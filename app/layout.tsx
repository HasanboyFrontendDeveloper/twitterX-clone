import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "./provider";

export const metadata: Metadata = {
  title: "Twitter X",
  description: "Twitter X is Twitter clone build with Next.js and MongoDB.",
  icons: {icon: '/images/x.svg'}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body>
        <Provider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </Provider>
      </body>
    </html>
  );
}
