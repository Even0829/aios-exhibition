/** 首轮全部为 Mock；保持固定场景时间与设备状态，等待后续真实适配器。 */
export const sceneCopy = {
  loaded: '康养场景已加载｜暂无空间建模设备',
};

export const standby = {
  phase: "standby" as const,
  participant: null,
  date: { day: "04", month: "九", weekday: "五", header: "9月4日 周五  17:46" },
  weather: { label: "晴", temperature: 26 },
  devices: [
    { id: "rf", name: "射频设备", status: "online" },
    { id: "camera", name: "视频摄像头", status: "online" },
    { id: "air", name: "空气消杀机", status: "online" },
    { id: "seat", name: "睡眠带", status: "online" },
  ],
  contextSteps: ["空间管理", "匹配场景", "康养场景", "建立空间"],
};
export const wake = {
  phase: "wake" as const,
  detectedPeople: 1,
  loadingLabel: "开始加载康养场景包",
  greeting: "你好，很高兴为您服务～",
};
export type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  available: boolean;
};
export const navigation: NavigationItem[] = [
  { id: "home", label: "主页", icon: "img2.svg", available: true },
  { id: "space", label: "空间", icon: "img3.svg", available: true },
  { id: "devices", label: "设备", icon: "img4.svg", available: true },
  { id: "memory", label: "记忆", icon: "img5.svg", available: true },
  { id: "tv", label: "电视", icon: "img6.svg", available: true },
];

export type MemoryFilter = 'all' | 'short' | 'long';
export type MemoryItem = {
  id: string;
  category: Exclude<MemoryFilter, 'all'>;
  title: string;
  scope: string;
  source: '感知事实' | '服务结果' | '系统推断' | '用户确认';
  status: '新发现' | '验证中' | '学习中' | '已形成' | '已沉淀';
  statusTone: 'new' | 'validating' | 'learning' | 'formed' | 'settled';
  verification: string;
  formed: string;
  updated: string;
  basis: string;
  effect: string;
  voiceExample: string;
  voiceProposal: string;
};

export const memory = {
  items: [
    {
      id: 'air-result', category: 'short',
      title: '本轮空气优化后，CO₂由986降至778ppm',
      scope: '客厅 · 空气消杀机', source: '服务结果', status: '新发现', statusTone: 'new',
      verification: '本轮记录', formed: '今天10:31', updated: '刚刚',
      basis: '来自本轮空气优化的设备执行反馈与环境指标变化。',
      effect: '继续结合后续空气服务验证，目前不会作为稳定偏好使用。',
      voiceExample: '为什么记住这条？', voiceProposal: '这条结果仅用于本轮体验，不形成长期偏好。',
    },
    {
      id: 'night-volume', category: 'short',
      title: '晚间播报后，体验者主动调低了音量',
      scope: '家庭成员 · 客厅 · 晚间', source: '系统推断', status: '验证中', statusTone: 'validating',
      verification: '已观察2次', formed: '昨天21:10', updated: '今天09:20',
      basis: '两次晚间主动播报后均出现降低音量的操作。',
      effect: '继续观察晚间反馈，不直接认定为固定习惯。',
      voiceExample: '这条只适用于谁？', voiceProposal: '这条记忆只适用于晚间在客厅休息时。',
    },
    {
      id: 'quiet-air', category: 'long',
      title: '客厅有人时，更适合采用低扰动空气优化',
      scope: '家庭成员 · 客厅 · 有人活动时', source: '系统推断', status: '已形成', statusTone: 'formed',
      verification: '已验证4次', formed: '9月1日', updated: '今天10:32',
      basis: '根据4次相似服务和1次用户反馈逐渐形成。',
      effect: '下次遇到相似情况，优先考虑低扰动方案，并结合当前环境重新判断。',
      voiceExample: '为什么这样认为？', voiceProposal: '低扰动方案只在客厅有人活动时优先考虑。',
    },
    {
      id: 'night-voice', category: 'long',
      title: '晚间主动播报应保持简短、轻柔',
      scope: '家庭成员 · 全屋 · 21:00后', source: '用户确认', status: '学习中', statusTone: 'learning',
      verification: '已验证2次', formed: '9月2日', updated: '昨天21:18',
      basis: '由两次晚间服务反馈和一次用户语音补充形成。',
      effect: '晚间主动播报优先缩短内容并降低干扰，紧急情况除外。',
      voiceExample: '以后晚上不要播报', voiceProposal: '晚间不主动播报，仅在紧急情况时提醒。',
    },
    {
      id: 'observe-after-service', category: 'long',
      title: '服务完成后，需要继续观察环境变化',
      scope: '家庭空间 · 环境服务完成后', source: '服务结果', status: '已沉淀', statusTone: 'settled',
      verification: '已验证12次', formed: '8月18日', updated: '今天10:32',
      basis: '由12次环境服务的执行结果和后续观察持续验证。',
      effect: '设备执行完成后继续感知环境，依据真实变化决定是否结束服务。',
      voiceExample: '最近什么时候用过？', voiceProposal: '服务完成后保留一段持续观察，再决定是否结束。',
    },
  ] satisfies MemoryItem[],
};

