"use client";

import { FormEvent, useState } from "react";
import { useFinance } from "../context/FinanceContext";

export default function PorukePage() {
  const { messages, sendMessage } = useFinance();

  const [text, setText] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [showMessageWindow, setShowMessageWindow] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  function handleAddUser(e: FormEvent) {
    e.preventDefault();

    if (!userEmail.trim()) {
      return;
    }

    setSelectedUser(userEmail.trim());
    setUserEmail("");
    setShowAddUser(false);
    setShowMessageWindow(true);
  }

  function handleSendMessage(e: FormEvent) {
    e.preventDefault();

    if (!text.trim()) {
      return;
    }

    sendMessage(text.trim());
    setText("");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
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

      {/* Add user button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddUser(true)}
          className="rounded-2xl bg-purple-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-800"
        >
          + Dodaj korisnika
        </button>
      </div>

      {/* Conversation */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
        {/* Conversation header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="font-semibold text-gray-900">
              {selectedUser || "Nema odabranog korisnika"}
            </h2>

            {selectedUser && (
              <p className="mt-1 text-xs text-green-600">
                ● korisnik je odabran
              </p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="min-h-[350px] space-y-4 p-6">
          {messages.length === 0 ? (
            <div className="flex min-h-[280px] items-center justify-center text-center">
              <div>
                <p className="font-semibold text-gray-900">
                  Još nema poruka
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Dodaj korisnika kako bi mu mogao poslati poruku.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
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
            ))
          )}
        </div>

        {/* Message input */}
        <form
          onSubmit={handleSendMessage}
          className="flex gap-3 border-t border-gray-100 p-4"
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
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
      </div>

      {/* Add user modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Dodaj korisnika
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Unesi e-mail osobe kojoj želiš poslati poruku.
                </p>
              </div>

              <button
                onClick={() => setShowAddUser(false)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

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
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="npr. ana@gmail.com"
                  className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-purple-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                Dodaj korisnika
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Send message modal */}
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
                onClick={() => setShowMessageWindow(false)}
                className="text-xl text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={(e) => {
                handleSendMessage(e);
                setShowMessageWindow(false);
              }}
              className="mt-6 space-y-4"
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Napiši poruku..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-purple-300"
                required
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowMessageWindow(false)}
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