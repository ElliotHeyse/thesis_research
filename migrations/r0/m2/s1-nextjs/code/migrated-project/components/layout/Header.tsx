"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/donors",
    label: "Donors",
    match: (path: string) => path.startsWith("/donors"),
  },
  {
    href: "/lots/items",
    label: "Lots",
    match: (path: string) => path.startsWith("/lots"),
  },
  {
    href: "/auction",
    label: "Auction",
    match: (path: string) => path.startsWith("/auction"),
  },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header>
      <div className="o-flex o-flex--justify-start o-flex--align-center u-gap-space-100 u-height-space-1100">
        <Image
          src="/assets/Tiger-icon-hi-res.svg"
          alt="Taylor Elementary School PTA Logo"
          width={88}
          height={88}
          unoptimized
        />
        <div className="o-flex o-flex--column o-flex--justify-between u-height-space-1100">
          <h1>Taylor Elementary School PTA</h1>
          <h2>Online Silent Auction</h2>
        </div>
      </div>
      <nav className="c-nav">
        {NAV_ITEMS.map((item, index) => (
          <span key={item.href} className="o-flex o-flex--align-center">
            {index > 0 && <div className="c-nav__divider" />}
            <Link
              href={item.href}
              className={`c-nav__item${item.match(pathname) ? " c-nav__item--active" : ""}`}
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  );
}
