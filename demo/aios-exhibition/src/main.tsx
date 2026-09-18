import { useTimeline } from "./timeline";
import { normalTimeline } from './timeline';
import { FallEvent } from './components/FallEvent';
import { fallMemory } from './fallMock';
import { VoiceDock } from "./components/VoiceDock";
import { ConfirmationPanel } from "./components/ConfirmationPanel";
import { PerceptionPage } from "./components/PerceptionPage";
import { AnalysisPage, type ReasoningStage } from "./components/AnalysisPage";
import { DecisionPage } from "./components/DecisionPage";
import { ExecutionPage } from "./components/ExecutionPage";
import { FeedbackPage } from "./components/FeedbackPage";
import { DevicePanel } from "./components/DevicePanel";
import { SpacePanel } from "./components/SpacePanel";
import { MemoryPanel } from "./components/MemoryPanel";
import { deviceTestOptions, type DeviceStory, type DeviceTest } from "./deviceMock";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AiosStatus,
  Asset,
  CalendarCard,
  ContextRail,
  DiscoveryCard,
  DeviceCountCard,
  Navigation,
  Screen,
  WorkflowCard,
} from "./components/Primitives";
import RadarAnimation from "./components/RadarAnimation";
import { bodyHistory, bodyQuestions, bodyStories, completion, exhibitionScenarios, navigation, standby, wake, type BodyObservationResult, type BodyOutcome, type ScenarioId } from "./mock";
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/funnel-display";
import "./styles.css";
type Scene = "standby" | "waking" | "awake" | "seating" | "perceiving" | "confirmation-transition" | "confirming" | "confirmation-exit" | "analysis-transition" | "analyzing" | "decision-transition" | "deciding" | "execution-transition" | "executing" | "feedback-transition" | "feedback" | "ending-transition" | "ending" | "wake-return";
const checkpoints: Scene[] = ["standby", "awake", "perceiving", "analyzing", "deciding", "executing", "feedback", "ending"];

