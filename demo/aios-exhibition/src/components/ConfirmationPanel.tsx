import { useTimeline } from "../timeline";
import { useEffect, useId, useRef, useState } from 'react';
import { Asset, GlassCard } from './Primitives';
import type { DecisionSeverity } from '../mock';

/** Figma 312:359. The globe remains owned by the persistent VoiceDock. */
export function ConfirmationPanel({ question, questionKey, interactive, onAnswer, severity, transition = 'idle', loadingMessage = '收到，正在分析理解...' }: {
  question: { message: string; options: { value: string; label: string }[] };
  questionKey: string; interactive: boolean; onAnswer: (answer: string) => void; severity: DecisionSeverity;
  transition?: 'idle' | 'question-exit' | 'loading' | 'loading-exit';
  loadingMessage?: string;
}) {
  const { setTimeout, clearTimeout } = useTimeline();
  const buttons = useRef<HTMLDivElement>(null);
  const questionId = useId();
  const submitted = useRef(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    submitted.current = false;
    setReady(false);
    if (!interactive || transition !== 'idle') return;
    const timer = setTimeout(() => {
      setReady(true);
    }, 600);
    return () => clearTimeout(timer);
  }, [questionKey, interactive, transition]);
  useEffect(() => {
    if (ready) buttons.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  }, [ready]);
  const loading = transition === 'loading' || transition === 'loading-exit';
  return <div className="confirmation-layer" data-severity={severity} data-transition={transition} aria-hidden={!interactive}>
    <GlassCard tone="workflow" className="confirmation-card">
      <div role="dialog" aria-modal="true" aria-labelledby={questionId} aria-label="INT AIOS 主动确认"
        onKeyDown={event => {
          if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(event.key)) return;
          const items = Array.from(buttons.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
          if (!items.length || !ready || transition !== 'idle') return;
          event.preventDefault();
          const index = items.indexOf(document.activeElement as HTMLButtonElement);
          const backwards = event.key === 'ArrowLeft' || event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey);
          items[(index + (backwards ? -1 : 1) + items.length) % items.length]?.focus({ preventScroll: true });
        }}>
        {loading ? <div key="loading" className="confirmation-loading-content" role="status" aria-live="polite" aria-busy="true">
          <p id={questionId} className="confirmation-question">{loadingMessage}</p>
          <Asset name="confirmation-wait-figma.svg" className="confirmation-spinner" />
        </div> : <div key={questionKey} className="confirmation-answer-content">
          <p id={questionId} className="confirmation-question">{question.message}</p>
          <div className="confirmation-options" data-count={question.options.length} ref={buttons}>
            {question.options.map(option => <button key={option.value} type="button" disabled={!interactive || !ready || transition !== 'idle'}
              onClick={() => { if (submitted.current) return; submitted.current = true; onAnswer(option.value); }}>
              {option.label}
            </button>)}
          </div>
        </div>}
      </div>
    </GlassCard>
  </div>;
}
