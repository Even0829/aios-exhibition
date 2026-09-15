import { useTimeline } from "../timeline";
import { useEffect, useState } from 'react';
import { Asset, GlassCard } from './Primitives';
import RadarAnimation from './RadarAnimation';
import { sceneCopy, type DecisionConfig } from '../mock';

export function DecisionPage({ active, data, heading, onComplete }: { active: boolean; data: DecisionConfig; heading: string; onComplete?: () => void }) {
  const { setTimeout, clearTimeout, setInterval, clearInterval } = useTimeline();
  const [visibleCount, setVisibleCount] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [conclusionVisible, setConclusionVisible] = useState(false);
  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [loopResetting, setLoopResetting] = useState(false);

  useEffect(() => {
    setVisibleCount(0);
    setLoadingIndex(-1);
    setConclusionVisible(false);
    setLoopStart(null);
    setLoopResetting(false);
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    data.results.forEach((_, index) => {
      const startsAt = 500 + index * 900;
      timers.push(setTimeout(() => {
        setVisibleCount(index + 1);
        setLoadingIndex(index);
      }, startsAt));
      timers.push(setTimeout(() => setLoadingIndex(value => value === index ? -1 : value), startsAt + 650));
    });
    const conclusionAt = 500 + data.results.length * 900 + 550;
    timers.push(setTimeout(() => setConclusionVisible(true), conclusionAt));
    timers.push(setTimeout(() => onComplete?.(), conclusionAt + 850));
    return () => timers.forEach(clearTimeout);
  }, [active, data, onComplete]);

  const maxOffset = Math.max(0, data.results.length - 3);
  const offset = Math.min(maxOffset, Math.max(0, visibleCount - 3));
  const allResultsVisible = visibleCount === data.results.length;
  const trackOffset = allResultsVisible ? (loopStart ?? maxOffset) : offset;
  const loopResults = maxOffset > 0 ? [...data.results, ...data.results] : data.results;

  useEffect(() => {
    if (!active || !allResultsVisible || maxOffset === 0) return;
    setLoopStart(maxOffset);
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => setLoopStart(value => (value ?? maxOffset) + 1), 2400);
    }, 1600);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [active, allResultsVisible, maxOffset]);

  useEffect(() => {
    if (loopStart !== data.results.length) return;
    const reset = setTimeout(() => {
      setLoopResetting(true);
      setLoopStart(0);
      setTimeout(() => setLoopResetting(false), 40);
    }, 840);
    return () => clearTimeout(reset);
  }, [data.results.length, loopStart]);

  const [headingFirst, headingSecond] = heading.split('\n');
  return <div className="decision-content" data-severity={data.severity}>
    <section className="decision-loaded"><RadarAnimation /><p>{sceneCopy.loaded}</p></section>
    <section className="hero decision-hero"><h1>{headingFirst}<br />{headingSecond}</h1><div className="guest"><Asset name="imgImage14.png" /><span>暂无身份注册｜游客模式</span></div></section>
    <aside className="work-panel decision-panel">
      <GlassCard tone="workflow" className="decision-summary">
        <div className="decision-heading"><h2><Asset name="decision-model-figma.png" />完成状态分析</h2><span><svg className="decision-status-ring" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="7.5" fill="none" stroke="currentColor" strokeWidth="3" /></svg>{data.status}</span></div>
        <div className={`decision-result-window ${maxOffset ? 'has-overflow' : ''}`}>
          <div className={`decision-results ${loopResetting ? 'loop-reset' : ''}`} style={{ transform: `translateY(-${trackOffset * 42}px)` }}>
            {loopResults.map((result, renderIndex) => {
              const index = renderIndex % data.results.length;
              const clone = renderIndex >= data.results.length;
              const visible = index < visibleCount && (!clone || allResultsVisible);
              return <div className={`decision-result ${visible ? 'visible' : ''}${!clone && index === loadingIndex ? ' loading' : ''}`} key={`${result}-${clone ? 'clone' : 'original'}`}>
              <Asset name="decision-check.svg" /><span>{result}</span>
            </div>})}
          </div>
        </div>
      </GlassCard>
      <GlassCard className={`decision-conclusion ${conclusionVisible ? 'visible' : ''}`}>
        <h2><Asset name="decision-model-figma.png" />INT AIOS 理解/决策</h2>
        <p>{data.conclusion}</p>
      </GlassCard>
    </aside>
  </div>;
}
