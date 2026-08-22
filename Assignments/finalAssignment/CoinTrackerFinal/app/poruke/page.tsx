"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useFinance } from "../context/FinanceContext";
import { useAuth } from "../context/AuthContext";
import { createClient } from "../lib/supabase/client";

export default function PorukePage() {
  const {
    messages,
    sendMessage,
  } = useFinance();

  const { user } = useAuth();

  const supabase = createClient();

  const [text, setText] =
    useState("");

  const [showAddUser, setShowAddUser] =
    useState(false);

  const [
    showMessageWindow,
    setShowMessageWindow,
  ] = useState(false);

  const [userEmail, setUserEmail] =
    useState("");

  const [selectedUser, setSelectedUser] =
    useState("");

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [error, setError] =
    useState("");

  /*
   * Automatski odaberi zadnjeg korisnika
   * s kojim postoji razgovor.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    if (selectedUserId) {
      return;
    }

    if (messages.length === 0) {
      return;
    }

    const lastMessage =
      messages[messages.length - 1];

    const otherUserId =
      lastMessage.mine
        ? lastMessage.receiverId
        : lastMessage.senderId;

    if (otherUserId) {
      setSelectedUserId(
        otherUserId
      );
    }
  }, [
    messages,
    selectedUserId,
    user,
  ]);

  /*
   * Pronađi ime/e-mail korisnika
   * preko njegovog ID-a.
   */
  async function loadUserName(
    userId: string
  ) {
    const {
      data,
    } = await supabase
      .from("profiles")
      .select(
        "name, email"
      )
      .eq(
        "id",
        userId
      )
      .maybeSingle();

    if (!data) {
      return;
    }

    setSelectedUser(
      data.name ||
        data.email ||
        "Korisnik"
    );
  }

  /*
   * Kada se odabere korisnik,
   * učitaj njegov naziv.
   */
  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    loadUserName(
      selectedUserId
    );
  }, [selectedUserId]);

  /*
   * Dodavanje korisnika radi se samo
   * kada prvi put želiš započeti razgovor.
   */
  async function handleAddUser(
    e: FormEvent
  ) {
    e.preventDefault();

    setError("");

    const email =
      userEmail
        .trim()
        .toLowerCase();

    if (!email) {
      return;
    }

    if (!user) {
      return;
    }

    if (
      email ===
      user.email.toLowerCase()
    ) {
      setError(
        "Ne možete poslati poruku sami sebi."
      );

      return;
    }

    const {
      data,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, name, email"
      )
      .eq(
        "email",
        email
      )
      .maybeSingle();

    if (profileError) {
      console.error(
        profileError
      );

      setError(
        "Greška kod pronalaska korisnika."
      );

      return;
    }

    if (!data) {
      setError(
        "Korisnik s tim e-mailom nije registriran."
      );

      return;
    }

    setSelectedUserId(
      data.id
    );

    setSelectedUser(
      data.name ||
        data.email
    );

    setUserEmail("");

    setShowAddUser(false);

    setShowMessageWindow(true);
  }

  /*
   * Slanje poruke.
   */
  async function handleSendMessage(
    e: FormEvent
  ) {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    if (!selectedUserId) {
      setError(
        "Odaberite korisnika kojem želite poslati poruku."
      );

      return;
    }

    await sendMessage(
      text.trim(),
      selectedUserId
    );

    setText("");

    setShowMessageWindow(
      false
    );
  }

  /*
   * Prikaži samo poruke iz trenutno
   * odabranog razgovora.
   */
  const conversationMessages =
    selectedUserId
      ? messages.filter(
          (message) =>
            (
              message.senderId ===
                selectedUserId &&
              message.receiverId ===
                user?.id
            ) ||
            (
              message.senderId ===
                user?.id &&
              message.receiverId ===
                selectedUserId
            )
        )
      : [];

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
          onClick={() =>
            setShowAddUser(true)
          }
          className="rounded-2xl bg-purple-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
        >
          + Nova poruka
        </button>
      </div>


      {/* RAZGOVOR */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">

        {/* HEADER RAZGOVORA */}

        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

          <div>

            <h2 className="font-semibold text-gray-900">
              {selectedUser ||
                "Nema odabranog korisnika"}
            </h2>

            {selectedUser && (
              <p className="mt-1 text-xs text-green-600">
                ● razgovor
              </p>
            )}

          </div>

        </div>


        {/* PORUKE */}

        <div className="min-h-[350px] space-y-4 p-6">

          {conversationMessages.length ===
          0 ? (

            <div className="flex min-h-[280px] items-center justify-center text-center">

              <div>

                <p className="font-semibold text-gray-900">
                  Još nema poruka
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Klikni na "Nova poruka" kako bi započeo razgovor.
                </p>

              </div>

            </div>

          ) : (

            conversationMessages.map(
              (message) => (

                <div
                  key={
                    message.id
                  }
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

        {selectedUserId && (

          <form
            onSubmit={
              handleSendMessage
            }
            className="flex gap-3 border-t border-gray-100 p-4"
          >

            <input
              value={text}
              onChange={(e) =>
                setText(
                  e.target.value
                )
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


      {/* MODAL - NOVA PORUKA */}

      {showAddUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Nova poruka
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


            <form
              onSubmit={
                handleAddUser
              }
              className="mt-6 space-y-4"
            >

              <div>

                <label className="text-sm font-semibold text-gray-700">
                  E-mail korisnika
                </label>

                <input
                  type="email"
                  value={
                    userEmail
                  }
                  onChange={(e) =>
                    setUserEmail(
                      e.target.value
                    )
                  }
                  placeholder="npr. ana@gmail.com"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-300"
                  required
                />

              </div>


              {error && (

                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>

              )}


              <button
                type="submit"
                className="w-full rounded-2xl bg-purple-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Nastavi
              </button>

            </form>

          </div>

        </div>

      )}


      {/* MODAL - SLANJE */}

      {showMessageWindow && (

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
                    {selectedUser}
                  </span>

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


            <form
              onSubmit={
                handleSendMessage
              }
              className="mt-6 space-y-4"
            >

              <textarea
                value={text}
                onChange={(e) =>
                  setText(
                    e.target.value
                  )
                }
                placeholder="Napiši poruku..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-300"
                required
              />


              {error && (

                <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>

              )}


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