function App() {
  const { setTimeout, clearTimeout } = useTimeline();
  const [scene, setScene] = useState<Scene>("standby");
  const [fallActive, setFallActive] = useState(false);
  const [fallRecorded, setFallRecorded] = useState(false);
  const resumeFocus = useRef<HTMLElement | null>(null);
  const resumeFall = useCallback(() => {
    setFallRecorded(true);
    setFallActive(false);
    normalTimeline.resume();
    window.requestAnimationFrame(() => resumeFocus.current?.focus({ preventScroll: true }));
  }, []);
  function triggerFall() {
    if (scene === 'standby' || fallActive) return;
    resumeFocus.current = document.querySelector<HTMLElement>('.normal-flow .avatar-trigger');
    normalTimeline.pause();
    setAvatarOpen(false);
    setFallActive(true);
  }
  const [flowRun, setFlowRun] = useState(0);
  const [scenarioId, setScenarioId] = useState<ScenarioId>('normal');
  const [bodyOutcome, setBodyOutcome] = useState<BodyOutcome | null>(null);
  const [bodyObservationResult, setBodyObservationResult] = useState<BodyObservationResult>('recovered');
  const [question, setQuestion] = useState<keyof typeof bodyQuestions>('feeling');
  const [nextQuestion, setNextQuestion] = useState<keyof typeof bodyQuestions>('symptoms');
  const [questionTransition, setQuestionTransition] = useState<'idle' | 'question-exit' | 'loading' | 'loading-exit'>('idle');
  const [bodyResultReady, setBodyResultReady] = useState(false);
  const [bodyRecordReady, setBodyRecordReady] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [deviceTestState, setDeviceTestState] = useState<DeviceTest>('normal');
  const [onlineDeviceCount, setOnlineDeviceCount] = useState(8);
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [bodySensingStarted, setBodySensingStarted] = useState(false);
  const [reasoningStage, setReasoningStage] = useState<ReasoningStage>('thinking');
  const [feedbackVoiceShown, setFeedbackVoiceShown] = useState(false);
  const [decisionVoiceShown, setDecisionVoiceShown] = useState(false);
  const showDecisionVoice = useCallback(() => setDecisionVoiceShown(true), []);
  const isBody = scenarioId === 'body-warning';
  const scenario = isBody && bodyOutcome ? bodyStories[bodyOutcome] : exhibitionScenarios[scenarioId];
  const bodyKeepsExecuting = bodyOutcome === 'urgent' || bodyOutcome === 'unanswered-escalated';
  const confirming = scene === 'confirmation-transition' || scene === 'confirming' || scene === 'confirmation-exit';
  const showPerception = scene === "seating" || scene === "perceiving" || scene === 'confirmation-transition' || (scene === "analysis-transition" && !isBody);
  const showAnalysis = scene === "analysis-transition" || scene === "analyzing" || scene === "decision-transition";
  const showDecision = scene === "decision-transition" || scene === "deciding" || scene === "execution-transition" || (scene === 'feedback-transition' && !!scenario.skipExecution);
  const showExecution = !scenario.skipExecution && (scene === "execution-transition" || scene === "executing" || scene === "feedback-transition");
  const showFeedback = scene === "feedback-transition" || scene === "feedback" || scene === "ending-transition" || scene === "ending" || scene === "wake-return";
  const showFeedbackStatus = scene === "feedback-transition" || scene === "feedback" || scene === "ending-transition" || scene === "ending";
  const expandedStatus = showPerception || showAnalysis || showDecision || showExecution || showFeedbackStatus;
  const warningVoiceActive = scenario.severity !== 'normal' && (
    (showPerception && (isBody ? bodyResultReady : bodySensingStarted))
    || confirming
    || showAnalysis
    || showDecision
    || showExecution
    || (scene === 'feedback' && !feedbackVoiceShown)
  );
  const endingPresentation = scene === 'ending-transition' || scene === 'ending' || scene === 'wake-return';
  const voiceSeverity = endingPresentation ? 'normal' : warningVoiceActive ? scenario.severity : isBody && !showFeedback ? 'normal' : scenario.feedback.severity;
  const [notice, setNotice] = useState("");
  const functionPanelOpen = deviceOpen || spaceOpen || memoryOpen;
  const storyReady = bodyResultReady || showAnalysis || showDecision || showExecution || showFeedback;
  const perceptionAir = scenario.perception.space.results.find(result => result.id === 'air')?.metrics ?? [];
  const perceptionBody = scenario.perception.body.results.find(result => result.id === 'seat')?.metrics ?? [];
  const feedbackAir = scenario.feedback.metrics.filter(metric => ['receipt', 'temperature', 'humidity', 'co2', 'pm25'].includes(metric.id));
  const hasAirService = scenario.execution.steps.some(step => step.id === 'purifier');
  const deviceStory: DeviceStory = {
    ready: storyReady,
    present: scene !== 'standby' && scene !== 'waking',
    airRunning: hasAirService && (showExecution || showFeedback),
    air: (showFeedback && feedbackAir.length ? feedbackAir : perceptionAir).map(metric => ({ label: metric.label, value: metric.value })),
    body: perceptionBody.map(metric => ({ label: metric.label, value: metric.value })),
  };
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const analysisStart = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const analysisSettle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const decisionStart = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const decisionSettle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const executionStart = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const executionSettle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const feedbackStart = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const feedbackSettle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const endingStart = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const endingSettle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const returnStart = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const returnSettle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openingTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const analysisScheduled = useRef(false);
  const decisionScheduled = useRef(false);
  const executionScheduled = useRef(false);
  const feedbackScheduled = useRef(false);
  const endingScheduled = useRef(false);
  const cancelAutomaticFlow = useCallback(() => {
    setDecisionVoiceShown(false);
    setQuestionTransition('idle');
    openingTimers.current.forEach(clearTimeout);
    openingTimers.current = [];
    clearTimeout(analysisStart.current);
    clearTimeout(analysisSettle.current);
    clearTimeout(decisionStart.current);
    clearTimeout(decisionSettle.current);
    clearTimeout(executionStart.current);
    clearTimeout(executionSettle.current);
    clearTimeout(feedbackStart.current);
    clearTimeout(feedbackSettle.current);
    clearTimeout(endingStart.current);
    clearTimeout(endingSettle.current);
    clearTimeout(returnStart.current);
    clearTimeout(returnSettle.current);
  }, []);
  const finishPerception = useCallback(() => {
    if (analysisScheduled.current) return;
    analysisScheduled.current = true;
    setBodyResultReady(true);
    analysisStart.current = setTimeout(() => {
      if (isBody) {
        setScene('confirmation-transition');
        analysisSettle.current = setTimeout(() => setScene('confirming'), 2_600);
        return;
      }
      setReasoningStage('thinking');
      setScene("analysis-transition");
      analysisSettle.current = setTimeout(() => setScene("analyzing"), 3400);
    }, 8_000);
  }, [isBody]);
  const finishAnalysis = useCallback(() => {
    if (decisionScheduled.current) return;
    decisionScheduled.current = true;
    decisionStart.current = setTimeout(() => {
      setDecisionVoiceShown(false);
      setScene("decision-transition");
      decisionSettle.current = setTimeout(() => setScene("deciding"), 3200);
    }, 8_000);
  }, []);
  const finishDecision = useCallback(() => {
    if (executionScheduled.current) return;
    executionScheduled.current = true;
    executionStart.current = setTimeout(() => {
      if (scenario.skipExecution) {
        feedbackScheduled.current = true;
        setFeedbackVoiceShown(false);
        setScene('feedback-transition');
        feedbackSettle.current = setTimeout(() => setScene('feedback'), 3200);
        return;
      }
      setScene("execution-transition");
      executionSettle.current = setTimeout(() => setScene("executing"), 3200);
    }, 0);
  }, [scenario.skipExecution]);
  const finishExecution = useCallback(() => {
    if (feedbackScheduled.current) return;
    feedbackScheduled.current = true;
    if (isBody && bodyOutcome === 'unanswered' && bodyObservationResult === 'escalate') {
      feedbackStart.current = setTimeout(() => {
        setDecisionVoiceShown(false);
        setBodyOutcome('unanswered-escalated');
        setScene('execution-transition');
        executionSettle.current = setTimeout(() => setScene('executing'), 3_200);
      }, 3_000);
      return;
    }
    feedbackStart.current = setTimeout(() => {
      setFeedbackVoiceShown(false);
      setScene("feedback-transition");
      feedbackSettle.current = setTimeout(() => setScene("feedback"), 3200);
    }, 6_000);
  }, [bodyObservationResult, bodyOutcome, isBody]);
  const finishFeedback = useCallback(() => {
    if (endingScheduled.current) return;
    endingScheduled.current = true;
    endingStart.current = setTimeout(() => {
      setFeedbackVoiceShown(false);
      setScene("ending-transition");
      endingSettle.current = setTimeout(() => setScene("ending"), 2_600);
    }, 8_000);
  }, []);
  const showFeedbackVoice = useCallback(() => { setFeedbackVoiceShown(true); setBodyRecordReady(true); }, []);
  const answerConfirmation = useCallback((answer: string) => {
    if (answer === 'discomfort') {
      setNextQuestion('symptoms');
      setQuestionTransition('question-exit');
      return;
    }
    if (answer === 'unanswered' && question === 'feeling') {
      setNextQuestion('feelingRetry');
      setQuestionTransition('question-exit');
      return;
    }
    if (answer !== 'fine' && answer !== 'rest' && answer !== 'urgent' && answer !== 'unanswered') return;
    setBodyOutcome(answer);
    setScene('confirmation-exit');
    analysisStart.current = setTimeout(() => {
      setReasoningStage('thinking');
      setScene('analysis-transition');
      analysisSettle.current = setTimeout(() => setScene('analyzing'), 3400);
    }, 900);
  }, [question]);
  useEffect(() => {
    if (scene !== 'confirming' || functionPanelOpen || questionTransition === 'idle') return;
    const delay = questionTransition === 'loading' ? 2_000 : 450;
    const transitionTimer = setTimeout(() => {
      if (questionTransition === 'question-exit') setQuestionTransition('loading');
      else if (questionTransition === 'loading') setQuestionTransition('loading-exit');
      else { setQuestion(nextQuestion); setQuestionTransition('idle'); }
    }, delay);
    return () => clearTimeout(transitionTimer);
  }, [scene, functionPanelOpen, nextQuestion, questionTransition]);
  const startBodySensing = useCallback(() => setBodySensingStarted(true), []);
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearTimeout(timer.current);
        setNotice("");
        setAvatarOpen(false);
        setDeviceOpen(false);
        setSpaceOpen(false);
        setMemoryOpen(false);
      }
      if (
        document.activeElement === document.body &&
        ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
      ) {
        event.preventDefault();
        document
          .querySelector<HTMLButtonElement>(".navigation button")
          ?.focus();
      }
    };
    addEventListener("keydown", keyboard);
    return () => {
      clearTimeout(timer.current);
      cancelAutomaticFlow();
      removeEventListener("keydown", keyboard);
    };
  }, [cancelAutomaticFlow]);
  useEffect(() => {
    if (scene !== "ending") return;
    returnStart.current = setTimeout(
      () => setScene("wake-return"),
      completion.loadingDurationMs + completion.completedHoldDurationMs,
    );
    return () => clearTimeout(returnStart.current);
  }, [scene]);
  useEffect(() => {
    if (scene !== "wake-return") return;
    returnSettle.current = setTimeout(() => {
      analysisScheduled.current = false;
      decisionScheduled.current = false;
      executionScheduled.current = false;
      feedbackScheduled.current = false;
      endingScheduled.current = false;
      setBodySensingStarted(false);
      setQuestion('feeling');
      setReasoningStage('thinking');
      setFeedbackVoiceShown(false);
      setScenarioId('normal');
      setFallRecorded(false);
      setBodyOutcome(null);
      setBodyObservationResult('recovered');
      setBodyResultReady(false);
      setBodyRecordReady(false);
      setScene("awake");
      openingTimers.current = [
        setTimeout(() => setScene("seating"), 8_000),
        setTimeout(() => setScene("perceiving"), 11_400),
      ];
    }, 3_200);
    return () => clearTimeout(returnSettle.current);
  }, [scene]);
  useEffect(() => {
    analysisScheduled.current = false;
    decisionScheduled.current = false;
    executionScheduled.current = false;
    feedbackScheduled.current = false;
    endingScheduled.current = false;
    openingTimers.current = [
      setTimeout(() => setScene("waking"), 8_000),
      setTimeout(() => setScene("awake"), 11_400),
      setTimeout(() => setScene("seating"), 19_400),
      setTimeout(() => setScene("perceiving"), 22_800),
    ];
    return cancelAutomaticFlow;
  }, [cancelAutomaticFlow, flowRun]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(".avatar-control")) {
        setAvatarOpen(false);
      }
    };
    addEventListener("pointerdown", close);
    return () => removeEventListener("pointerdown", close);
  }, []);

  const checkpointIndex = scene === "standby" || scene === "waking" ? 0
    : scene === "awake" ? 1
      : scene === "seating" || scene === "perceiving" || confirming ? 2
        : scene === "analysis-transition" || scene === "analyzing" ? 3
          : scene === "decision-transition" || scene === "deciding" ? 4
            : scene === "execution-transition" || scene === "executing" ? 5
              : scene === "feedback-transition" || scene === "feedback" ? 6
                : scene === "ending-transition" || scene === "ending" ? 7 : 1;
  function jumpTo(index: number) {
    if (index < 0 || index >= checkpoints.length) return;
    if (isBody && bodyOutcome === 'unanswered' && bodyObservationResult === 'escalate' && index >= 6) {
      cancelAutomaticFlow();
      analysisScheduled.current = true;
      decisionScheduled.current = true;
      executionScheduled.current = true;
      feedbackScheduled.current = true;
      setDecisionVoiceShown(false);
      setBodyOutcome('unanswered-escalated');
      setScene('execution-transition');
      executionSettle.current = setTimeout(() => setScene('executing'), 3_200);
      setAvatarOpen(false);
      return;
    }
    if (isBody && bodyKeepsExecuting && index >= 6) return;
    if (isBody && index >= 3 && !bodyOutcome) {
      cancelAutomaticFlow();
      analysisScheduled.current = true;
      setScene('confirming');
      setAvatarOpen(false);
      return;
    }
    if (isBody && index <= 2) {
      setBodyOutcome(null);
      setQuestion('feeling');
      setBodyRecordReady(false);
    }
    if (scenario.skipExecution && index === 5) index = checkpointIndex >= 6 ? 4 : 6;
    cancelAutomaticFlow();
    analysisScheduled.current = index >= 3;
    decisionScheduled.current = index >= 4;
    executionScheduled.current = index >= 5;
    feedbackScheduled.current = index >= 6;
    endingScheduled.current = index >= 7;
    setBodySensingStarted(false);
    setBodyResultReady(false);
    if (index < 6) setBodyRecordReady(false);
    setReasoningStage('thinking');
    setFeedbackVoiceShown(false);
    setScene(checkpoints[index]);
    setAvatarOpen(false);
    setDeviceOpen(false);
    setSpaceOpen(false);
    setMemoryOpen(false);
    if (index === 0) {
      setFlowRun(value => value + 1);
    } else if (index === 1) {
      openingTimers.current = [
        setTimeout(() => setScene("seating"), 8_000),
        setTimeout(() => setScene("perceiving"), 11_400),
      ];
    }
  }
  function restart() {
    normalTimeline.resume();
    setFallActive(false);
    setFallRecorded(false);
    cancelAutomaticFlow();
    analysisScheduled.current = false;
    decisionScheduled.current = false;
    executionScheduled.current = false;
    feedbackScheduled.current = false;
    endingScheduled.current = false;
    setBodySensingStarted(false);
    setReasoningStage('thinking');
    setFeedbackVoiceShown(false);
    setAvatarOpen(false);
    setDeviceTestState('normal');
    setDeviceOpen(false);
    setSpaceOpen(false);
    setMemoryOpen(false);
    setNotice("");
    setScenarioId('normal');
    setBodyOutcome(null);
    setBodyObservationResult('recovered');
    setQuestion('feeling');
    setBodyResultReady(false);
    setBodyRecordReady(false);
    setScene("standby");
    setFlowRun(value => value + 1);
  }
  function startScenario(nextScenario: ScenarioId) {
    setFallRecorded(false);
    cancelAutomaticFlow();
    analysisScheduled.current = false;
    decisionScheduled.current = false;
    executionScheduled.current = false;
    feedbackScheduled.current = false;
    endingScheduled.current = false;
    setBodySensingStarted(false);
    setReasoningStage('thinking');
    setFeedbackVoiceShown(false);
    setAvatarOpen(false);
    setDeviceOpen(false);
    setSpaceOpen(false);
    setMemoryOpen(false);
    setNotice("");
    setScenarioId(nextScenario);
    setBodyOutcome(null);
    setBodyObservationResult('recovered');
    setQuestion('feeling');
    setBodyResultReady(false);
    setBodyRecordReady(false);
    setScene("awake");
    openingTimers.current = [
      setTimeout(() => setScene("seating"), 8_000),
      setTimeout(() => setScene("perceiving"), 11_400),
    ];
  }
  function switchFromFall(nextScenario: ScenarioId) {
    normalTimeline.resume();
    setFallActive(false);
    startScenario(nextScenario);
  }
  function select(id: string) {
    clearTimeout(timer.current);
    if (id === "devices") {
      setNotice("");
      setSpaceOpen(false);
      setMemoryOpen(false);
      setDeviceOpen(true);
      return;
    }
    if (id === "space") {
      setNotice("");
      setDeviceOpen(false);
      setMemoryOpen(false);
      setSpaceOpen(true);
      return;
    }
    if (id === "memory") {
      setNotice("");
      setDeviceOpen(false);
      setSpaceOpen(false);
      setMemoryOpen(true);
      return;
    }
    if (id === "home") {
      setDeviceOpen(false);
      setSpaceOpen(false);
      setMemoryOpen(false);
    }
    setNotice(id === "tv" ? "待接入" : "");
    if (id === "tv") timer.current = setTimeout(() => setNotice(""), 2500);
  }
  return (
    <Screen>
      <div className={`normal-flow ${fallActive ? 'interrupted' : ''}`} inert={fallActive} aria-hidden={fallActive}>
      <div className={`scene-state ${scene} ${functionPanelOpen ? "function-open" : ""} ${confirming ? 'confirmation-open' : ''} ${isBody ? 'body-story' : ''} ${scenario.skipExecution ? 'skip-execution' : ''}`} data-scenario={scenarioId} data-outcome={bodyOutcome ?? 'pending'}>
      <div className="background" aria-hidden="true">
        <Asset
          name="img5055Cb67514Cda73477F2Beea6Ec94356F5Db38C1Dd471LomthW1.png"
          className="background-base"
        />
        <Asset name="imgImage20.png" className="background-photo" />
        <div className="background-shade" />
      </div>
      <header>
        <div className="brand">INT AIOS</div>
        <AiosStatus
          label={confirming ? 'INT AIOS 正在介入确认...' : scene === "standby" ? "INT AIOS 正在待命..." : "INT AIOS 状态已改变..."}
          active={scene !== "standby"}
          expanded={expandedStatus && !confirming}
          currentPhases={showFeedbackStatus ? ["感知", "反馈"] : showExecution ? ["感知", "执行"] : showDecision ? ["感知", "决策"] : showAnalysis ? ["感知", "思考/分析"] : ["感知"]}
        />
        <div className="system-info">
          <Asset name="imgWifi1.svg" className="wifi" />
          <span>{standby.date.header}</span>
          <Asset name="imgImage15.png" className="weather" />
          <span>
            {standby.weather.label} &nbsp;{standby.weather.temperature}℃
          </span>
          <div className="avatar-control" onPointerDown={(event) => event.stopPropagation()}>
            <button className="avatar-trigger" type="button" aria-label="打开页面查验控制" aria-haspopup="menu" aria-expanded={avatarOpen} onClick={() => setAvatarOpen(open => !open)}>
              <Asset name="imgImage13.png" className="avatar" />
            </button>
            {avatarOpen && <div className="avatar-menu" role="menu" aria-label="页面查验控制">
              <button type="button" role="menuitem" className="restart-control" onClick={restart}><i>↻</i><span>重新开始</span></button>
              <button type="button" role="menuitem" disabled={checkpointIndex === 0} onClick={() => jumpTo(checkpointIndex - 1)}><i>←</i><span>上一步</span></button>
              <button type="button" role="menuitem" disabled={checkpointIndex === checkpoints.length - 1 || (confirming && scene !== 'confirmation-transition') || (isBody && bodyKeepsExecuting && checkpointIndex >= 5)} onClick={() => jumpTo(checkpointIndex + 1)}><i>→</i><span>下一步</span></button>
              <div className="avatar-menu-label">异常体验故事</div>
              <button type="button" role="menuitem" className={scenarioId === 'air-warning' ? 'scenario-control current' : 'scenario-control'} onClick={() => startScenario('air-warning')}><i className="story-dot warning" /><span>空气环境异常</span></button>
              <button type="button" role="menuitem" className={`scenario-control ${isBody ? 'current' : ''}`} onClick={() => startScenario('body-warning')}><i className="story-dot warning" /><span>人体检测不舒服</span></button>
              <button type="button" role="menuitem" className="scenario-control" disabled={scene === 'standby'} onClick={triggerFall}><i className="story-dot emergency" /><span>疑似跌倒</span>{scene === 'standby' && <em>等待人在场</em>}</button>
              {isBody && <>
                <div className="avatar-menu-label">无回应观察结果</div>
                <button type="button" role="menuitem" className={`scenario-control ${bodyObservationResult === 'recovered' ? 'current' : ''}`} onClick={() => { setBodyObservationResult('recovered'); setAvatarOpen(false); }}><i className="story-dot normal" /><span>数据恢复平稳</span></button>
                <button type="button" role="menuitem" className={`scenario-control ${bodyObservationResult === 'escalate' ? 'current' : ''}`} onClick={() => { setBodyObservationResult('escalate'); setAvatarOpen(false); }}><i className="story-dot emergency" /><span>仍异常并升级</span></button>
              </>}
              {deviceOpen && <>
                <div className="avatar-menu-label">设备界面状态</div>
                {deviceTestOptions.map(option => <button type="button" role="menuitem" className={deviceTestState === option.id ? 'scenario-control current' : 'scenario-control'} key={option.id} onClick={() => { setDeviceTestState(option.id); setAvatarOpen(false); }}><i className={`story-dot ${option.id === 'normal' || option.id === 'linked' ? 'normal' : option.id === 'failed' || option.id === 'disconnected' ? 'emergency' : 'warning'}`} /><span>{option.label}</span></button>)}
              </>}
            </div>}
          </div>
        </div>
      </header>
      <div className="primary-scene-content">
      <div className="standby-content" aria-hidden={scene !== "standby"}>
        <ContextRail steps={standby.contextSteps} />
      <section className="hero standby-hero">
        <h1>
          INT AIOS 已接管当前空间
          <br />
          开启全天候照护
        </h1>
        <div className="guest">
          <Asset name="imgImage14.png" />
          <span>暂无身份注册｜游客模式</span>
        </div>
      </section>
      <aside className="work-panel">
        <div className="summary-grid">
          <CalendarCard date={standby.date} />
          <DeviceCountCard
            count={onlineDeviceCount}
          />
        </div>
        <WorkflowCard
          title="空间场景管理"
          description="INT AIOS进入家庭空间"
          icon="imgImage9.png"
          illustration="imgImage12.png"
        />
      </aside>
      </div>

      <div className="wake-content" aria-hidden={scene === "standby" || expandedStatus}>
        <section className="wake-loading">
          <div className="wake-radar"><RadarAnimation /></div>
          <p className="loading-shimmer">{wake.loadingLabel}</p>
          <div className="loading-track"><span /></div>
        </section>
        <section className="hero wake-hero">
          <h1>
            INT AIOS 刚刚已感知到有
            <br />
            人进入空间
          </h1>
          <div className="guest">
            <Asset name="imgImage14.png" />
            <span>暂无身份注册｜游客模式</span>
          </div>
        </section>
        <aside className="work-panel wake-panel">
          <div className="summary-grid">
            <CalendarCard date={standby.date} />
            <DeviceCountCard count={onlineDeviceCount} />
          </div>
          <DiscoveryCard count={wake.detectedPeople} />
        </aside>
      </div>
      {showPerception && <PerceptionPage active={scene !== "seating"} data={scenario.perception} onBodyStart={startBodySensing} onComplete={finishPerception} />}
      {showAnalysis && <AnalysisPage active={!showDecision} data={scenario.analysis} severity={scenario.severity} heading={scenario.headings.analysis} onStageChange={setReasoningStage} onComplete={finishAnalysis} />}
      {showDecision && <DecisionPage active={scene === "deciding" || scene === "execution-transition" || (scene === 'feedback-transition' && !!scenario.skipExecution)} data={scenario.decision} heading={scenario.headings.decision} onComplete={showDecisionVoice} />}
      {showExecution && <ExecutionPage active={scene === "executing" || scene === "feedback-transition"} data={scenario.execution} heading={scenario.headings.execution} onComplete={finishExecution} careActionState={bodyOutcome === 'unanswered-escalated' ? 'running' : 'pending'} />}
      {showFeedback && <FeedbackPage
        active={scene === "feedback"}
        data={scenario.feedback}
        heading={scenario.headings.feedback}
        completionVisible={scene === "ending-transition" || scene === "ending"}
        completionLoading={scene === "ending"}
        onNarration={showFeedbackVoice}
        onComplete={finishFeedback}
      />}
      </div>
      {confirming && <ConfirmationPanel question={bodyQuestions[question]} questionKey={question} transition={questionTransition} interactive={scene === 'confirming' && !functionPanelOpen} onAnswer={answerConfirmation} severity={scenario.severity} />}
      <DevicePanel key={`devices-${flowRun}`} open={deviceOpen} onClose={() => setDeviceOpen(false)} story={deviceStory} testState={deviceTestState} suspended={fallActive} onCountChange={setOnlineDeviceCount} />
      <SpacePanel open={spaceOpen} onClose={() => setSpaceOpen(false)} />
      <MemoryPanel open={memoryOpen} onClose={() => setMemoryOpen(false)} items={[...(fallRecorded ? [fallMemory] : []), ...(isBody && !bodyRecordReady ? bodyHistory : scenario.memoryItems)]} />
      <Navigation items={navigation} onSelect={select} activeId={memoryOpen ? "memory" : spaceOpen ? "space" : deviceOpen ? "devices" : "home"} />
      {!memoryOpen && !deviceOpen && <VoiceDock
        placement={confirming && !functionPanelOpen ? 'confirmation' : 'dock'}
        message={functionPanelOpen || confirming ? null : scene === 'deciding' ? (decisionVoiceShown ? scenario.decision.voice : null) : scene === "feedback" ? (feedbackVoiceShown ? scenario.feedback.voice : null) : scene === "ending-transition" || scene === "ending" ? null : scene === "standby" || showDecision || showExecution || showAnalysis ? null : showPerception ? ((isBody ? bodyResultReady : bodySensingStarted) ? scenario.perception.greeting : null) : wake.greeting}
        onPresentationComplete={scene === 'deciding' && decisionVoiceShown && !functionPanelOpen ? finishDecision : undefined}
        replacementPreludeMs={functionPanelOpen || scene === "ending-transition" ? 0 : expandedStatus ? 400 : 0}
        phase={showAnalysis && !showDecision ? "thinking" : "responding"}
        confirmationPhase={questionTransition === 'loading' || questionTransition === 'loading-exit' ? 'thinking' : 'responding'}
        severity={voiceSeverity}
      />}
      <div
        role="status"
        aria-live="polite"
        className={`notice ${notice ? "visible" : ""}`}
      >
        {notice}
      </div>
      </div>
      </div>
      {fallActive && <FallEvent onResume={resumeFall} onRestart={restart} onScenario={switchFromFall} />}
    </Screen>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
