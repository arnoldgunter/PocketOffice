import "./globals.css";

export const metadata = {
  title: "POKO",
  description: "Pocket Office – Dein Büro für die Hosentasche",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  );
}
