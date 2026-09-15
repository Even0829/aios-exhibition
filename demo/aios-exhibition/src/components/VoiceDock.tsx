import { useTimeline } from "../timeline";
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { VoicePresence, type VoicePhase, type VoiceSeverity } from './VoicePresence';

type Stage = 'rest' | 'enter' | 'shown' | 'exit';
/** One persistent globe; every message replacement first closes and returns home. */
export function VoiceDock({ message, replacementPreludeMs = 0, phase = 'responding', severity = 'normal', autoDismissMs, placement = 'dock', confirmationPhase = 'responding', onPresentationComplete }: { message: string | null; replacementPreludeMs?: number; phase?: VoicePhase; severity?: VoiceSeverity; autoDismissMs?: number; placement?: 'dock' | 'confirmation'; confirmationPhase?: VoicePhase; onPresentationComplete?: () => void }) {
  const { setTimeout, clearTimeout } = useTimeline();
  const [stage, setStage] = useState<Stage>('rest');
  const [displayed, setDisplayed] = useState<string | null>(null);
  const [entrance, setEntrance] = useState<'initial' | 'next'>('initial');
  const [overflowing, setOverflowing] = useState(false);
  const previous = useRef<string | null>(null);
  const prelude = useRef(replacementPreludeMs);
  prelude.current = replacementPreludeMs;
  const autoRest = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copyWindow = useRef<HTMLDivElement | null>(null);
  const copy = useRef<HTMLSpanElement | null>(null);
  useEffect(() => () => clearTimeout(autoRest.current), []);
  useLayoutEffect(() => {
    if (!displayed || !copyWindow.current || !copy.current) {
      setOverflowing(false);
      return;
    }
    setOverflowing(copy.current.scrollWidth > copyWindow.current.clientWidth);
  }, [displayed]);
  useEffect(() => {
    if (previous.current === message) return;
    const hadMessage = previous.current !== null;
    previous.current = message;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const enter = () => {
      setDisplayed(message);
      if (!message) { setStage('rest'); return; }
      setEntrance(hadMessage ? 'next' : 'initial');
      setStage('enter');
      timers.push(setTimeout(() => setStage('shown'), hadMessage ? 2000 : 3400));
    };
    if (hadMessage) {
      timers.push(setTimeout(() => {
        setStage('exit');
        timers.push(setTimeout(enter, 1000));
      }, prelude.current));
    } else enter();
    return () => timers.forEach(clearTimeout);
  }, [message]);
  useEffect(() => {
    if (stage !== 'shown' || !autoDismissMs) return;
    const close = setTimeout(() => {
      setStage('exit');
      autoRest.current = setTimeout(() => {
        setDisplayed(null);
        setStage('rest');
      }, 1000);
    }, autoDismissMs);
    return () => clearTimeout(close);
  }, [autoDismissMs, stage]);
  useEffect(() => {
    if (stage !== 'shown' || !message || displayed !== message || !onPresentationComplete) return;
    // Allow the existing 1s delay + 14s marquee to reach its end before advancing.
    const done = setTimeout(onPresentationComplete, overflowing ? 16_000 : 4_600);
    return () => clearTimeout(done);
  }, [stage, message, displayed, overflowing, onPresentationComplete]);
  const presencePhase = placement === 'confirmation'
    ? confirmationPhase
    : phase === 'thinking'
      ? 'thinking'
      : stage === 'shown'
        ? phase
        : 'idle';
  return <div className={`voice-dock voice-${stage} ${placement === 'confirmation' ? 'voice-confirmation' : ''}`} data-entrance={entrance}>
    <div className={`voice-prompt ${overflowing ? 'voice-prompt-long' : ''}`} aria-hidden={stage === 'rest' || stage === 'exit'}>
      <div className="voice-copy-window" ref={copyWindow}>
        <span key={displayed} ref={copy}>{displayed}</span>
      </div>
    </div>
    <VoicePresence phase={presencePhase} severity={severity} />
  </div>;
}
