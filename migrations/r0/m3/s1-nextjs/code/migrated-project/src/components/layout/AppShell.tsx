import Link from "next/link";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Home", section: "home" },
  { href: "/donors", label: "Donors", section: "donors" },
  { href: "/lots/items", label: "Lots", section: "lots" },
  { href: "/auction", label: "Auction", section: "auction" },
];

export function Header({ activeSection }: { activeSection?: string }) {
  return (
    <header>
      <div className="o-flex o-flex--justify-start o-flex--align-center u-gap-space-100">
        <Image
          src="/assets/tiger-logo.svg"
          alt="Taylor Elementary School PTA Logo"
          width={88}
          height={88}
        />
        <div className="o-flex o-flex--column o-flex--justify-between">
          <h1>Taylor Elementary School PTA</h1>
          <h2>Online Silent Auction</h2>
        </div>
      </div>
      <nav className="c-nav">
        {navItems.map((item, index) => (
          <span key={item.href} style={{ display: "contents" }}>
            {index > 0 ? <div className="c-nav__divider" /> : null}
            <Link
              href={item.href}
              className={`c-nav__item${activeSection === item.section ? " c-nav__item--active" : ""}`}
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer style={{ padding: "var(--space-300)", textAlign: "center", color: "var(--gray-800)" }}>
      <p>&copy; Taylor Elementary School PTA</p>
    </footer>
  );
}

export function AppShell({
  children,
  activeSection,
}: {
  children: React.ReactNode;
  activeSection?: string;
}) {
  return (
    <>
      <Header activeSection={activeSection} />
      <main className="o-container">{children}</main>
      <Footer />
    </>
  );
}
