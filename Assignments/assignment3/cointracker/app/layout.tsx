import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "CoinTracker",
  description: "Financial overview app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className="flex h-screen bg-gray-50 text-gray-800">
        {/* Sidebar */}
        <aside className="w-64 bg-purple-900 text-white p-6 space-y-4">
          <h1 className="text-2xl font-bold mb-6">CoinTracker</h1>
          <nav className="flex flex-col space-y-2">
            <Link href="/" className="hover:text-purple-300">Pregled</Link>
            <Link href="/prihodi" className="hover:text-purple-300">Prihodi</Link>
            <Link href="/troskovi" className="hover:text-purple-300">Troškovi</Link>
            <Link href="/stednja" className="hover:text-purple-300">Štednja</Link>
            <Link href="/dugovi" className="hover:text-purple-300">Dugovi</Link>
            <Link href="/profil" className="hover:text-purple-300">Profil</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-10">{children}</main>
      </body>
    </html>
  );
}
