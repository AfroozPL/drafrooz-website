"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" onClick={onClick} disabled={pending}>
      Sign out
    </Button>
  );
}