export type SpaceView = 'packages' | 'model' | 'entities';
export const space = {
  sections: [
    { id: 'packages', label: '空间场景包', title: '空间场景包', icon: 'space-pack-icon-figma.svg', tone: 'package' },
    { id: 'model', label: '空间建模', title: '空间建模', icon: 'space-model-icon-figma.svg', tone: 'model' },
    { id: 'entities', label: '其他实体', title: '其他空间实体', icon: 'space-entity-icon-figma.svg', tone: 'entity' },
  ] satisfies { id: SpaceView; label: string; title: string; icon: string; tone: string }[],
  packages: [{
    id: 'eldercare',
    name: '康养场景包',
    description: '持续理解老人生活和家庭状态，全天候负责日常照护、安全守护、任务调度与家属协同',
    image: 'space-pack-figma.png',
    installed: true,
    removable: false,
  }],
  modelEmpty: '暂无空间建模设备可以帮助建模，建议接入相关设备',
  entities: [{ id: 'lounge-chair', name: '沙发椅', room: '客厅', image: 'space-chair-figma.png' }],
};

export type SensingResult = {
  id: string;
  label: string;
  kind: 'video' | 'metrics';
  metrics?: { label: string; value: string; tone?: DecisionSeverity }[];
};
export type SensingGroup = {
  id: string;
  startTitle: string;
  resultTitle: string;
  severity?: DecisionSeverity;
  devices: { id: string; label: string; durationMs: number }[];
  results: SensingResult[];
};

export const perception = {
  people: 1,
  appearance: '女  20-30岁',
  greeting: '尽量保持静止，避免影响数据准确～',
  space: {
    id: 'space', startTitle: '启动空间感知', resultTitle: '完成空间状态感知',
    devices: [
      { id: 'camera', label: '视频摄像头', durationMs: 5600 },
      { id: 'air', label: '空气消杀机', durationMs: 8200 },
    ],
    results: [
      { id: 'camera', label: '视频识别', kind: 'video' },
      { id: 'air', label: '环境感知', kind: 'metrics', metrics: [
        { label: '环境温度', value: '26.4℃' },
        { label: '环境湿度', value: '58%' },
        { label: 'CO₂', value: '986 ppm' },
        { label: 'PM2.5', value: '18 μg/m³' },
        { label: 'VOC', value: '正常' },
        { label: '颗粒物', value: '轻度波动' },
      ] },
    ],
  } satisfies SensingGroup,
  body: {
    id: 'body', startTitle: '启动人体感知', resultTitle: '完成人体状态感知',
    devices: [{ id: 'seat', label: '睡眠带', durationMs: 12000 }],
    results: [{ id: 'seat', label: '睡眠带', kind: 'metrics', metrics: [
      { label: '心率', value: '72 次/分' },
      { label: '呼吸', value: '16 次/分' },
    ] }],
  } satisfies SensingGroup,
};

export const analysis = {
  phase: 'analysis' as const,
  voice: '已监测到空间与人体状态，正在结合温度、湿度、空气质量、心率和呼吸数据进行综合分析。',
  thinking: {
    durationMs: 8_000,
    message: '已接收信息/数据，正在理解',
  },
  durationMs: 12_000,
  capabilities: [
    { id: 'camera', label: '已使用视频摄像能力', at: 16 },
    { id: 'sleep', label: '已使用睡眠带监测能力', at: 42 },
    { id: 'air', label: '已使用空气消杀机能力', at: 68 },
  ],
};

