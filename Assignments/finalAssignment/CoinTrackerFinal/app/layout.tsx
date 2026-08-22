import "./globals.css";
import AppShell from "./components/AppShell";
import { AuthProvider } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";

export const metadata = {
  title: "CoinTracker",
  description: "Moderna aplikacija za osobne financije",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className="min-h-dvh">
        <AuthProvider>
          <FinanceProvider>
            <AppShell>{children}</AppShell>
          </FinanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
