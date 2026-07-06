import Script from "next/script";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "agent-id": string },
        HTMLElement
      >;
    }
  }
}

export function ElevenLabsWidget() {
  return (
    <>
      <elevenlabs-convai agent-id="agent_8001kwtsr9gbfeqrqj4ye4jn8cwj" />
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
    </>
  );
}
