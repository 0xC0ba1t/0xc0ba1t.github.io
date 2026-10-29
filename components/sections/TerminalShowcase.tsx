import MacbookScrollDemo from "@/components/macbook-scroll-demo";

/** The interactive terminal, shown on the screen of Aceternity's scroll-driven MacBook. */
export function TerminalShowcase() {
  return (
    <section id="terminal" aria-labelledby="terminal-h" className="relative border-b border-line">
      <MacbookScrollDemo />
    </section>
  );
}
