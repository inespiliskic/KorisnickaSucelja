"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createClient } from "../lib/supabase/client";

type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResult = {
  ok: boolean;
  message?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  hydrated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [hydrated, setHydrated] =
    useState(false);

  async function loadUser() {
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      setUser(null);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", supabaseUser.id)
      .maybeSingle();

    setUser({
      id: supabaseUser.id,
      name:
        profile?.name ??
        supabaseUser.user_metadata?.name ??
        "CoinTracker korisnik",
      email:
        profile?.email ??
        supabaseUser.email ??
        "",
    });
  }

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      await loadUser();

      if (mounted) {
        setHydrated(true);
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async () => {
        await loadUser();
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    const cleanName = name.trim();
    const cleanEmail = normalizeEmail(email);

    if (!cleanName) {
      return {
        ok: false,
        message: "Unesite ime i prezime.",
      };
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return {
        ok: false,
        message: "Unesite ispravnu e-mail adresu.",
      };
    }

    if (password.length < 6) {
      return {
        ok: false,
        message:
          "Lozinka mora imati najmanje 6 znakova.",
      };
    }

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
        },
      },
    });

    if (error) {
      return {
        ok: false,
        message: error.message,
      };
    }

    if (!data.user) {
      return {
        ok: false,
        message: "Registracija nije uspjela.",
      };
    }

    /*
     * Spremamo dodatne podatke korisnika
     * u tablicu profiles.
     */
    const { error: profileError } =
      await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          name: cleanName,
          email: cleanEmail,
          currency: "EUR",
        });

    if (profileError) {
      return {
        ok: false,
        message:
          "Račun je napravljen, ali profil nije spremljen.",
      };
    }

    /*
     * Ako je uključena potvrda e-maila,
     * Supabase neće odmah napraviti session.
     */
    if (!data.session) {
      return {
        ok: false,
        message:
          "Račun je napravljen. Provjerite svoj e-mail i potvrdite račun prije prijave.",
      };
    }

    await loadUser();

    return {
      ok: true,
    };
  }

  async function login(
    email: string,
    password: string
  ): Promise<AuthResult> {
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail) {
      return {
        ok: false,
        message: "Unesite e-mail adresu.",
      };
    }

    if (!password) {
      return {
        ok: false,
        message: "Unesite lozinku.",
      };
    }

    const { error } =
      await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

    if (error) {
      return {
        ok: false,
        message:
          "E-mail ili lozinka nisu ispravni.",
      };
    }

    await loadUser();

    return {
      ok: true,
    };
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      hydrated,
      login,
      register,
      logout,
    }),
    [user, hydrated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}