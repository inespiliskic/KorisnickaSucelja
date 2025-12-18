import "./globals.css";
import Sidebar from "./components/Sidebar";


export const metadata = {
  title: "CoinTracker",
  description: "Financial overview app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className="h-dvh bg-[#F6F7FB] text-gray-800">
        <div className="flex h-dvh overflow-hidden">
          <Sidebar />

          {/* Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl p-8">{children}</div>
          </main>

          
        </div>
      </body>
    </html>
  );
}
