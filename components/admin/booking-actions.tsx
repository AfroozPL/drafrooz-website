"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { markBookingCompleted } from "@/app/actions/admin";

export function MarkCompletedButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await markBookingCompleted({ id });
            if (res.ok) router.refresh();
            else setError(res.error);
          })
        }
        className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-light-gray transition-colors hover:border-vivid-mint hover:text-vivid-mint disabled:opacity-50"
      >
        {pending ? "Saving…" : "Mark completed"}
      </button>
      {error && <span className="text-xs text-amber-gold">{error}</span>}
    </span>
  );
}
