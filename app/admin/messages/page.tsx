import type { Metadata } from "next";
import { Inbox } from "@/components/admin/inbox";
import { getMessages } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Admin · Inbox" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const messages = await getMessages();
  const initialTab = tab === "strategy-call" || tab === "contact" || tab === "archived" ? tab : "all";

  return (
    <>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-white">Inbox</h1>
      <p className="mt-2 mb-8 max-w-2xl text-light-gray">
        Free strategy call requests and contact form messages, newest first. Opening a new
        message marks it as read.
      </p>
      <Inbox messages={messages} initialTab={initialTab} />
    </>
  );
}
