import "./globals.css";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "CoinTracker",
  description: "Financial overview app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hr">
      <body className="h-dvh">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
