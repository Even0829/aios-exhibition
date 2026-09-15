import { useTimeline } from "../timeline";
import { useEffect, useState } from 'react';
import { Asset, CyclingDots, GlassCard } from './Primitives';
import RadarAnimation from './RadarAnimation';
import { sceneCopy, type AnalysisConfig, type DecisionSeverity } from '../mock';

export type ReasoningStage = 'thinking' | 'analysis';

function CapabilityProcess({ progress, data }: { progress: number; data: AnalysisConfig }) {
  const { setTimeout, clearTimeout, setInterval, clearInterval, performance } = useTimeline();
  const [offset, setOffset] = useState(0);
  const lastOffset = Math.max(0, data.capabilities.length - 3);
  useEffect(() => {
    if (!lastOffset) return;
    const timer = setInterval(() => setOffset(value => value < lastOffset ? value + 1 : 0), 2400);
    return () => clearInterval(timer);
  }, [lastOffset]);
  const firstPending = data.capabilities.findIndex(item => progress < item.at);
  return <div className={`analysis-capability-window ${lastOffset && offset < lastOffset ? 'has-overflow' : ''}`}>
    <div className="analysis-capabilities" style={{ transform: `translateY(-${offset * 42}px)` }}>
      {data.capabilities.map((item, index) => {
        const used = progress >= item.at;
        const loading = !used && index === firstPending;
        return <div key={item.id} className={`${used ? 'used' : ''}${loading ? ' loading' : ''}`}>
          <Asset name="analysis-tool.svg" /><span>{item.label}</span><i />
        </div>;
      })}
    </div>
  </div>;
}

export function AnalysisPage({ active, data, severity, heading, onStageChange, onComplete }: { active: boolean; data: AnalysisConfig; severity: DecisionSeverity; heading: string; onStageChange?: (stage: ReasoningStage) => void; onComplete?: () => void }) {
  const { setTimeout, clearTimeout, setInterval, clearInterval, performance } = useTimeline();
  const [stage, setStage] = useState<'thinking' | 'switching' | 'analysis'>('thinking');
  const [thinkingProgress, setThinkingProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  useEffect(() => {
    if (!active) return;
    setStage('thinking');
    setThinkingProgress(0);
    setAnalysisProgress(0);
    onStageChange?.('thinking');
    const started = performance.now();
    let hold: ReturnType<typeof setTimeout> | undefined;
    let reveal: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      const next = Math.min(100, Math.floor((performance.now() - started) / data.thinking.durationMs * 100));
      setThinkingProgress(next);
      if (next >= 100) {
        clearInterval(timer);
        hold = setTimeout(() => {
          setStage('switching');
          reveal = setTimeout(() => {
            setStage('analysis');
            onStageChange?.('analysis');
          }, 700);
        }, 1000);
      }
    }, 100);
    return () => {
      clearInterval(timer);
      clearTimeout(hold);
      clearTimeout(reveal);
    };
  }, [active, data, onStageChange]);
  useEffect(() => {
    if (!active || stage !== 'analysis') return;
    const started = performance.now();
    const timer = setInterval(() => {
      const next = Math.min(100, Math.floor((performance.now() - started) / data.durationMs * 100));
      setAnalysisProgress(next);
      if (next >= 100) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 100);
    return () => clearInterval(timer);
  }, [active, data, onComplete, stage]);

  const [headingFirst, headingSecond] = heading.split('\n');
  return <div className="analysis-content" data-severity={severity}>
    <section className="analysis-loaded"><RadarAnimation /><p>{sceneCopy.loaded}</p></section>
    <section className="hero analysis-hero"><h1>{headingFirst}<br />{headingSecond}</h1><div className="guest"><Asset name="imgImage14.png" /><span>暂无身份注册｜游客模式</span></div></section>
    <aside className="work-panel analysis-panel">
      <GlassCard tone="workflow" className={`analysis-card ${stage}-stage`}>
        <div className="reasoning-stage thinking-stage-content" aria-hidden={stage === 'analysis'}>
          <div className="analysis-heading"><h2><Asset name="thinking-mode-figma.png" />思考模式</h2><span><Asset name="imgEllipse13Active.svg" />思考中<CyclingDots /></span></div>
          <div className="thinking-message"><Asset name="thinking-deep.svg" /><span>{data.thinking.message}<CyclingDots /></span></div>
          <div className="thinking-progress-row">
          <div className="analysis-progress-copy"><span>思考进度</span><strong>{thinkingProgress}%</strong></div>
          <div className="analysis-progress" role="progressbar" aria-label="思考进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={thinkingProgress}><span style={{ width: `${thinkingProgress}%` }} /></div>
          </div>
        </div>
        <div className="reasoning-stage analysis-stage-content" aria-hidden={stage !== 'analysis'}>
          <div className="analysis-heading"><h2><Asset name="analysis-model-figma.png" />完成模型同步</h2><span><Asset name="imgEllipse13Active.svg" />模型分析中<CyclingDots /></span></div>
          <CapabilityProcess progress={analysisProgress} data={data} />
          <div className="analysis-progress-copy"><span>分析进程</span><strong>{analysisProgress}%</strong></div>
          <div className="analysis-progress" role="progressbar" aria-label="分析进程" aria-valuemin={0} aria-valuemax={100} aria-valuenow={analysisProgress}><span style={{ width: `${analysisProgress}%` }} /></div>
        </div>
      </GlassCard>
    </aside>
  </div>;
}
