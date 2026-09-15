import { analysis, type DecisionConfig, type ExecutionConfig, type FeedbackConfig, type MemoryItem } from './mock';

export type FallOutcome = 'fine' | 'help' | 'unanswered';
export type CooperationState = 'pending' | 'initiated' | 'guarding';
const options = [{ value: 'fine', label: '我没事' }, { value: 'help', label: '我需要帮助' }, { value: 'unanswered', label: '无人回应' }];
export const fallQuestions = [
  { message: '检测到有人可能跌倒了，您现在还好吗？', options },
  { message: '如果您能听到，请回应我。您可以直接说“我没事”或者“我需要帮助”。', options },
];
export const fallAnalysis = {
  ...analysis, voice: '',
  thinking: { ...analysis.thinking, message: '已接收疑似事件与确认信息，正在理解现场状态' },
  capabilities: [
    { id: 'rf', label: '已结合射频疑似事件', at: 16 },
    { id: 'space', label: '已结合人在场与空间信息', at: 42 },
    { id: 'answer', label: '已结合本次交互确认结果', at: 68 },
  ],
};
const evidence = ['射频设备上报疑似跌倒事件', '当前客厅检测到 1 人'];
export const fallDecisions: Record<FallOutcome, DecisionConfig> = {
  fine: { severity: 'normal', status: '本人已回应', results: [...evidence, '本人回答：我没事', '当前不需要帮助，未发起协同'], conclusion: '记录本次疑似事件并继续关注，恢复之前的服务。', voice: '好的，已确认您目前不需要帮助。我会记录这次疑似事件，并继续关注。' },
  help: { severity: 'emergency', status: '需要现场帮助', results: [...evidence, '本人明确回答：我需要帮助', '持续守护并同步预设紧急联系人'], conclusion: '保持当前状态，请先不要急着起身。我会持续观察，并同步预设紧急联系人。', voice: '收到。请保持当前状态，先不要急着起身。我会持续观察，并同步预设紧急联系人。' },
  unanswered: { severity: 'emergency', status: '暂未收到回应', results: [...evidence, '两次询问暂未收到本人回应', '持续记录并同步预设紧急联系人'], conclusion: '暂未收到回应，持续记录现场情况，同步预设紧急联系人并等待现场介入。', voice: '我暂时没有收到回应。我会持续记录现场情况，并同步预设紧急联系人，等待现场介入。' },
};
export const fallExecution: ExecutionConfig = {
  severity: 'emergency', target: '保持当前状态，请先不要急着起身。我会持续观察，并同步预设紧急联系人',
  title: '正在持续守护', durationMs: 0, steps: [], care: {
    mode: 'continuous',
    description: '持续守护，记录实时状态',
    secondary: {
      title: '同步紧急联系人',
      pending: '准备通知预设紧急联系人',
      running: '正在通知预设紧急联系人',
      complete: '通知已发出，等待现场介入',
    },
  },
};
export const cooperation = {
  pending: { voice: null },
  initiated: { voice: '我正在同步预设紧急联系人，并会继续守护现场情况。' },
  guarding: { voice: '已同步预设紧急联系人。我会继续记录并守护，等待现场介入。' },
};
export const fallFeedback: FeedbackConfig = {
  severity: 'normal', result: '本人已回应“我没事”，当前不需要帮助。本轮确认结束。',
  voice: '好的，已确认您目前不需要帮助。我会记录这次疑似事件，并继续关注。',
  metrics: [{ id: 'event', label: '本次事件', value: '疑似跌倒' }, { id: 'reply', label: '本人回答', value: '我没事' }, { id: 'action', label: '现场协同', value: '未发起' }, { id: 'result', label: '确认结果', value: '本轮确认结束' }], chart: null,
};
export const fallMemory: MemoryItem = {
  id: 'fall-confirmed', category: 'short', title: '疑似跌倒事件后，本人回应“我没事”，本轮确认已记录',
  scope: '当前体验者 · 客厅', source: '用户确认', status: '新发现', statusTone: 'new', verification: '本轮记录', formed: '刚刚', updated: '刚刚',
  basis: '射频设备上报疑似跌倒事件；本人明确回应当前不需要帮助，未发起现场协同。',
  effect: '继续关注并恢复之前的服务；不形成射频误报或医学结论。', voiceExample: '为什么记住这次结果？', voiceProposal: '记录疑似事件与本人回答，作为后续关注的参考。',
};