export type DecisionSeverity = 'normal' | 'warning' | 'emergency';
export const decision = {
  voice: '您现在整体平稳，我会轻柔地优化一下空气，让您更舒适。',
  severity: 'normal' as DecisionSeverity,
  status: '状态正常',
  results: [
    '心率 72 次/分，处于健康范围',
    '呼吸 16 次/分，处于正常范围',
    '温度 26.4℃、湿度 58%，体感平稳',
    'CO₂ 986 ppm，处于正常范围',
    'PM2.5 18 μg/m³，VOC 状态正常',
    '颗粒物轻度波动，建议适度优化空气',
  ],
  conclusion: '人体及空间状态平稳，适度优化空气环境可提升舒适度',
};

export type ExecutionSeverity = DecisionSeverity;
export const execution = {
  severity: decision.severity as ExecutionSeverity,
  target: 'INT AIOS 将根据当前人体状态轻量调节净化与送风',
  title: '正在优化环境',
  durationMs: 12_000,
  steps: [
    { id: 'target', label: '确认空气优化目标', pending: '待确认', running: '确认中', complete: '已确认', at: 8 },
    { id: 'purifier', label: '空气消杀机', pending: '待调度', running: '运行中', complete: '已启动', at: 28 },
    { id: 'airflow', label: '送风模式', pending: '待增强', running: '增强中', complete: '已增强', at: 54 },
    { id: 'quality', label: '空气指标', pending: '待优化', running: '优化中', complete: '已优化', at: 76 },
  ],
};

export type FeedbackSeverity = ExecutionSeverity;
export const feedback = {
  severity: 'normal' as FeedbackSeverity,
  result: 'INT AIOS 已完成本轮低扰动优化，环境质量更优',
  voice: '我会收集日志，筛选数据作为成长经验',
  metrics: [
    { id: 'temperature', label: '环境温度', value: '26.5℃' },
    { id: 'humidity', label: '环境湿度', value: '59%' },
    { id: 'co2', label: 'CO₂', value: '778 ppm' },
    { id: 'pm25', label: 'PM2.5', value: '16 μg/m³' },
  ],
  chart: {
    label: 'CO₂ 服务趋势',
    summary: '986 → 778 ppm',
    samples: [986, 918, 842, 778],
    times: ['30s', '20s', '10s', '0'],
  },
};

export const completion = {
  title: '暂无新的任务',
  description: 'INT AIOS将继续保持感知待命',
  loadingDurationMs: 3_600,
  completedHoldDurationMs: 3_000,
};

export type PerceptionConfig = {
  people: number;
  appearance: string;
  greeting: string;
  space: SensingGroup;
  body: SensingGroup;
};
export type AnalysisConfig = typeof analysis;
export type DecisionConfig = typeof decision;
export type ExecutionConfig = typeof execution & {
  care?: {
    mode: 'timed' | 'continuous';
    description: string;
    secondary?: {
      title: string;
      pending: string;
      running: string;
      complete: string;
    };
  };
};
export type FeedbackConfig = Omit<typeof feedback, 'chart' | 'metrics'> & {
  metrics: { id: string; label: string; value: string; tone?: DecisionSeverity }[];
  chart: typeof feedback.chart | null;
  completion?: { title: string; description: string };
};
export type ScenarioId = 'normal' | 'air-warning' | 'body-warning';
export type BodyOutcome = 'fine' | 'rest' | 'urgent' | 'unanswered' | 'unanswered-escalated';
export type BodyObservationResult = 'recovered' | 'escalate';

export type ExhibitionScenario = {
  id: ScenarioId;
  label: string;
  severity: DecisionSeverity;
  perception: PerceptionConfig;
  analysis: AnalysisConfig;
  decision: DecisionConfig;
  execution: ExecutionConfig;
  feedback: FeedbackConfig;
  memoryItems: MemoryItem[];
  skipExecution?: boolean;
  headings: {
    analysis: string;
    decision: string;
    execution: string;
    feedback: string;
  };
};

const normalScenario: ExhibitionScenario = {
  id: 'normal',
  label: '正常状态',
  severity: 'normal',
  perception,
  analysis,
  decision,
  execution,
  feedback,
  memoryItems: memory.items,
  headings: {
    analysis: 'INT AIOS 正在分析当前服务\n对象以及环境空间',
    decision: 'INT AIOS 正在根据分析并理\n解状态，给出最优决策',
    execution: 'INT AIOS 正在调度空间设备\n进行主动服务',
    feedback: 'INT AIOS会反馈本次执行并\n作为成长日志进入记忆',
  },
};

