"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase/client";

type Contact = {
  id: string;
  name: string;
  email: string;
};

export default function PorukePage() {
  const {
    messages,
    sendMessage,
  } = useFinance();

  const { user } = useAuth();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [text, setText] =
    useState("");

  const [showAddUser, setShowAddUser] =
    useState(false);

  const [showMessageWindow, setShowMessageWindow] =
    useState(false);

  const [userEmail, setUserEmail] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState<Contact | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [searchingUser, setSearchingUser] =
    useState(false);

  /* =======================================================
     TRAŽENJE KORISNIKA
     ======================================================= */

  async function handleAddUser(
    e: FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanEmail =
      userEmail
        .trim()
        .toLowerCase();

    if (!cleanEmail) {
      setError(
        "Unesite e-mail korisnika."
      );

      return;
    }

    if (!user) {
      setError(
        "Morate biti prijavljeni."
      );

      return;
    }

    setSearchingUser(true);

    try {
      const { data, error } =
        await supabase
          .from("profiles")
          .select(
            "id, name, email"
          )
          .eq(
            "email",
            cleanEmail
          )
          .maybeSingle();

      if (error) {
        console.error(
          "Greška kod traženja korisnika:",
          error
        );

        setError(
          "Dogodila se greška pri traženju korisnika."
        );

        return;
      }

      if (!data) {
        setError(
          "Korisnik s tim e-mailom nije registriran."
        );

        return;
      }

      if (data.id === user.id) {
        setError(
          "Ne možete odabrati sami sebe."
        );

        return;
      }

      setSelectedUser({
        id: data.id,
        name:
          data.name ||
          "CoinTracker korisnik",
        email: data.email,
      });

      setUserEmail("");
      setShowAddUser(false);
      setShowMessageWindow(true);
    } finally {
      setSearchingUser(false);
    }
  }

  /* =======================================================
     SLANJE PORUKE
     ======================================================= */

  async function handleSendMessage(
    e: FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedUser) {
      setError(
        "Prvo odaberite korisnika."
      );

      return;
    }

    if (!text.trim()) {
      setError(
        "Napišite poruku."
      );

      return;
    }

    const sent =
      await sendMessage(
        text.trim(),
        selectedUser.id
      );

    if (!sent) {
      setError(
        "Poruka nije poslana. Pokušajte ponovno."
      );

      return;
    }

    setText("");
    setShowMessageWindow(false);

    setSuccess(
      "Poruka je uspješno poslana."
    );

    setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  /* =======================================================
     PORUKE TRENUTNOG RAZGOVORA
     ======================================================= */

  const conversationMessages =
    selectedUser
      ? messages.filter(
          (message) =>
            (
              message.senderId ===
                selectedUser.id &&
              message.receiverId ===
                user?.id
            ) ||
            (
              message.senderId ===
                user?.id &&
              message.receiverId ===
                selectedUser.id
            )
        )
      : [];

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div>
        <p className="text-sm font-semibold text-purple-700">
          Poruke
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
          Dogovori zajedničke troškove
        </h1>

        <p className="mt-2 text-gray-500">
          Komuniciraj s drugim korisnicima izravno iz CoinTrackera.
        </p>
      </div>

      {/* DODAJ KORISNIKA */}

      <div className="flex justify-end">
        <button
          onClick={() => {
            setError("");
            setUserEmail("");
            setShowAddUser(true);
          }}
          className="rounded-2xl bg-purple-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
        >
          + Dodaj korisnika
        </button>
      </div>

      {/* PORUKA USPJEHA */}

      {success && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
          {success}
        </div>
      )}

      {/* RAZGOVOR */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* HEADER RAZGOVORA */}

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="font-semibold text-gray-900">
              {selectedUser
                ? selectedUser.name
                : "Nema odabranog korisnika"}
            </h2>

            {selectedUser && (
              <p className="mt-1 text-xs text-gray-500">
                {selectedUser.email}
              </p>
            )}

            {selectedUser && (
              <p className="mt-1 text-xs text-green-600">
                ● razgovor je otvoren
              </p>
            )}
          </div>

          {selectedUser && (
            <button
              onClick={() =>
                setSelectedUser(null)
              }
              className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-200"
            >
              Zatvori razgovor
            </button>
          )}
        </div>

        {/* PORUKE */}

        <div className="min-h-[350px] space-y-4 p-6">
          {!selectedUser ? (
            <div className="flex min-h-[280px] items-center justify-center text-center">
              <div>
                <p className="font-semibold text-gray-900">
                  Nema odabranog korisnika
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Klikni na „Dodaj korisnika” kako bi započeo razgovor.
                </p>
              </div>
            </div>
          ) : conversationMessages.length ===
            0 ? (
            <div className="flex min-h-[280px] items-center justify-center text-center">
              <div>
                <p className="font-semibold text-gray-900">
                  Još nema poruka
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Pošalji prvu poruku korisniku{" "}
                  {selectedUser.name}.
                </p>
              </div>
            </div>
          ) : (
            conversationMessages.map(
              (message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.mine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 ${
                      message.mine
                        ? "rounded-br-md bg-purple-900 text-white"
                        : "rounded-bl-md bg-gray-50 text-gray-700 ring-1 ring-gray-100"
                    }`}
                  >
                    {!message.mine && (
                      <p className="mb-1 text-xs font-semibold text-purple-700">
                        {message.sender}
                      </p>
                    )}

                    <p className="text-sm">
                      {message.text}
                    </p>

                    <p
                      className={`mt-1 text-[10px] ${
                        message.mine
                          ? "text-purple-200"
                          : "text-gray-400"
                      }`}
                    >
                      {message.createdAt}
                    </p>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* INPUT */}

        {selectedUser && (
          <form
            onSubmit={handleSendMessage}
            className="flex gap-3 border-t border-gray-100 p-4"
          >
            <input
              value={text}
              onChange={(e) =>
                setText(e.target.value)
              }
              placeholder="Napiši poruku..."
              className="min-w-0 flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-300"
            />

            <button
              type="submit"
              className="rounded-2xl bg-purple-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Pošalji
            </button>
          </form>
        )}
      </div>

      {/* ===================================================
          MODAL - DODAJ KORISNIKA
          =================================================== */}

      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Dodaj korisnika
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Unesi e-mail registrirane osobe kojoj želiš poslati poruku.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddUser(false)
                }
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleAddUser}
              className="mt-6 space-y-4"
            >
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  E-mail korisnika
                </label>

                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => {
                    setUserEmail(
                      e.target.value
                    );
                    setError("");
                  }}
                  placeholder="npr. ana@gmail.com"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-300"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={searchingUser}
                className="w-full rounded-2xl bg-purple-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {searchingUser
                  ? "Tražim korisnika..."
                  : "Dodaj korisnika"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================
          MODAL - NOVA PORUKA
          =================================================== */}

      {showMessageWindow &&
        selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700">
                    Nova poruka
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900">
                    Pošalji poruku
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Primatelj:{" "}
                    <span className="font-semibold text-gray-700">
                      {selectedUser.name}
                    </span>
                  </p>

                  <p className="text-xs text-gray-400">
                    {selectedUser.email}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowMessageWindow(
                      false
                    )
                  }
                  className="text-xl text-gray-400 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSendMessage}
                className="mt-6 space-y-4"
              >
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(
                      e.target.value
                    );
                    setError("");
                  }}
                  placeholder="Napiši poruku..."
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-300"
                  required
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowMessageWindow(
                        false
                      )
                    }
                    className="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                  >
                    Odustani
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-purple-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
                  >
                    Pošalji poruku
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}