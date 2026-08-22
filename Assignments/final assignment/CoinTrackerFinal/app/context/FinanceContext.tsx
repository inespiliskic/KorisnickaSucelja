"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "./AuthContext";
import { createClient } from "../lib/supabase/client";

/* =========================================================
   TIPOVI
   ========================================================= */

export type Transaction = {
  id: number;
  type: "income" | "expense";
  title: string;
  category: string;
  amount: number;
  date: string;
};

export type SavingsGoal = {
  id: number;
  name: string;
  target: number;
  saved: number;
};

export type Debt = {
  id: number;
  name: string;
  total: number;
  remaining: number;
  monthly: number;
};

export type Budget = {
  category: string;
  limit: number;
};

export type ChatMessage = {
  id: number;
  sender: string;
  text: string;
  createdAt: string;
  mine: boolean;
};

type Profile = {
  name: string;
  email: string;
  currency: string;
};

/* =========================================================
   CONTEXT TIP
   ========================================================= */

type FinanceContextValue = {
  transactions: Transaction[];
  savingsGoals: SavingsGoal[];
  debts: Debt[];
  budgets: Budget[];
  messages: ChatMessage[];

  profile: Profile;

  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalSaved: number;
  totalDebt: number;

  addTransaction: (
    transaction: Omit<Transaction, "id">
  ) => Promise<void>;

  deleteTransaction: (
    id: number
  ) => Promise<void>;

  addSavingsGoal: (
    goal: Omit<SavingsGoal, "id" | "saved"> & {
      saved?: number;
    }
  ) => Promise<void>;

  depositToGoal: (
    id: number,
    amount: number
  ) => Promise<void>;

  deleteSavingsGoal: (
    id: number
  ) => Promise<void>;

  addDebt: (
    debt: Omit<Debt, "id">
  ) => Promise<void>;

  payDebt: (
    id: number,
    amount: number
  ) => Promise<void>;

  deleteDebt: (
    id: number
  ) => Promise<void>;

  setBudget: (
    category: string,
    limit: number
  ) => Promise<void>;

  sendMessage: (
    text: string
  ) => Promise<void>;

  updateProfile: (
    profile: Profile
  ) => Promise<void>;

  clearData: () => Promise<void>;
};

/* =========================================================
   POČETNE VRIJEDNOSTI
   ========================================================= */

const initialTransactions: Transaction[] = [];

const initialGoals: SavingsGoal[] = [];

const initialDebts: Debt[] = [];

const initialBudgets: Budget[] = [];

const initialMessages: ChatMessage[] = [];

const initialProfile: Profile = {
  name: "CoinTracker korisnik",
  email: "",
  currency: "EUR",
};

/* =========================================================
   TEČAJEVI
   1 EUR = određeni iznos druge valute
   ========================================================= */

const currencyRates: Record<string, number> = {
  EUR: 1,
  USD: 1.16,
  GBP: 0.86,
  CHF: 0.94,
  BAM: 1.95583,
};

function convertAmount(
  value: number,
  from: string,
  to: string
) {
  if (from === to) {
    return value;
  }

  const fromRate =
    currencyRates[from] ?? 1;

  const toRate =
    currencyRates[to] ?? 1;

  return Math.round(
    ((value / fromRate) * toRate +
      Number.EPSILON) *
      100
  ) / 100;
}

/* =========================================================
   CONTEXT
   ========================================================= */

const FinanceContext =
  createContext<FinanceContextValue | null>(null);

/* =========================================================
   PROVIDER
   ========================================================= */

