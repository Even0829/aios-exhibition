import { useCallback, useEffect, useRef, useState } from 'react';
import { Timeline, TimelineContext } from '../timeline';
import { cooperation, fallAnalysis, fallDecisions, fallExecution, fallFeedback, fallQuestions, type CooperationState, type FallOutcome } from '../fallMock';
import type { ScenarioId } from '../mock';
import { AiosStatus, Asset } from './Primitives';
import { ConfirmationPanel } from './ConfirmationPanel';
import { AnalysisPage } from './AnalysisPage';
import { DecisionPage } from './DecisionPage';
import { ExecutionPage } from './ExecutionPage';
import { FeedbackPage } from './FeedbackPage';
import { VoiceDock } from './VoiceDock';

type Stage = 'entering' | 'confirming' | 'confirmation-exit' | 'analyzing' | 'decision-transition' | 'deciding' | 'execution-transition' | 'executing' | 'feedback-transition' | 'feedback' | 'returning';
export function FallEvent({ onResume, onRestart, onScenario }: { onResume: () => void; onRestart: () => void; onScenario: (scenario: ScenarioId) => void }) {
  const [clock] = useState(() => new Timeline());
  const [stage, setStage] = useState<Stage>('entering');
  const [question, setQuestion] = useState(0);
  const [transition, setTransition] = useState<'idle' | 'question-exit' | 'loading' | 'loading-exit'>('idle');
  const [outcome, setOutcome] = useState<FallOutcome | null>(null);
  const [voice, setVoice] = useState<string | null>(null);
  const [state, setState] = useState<CooperationState>('pending');
  const [menu, setMenu] = useState(false);
  const scheduled = useRef(false);
  const decisionStarted = useRef(false);
  const severity = outcome === 'fine' ? 'normal' : 'emergency';
  const confirming = ['entering', 'confirming', 'confirmation-exit'].includes(stage);
  useEffect(() => {
    const id = clock.setTimeout(() => setStage('confirming'), 700);
    return () => { clock.clearTimeout(id); clock.dispose(); };
  }, [clock]);
  useEffect(() => {
    if (transition === 'idle') return;
    const id = clock.setTimeout(() => {
      if (transition === 'question-exit') setTransition('loading');
      else if (transition === 'loading') setTransition('loading-exit');
      else { setQuestion(1); setTransition('idle'); }
    }, transition === 'loading' ? 2000 : 450);
    return () => clock.clearTimeout(id);
  }, [clock, transition]);
  const answer = useCallback((value: string) => {
    if (stage !== 'confirming' || transition !== 'idle') return;
    if (value === 'unanswered' && question === 0) { setTransition('question-exit'); return; }
    if (value !== 'fine' && value !== 'help' && value !== 'unanswered') return;
    setOutcome(value);
    setStage('confirmation-exit');
    clock.setTimeout(() => setStage('analyzing'), 900);
  }, [clock, question, stage, transition]);
  const toDecision = useCallback(() => {
    if (decisionStarted.current) return;
    decisionStarted.current = true;
    setVoice(null);
    setStage('decision-transition');
    clock.setTimeout(() => setStage('deciding'), 3200);
  }, [clock]);
  const finishAnalysis = useCallback(() => {
    if (scheduled.current) return;
    scheduled.current = true;
    clock.setTimeout(toDecision, 8000);
  }, [clock, toDecision]);
  const decisionReady = useCallback(() => { if (outcome) setVoice(fallDecisions[outcome].voice); }, [outcome]);
  const afterDecision = useCallback(() => {
    setVoice(null);
    const fine = outcome === 'fine';
    setStage(fine ? 'feedback-transition' : 'execution-transition');
    clock.setTimeout(() => setStage(fine ? 'feedback' : 'executing'), 3200);
  }, [clock, outcome]);
  useEffect(() => {
    if (stage !== 'executing') return;
    const initiated = clock.setTimeout(() => { setState('initiated'); setVoice(cooperation.initiated.voice); }, 3400);
    const guarding = clock.setTimeout(() => { setState('guarding'); setVoice(cooperation.guarding.voice); }, 8200);
    return () => { clock.clearTimeout(initiated); clock.clearTimeout(guarding); };
  }, [clock, stage]);
  const finishFeedback = useCallback(() => {
    clock.setTimeout(() => {
      setStage('returning');
      clock.setTimeout(onResume, 700);
    }, 8000);
  }, [clock, onResume]);
  const showAnalysis = stage === 'analyzing' || stage === 'decision-transition';
  const showDecision = ['decision-transition', 'deciding', 'execution-transition', 'feedback-transition'].includes(stage);
  const showExecution = stage === 'execution-transition' || stage === 'executing';
  const showFeedback = stage === 'feedback-transition' || stage === 'feedback';
  const stableStage = ['confirming', 'analyzing', 'deciding', 'executing', 'feedback'].includes(stage);
  const canGoPrevious = stableStage && stage !== 'confirming';
  const canGoNext = stage === 'analyzing' || stage === 'deciding' || stage === 'feedback';
  const resetConfirmation = useCallback(() => {
    clock.dispose();
    setStage('confirming');
    setQuestion(0);
    setTransition('idle');
    setOutcome(null);
    setVoice(null);
    setState('pending');
    scheduled.current = false;
    decisionStarted.current = false;
    setMenu(false);
  }, [clock]);
  const previous = () => {
    if (!canGoPrevious) return;
    clock.dispose();
    setVoice(null);
    setState('pending');
    setMenu(false);
    if (stage === 'analyzing') { resetConfirmation(); return; }
    if (stage === 'deciding') {
      scheduled.current = false;
      decisionStarted.current = false;
      setStage('analyzing');
      return;
    }
    if (stage === 'executing' || stage === 'feedback') setStage('deciding');
  };
  const next = () => {
    if (!canGoNext) return;
    clock.dispose();
    setVoice(null);
    setMenu(false);
    if (stage === 'analyzing') { toDecision(); return; }
    if (stage === 'deciding') { afterDecision(); return; }
    if (stage === 'feedback') onResume();
  };
  return <TimelineContext.Provider value={clock}>
    <div className={`fall-event scene-state ${stage === 'entering' ? 'fall-entering' : stage} ${confirming ? 'confirmation-open' : ''}`} data-scenario="fall-emergency" data-outcome={outcome ?? 'pending'} data-cooperation={state} aria-label="疑似跌倒事件" onKeyDown={e => {
      if (e.key === 'Escape') { e.stopPropagation(); setMenu(false); }
    }}>
      <header>
        <AiosStatus label={confirming ? 'INT AIOS 检测到疑似跌倒...' : 'INT AIOS 状态已改变...'} active expanded={!confirming} currentPhases={['感知', showFeedback ? '反馈' : showExecution ? '执行' : showDecision ? '决策' : '思考/分析']} />
        <div className="system-info"><div className="avatar-control">
          <button className="avatar-trigger" type="button" aria-label="打开紧急事件查验控制" aria-expanded={menu} onClick={() => setMenu(v => !v)}><Asset name="imgImage13.png" className="avatar" /></button>
          {menu && <div className="avatar-menu" role="menu" aria-label="紧急事件查验控制">
            <button type="button" role="menuitem" className="restart-control" onClick={onRestart}><i>↻</i><span>重新开始</span></button>
            <button type="button" role="menuitem" disabled={!canGoPrevious} onClick={previous}><i>←</i><span>上一步</span></button>
            <button type="button" role="menuitem" disabled={!canGoNext} onClick={next}><i>→</i><span>下一步</span></button>
            <div className="avatar-menu-label">异常体验故事</div>
            <button type="button" role="menuitem" className="scenario-control" onClick={() => onScenario('air-warning')}><i className="story-dot warning" /><span>空气环境异常</span></button>
            <button type="button" role="menuitem" className="scenario-control" onClick={() => onScenario('body-warning')}><i className="story-dot warning" /><span>人体检测不舒服</span></button>
            <button type="button" role="menuitem" className="scenario-control current" onClick={resetConfirmation}><i className="story-dot emergency" /><span>疑似跌倒</span></button>
          </div>}
        </div></div>
      </header>
      {confirming && <>
        <ConfirmationPanel question={fallQuestions[question]} questionKey={`fall-${question}`} interactive={stage === 'confirming'} severity="emergency" transition={transition} loadingMessage={fallQuestions[1].message} onAnswer={answer} />
      </>}
      {showAnalysis && <AnalysisPage active={stage === 'analyzing'} data={fallAnalysis} severity={severity} heading={'INT AIOS 正在结合疑似事件\n与确认信息分析现场状态'} onComplete={finishAnalysis} />}
      {showDecision && outcome && <DecisionPage active={stage === 'deciding'} data={fallDecisions[outcome]} heading={'INT AIOS 正在根据现场状态\n给出本次照护决策'} onComplete={decisionReady} />}
      {showExecution && <ExecutionPage active={stage === 'executing'} data={fallExecution} heading={'INT AIOS 正在关注人体与\n空间变化并持续陪护'} careActionState={state === 'pending' ? 'pending' : state === 'initiated' ? 'running' : 'complete'} />}
      {showFeedback && <FeedbackPage active={stage === 'feedback'} data={fallFeedback} heading={'INT AIOS已记录本轮确认\n将继续关注并恢复服务'} resultTitle="INT AIOS 确认结果" detailTitle="确认反馈" onComplete={finishFeedback} />}
      <VoiceDock placement={confirming ? 'confirmation' : 'dock'} message={confirming ? null : voice} severity={severity} phase={showAnalysis && !showDecision ? 'thinking' : 'responding'} confirmationPhase={transition === 'loading' || transition === 'loading-exit' ? 'thinking' : 'responding'} onPresentationComplete={stage === 'deciding' ? afterDecision : stage === 'executing' && voice ? () => setVoice(current => current === voice ? null : current) : undefined} />
    </div>
  </TimelineContext.Provider>;
}
