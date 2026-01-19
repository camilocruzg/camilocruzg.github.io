import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navItems = [
  { label: "Writing", href: "/" },
  { label: "About me", href: "/bio" },
  { label: "Publications", href: "/publications" },
  { label: "Side Projects", href: "/other-projects" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/CCruzG" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/camilocruzg/" },
  { label: "Bluesky", href: "https://bsky.app/profile/camilocruzg.bsky.social" },
  { label: "itch.io", href: "https://badloops.itch.io/"},
];

export const metadata: Metadata = {
  title: "Camilo's Site",
  description: "This site is a working notebook—ideas shared early, revised often.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
          <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-10 px-4 py-6 md:px-8">
            <header className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  {/* <p className="text-sm tracking-[0.4em] text-[color:var(--muted)]"></p> */}
                  <h1 className="text-2xl uppercase font-semibold">Camilo Cruz Gambardella</h1>
                </div>
                <span className="text-xs text-[color:var(--muted)]">macOS · Zsh</span>
              </div>
              <nav className="flex gap-4 text-sm text-[color:var(--muted)]">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="transition-colors hover:text-[color:var(--foreground)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="h-px w-full bg-[color:var(--foreground)]/10" />
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[color:var(--foreground)]/10 pt-4 text-xs text-[color:var(--muted)]">
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-[color:var(--foreground)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <p className="mt-2">© Dr. Camilo Cruz Gambardella.</p>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