const airWarningScenario: ExhibitionScenario = {
  id: 'air-warning',
  label: '空气环境异常',
  severity: 'warning',
  perception: {
    ...perception,
    greeting: '监测到客厅 CO₂ 持续偏高，我会继续结合在场情况和人体状态进行分析。',
    space: {
      ...perception.space,
      severity: 'warning',
      results: [
        perception.space.results[0],
        {
          id: 'air', label: '环境感知', kind: 'metrics', metrics: [
            { label: '环境温度', value: '26.4℃' },
            { label: '环境湿度', value: '58%' },
            { label: 'CO₂', value: '1680 ppm', tone: 'warning' },
            { label: 'PM2.5', value: '18 μg/m³' },
            { label: 'VOC', value: '正常' },
            { label: '颗粒物', value: '稳定' },
          ],
        },
      ],
    },
  },
  analysis: {
    ...analysis,
    voice: '监测到客厅 CO₂ 持续升高，我正在结合在场情况和当前人体状态进行分析。',
    thinking: { ...analysis.thinking, message: '已接收 CO₂ 趋势和人体数据，正在理解异常变化' },
    capabilities: [
      { id: 'air', label: '已使用空气环境感知能力', at: 14 },
      { id: 'sleep', label: '已使用睡眠带监测能力', at: 36 },
      { id: 'presence', label: '已结合客厅在场状态', at: 60 },
      { id: 'trend', label: '已分析空气指标变化趋势', at: 82 },
    ],
  },
  decision: {
    severity: 'warning',
    voice: '客厅里的 CO₂ 有些偏高，我会启动空气消杀机进行低扰动空气优化，并继续观察变化。',
    status: '空气环境异常',
    results: [
      'CO₂ 升至 1680 ppm，较初始读数持续上升',
      '客厅当前检测到 1 人，优先采用低扰动空气优化',
      '温度、湿度、PM2.5 与 VOC 保持平稳',
      '当前心率与呼吸数据保持平稳',
      '空气消杀机在线，可执行本轮低扰动空气优化',
    ],
    conclusion: 'CO₂ 持续偏高，启动空气消杀机低扰动空气优化，并持续监测变化',
  },
  execution: {
    severity: 'warning',
    target: 'INT AIOS 将启动空气消杀机，以低扰动模式改善客厅空气状态并持续监测 CO₂',
    title: '正在处理 CO₂ 偏高',
    durationMs: 12_000,
    steps: [
      { id: 'target', label: '确认空气优化目标', pending: '待确认', running: '确认中', complete: '已确认', at: 8 },
      { id: 'purifier', label: '空气消杀机', pending: '待调度', running: '调度中', complete: '指令已发送', at: 28 },
      { id: 'receipt', label: '设备运行状态', pending: '待回执', running: '等待回执', complete: '已回执', at: 54 },
      { id: 'co2', label: 'CO₂ 变化趋势', pending: '待观察', running: '持续观察', complete: '已确认', at: 76 },
    ],
  },
  feedback: {
    severity: 'normal',
    result: '本轮低扰动空气优化已产生可观察效果，客厅 CO₂ 明显回落',
    voice: '客厅的 CO₂ 已经回落，我会记录这次变化和处理结果，继续关注。',
    metrics: [
      { id: 'receipt', label: '设备运行回执', value: '已确认' },
      { id: 'co2', label: 'CO₂', value: '920 ppm' },
      { id: 'pm25', label: 'PM2.5', value: '18 μg/m³' },
      { id: 'body', label: '人体状态', value: '持续平稳' },
    ],
    chart: {
      label: 'CO₂ 变化趋势',
      summary: '1680 → 920 ppm',
      samples: [1680, 1460, 1180, 920],
      times: ['30s', '20s', '10s', '0'],
    },
  },
  memoryItems: [
    {
      id: 'air-warning-result', category: 'short',
      title: '本轮客厅 CO₂ 偏高经低扰动空气优化与持续观察后，由 1680 回落至 920 ppm',
      scope: '客厅 · 空气消杀机', source: '服务结果', status: '新发现', statusTone: 'new',
      verification: '本轮记录', formed: '刚刚', updated: '刚刚',
      basis: '来自本轮空气消杀机运行回执与 CO₂ 后续读数；将作为本次服务记录继续观察。',
      effect: '作为短期新发现继续验证，不自动形成稳定偏好或修改异常判断条件。',
      voiceExample: '为什么记住这次结果？', voiceProposal: '这条只记录本轮事件与服务结果，不形成长期偏好。',
    },
    ...memory.items.slice(1),
  ] satisfies MemoryItem[],
  headings: {
    analysis: 'INT AIOS 正在理解空气变化\n及当前空间状态',
    decision: 'INT AIOS 正在根据分析并理\n解状态，给出最优决策',
    execution: 'INT AIOS 正在调度空间设备\n处理 CO₂ 偏高',
    feedback: 'INT AIOS会反馈本次执行并\n作为成长日志进入记忆',
  },
};

