import "./globals.css";

export const metadata = {
  title: "React Starter — Full Stack",
  description: "Aplicação full-stack com Next.js, JWT e painel administrativo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
