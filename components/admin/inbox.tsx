"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { setMessageStatus } from "@/app/actions/admin";
import type { AdminMessage } from "@/lib/admin/data";
import { fmtDateTime, timeAgo } from "@/components/admin/format";

type Tab = "all" | "strategy-call" | "contact" | "archived";

const STATUS_STYLE: Record<AdminMessage["status"], string> = {
  new: "bg-vivid-mint/15 text-vivid-mint",
  read: "bg-electric-blue/15 text-electric-blue",
  replied: "bg-deep-violet/20 text-[#b79cff]",
  archived: "bg-white/10 text-muted",
};

export function Inbox({ messages, initialTab = "all" }: { messages: AdminMessage[]; initialTab?: Tab }) {
  const router = useRouter();
  const [tab, setTab] = React.useState<Tab>(initialTab);
  const [query, setQuery] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  // Optimistic status overrides so buttons feel instant.
  const [overrides, setOverrides] = React.useState<Record<string, AdminMessage["status"]>>({});

  const withStatus = messages.map((m) => ({ ...m, status: overrides[m.id] ?? m.status }));
  const q = query.trim().toLowerCase();
  const visible = withStatus.filter((m) => {
    if (tab === "archived" ? m.status !== "archived" : m.status === "archived") return false;
    if (tab === "strategy-call" && m.kind !== "strategy-call") return false;
    if (tab === "contact" && m.kind !== "contact") return false;
    if (!q) return true;
    return [m.name, m.email, m.company ?? "", m.message].some((s) => s.toLowerCase().includes(q));
  });

  const counts = {
    all: withStatus.filter((m) => m.status !== "archived").length,
    "strategy-call": withStatus.filter((m) => m.kind === "strategy-call" && m.status !== "archived").length,
    contact: withStatus.filter((m) => m.kind === "contact" && m.status !== "archived").length,
    archived: withStatus.filter((m) => m.status === "archived").length,
  };

  function update(id: string, status: AdminMessage["status"]) {
    const before = overrides[id];
    setOverrides((o) => ({ ...o, [id]: status }));
    setError(null);
    startTransition(async () => {
      const res = await setMessageStatus({ id, status });
      if (!res.ok) {
        setOverrides((o) => ({ ...o, [id]: before as AdminMessage["status"] }));
        setError(res.error);
      } else {
        router.refresh();
      }
    });
  }

  function toggle(m: AdminMessage & { status: AdminMessage["status"] }) {
    const next = openId === m.id ? null : m.id;
    setOpenId(next);
    if (next && m.status === "new") update(m.id, "read");
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "strategy-call", label: "Strategy calls" },
    { key: "contact", label: "Contact messages" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                tab === t.key
                  ? "border-electric-blue bg-electric-blue text-ink font-semibold"
                  : "border-white/15 text-light-gray hover:text-white",
              )}
            >
              {t.label} <span className="opacity-70">{counts[t.key]}</span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, company or message…"
          aria-label="Search messages"
          className="w-full rounded-full border border-white/15 bg-ink px-4 py-2 text-sm text-white placeholder:text-muted focus:border-electric-blue focus:outline-none lg:w-80"
        />
      </div>

      {error && <p className="mt-4 text-sm text-amber-gold">{error}</p>}

      <ul className="mt-6 divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08]">
        {visible.length === 0 && (
          <li className="p-10 text-center text-light-gray">
            {q ? "No messages match that search." : "Nothing here yet. New enquiries will appear here as soon as they're sent."}
          </li>
        )}
        {visible.map((m) => {
          const open = openId === m.id;
          const subject =
            m.kind === "strategy-call" ? "Your free AI strategy call" : "Re: your message";
          return (
            <li key={m.id} className={cn("bg-navy/30 transition-colors", open && "bg-navy/70")}>
              <button
                type="button"
                onClick={() => toggle(m)}
                aria-expanded={open}
                className="flex w-full items-start gap-4 p-5 text-left hover:bg-white/[0.02]"
              >
                <span
                  aria-hidden
                  className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", m.status === "new" ? "bg-vivid-mint" : "bg-transparent")}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("font-semibold text-white", m.status === "new" && "text-white")}>{m.name}</span>
                    {m.company && <span className="text-sm text-muted">· {m.company}</span>}
                    {m.kind === "strategy-call" && (
                      <span className="rounded-full bg-vivid-mint/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-vivid-mint">
                        Free strategy call
                      </span>
                    )}
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] capitalize", STATUS_STYLE[m.status])}>{m.status}</span>
                  </div>
                  <p className="mt-1 truncate text-sm text-light-gray">{m.body}</p>
                </div>
                <span className="shrink-0 text-xs text-muted" title={fmtDateTime(m.created_at)}>
                  {timeAgo(m.created_at)}
                </span>
              </button>

              {open && (
                <div className="px-5 pb-6 pl-11">
                  <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                    <Field label="Email">
                      <a href={`mailto:${m.email}`} className="text-electric-blue hover:underline">{m.email}</a>
                    </Field>
                    <Field label="Received">{fmtDateTime(m.created_at)}</Field>
                    {m.company && <Field label="Organisation">{m.company}</Field>}
                    {m.fields.map((f) => (
                      <Field key={f.label} label={f.label}>{f.value}</Field>
                    ))}
                  </dl>
                  <p className="mt-5 whitespace-pre-wrap rounded-xl border border-white/[0.06] bg-ink/60 p-4 text-[15px] leading-relaxed text-white/90">
                    {m.body}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <a
                      href={`mailto:${m.email}?subject=${encodeURIComponent(subject)}`}
                      onClick={() => m.status !== "replied" && update(m.id, "replied")}
                      className="rounded-full bg-electric-blue px-4 py-2 text-sm font-semibold text-ink hover:shadow-glow-blue"
                    >
                      Reply by email
                    </a>
                    {m.status !== "replied" && (
                      <ActionButton disabled={pending} onClick={() => update(m.id, "replied")}>Mark replied</ActionButton>
                    )}
                    {m.status !== "new" && (
                      <ActionButton disabled={pending} onClick={() => update(m.id, "new")}>Mark unread</ActionButton>
                    )}
                    {m.status !== "archived" ? (
                      <ActionButton disabled={pending} onClick={() => update(m.id, "archived")}>Archive</ActionButton>
                    ) : (
                      <ActionButton disabled={pending} onClick={() => update(m.id, "read")}>Restore</ActionButton>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-28 shrink-0 text-muted">{label}</dt>
      <dd className="min-w-0 break-words text-white">{children}</dd>
    </div>
  );
}

function ActionButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="rounded-full border border-white/15 px-4 py-2 text-sm text-light-gray transition-colors hover:border-white/40 hover:text-white disabled:opacity-50"
    />
  );
}
