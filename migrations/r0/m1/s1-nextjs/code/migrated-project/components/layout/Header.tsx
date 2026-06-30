import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home", section: "home" },
  { href: "/donors", label: "Donors", section: "donors" },
  { href: "/lots/items", label: "Lots", section: "lots" },
  { href: "/auction", label: "Auction", section: "auction" },
];

export function Header({ activeSection }: { activeSection: string }) {
  return (
    <header>
      <div className="o-flex o-flex--justify-start o-flex--align-center u-gap-space-100 u-height-space-1100">
        <img
          src="/Tiger-icon-hi-res.svg"
          alt="Taylor Elementary School PTA Logo"
          width={88}
          height={88}
        />
        <div className="o-flex o-flex--column o-flex--justify-between u-height-space-1100">
          <h1>Taylor Elementary School PTA</h1>
          <h2>Online Silent Auction</h2>
        </div>
      </div>
      <nav className="c-nav">
        {NAV_ITEMS.map((item, index) => (
          <span key={item.href} style={{ display: "contents" }}>
            {index > 0 && <div className="c-nav__divider" />}
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
    <footer style={{ textAlign: "center", padding: "1rem", color: "#666" }}>
      <p>&copy; Taylor Elementary School PTA</p>
    </footer>
  );
}

export function getActiveSection(pathname: string): string {
  if (pathname.startsWith("/donors")) return "donors";
  if (pathname.startsWith("/lots")) return "lots";
  if (pathname.startsWith("/auction")) return "auction";
  return "home";
}
