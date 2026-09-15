import { useEffect, useMemo, useRef, useState } from 'react';
import { memory, type MemoryFilter, type MemoryItem } from '../mock';
import { Asset } from './Primitives';
import { VoicePresence } from './VoicePresence';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'proposal' | 'saved';

const filters: { id: MemoryFilter; label: string }[] = [
  { id: 'all', label: '全部记忆' },
  { id: 'short', label: '短期记忆' },
  { id: 'long', label: '长期记忆' },
];

const voiceCopy: Record<VoiceState, string> = {
  idle: '按住语音键，告诉我这条记忆需要怎样调整',
  listening: '正在听，请直接告诉我需要怎样调整…',
  thinking: '正在理解你的意思…',
  proposal: '再次按下语音键确认这次调整',
  saved: '已更新，我会继续根据后续服务学习',
};

function MemoryCard({ item, selected, open, onSelect }: {
  item: MemoryItem;
  selected: boolean;
  open: boolean;
  onSelect: () => void;
}) {
  return <button
    type="button"
    className={`memory-card ${selected ? 'selected' : ''}`}
    aria-pressed={selected}
    tabIndex={open ? 0 : -1}
    onClick={onSelect}
  >
    <span className="memory-card-title">{item.title}</span>
    <span className="memory-card-meta">
      <span>{item.scope}</span>
      <i />
      <span>{item.source}</span>
    </span>
    <span className="memory-card-foot">
      <em className={`memory-status status-${item.statusTone}`}>{item.status}</em>
      <span>{item.verification}</span>
      <span>{item.updated}</span>
    </span>
  </button>;
}

export function MemoryPanel({ open, onClose, items = memory.items }: {
  open: boolean;
  onClose: () => void;
  items?: MemoryItem[];
}) {
  const [filter, setFilter] = useState<MemoryFilter>('all');
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const visibleItems = useMemo(() => items.filter(item =>
    filter === 'all' || item.category === filter,
  ), [filter, items]);
  const selected = items.find(item => item.id === selectedId) ?? visibleItems[0];

  function clearVoiceTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function resetVoice() {
    clearVoiceTimers();
    setVoiceState('idle');
  }

  useEffect(() => {
    if (!open) return;
    setFilter('all');
    setSelectedId(items[0]?.id ?? '');
    resetVoice();
    return clearVoiceTimers;
  }, [open, items]);

  function changeFilter(next: MemoryFilter) {
    const first = items.find(item => next === 'all' || item.category === next);
    setFilter(next);
    if (first) setSelectedId(first.id);
    resetVoice();
  }

  function selectMemory(id: string) {
    setSelectedId(id);
    resetVoice();
  }

  function startVoiceInteraction() {
    if (!selected || voiceState === 'listening' || voiceState === 'thinking') return;
    clearVoiceTimers();
    if (voiceState === 'proposal') {
      setVoiceState('saved');
      timers.current.push(setTimeout(() => setVoiceState('idle'), 2_600));
      return;
    }
    if (voiceState === 'saved') {
      setVoiceState('idle');
      return;
    }
    setVoiceState('listening');
    timers.current.push(setTimeout(() => setVoiceState('thinking'), 1_300));
    timers.current.push(setTimeout(() => setVoiceState('proposal'), 2_600));
  }

  const displayCopy = voiceState === 'proposal' && selected
    ? `我理解为：${selected.voiceProposal}`
    : voiceCopy[voiceState];

  return <section className={`device-overlay memory-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
    <div className="device-modal memory-modal" role="dialog" aria-modal="true" aria-label="记忆空间">
      <aside className="memory-sidebar">
        <button className="memory-back" type="button" onClick={onClose} tabIndex={open ? 0 : -1}>
          <Asset name="space-back-figma.svg" /><span>记忆空间</span>
        </button>
        <div className="memory-section-current">
          <span><Asset name="memory-section-icon.svg" /></span>
          <b>记忆</b>
          <em>{items.length}</em>
        </div>
      </aside>

      <section className="memory-list-pane" aria-label="记忆列表">
        <div className="memory-filters" role="tablist" aria-label="记忆分类">
          {filters.map(item => <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            tabIndex={open ? 0 : -1}
            onClick={() => changeFilter(item.id)}
          >{item.label}</button>)}
        </div>
        <div className="memory-list" aria-live="polite">
          {visibleItems.map(item => <MemoryCard
            key={item.id}
            item={item}
            selected={selected?.id === item.id}
            open={open}
            onSelect={() => selectMemory(item.id)}
          />)}
        </div>
      </section>

      <aside className="memory-detail-pane" aria-label="记忆详情">
        <h1>记忆详情</h1>
        {selected && <article className="memory-detail" key={selected.id}>
          <div className="memory-detail-heading">
            <span className="memory-detail-label">记忆结论</span>
            <h2>{selected.title}</h2>
            <div>
              <span>{selected.category === 'short' ? '短期记忆' : '长期记忆'}</span>
              <em className={`memory-status status-${selected.statusTone}`}>{selected.status}</em>
              <span>{selected.source}</span>
            </div>
          </div>
          <dl>
            <div>
              <dt>适用范围</dt>
              <dd>{selected.scope}</dd>
            </div>
            <div>
              <dt>形成依据</dt>
              <dd>{selected.basis}</dd>
            </div>
            <div>
              <dt>{selected.category === 'short' ? '接下来如何验证' : '会如何影响服务'}</dt>
              <dd>{selected.effect}</dd>
            </div>
          </dl>
          <p className="memory-time">首次形成：{selected.formed}<span />最近更新：{selected.updated}</p>
        </article>}

        <div className={`memory-voice state-${voiceState}`}>
          <button
            type="button"
            className="memory-voice-control"
            aria-label={displayCopy}
            tabIndex={open ? 0 : -1}
            onClick={startVoiceInteraction}
          >
            <span className="memory-voice-orb"><VoicePresence phase={voiceState === 'thinking' ? 'thinking' : voiceState === 'idle' ? 'idle' : 'responding'} /></span>
            <span className="memory-voice-copy">{displayCopy}</span>
          </button>
          <p>{voiceState === 'idle' ? `也可以说：“${selected?.voiceExample ?? '为什么这样认为'}”` : voiceState === 'proposal' ? '再次按下确认，或重新说出你的要求' : ' '}</p>
        </div>
      </aside>
    </div>
  </section>;
}
