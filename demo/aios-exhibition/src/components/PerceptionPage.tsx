import { useTimeline } from "../timeline";
import { useCallback, useEffect, useState, type CSSProperties } from 'react';
import { Asset, CyclingDots, GlassCard } from './Primitives';
import RadarAnimation from './RadarAnimation';
import { sceneCopy, type PerceptionConfig, type SensingGroup, type SensingResult } from '../mock';

export function DeviceProgress({ label, progress }: { label: string; progress: number }) {
  return <div className="device-progress available">
    <span className="device-progress-label">{label}</span>
    <div className="device-progress-track" role="progressbar" aria-label={label} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${progress}%` }} />
    </div><strong>{progress}%</strong>
  </div>;
}

function ResultSlide({ result, active, people, appearance }: { result: SensingResult; active: boolean; people: number; appearance: string }) {
  const { setTimeout, clearTimeout, setInterval, clearInterval, performance } = useTimeline();
  const [row, setRow] = useState(0);
  const metrics = result.metrics ?? [];
  const last = Math.max(0, metrics.length - 2);
  useEffect(() => {
    setRow(0);
    if (!active || !last) return;
    const timer = setInterval(() => setRow(n => n < last ? n + 1 : 0), 2400);
    return () => clearInterval(timer);
  }, [active, last]);
  return <div className="sensing-slide" aria-hidden={!active}>
    <div className="sensing-source">· {result.label}</div>
    {result.kind === 'video' ? <>
      <div className="sensing-video-copy"><div>客厅｜{people} 人</div><div>座椅｜{appearance}</div></div>
      <div className="recognition-preview" aria-label="视频识别参考画面"><Asset name="perception-video.png" /><span className="face-target" /></div>
    </> : <div className={`metric-window ${last && row < last ? 'has-overflow' : ''}`}>
      <div className="metric-list" style={{ transform: `translateY(-${row * 44}px)` }}>
        {metrics.map((metric, i) => <div className={`metric-row ${i === row + 2 && row < last ? 'metric-preview' : ''}`} data-tone={metric.tone ?? 'normal'} key={metric.label}>
          <span>{String(i + 1).padStart(2, '0')}</span><span>{metric.label}</span><span>•</span><strong>{metric.value}</strong>
        </div>)}
      </div>
    </div>}
  </div>;
}

function ResultCarousel({ results, people, appearance }: { results: SensingResult[]; people: number; appearance: string }) {
  const { setTimeout, clearTimeout, setInterval, clearInterval, performance } = useTimeline();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (results.length < 2) return;
    // Long metric lists finish their vertical reading cycle before changing device.
    const duration = Math.max(5200, ((results[index].metrics?.length ?? 0) - 2) * 2400 + 3000);
    const timer = setTimeout(() => setIndex(n => (n + 1) % results.length), duration);
    return () => clearTimeout(timer);
  }, [index, results]);
  return <>
    <div className="result-window"><div className="result-track" style={{ transform: `translateX(-${index * 100}%)` }}>
      {results.map((result, i) => <ResultSlide key={result.id} result={result} active={i === index} people={people} appearance={appearance} />)}
    </div></div>
    {results.length > 1 && <div className="sensing-pagination" aria-label="感知结果切换">
      {results.map((result, i) => <button type="button" key={result.id} aria-label={result.label} aria-current={index === i ? 'true' : undefined} onClick={() => setIndex(i)} />)}
    </div>}
  </>;
}

function SensingCard({ group, people, appearance, onComplete }: { group: SensingGroup; people: number; appearance: string; onComplete?: () => void }) {
  const { setTimeout, clearTimeout, setInterval, clearInterval, performance } = useTimeline();
  const [elapsed, setElapsed] = useState(0);
  const [mode, setMode] = useState<'collecting' | 'morphing' | 'result'>('collecting');
  const completed = group.devices.every(device => elapsed >= device.durationMs);
  useEffect(() => {
    const started = performance.now();
    const duration = Math.max(0, ...group.devices.map(device => device.durationMs));
    const timer = setInterval(() => {
      const next = Math.min(duration, performance.now() - started);
      setElapsed(next);
      if (next >= duration) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [group]);
  useEffect(() => {
    if (!completed) return;
    const morph = setTimeout(() => setMode('morphing'), 2000);
    const result = setTimeout(() => { setMode('result'); onComplete?.(); }, 2750);
    return () => { clearTimeout(morph); clearTimeout(result); };
  }, [completed, onComplete]);
  const singleResult = group.results.length === 1;
  const single = group.results[0];
  const metricHeight = Math.min(2, single?.metrics?.length ?? 0) * 44;
  const viewportHeight = singleResult && single.kind === 'metrics'
    ? 56 + (single.metrics!.length > 2 ? 132 : metricHeight)
    : 188;
  const size = {
    '--collection-height': `${92 + group.devices.length * 44}px`,
    '--result-height': `${singleResult ? 58 + 48 + viewportHeight : 306}px`,
    '--result-viewport-height': `${viewportHeight}px`,
    '--single-metric-height': `${single?.metrics && single.metrics.length > 2 ? 132 : metricHeight}px`,
  } as CSSProperties;
  return <div className={`sensing-card-wrap sensing-${mode}${singleResult ? ' sensing-single' : ''}`} style={size} data-group={group.id} data-state={mode} data-severity={group.severity ?? 'normal'}>
    <GlassCard tone="workflow" className="sensing-card">
      <div className="sensing-collect">
        <div className="sensing-heading"><h2><Asset name="wake-discovery-icon.png" />{group.startTitle}</h2><span className="sensing-status"><Asset name="imgEllipse13Active.svg" />匹配设备能力<CyclingDots /></span></div>
        <div className="device-progress-list">{group.devices.map(device => <DeviceProgress key={device.id} label={device.label} progress={Math.min(100, Math.floor(elapsed / device.durationMs * 100))} />)}</div>
      </div>
      <div className="sensing-results" aria-hidden={mode !== 'result'}>
        <div className="sensing-heading"><h2><Asset name="wake-discovery-icon.png" />{group.resultTitle}</h2><span className="sensing-status"><Asset name="imgEllipse13Active.svg" />持续感知中<CyclingDots /></span></div>
        {mode === 'result' && <ResultCarousel results={group.results} people={people} appearance={appearance} />}
      </div>
    </GlassCard>
  </div>;
}

export function PerceptionPage({ active, data, onBodyStart, onComplete }: { active: boolean; data: PerceptionConfig; onBodyStart?: () => void; onComplete?: () => void }) {
  const [bodyStarted, setBodyStarted] = useState(false);
  const startBody = useCallback(() => {
    setBodyStarted(true);
    onBodyStart?.();
  }, [onBodyStart]);
  return <div className="perception-content">
    <section className="perception-loaded"><RadarAnimation /><p>{sceneCopy.loaded}</p></section>
    <section className="hero perception-hero"><h1>INT AIOS 持续守候并建立<br />人体与空间感知</h1><div className="guest"><Asset name="imgImage14.png" /><span>暂无身份注册｜游客模式</span></div></section>
    <aside className="work-panel perception-panel">
      {active && <SensingCard group={data.space} people={data.people} appearance={data.appearance} onComplete={startBody} />}
      {bodyStarted && <SensingCard group={data.body} people={data.people} appearance={data.appearance} onComplete={onComplete} />}
    </aside>
  </div>;
}
