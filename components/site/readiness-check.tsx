"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  readinessQuestions,
  scoreReadiness,
  type ReadinessQuestion,
} from "@/lib/content/readiness";
import { Icon } from "@/components/site/icons";

type Answers = Partial<Record<ReadinessQuestion["id"], number>>;

const STAGE_ORDER = ["explorer", "experimenter", "builder", "scaler"] as const;

export function ReadinessCheck() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const total = readinessQuestions.length;
  const done = step >= total;

  const result = done
    ? scoreReadiness(answers as Record<ReadinessQuestion["id"], number>)
    : null;

  const advancing = React.useRef(false);

  function choose(qid: ReadinessQuestion["id"], value: number) {
    if (advancing.current) return; // ignore double-clicks mid-transition
    advancing.current = true;
    setAnswers((a) => ({ ...a, [qid]: value }));
    // Small pause so the selection registers visually before moving on.
    window.setTimeout(() => {
      setStep((s) => s + 1);
      advancing.current = false;
    }, 220);
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  const q = readinessQuestions[Math.min(step, total - 1)];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-paper text-ink shadow-[0_40px_120px_-40px_rgba(0,194,255,0.45)]">
      {/* progress */}
      <div className="h-1.5 bg-ink/5">
        <div
          className="h-full bg-gradient-to-r from-electric-blue to-deep-violet transition-[width] duration-500"
          style={{ width: `${(Math.min(step, total) / total) * 100}%` }}
        />
      </div>

      <div className="p-6 sm:p-10 min-h-[420px]" aria-live="polite">
        {!done ? (
          <div key={q.id} className="animate-rise-in">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Question {step + 1} of {total}
            </p>
            <h3 className="mt-3 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
              {q.question}
            </h3>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {q.options.map((opt, i) => {
                const selected = answers[q.id] === i;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => choose(q.id, i)}
                    className={cn(
                      "group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left text-[15px] transition-all duration-200",
                      selected
                        ? "border-deep-violet bg-deep-violet text-white"
                        : "border-ink/10 bg-white hover:border-electric-blue hover:-translate-y-0.5 hover:shadow-lg",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-xs",
                        selected ? "border-white/40" : "border-ink/15 text-ink/50 group-hover:border-electric-blue group-hover:text-electric-blue",
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="mt-6 text-sm text-ink/60 hover:text-ink underline-offset-4 hover:underline"
              >
                ← Previous question
              </button>
            )}
          </div>
        ) : (
          result && (
            <div className="animate-rise-in">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
                Your AI maturity stage
              </p>
              <h3 className="mt-2 font-display text-4xl sm:text-5xl font-semibold tracking-tight">
                <span className="font-serif italic font-normal text-deep-violet">The </span>
                {result.name}
              </h3>

              {/* stage track */}
              <div className="mt-6 grid grid-cols-4 gap-2">
                {STAGE_ORDER.map((k, i) => {
                  const reached = STAGE_ORDER.indexOf(result.key) >= i;
                  return (
                    <div key={k}>
                      <div
                        className={cn(
                          "h-2 rounded-full transition-colors duration-700",
                          reached ? "bg-gradient-to-r from-electric-blue to-deep-violet" : "bg-ink/10",
                        )}
                        style={{ transitionDelay: `${i * 150}ms` }}
                      />
                      <p className={cn("mt-2 text-xs capitalize", k === result.key ? "font-semibold text-ink" : "text-ink/45")}>
                        {k}
                      </p>
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 text-ink/75 leading-relaxed max-w-2xl">{result.summary}</p>
              <div className="mt-5 rounded-2xl bg-white p-5 border border-ink/10">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-electric-blue">
                  Recommended next step
                </p>
                <p className="mt-2 text-ink">{result.nextStep}</p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={`/strategy-call?stage=${result.key}`}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition hover:bg-deep-violet"
                >
                  Discuss my results on a free call
                  <Icon name="arrow" className="h-4 w-4" />
                </Link>
                <Link
                  href={`/services/${result.serviceSlug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-6 py-3.5 font-semibold text-ink transition hover:border-ink"
                >
                  {result.serviceName}
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="text-sm text-ink/60 hover:text-ink underline-offset-4 hover:underline ml-1"
                >
                  Start again
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
