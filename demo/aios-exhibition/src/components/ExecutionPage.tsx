import { useTimeline } from "../timeline";
import { useEffect, useMemo, useState } from 'react';
import { Asset, GlassCard } from './Primitives';
import RadarAnimation from './RadarAnimation';
import { sceneCopy, type ExecutionConfig } from '../mock';

type CareActionState = 'pending' | 'running' | 'complete';

export function ExecutionPage({ active, data, heading, onComplete, careActionState = 'pending' }: { active: boolean; data: ExecutionConfig; heading: string; onComplete?: () => void; careActionState?: CareActionState }) {
  const { setTimeout, clearTimeout, performance, requestAnimationFrame, cancelAnimationFrame } = useTimeline();
  const [targetVisible, setTargetVisible] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTargetVisible(false);
    setProcessVisible(false);
    setProgress(0);
    if (!active) return;
    const targetTimer = setTimeout(() => setTargetVisible(true), 420);
    const processTimer = setTimeout(() => setProcessVisible(true), 2_020);
    const progressStart = data.care ? 2_840 : 2_300;
    const startedAt = performance.now() + progressStart;
    let frame = 0;
    const tick = (now: number) => {
      if (now < startedAt) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const next = Math.min(100, ((now - startedAt) / data.durationMs) * 100);
      setProgress(next);
      if (next < 100) frame = requestAnimationFrame(tick);
      else onComplete?.();
    };
    if (data.care?.mode !== 'continuous') frame = requestAnimationFrame(tick);
    return () => {
      clearTimeout(targetTimer);
      clearTimeout(processTimer);
      cancelAnimationFrame(frame);
    };
  }, [active, data, onComplete]);

  const currentIndex = useMemo(() => {
    const started = data.steps.reduce((latest, step, index) => progress >= step.at ? index : latest, -1);
    if (progress >= 100) return data.steps.length;
    return started;
  }, [data.steps, progress]);
  const maxOffset = Math.max(0, data.steps.length - 4);
  const offset = Math.min(maxOffset, Math.max(0, currentIndex - 3));

  const [headingFirst, headingSecond] = heading.split('\n');
  return <div className={`execution-content ${data.care ? 'care-execution' : ''}`} data-severity={data.severity}>
    <section className="execution-loaded"><RadarAnimation /><p>{sceneCopy.loaded}</p></section>
    <section className="hero execution-hero"><h1>{headingFirst}<br />{headingSecond}</h1><div className="guest"><Asset name="imgImage14.png" /><span>暂无身份注册｜游客模式</span></div></section>
    <aside className="work-panel execution-panel">
      <GlassCard className={`execution-target ${targetVisible ? 'visible' : ''}`}>
        <h2><Asset name="decision-model-figma.png" />INT AIOS 执行目标</h2>
        <p>{data.target}</p>
      </GlassCard>
      {data.care?.secondary && <GlassCard tone="workflow" className={`execution-process care-process care-secondary ${processVisible ? 'visible' : ''}`}>
        <h2><Asset name="decision-model-figma.png" />{data.care.secondary.title}</h2>
        <p>{data.care.secondary[careActionState]}</p>
        <div className={`care-ring ${careActionState === 'running' ? 'continuous' : ''}`} role="status" aria-label={data.care.secondary[careActionState]}>
          <Asset name="completion-ring-figma.svg" className="care-ring-track" />
          <svg viewBox="0 0 64 64" className="care-ring-progress" aria-hidden="true"><circle cx="32" cy="32" r="30" pathLength="1" style={{ strokeDashoffset: careActionState === 'complete' ? 0 : .74 }} /></svg>
          <Asset name="completion-hourglass-figma.svg" className="care-ring-icon" />
        </div>
      </GlassCard>}
      {data.care ? <GlassCard tone="workflow" className={`execution-process care-process ${processVisible ? 'visible' : ''}`}>
        <h2><Asset name="decision-model-figma.png" />{data.title}</h2>
        <p>{data.care.description}</p>
        <div className={`care-ring ${data.care.mode === 'continuous' ? 'continuous' : ''}`} role="progressbar"
          aria-label={data.care.mode === 'continuous' ? '持续陪护，等待外部介入' : '本轮陪护观察进度'}
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={data.care.mode === 'timed' ? Math.round(progress) : undefined}>
          <Asset name="completion-ring-figma.svg" className="care-ring-track" />
          <svg viewBox="0 0 64 64" className="care-ring-progress" aria-hidden="true"><circle cx="32" cy="32" r="30" pathLength="1" style={{ strokeDashoffset: data.care.mode === 'continuous' ? .74 : 1 - progress / 100 }} /></svg>
          <Asset name="care-hand-figma.svg" className="care-ring-icon" />
        </div>
      </GlassCard> : <GlassCard tone="workflow" className={`execution-process ${processVisible ? 'visible' : ''}`}>
        <div className="execution-heading">
          <h2><Asset name="decision-model-figma.png" />{data.title}</h2>
          <span><Asset name="imgEllipse13Active.svg" />主动服务中</span>
        </div>
        <div className={`execution-step-window ${maxOffset ? 'has-overflow' : ''}`}>
          <div className="execution-steps" style={{ transform: `translateY(-${offset * 42}px)` }}>
            {data.steps.map((step, index) => {
              const complete = progress >= 100 || currentIndex > index;
              const running = currentIndex === index;
              const revealed = currentIndex >= index;
              const status = complete ? step.complete : running ? step.running : step.pending;
              return <div className={`execution-step ${revealed ? 'revealed' : ''} ${running ? 'running' : ''} ${complete ? 'complete' : ''}`} key={step.id}>
                <b>{String(index + 1).padStart(2, '0')}</b>
                <span>{step.label}</span>
                <i />
                <em>{status}</em>
              </div>;
            })}
          </div>
        </div>
        <div className="execution-progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="execution-progress-copy"><span>服务进程</span><strong>{Math.round(progress)}%</strong></div>
      </GlassCard>}
    </aside>
  </div>;
}