export function FinanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [transactions, setTransactions] =
    useState<Transaction[]>(
      initialTransactions
    );

  const [savingsGoals, setSavingsGoals] =
    useState<SavingsGoal[]>(
      initialGoals
    );

  const [debts, setDebts] =
    useState<Debt[]>(initialDebts);

  const [budgets, setBudgets] =
    useState<Budget[]>(initialBudgets);

  const [messages, setMessages] =
    useState<ChatMessage[]>(
      initialMessages
    );

  const [profile, setProfile] =
    useState<Profile>(
      initialProfile
    );

  const [hydrated, setHydrated] =
    useState(false);

  const [loadedForUser, setLoadedForUser] =
    useState<string | null>(null);

  /* =======================================================
     UČITAVANJE PODATAKA IZ SUPABASEA
     ======================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setHydrated(false);

      if (!user) {
        setTransactions([]);
        setSavingsGoals([]);
        setDebts([]);
        setBudgets([]);
        setMessages([]);
        setProfile(initialProfile);

        setLoadedForUser(null);
        setHydrated(true);

        return;
      }

      try {
        /* ---------------------------------------------------
           PROFILE
           --------------------------------------------------- */

        const { data: profileData } =
          await supabase
            .from("profiles")
            .select(
              "name, email, currency"
            )
            .eq("id", user.id)
            .maybeSingle();

        /* ---------------------------------------------------
           TRANSACTIONS
           --------------------------------------------------- */

        const {
          data: transactionData,
          error: transactionError,
        } = await supabase
          .from("transactions")
          .select(
            "id, type, title, category, amount, date"
          )
          .eq("user_id", user.id)
          .order("date", {
            ascending: false,
          });

        if (transactionError) {
          console.error(
            "Greška kod učitavanja transakcija:",
            transactionError
          );
        }

        /* ---------------------------------------------------
           SAVINGS GOALS
           --------------------------------------------------- */

        const {
          data: savingsData,
          error: savingsError,
        } = await supabase
          .from("savings_goals")
          .select(
            "id, name, target, saved"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (savingsError) {
          console.error(
            "Greška kod učitavanja štednje:",
            savingsError
          );
        }

        /* ---------------------------------------------------
           DEBTS
           --------------------------------------------------- */

        const {
          data: debtData,
          error: debtError,
        } = await supabase
          .from("debts")
          .select(
            "id, name, total, remaining, monthly"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (debtError) {
          console.error(
            "Greška kod učitavanja dugova:",
            debtError
          );
        }

        /* ---------------------------------------------------
           BUDGETS
           --------------------------------------------------- */

        const {
          data: budgetData,
          error: budgetError,
        } = await supabase
          .from("budgets")
          .select(
            "id, category, limit_amount"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (budgetError) {
          console.error(
            "Greška kod učitavanja budžeta:",
            budgetError
          );
        }

        /* ---------------------------------------------------
           MESSAGES

           Trenutno ih samo učitavamo.
           Slanje poruka ćemo spojiti nakon što
           uredimo Poruke stranicu i dodavanje korisnika.
           --------------------------------------------------- */

        const {
          data: messageData,
          error: messageError,
        } = await supabase
          .from("messages")
          .select(
            "id, sender_id, receiver_id, text, created_at"
          )
          .or(
            `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
          )
          .order("created_at", {
            ascending: true,
          });

        if (messageError) {
          console.error(
            "Greška kod učitavanja poruka:",
            messageError
          );
        }

        if (cancelled) {
          return;
        }

        /* ---------------------------------------------------
           POSTAVLJANJE TRANSAKCIJA
           --------------------------------------------------- */

        setTransactions(
          (transactionData ?? []).map(
            (transaction) => ({
              id: Number(
                transaction.id
              ),

              type:
                transaction.type as
                  | "income"
                  | "expense",

              title:
                transaction.title,

              category:
                transaction.category,

              amount:
                Number(
                  transaction.amount
                ),

              date:
                transaction.date,
            })
          )
        );

        /* ---------------------------------------------------
           POSTAVLJANJE ŠTEDNJE
           --------------------------------------------------- */

        setSavingsGoals(
          (savingsData ?? []).map(
            (goal) => ({
              id: Number(goal.id),

              name: goal.name,

              target:
                Number(goal.target),

              saved:
                Number(goal.saved),
            })
          )
        );

        /* ---------------------------------------------------
           POSTAVLJANJE DUGOVA
           --------------------------------------------------- */

        setDebts(
          (debtData ?? []).map(
            (debt) => ({
              id: Number(debt.id),

              name: debt.name,

              total:
                Number(debt.total),

              remaining:
                Number(
                  debt.remaining
                ),

              monthly:
                Number(debt.monthly),
            })
          )
        );

        /* ---------------------------------------------------
           POSTAVLJANJE BUDŽETA
           --------------------------------------------------- */

        setBudgets(
          (budgetData ?? []).map(
            (budget) => ({
              category:
                budget.category,

              limit:
                Number(
                  budget.limit_amount
                ),
            })
          )
        );

        /* ---------------------------------------------------
           POSTAVLJANJE PROFILA
           --------------------------------------------------- */

        setProfile({
          name:
            profileData?.name ??
            user.name,

          email:
            profileData?.email ??
            user.email,

          currency:
            profileData?.currency ??
            "EUR",
        });

        /* ---------------------------------------------------
           PORUKE

           Za sada koristimo e-mail pošiljatelja
           kao prikaz sendera. Detaljnije ćemo ih
           srediti u sljedećem koraku.
           --------------------------------------------------- */

        setMessages(
          (messageData ?? []).map(
            (message) => ({
              id: Number(
                message.id
              ),

              sender:
                message.sender_id ===
                user.id
                  ? "Ja"
                  : "Korisnik",

              text:
                message.text,

              createdAt:
                new Date(
                  message.created_at
                ).toLocaleTimeString(
                  "hr-HR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                ),

              mine:
                message.sender_id ===
                user.id,
            })
          )
        );

        setLoadedForUser(
          user.id
        );
      } catch (error) {
        console.error(
          "Greška kod učitavanja financijskih podataka:",
          error
        );
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [user, supabase]);

  /* =======================================================
     IZRAČUNI
     ======================================================= */

  const totalIncome = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.type ===
            "income"
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        ),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            transaction.type ===
            "expense"
        )
        .reduce(
          (sum, transaction) =>
            sum + transaction.amount,
          0
        ),
    [transactions]
  );

  const totalSaved = useMemo(
    () =>
      savingsGoals.reduce(
        (sum, goal) =>
          sum + goal.saved,
        0
      ),
    [savingsGoals]
  );

  const totalDebt = useMemo(
    () =>
      debts.reduce(
        (sum, debt) =>
          sum + debt.remaining,
        0
      ),
    [debts]
  );

  /* =======================================================
     TRANSAKCIJE
     ======================================================= */

  const addTransaction = async (
    transaction: Omit<
      Transaction,
      "id"
    >
  ) => {
    if (!user) {
      return;
    }

    const { data, error } =
      await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: transaction.type,
          title: transaction.title,
          category:
            transaction.category,
          amount: transaction.amount,
          date: transaction.date,
        })
        .select(
          "id, type, title, category, amount, date"
        )
        .single();

    if (error) {
      console.error(
        "Greška kod dodavanja transakcije:",
        error
      );

      return;
    }

    const newTransaction: Transaction =
      {
        id: Number(data.id),
        type:
          data.type as
            | "income"
            | "expense",
        title: data.title,
        category:
          data.category,
        amount:
          Number(data.amount),
        date: data.date,
      };

    setTransactions(
      (current) => [
        newTransaction,
        ...current,
      ]
    );
  };

  const deleteTransaction = async (
    id: number
  ) => {
    const { error } =
      await supabase
        .from("transactions")
        .delete()
        .eq("id", id)
        .eq(
          "user_id",
          user?.id
        );

    if (error) {
      console.error(
        "Greška kod brisanja transakcije:",
        error
      );

      return;
    }

    setTransactions(
      (current) =>
        current.filter(
          (transaction) =>
            transaction.id !== id
        )
    );
  };

  /* =======================================================
     ŠTEDNJA
     ======================================================= */

  const addSavingsGoal = async (
    goal: Omit<
      SavingsGoal,
      "id" | "saved"
    > & {
      saved?: number;
    }
  ) => {
    if (!user) {
      return;
    }

    const saved =
      goal.saved ?? 0;

    const { data, error } =
      await supabase
        .from("savings_goals")
        .insert({
          user_id: user.id,
          name: goal.name,
          target: goal.target,
          saved,
        })
        .select(
          "id, name, target, saved"
        )
        .single();

    if (error) {
      console.error(
        "Greška kod dodavanja cilja štednje:",
        error
      );

      return;
    }

    setSavingsGoals(
      (current) => [
        {
          id: Number(data.id),
          name: data.name,
          target:
            Number(data.target),
          saved:
            Number(data.saved),
        },

        ...current,
      ]
    );
  };

  const depositToGoal = async (
    id: number,
    amount: number
  ) => {
    const goal =
      savingsGoals.find(
        (item) =>
          item.id === id
      );

    if (!goal) {
      return;
    }

    const newSaved = Math.min(
      goal.target,
      goal.saved + amount
    );

    const { error } =
      await supabase
        .from("savings_goals")
        .update({
          saved: newSaved,
        })
        .eq("id", id)
        .eq(
          "user_id",
          user?.id
        );

    if (error) {
      console.error(
        "Greška kod uplate u štednju:",
        error
      );

      return;
    }

    setSavingsGoals(
      (current) =>
        current.map(
          (item) =>
            item.id === id
              ? {
                  ...item,
                  saved: newSaved,
                }
              : item
        )
    );
  };

  const deleteSavingsGoal =
    async (id: number) => {
      const { error } =
        await supabase
          .from("savings_goals")
          .delete()
          .eq("id", id)
          .eq(
            "user_id",
            user?.id
          );

      if (error) {
        console.error(
          "Greška kod brisanja cilja štednje:",
          error
        );

        return;
      }

      setSavingsGoals(
        (current) =>
          current.filter(
            (goal) =>
              goal.id !== id
          )
      );
    };

  /* =======================================================
     DUGOVI
     ======================================================= */

  const addDebt = async (
    debt: Omit<Debt, "id">
  ) => {
    if (!user) {
      return;
    }

    const { data, error } =
      await supabase
        .from("debts")
        .insert({
          user_id: user.id,
          name: debt.name,
          total: debt.total,
          remaining:
            debt.remaining,
          monthly:
            debt.monthly ?? 0,
        })
        .select(
          "id, name, total, remaining, monthly"
        )
        .single();

    if (error) {
      console.error(
        "Greška kod dodavanja duga:",
        error
      );

      return;
    }

    setDebts(
      (current) => [
        {
          id: Number(data.id),
          name: data.name,
          total:
            Number(data.total),
          remaining:
            Number(data.remaining),
          monthly:
            Number(data.monthly),
        },

        ...current,
      ]
    );
  };

  const payDebt = async (
  id: number,
  amount: number
) => {
  if (!user) {
    return;
  }

  const debt = debts.find(
    (item) => item.id === id
  );

  if (!debt) {
    return;
  }

  if (amount <= 0) {
    return;
  }

  const actualPayment = Math.min(
    amount,
    debt.remaining
  );

  const newRemaining =
    Math.max(
      0,
      debt.remaining - actualPayment
    );

  /* =====================================================
     1. AŽURIRAJ DUG
     ===================================================== */

  const { error: debtError } =
    await supabase
      .from("debts")
      .update({
        remaining: newRemaining,
      })
      .eq("id", id)
      .eq("user_id", user.id);

  if (debtError) {
    console.error(
      "Greška kod ažuriranja duga:",
      debtError
    );

    return;
  }


  const { data: transactionData, error: transactionError } =
    await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        type: "expense",
        title: `Otplata duga: ${debt.name}`,
        category: "Dugovanja",
        amount: actualPayment,
        date: new Date()
          .toISOString()
          .split("T")[0],
      })
      .select(
        "id, type, title, category, amount, date"
      )
      .single();

  if (transactionError) {
    console.error(
      "Greška kod spremanja otplate kao troška:",
      transactionError
    );



    await supabase
      .from("debts")
      .update({
        remaining: debt.remaining,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    return;
  }

  setDebts(
    (current) =>
      current.map(
        (item) =>
          item.id === id
            ? {
                ...item,
                remaining:
                  newRemaining,
              }
            : item
      )
  );

  /* =====================================================
     4. DODAJ TROŠAK U APLIKACIJU
     ===================================================== */

  if (transactionData) {
    const newTransaction: Transaction = {
      id: Number(
        transactionData.id
      ),

      type: "expense",

      title:
        transactionData.title,

      category:
        transactionData.category,

      amount:
        Number(
          transactionData.amount
        ),

      date:
        transactionData.date,
    };

    setTransactions(
      (current) => [
        newTransaction,
        ...current,
      ]
    );
  }
};

  const deleteDebt = async (
    id: number
  ) => {
    const { error } =
      await supabase
        .from("debts")
        .delete()
        .eq("id", id)
        .eq(
          "user_id",
          user?.id
        );

    if (error) {
      console.error(
        "Greška kod brisanja duga:",
        error
      );

      return;
    }

    setDebts(
      (current) =>
        current.filter(
          (debt) =>
            debt.id !== id
        )
    );
  };

  /* =======================================================
     BUDŽETI
     ======================================================= */

  const setBudget = async (
    category: string,
    limit: number
  ) => {
    if (!user) {
      return;
    }

    const existing =
      budgets.find(
        (budget) =>
          budget.category
            .toLowerCase() ===
          category.toLowerCase()
      );

    if (existing) {
      const { error } =
        await supabase
          .from("budgets")
          .update({
            category,
            limit_amount:
              limit,
          })
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "category",
            existing.category
          );

      if (error) {
        console.error(
          "Greška kod ažuriranja budžeta:",
          error
        );

        return;
      }

      setBudgets(
        (current) =>
          current.map(
            (budget) =>
              budget.category
                .toLowerCase() ===
              category.toLowerCase()
                ? {
                    ...budget,
                    category,
                    limit,
                  }
                : budget
          )
      );

      return;
    }

    const { data, error } =
      await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          category,
          limit_amount:
            limit,
        })
        .select(
          "category, limit_amount"
        )
        .single();

    if (error) {
      console.error(
        "Greška kod dodavanja budžeta:",
        error
      );

      return;
    }

    setBudgets(
      (current) => [
        ...current,
        {
          category:
            data.category,
          limit:
            Number(
              data.limit_amount
            ),
        },
      ]
    );
  };

  /* =======================================================
     PORUKE
     ======================================================= */

  const sendMessage = async (
    text: string
  ) => {
    /*
     * Trenutni UI šalje samo tekst poruke,
     * ali ne šalje ID primatelja.
     *
     * Zato ovu funkciju još ne spremamo
     * u bazu.
     *
     * Poruke ćemo spojiti u sljedećem
     * koraku zajedno s "Dodaj korisnika".
     */

    if (!text.trim()) {
      return;
    }

    console.log(
      "Poruke ćemo povezati s korisnicima u sljedećem koraku."
    );
  };

  /* =======================================================
     PROFIL
     ======================================================= */

  const updateProfile = async (
    nextProfile: Profile
  ) => {
    if (!user) {
      return;
    }

    const currentCurrency =
      profile.currency;

    const nextCurrency =
      nextProfile.currency;

    /* -------------------------------------------------------
       Ako se valuta promijenila,
       preračunavamo postojeće podatke
       ------------------------------------------------------- */

    if (
      nextCurrency !==
      currentCurrency
    ) {
      /* TRANSAKCIJE */

      for (const transaction of transactions) {
        const convertedAmount =
          convertAmount(
            transaction.amount,
            currentCurrency,
            nextCurrency
          );

        await supabase
          .from("transactions")
          .update({
            amount:
              convertedAmount,
          })
          .eq(
            "id",
            transaction.id
          )
          .eq(
            "user_id",
            user.id
          );
      }

      /* ŠTEDNJA */

      for (const goal of savingsGoals) {
        await supabase
          .from("savings_goals")
          .update({
            target:
              convertAmount(
                goal.target,
                currentCurrency,
                nextCurrency
              ),

            saved:
              convertAmount(
                goal.saved,
                currentCurrency,
                nextCurrency
              ),
          })
          .eq(
            "id",
            goal.id
          )
          .eq(
            "user_id",
            user.id
          );
      }

      /* DUGOVI */

      for (const debt of debts) {
        await supabase
          .from("debts")
          .update({
            total:
              convertAmount(
                debt.total,
                currentCurrency,
                nextCurrency
              ),

            remaining:
              convertAmount(
                debt.remaining,
                currentCurrency,
                nextCurrency
              ),

            monthly:
              convertAmount(
                debt.monthly,
                currentCurrency,
                nextCurrency
              ),
          })
          .eq(
            "id",
            debt.id
          )
          .eq(
            "user_id",
            user.id
          );
      }

      /* BUDŽETI */

      for (const budget of budgets) {
        const convertedLimit =
          convertAmount(
            budget.limit,
            currentCurrency,
            nextCurrency
          );

        await supabase
          .from("budgets")
          .update({
            limit_amount:
              convertedLimit,
          })
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "category",
            budget.category
          );
      }

      /* Ažuriranje lokalnog stanja */

      setTransactions(
        (current) =>
          current.map(
            (transaction) => ({
              ...transaction,
              amount:
                convertAmount(
                  transaction.amount,
                  currentCurrency,
                  nextCurrency
                ),
            })
          )
      );

      setSavingsGoals(
        (current) =>
          current.map(
            (goal) => ({
              ...goal,

              target:
                convertAmount(
                  goal.target,
                  currentCurrency,
                  nextCurrency
                ),

              saved:
                convertAmount(
                  goal.saved,
                  currentCurrency,
                  nextCurrency
                ),
            })
          )
      );

      setDebts(
        (current) =>
          current.map(
            (debt) => ({
              ...debt,

              total:
                convertAmount(
                  debt.total,
                  currentCurrency,
                  nextCurrency
                ),

              remaining:
                convertAmount(
                  debt.remaining,
                  currentCurrency,
                  nextCurrency
                ),

              monthly:
                convertAmount(
                  debt.monthly,
                  currentCurrency,
                  nextCurrency
                ),
            })
          )
      );

      setBudgets(
        (current) =>
          current.map(
            (budget) => ({
              ...budget,

              limit:
                convertAmount(
                  budget.limit,
                  currentCurrency,
                  nextCurrency
                ),
            })
          )
      );
    }

    /* -------------------------------------------------------
       PROFIL
       ------------------------------------------------------- */

    const updatedProfile = {
      name:
        nextProfile.name,
      email:
        user.email,
      currency:
        nextCurrency,
    };

    const { error } =
      await supabase
        .from("profiles")
        .update({
          name:
            updatedProfile.name,

          email:
            updatedProfile.email,

          currency:
            updatedProfile.currency,
        })
        .eq(
          "id",
          user.id
        );

    if (error) {
      console.error(
        "Greška kod ažuriranja profila:",
        error
      );

      return;
    }

    setProfile(
      updatedProfile
    );
  };

  /* =======================================================
     OBRIŠI SVE PODATKE
     ======================================================= */

  const clearData = async () => {
    if (!user) {
      return;
    }

    /*
     * Brisanje se radi iz svih korisnikovih tablica.
     */

    await supabase
      .from("transactions")
      .delete()
      .eq(
        "user_id",
        user.id
      );

    await supabase
      .from("savings_goals")
      .delete()
      .eq(
        "user_id",
        user.id
      );

    await supabase
      .from("debts")
      .delete()
      .eq(
        "user_id",
        user.id
      );

    await supabase
      .from("budgets")
      .delete()
      .eq(
        "user_id",
        user.id
      );

    await supabase
      .from("messages")
      .delete()
      .or(
        `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
      );

    setTransactions([]);
    setSavingsGoals([]);
    setDebts([]);
    setBudgets([]);
    setMessages([]);

    setProfile({
      name:
        user.name ??
        "CoinTracker korisnik",

      email:
        user.email,

      currency:
        "EUR",
    });

    await supabase
      .from("profiles")
      .update({
        currency: "EUR",
      })
      .eq(
        "id",
        user.id
      );
  };

  /* =======================================================
     LOADING
     ======================================================= */

  if (
    user &&
    (
      !hydrated ||
      loadedForUser !==
        user.id
    )
  ) {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#F6F7FB]">
        <div className="rounded-3xl bg-white px-8 py-6 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">
          Učitavanje vaših financija…
        </div>
      </div>
    );
  }

  /* =======================================================
     PROVIDER
     ======================================================= */

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        savingsGoals,
        debts,
        budgets,
        messages,

        profile,

        totalIncome,
        totalExpenses,

        balance:
          totalIncome -
          totalExpenses,

        totalSaved,
        totalDebt,

        addTransaction,
        deleteTransaction,

        addSavingsGoal,
        depositToGoal,
        deleteSavingsGoal,

        addDebt,
        payDebt,
        deleteDebt,

        setBudget,

        sendMessage,

        updateProfile,

        clearData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

/* =========================================================
   HOOK
   ========================================================= */

export function useFinance() {
  const context =
    useContext(
      FinanceContext
    );

  if (!context) {
    throw new Error(
      "useFinance must be used within FinanceProvider"
    );
  }

  return context;
}