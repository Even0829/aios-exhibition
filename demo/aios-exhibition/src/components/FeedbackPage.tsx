import { useTimeline } from "../timeline";
import { useEffect, useMemo, useState } from 'react';
import { Asset, GlassCard } from './Primitives';
import RadarAnimation from './RadarAnimation';
import { completion, sceneCopy, type FeedbackConfig } from '../mock';

export function FeedbackPage({ active, data, heading, completionVisible = false, completionLoading = false, onNarration, onComplete, resultTitle = 'INT AIOS 执行结果', detailTitle = '执行反馈' }: {
  active: boolean;
  data: FeedbackConfig;
  heading: string;
  resultTitle?: string;
  detailTitle?: string;
  completionVisible?: boolean;
  completionLoading?: boolean;
  onNarration?: () => void;
  onComplete?: () => void;
}) {
  const { setTimeout, clearTimeout } = useTimeline();
  const [resultVisible, setResultVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    setResultVisible(false);
    setDetailVisible(false);
    setVisibleCount(0);
    setChartVisible(false);
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => setResultVisible(true), 420),
      setTimeout(() => setDetailVisible(true), 2_020),
    ];
    data.metrics.forEach((_, index) => {
      timers.push(setTimeout(() => setVisibleCount(index + 1), 2_450 + index * 720));
    });
    const chartAt = 2_450 + data.metrics.length * 720 + 300;
    timers.push(setTimeout(() => setChartVisible(true), chartAt));
    timers.push(setTimeout(() => onNarration?.(), chartAt + 900));
    timers.push(setTimeout(() => onComplete?.(), chartAt + 3_200));
    return () => timers.forEach(clearTimeout);
  }, [active, data, onComplete, onNarration]);

  const maxOffset = Math.max(0, data.metrics.length - 4);
  const offset = Math.min(maxOffset, Math.max(0, visibleCount - 4));
  const linePoints = useMemo(() => {
    const values = data.chart?.samples ?? [];
    if (values.length < 2) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = Math.max(1, max - min);
    return values.map((value, index) => {
      const x = index * (364 / (values.length - 1));
      const y = 2 + ((max - value) / span) * 66;
      return `${x},${y}`;
    }).join(' ');
  }, [data.chart]);

  const [headingFirst, headingSecond] = heading.split('\n');
  return <div className={`feedback-content ${!data.chart ? 'feedback-no-chart' : ''}`} data-severity={data.severity}>
    <section className="feedback-loaded"><RadarAnimation /><p>{sceneCopy.loaded}</p></section>
    <section className="hero feedback-hero">
      <h1>{headingFirst}<br />{headingSecond}</h1>
      <div className="feedback-badges">
        <div className="guest"><Asset name="imgImage14.png" /><span>暂无身份注册｜游客模式</span></div>
        <div className="memory-badge">成长日志｜记忆</div>
      </div>
    </section>
    <aside className="work-panel feedback-panel">
      <GlassCard className={`feedback-result ${resultVisible ? 'visible' : ''}`}>
        <h2><Asset name="decision-model-figma.png" />{resultTitle}</h2>
        <p>{data.result}</p>
      </GlassCard>
      <GlassCard tone="workflow" className={`feedback-detail ${detailVisible ? 'visible' : ''}`}>
        <div className="feedback-heading">
          <h2><Asset name="decision-model-figma.png" />{detailTitle}</h2>
          <span><Asset name="imgEllipse13Active.svg" />{visibleCount === data.metrics.length ? '数据已确认' : '数据确认中'}</span>
        </div>
        <div className={`feedback-metric-window ${maxOffset ? 'has-overflow' : ''}`}>
          <div className="feedback-metrics" style={{ transform: `translateY(-${offset * 42}px)` }}>
            {data.metrics.map((metric, index) => {
              const visible = index < visibleCount;
              const loading = index === visibleCount;
              return <div className={`feedback-metric ${visible ? 'visible' : ''} ${loading ? 'loading' : ''}`} data-tone={metric.tone ?? 'normal'} key={metric.id}>
                <b>{String(index + 1).padStart(2, '0')}</b><span>{metric.label}</span><i /><em>{metric.value}</em>
              </div>;
            })}
          </div>
        </div>
        {data.chart && <div className={`feedback-chart ${chartVisible ? 'visible' : ''}`} aria-label={`${data.chart.label}，${data.chart.summary}`}>
          <div className="feedback-chart-caption"><span>{data.chart.label}</span><strong>{data.chart.summary}</strong></div>
          <svg viewBox="0 0 364 86" role="img" aria-hidden="true">
            <defs><linearGradient id="feedback-line" x1="0" x2="1"><stop offset="0" stopColor="#ff7a18"/><stop offset="0.55" stopColor="#d5de18"/><stop offset="1" stopColor="#39f21b"/></linearGradient></defs>
            <path className="feedback-grid-horizontal" d="M0 15H364 M0 50H364 M0 85H364" />
            <path className="feedback-grid-marker" d="M118 13V85" />
            <polyline points={linePoints} fill="none" stroke="url(#feedback-line)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="feedback-chart-axis">{data.chart.times.map(time => <span key={time}>{time}</span>)}</div>
        </div>}
      </GlassCard>
      <GlassCard tone="workflow" className={`completion-card ${completionVisible ? 'visible' : ''} ${completionLoading ? 'loading' : ''}`}>
        <div className="completion-copy">
          <h2><Asset name="decision-model-figma.png" />{data.completion?.title ?? completion.title}</h2>
          <p>{data.completion?.description ?? completion.description}</p>
        </div>
        <div className="completion-loader" role="progressbar" aria-label="等待新的事件和需求" aria-valuemin={0} aria-valuemax={100}>
          <Asset name="completion-ring-figma.svg" className="completion-loader-track" />
          <svg className="completion-loader-progress" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" pathLength="1" />
          </svg>
          <Asset name="completion-hourglass-figma.svg" className="completion-hourglass" />
        </div>
      </GlassCard>
    </aside>
  </div>;
}