export const bodyQuestions = {
  feeling: {
    message: '检测到您的心率偏快，现在是否有不舒服吗？您可直接回答：“没有不适”或者“有些不舒服”',
    options: [{ value: 'fine', label: '没有不适' }, { value: 'discomfort', label: '有些不舒服' }, { value: 'unanswered', label: '无人回应' }],
  },
  feelingRetry: {
    message: '我暂时没有听到您的回答，再确认一次：您现在是否有不舒服？您可直接回答：“没有不适”或者“有些不舒服”',
    options: [{ value: 'fine', label: '没有不适' }, { value: 'discomfort', label: '有些不舒服' }, { value: 'unanswered', label: '无人回应' }],
  },
  symptoms: {
    message: '那现在是否有明显胸痛、呼吸困难或头晕？您可以直接回答：“有明显不适”或者“没有/不确定”',
    options: [{ value: 'urgent', label: '有明显不适' }, { value: 'rest', label: '没有/不确定' }, { value: 'unanswered', label: '无人回应' }],
  },
};

const bodyPerception: PerceptionConfig = {
  ...perception,
  greeting: '监测到心率偏快，我会结合您的感受进一步确认。',
  body: {
    ...perception.body, severity: 'warning',
    results: [{ id: 'seat', label: '睡眠带', kind: 'metrics', metrics: [
      { label: '心率', value: '118 次/分', tone: 'warning' },
      { label: '呼吸', value: '16 次/分' },
    ] }],
  },
};
export const bodyHistory = memory.items.filter(item => item.id !== 'air-result');
const bodyBase: ExhibitionScenario = {
  ...normalScenario, id: 'body-warning', label: '人体检测不舒服', severity: 'warning',
  perception: bodyPerception,
  analysis: {
    ...analysis,
    voice: '正在结合心率、呼吸数据和您的回答，分析当前身体状态。',
    thinking: { ...analysis.thinking, message: '已接收人体数据与您的回答，正在理解当前状态' },
    capabilities: [
      { id: 'sleep', label: '已使用睡眠带监测能力', at: 16 },
      { id: 'answer', label: '已结合体验者的主动回答', at: 42 },
      { id: 'space', label: '已结合当前空间与空气状态', at: 68 },
    ],
  },
  execution: {
    severity: 'warning', target: 'INT AIOS 将持续关注人体变化，陪护休息并观察后续数据',
    title: '正在关注陪护', durationMs: 12_000, steps: [],
    care: { mode: 'timed', description: '陪护休息，持续观察身体变化' },
  },
  feedback: {
    severity: 'normal', result: '本轮陪护观察已完成，当前心率与呼吸指标恢复平稳。',
    voice: '我会记录本次心率变化、您的回答和陪护结果，作为后续关注的参考。',
    metrics: [
      { id: 'heart', label: '当前心率', value: '86 次/分' },
      { id: 'breath', label: '当前呼吸', value: '16 次/分' },
      { id: 'heart-change', label: '心率前后', value: '118 → 86 次/分' },
      { id: 'breath-change', label: '呼吸前后', value: '16 → 16 次/分' },
    ],
    chart: { label: '本轮心率变化', summary: '118 → 86 次/分', samples: [118, 108, 96, 86], times: ['0分钟', '2分钟', '4分钟', '5分钟'] },
  },
  headings: {
    ...normalScenario.headings,
    analysis: 'INT AIOS 正在结合人体数据\n与您的回答分析状态',
    execution: 'INT AIOS 正在关注人体与\n空间变化并持续陪护',
  },
};
function bodyMemory(outcome: 'fine' | 'rest' | 'unanswered'): MemoryItem[] {
  const fine = outcome === 'fine';
  const unanswered = outcome === 'unanswered';
  return [{
    id: `body-${outcome}-result`, category: 'short',
    title: fine
      ? '本轮心率偏快，体验者反馈没有不适，已记录持续关注建议'
      : unanswered
        ? '持续未获得本人回应，15分钟关注后心率与呼吸数据恢复平稳'
        : '本轮陪护观察中，心率由 118 回落至 86 次/分',
    scope: '当前体验者 · 睡眠带', source: fine ? '用户确认' : '服务结果', status: '新发现', statusTone: 'new',
    verification: '本轮记录', formed: '刚刚', updated: '刚刚',
    basis: fine
      ? '睡眠带心率 118 次/分、呼吸 16 次/分；本人选择没有不适。未执行陪护或确认心率恢复。'
      : unanswered
        ? '主动确认期间持续未获得本人回应；15分钟持续关注后，心率由 118 回落至 86 次/分，呼吸保持 16 次/分。'
        : '本人选择有些不舒服、没有/不确定明显症状；陪护观察后心率 86 次/分、呼吸 16 次/分。未再次询问症状。',
    effect: fine
      ? '后续继续关注心率变化，不形成已恢复结论。'
      : unanswered
        ? '只记录本轮未回应与后续数据，不推断本人感受、意识状态或医学结论。'
        : '记录本轮观察结果，不形成疾病诊断、疗效或长期阈值；15 分钟复查仅为建议。',
    voiceExample: '为什么记住这次结果？', voiceProposal: '这条只记录本轮数据和实际回答，不形成医学诊断。',
  }, ...bodyHistory];
}
export const bodyStories: Record<BodyOutcome, ExhibitionScenario> = {
  fine: {
    ...bodyBase, skipExecution: true,
    decision: { voice: '好的，我会继续关注您的身体变化。', severity: 'warning', status: '暂无主观不适', results: [
      '睡眠带心率 118 次/分，当前偏快', '呼吸 16 次/分，当前保持平稳',
      '体验者回答：没有不适', '空气指标暂无明显变化', '继续关注后续身体变化',
    ], conclusion: '我会继续关注您的变化。' },
    feedback: {
      severity: 'warning', result: '已记录您暂无不适的反馈，后续将继续关注心率变化。',
      voice: '我会记录本次心率变化和您的回答，继续关注后续状态。',
      metrics: [
        { id: 'heart', label: '当前心率', value: '118 次/分', tone: 'warning' }, { id: 'breath', label: '当前呼吸', value: '16 次/分' },
        { id: 'answer', label: '本人反馈', value: '没有不适' }, { id: 'advice', label: '后续建议', value: '持续关注' },
      ], chart: null, completion: { title: '本次确认已记录', description: 'INT AIOS将继续关注您的变化' },
    }, memoryItems: bodyMemory('fine'),
  },
  rest: {
    ...bodyBase,
    decision: { voice: '您先在原地休息，我会持续关注，如有必要，15分钟后我会再次确认', severity: 'warning', status: '继续关注身体', results: [
      '睡眠带心率 118 次/分，当前偏快', '体验者回答：有些不舒服',
      '明显症状回答：没有/不确定', '呼吸与空气指标暂无明显变化', '建议原地休息，并持续观察',
    ], conclusion: '建议先原地休息，15分钟后我会再次确认。' },
    memoryItems: bodyMemory('rest'),
  },
  urgent: {
    ...bodyBase, severity: 'emergency',
    decision: { voice: '请先停下活动，保持安全、舒服的姿势。我会帮您向现场求助，持续关注您的情况，必要时联系预设联系人。', severity: 'emergency', status: '需及时帮助', results: [
      '睡眠带心率 118 次/分，当前偏快', '体验者回答：有些不舒服',
      '体验者明确回答：有明显不适', '先停止活动，寻求身边人员帮助', '持续陪护，准备必要的联系人协同',
    ], conclusion: '请停止活动，保持安全舒适体位，我将帮助向现场求助。同时持续关注、准备协同，必要时联系预设联系人' },
    execution: { severity: 'emergency', target: '请先停止活动，保持休息。我会持续观察，并同步预设紧急联系人。',
      title: '正在持续陪护', durationMs: 0, steps: [], care: { mode: 'continuous', description: '持续观察，等待外部介入' } },
    memoryItems: bodyHistory,
  },
  unanswered: {
    ...bodyBase,
    headings: {
      ...bodyBase.headings,
      analysis: 'INT AIOS 正在结合人体数据\n与当前确认状态分析',
    },
    analysis: {
      ...bodyBase.analysis,
      thinking: { ...bodyBase.analysis.thinking, message: '已接收人体数据与未回应状态，正在理解当前情况' },
      capabilities: [
        { id: 'sleep', label: '已使用睡眠带监测能力', at: 16 },
        { id: 'unanswered', label: '主动确认暂未获得本人回应', at: 42 },
        { id: 'space', label: '已结合当前空间与呼吸状态', at: 68 },
      ],
    },
    decision: {
      voice: '我暂时没有听到您的回答。请先保持休息，我会继续关注您的心率和呼吸。15分钟后，如果数据仍未恢复或出现进一步异常变化，我会启动升级预案。',
      severity: 'warning',
      status: '暂未获得回应',
      results: [
        '睡眠带心率 118 次/分，当前偏快',
        '呼吸 16 次/分，当前保持平稳',
        '主动确认期间持续未获得本人回应',
        '当前未获得新的明确紧急证据',
        '保持休息并持续关注 15 分钟',
      ],
      conclusion: '我暂时没有听到您的回答。请先保持休息，我会继续关注您的心率和呼吸。15分钟后，如果数据仍未恢复或出现进一步异常变化，我会启动升级预案。',
    },
    execution: {
      severity: 'warning',
      target: '请先保持休息，INT AIOS 将持续关注您的心率和呼吸变化。',
      title: '持续关注 15 分钟',
      durationMs: 20_000,
      steps: [],
      care: { mode: 'timed', description: '持续观察心率与呼吸变化' },
    },
    feedback: {
      severity: 'normal',
      result: '15分钟持续关注已完成，当前心率与呼吸数据恢复平稳。',
      voice: '已完成15分钟持续关注，心率和呼吸数据已恢复平稳。我会记录本次变化，继续保持关注。',
      metrics: [
        { id: 'heart', label: '当前心率', value: '86 次/分' },
        { id: 'breath', label: '当前呼吸', value: '16 次/分' },
        { id: 'heart-change', label: '心率前后', value: '118 → 86 次/分' },
        { id: 'response', label: '本人回应', value: '暂未获得' },
      ],
      chart: { label: '15分钟心率变化', summary: '118 → 86 次/分', samples: [118, 110, 98, 86], times: ['0分钟', '5分钟', '10分钟', '15分钟'] },
    },
    memoryItems: bodyMemory('unanswered'),
  },
  'unanswered-escalated': {
    ...bodyBase,
    severity: 'emergency',
    headings: {
      ...bodyBase.headings,
      analysis: 'INT AIOS 正在结合人体数据\n与当前确认状态分析',
    },
    decision: {
      voice: '15分钟持续关注后，您的心率仍未恢复，我会启动升级预案，持续守护并同步预设紧急联系人。',
      severity: 'emergency',
      status: '需升级预案',
      results: [
        '15分钟后心率仍为 126 次/分',
        '呼吸 18 次/分，较初始读数发生变化',
        '主动确认仍未获得本人回应',
        '持续守护并启动升级预案',
      ],
      conclusion: '15分钟后数据仍未恢复并出现进一步变化，启动升级预案。',
    },
    execution: {
      severity: 'emergency',
      target: '15分钟持续关注后数据仍未恢复。INT AIOS 将持续守护，并同步预设紧急联系人。',
      title: '正在持续守护',
      durationMs: 0,
      steps: [],
      care: {
        mode: 'continuous',
        description: '持续守护，记录心率与呼吸状态',
        secondary: {
          title: '同步预设紧急联系人',
          pending: '准备同步预设紧急联系人',
          running: '正在同步，等待外部介入',
          complete: '通知已发出，等待外部介入',
        },
      },
    },
    feedback: { ...bodyBase.feedback, severity: 'emergency' },
    memoryItems: bodyHistory,
  },
};

export const exhibitionScenarios: Record<ScenarioId, ExhibitionScenario> = {
  normal: normalScenario,
  'air-warning': airWarningScenario,
  'body-warning': { ...bodyBase, memoryItems: bodyHistory },
};
