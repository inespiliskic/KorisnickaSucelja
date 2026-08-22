"use client";

export default function Modal({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button className="absolute inset-0 bg-gray-950/35" aria-label="Zatvori" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100">✕</button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
