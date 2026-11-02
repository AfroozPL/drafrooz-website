"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/messages", label: "Inbox" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/newsletter", label: "Subscribers" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/availability", label: "Availability" },
];

export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors",
              active ? "bg-electric-blue/15 text-white" : "text-light-gray hover:bg-white/5 hover:text-white",
            )}
          >
            {item.label}
            {item.href === "/admin/messages" && newCount > 0 && (
              <span className="rounded-full bg-vivid-mint px-2 py-0.5 text-[11px] font-bold text-ink">{newCount}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
