import { useEffect, useMemo, useRef, useState } from 'react';
import { Asset } from './Primitives';
import { VoicePresence } from './VoicePresence';
import { accounts, connectionLabels, createDevices, deviceSummary, type AccountId, type DeviceStory, type DeviceTest, type HomeDevice } from '../deviceMock';

type View = 'devices' | 'accounts' | 'detail' | 'handoff';
type VoiceState = 'idle' | 'listening' | 'thinking' | 'clarify' | 'confirm' | 'executing' | 'success' | 'error' | 'unknown';
type Intent = { label: string; action: 'on' | 'off' | 'level' | 'query' | 'stop'; value?: number; all?: boolean };
type Handoff = { title: string; copy: string; returnView: View; focus: string };

function ProductImage({ device: d }: { device: HomeDevice }) {
  if (d.image) return <Asset name={d.image} alt={d.name} className="device-product" />;
  return <svg className="device-product device-drawing" viewBox="0 0 140 140" role="img" aria-label={d.name}>
    {d.kind === 'light' ? <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round">
      <path d="M45 20h50l16 42H29z" fill="currentColor" fillOpacity=".2" /><path d="M70 63v57M46 121h48" />
      <ellipse cx="70" cy="122" rx="27" ry="5" fill="currentColor" fillOpacity=".25" />{d.on && <path d="m43 72-7 10m61-10 7 10M70 73v13" stroke="#ffe6a3" />}
    </g> : d.kind === 'curtain' ? <g stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity=".12">
      <path d="M16 22h108M22 25h96v98H22z" fill="none" /><path d="M24 26h34v92l-34 7zM116 26H82v92l34 7z" />
      <path d="M33 29v87m10-87v85m9-85v84m37-84v84m9-84v85m9-85v87" opacity=".5" />
    </g> : <g fill="none" stroke="currentColor" strokeWidth="2.5">
      <rect x="30" y="30" width="80" height="80" rx="21" fill="currentColor" fillOpacity=".16" /><rect x="41" y="45" width="58" height="42" rx="6" fill="#141c22" />
      <text x="70" y="65" fill="currentColor" stroke="none" fontSize="16" textAnchor="middle">25.6°</text><text x="70" y="80" fill="currentColor" stroke="none" fontSize="10" textAnchor="middle">56%</text><circle cx="70" cy="98" r="2" />
    </g>}
  </svg>;
}

export function DevicePanel({ open, onClose, story, testState, suspended, onCountChange }: {
  open: boolean; onClose: () => void; story: DeviceStory; testState: DeviceTest; suspended: boolean; onCountChange: (count: number) => void;
}) {
  const [devices, setDevices] = useState(createDevices);
  const [view, setView] = useState<View>('devices');
  const [room, setRoom] = useState('全部空间');
  const [selectedId, setSelectedId] = useState('');
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const [voice, setVoice] = useState<VoiceState>('idle');
  const [message, setMessage] = useState('');
  const [choice, setChoice] = useState(0);
  const [pending, setPending] = useState<string[]>([]);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [candidates, setCandidates] = useState<HomeDevice[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const focusReturn = useRef('device-rf');
  const uiTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const commandTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const requestId = useRef(0);
  const active = useRef(false);
  active.current = open && !suspended;
  const effective = useMemo(() => testState === 'empty' ? [] : devices.map(d => d.id === 'living-light' && (testState === 'offline' || testState === 'unknown') ? { ...d, connection: testState as HomeDevice['connection'] } : d), [devices, testState]);
  const selected = effective.find(d => d.id === selectedId);
  const visible = effective
    .filter(d => room === '全部空间' || d.room === room)
    .sort((a, b) => (a.connection === 'online' ? 0 : 1) - (b.connection === 'online' ? 0 : 1));
  const rooms = ['全部空间', ...new Set(effective.map(d => d.room))];
  const accountName = (id: AccountId) => accounts.find(a => a.id === id)!.name;
  const expired = (d: HomeDevice) => testState === 'expired' && d.account === 'tuya';
  const metricsFor = (d: HomeDevice) => d.id === 'air' ? story.ready ? story.air.slice(0, 4) : [] : d.id === 'sleep' ? story.ready ? story.body : [] : d.kind === 'light' ? [{ label: d.on ? '当前亮度' : '预设亮度', value: `${d.level}%` }] : d.kind === 'curtain' ? [{ label: '开合比例', value: `${d.level}%` }] : d.metrics || [];
  const summary = (d: HomeDevice) => testState === 'disconnected' ? '状态暂未更新' : expired(d) ? '需重新授权' : pending.includes(d.id) ? d.kind === 'curtain' ? '正在调整开合…' : '正在执行…' : deviceSummary(d, story);
  const intents: Intent[] = selected ? selected.kind === 'light' ? [
    { label: selected.on ? '关闭它' : '打开它', action: selected.on ? 'off' : 'on' }, { label: '把亮度调到 40%', action: 'level', value: 40 }, { label: '查询当前状态', action: 'query' },
  ] : selected.kind === 'curtain' ? [{ label: '完全打开窗帘', action: 'level', value: 100 }, { label: '关闭窗帘', action: 'level', value: 0 }, { label: '停止窗帘', action: 'stop' }] : [{ label: '查询当前状态', action: 'query' }] : [
    { label: '打开灯', action: 'on' }, { label: '关闭所有灯', action: 'off', all: true }, { label: '卧室温度多少', action: 'query' },
  ];
  function clearUI() { uiTimers.current.forEach(clearTimeout); uiTimers.current = []; }
  function resetVoice() { clearUI(); setVoice('idle'); setMessage(''); setIntent(null); setCandidates([]); }
  function later(fn: () => void, delay: number) { uiTimers.current.push(setTimeout(fn, delay)); }
  function focus(id: string) { window.requestAnimationFrame(() => (root.current?.querySelector<HTMLElement>(`[data-focus="${id}"]`) || root.current?.querySelector<HTMLElement>('[data-focus="add-devices"]'))?.focus({ preventScroll: true })); }
  function returnList() { resetVoice(); setView('devices'); setSelectedId(''); window.requestAnimationFrame(() => { if (grid.current) grid.current.scrollTop = scroll.current; focus(focusReturn.current); }); }
  function navigate(next: 'devices' | 'accounts') { resetVoice(); setView(next); setSelectedId(''); setChoice(0); if (next === 'devices') setRoom('全部空间'); focus(next === 'accounts' ? 'add-accounts' : 'add-devices'); }
  function detailFocus(d?: HomeDevice) {
    if (!d || d.connection !== 'online' || expired(d) || testState === 'disconnected') return 'device-settings';
    if (d.controls?.power) return 'device-power';
    if (d.controls?.ranges?.length) return `device-${d.controls.ranges[0].field}`;
    return 'device-settings';
  }
  function showDevice(d: HomeDevice) { scroll.current = grid.current?.scrollTop || 0; focusReturn.current = `device-${d.id}`; resetVoice(); setSelectedId(d.id); setChoice(0); setView('detail'); focus(detailFocus(d)); }
  function showHandoff(title: string, copy: string, focusId: string) { scroll.current = grid.current?.scrollTop || scroll.current; resetVoice(); setHandoff({ title, copy, returnView: view, focus: focusId }); setView('handoff'); focus('handoff-back'); }
  function back() {
    if (['listening', 'thinking', 'clarify', 'confirm'].includes(voice)) { resetVoice(); focus('voice'); return; }
    if (view === 'handoff' && handoff) { setView(handoff.returnView); window.requestAnimationFrame(() => { if (grid.current) grid.current.scrollTop = scroll.current; focus(handoff.focus); }); return; }
    if (view === 'detail') { returnList(); return; }
    onClose();
  }
  useEffect(() => { onCountChange(effective.filter(d => d.connection === 'online').length); }, [effective, onCountChange]);
  useEffect(() => {
    if (!open || suspended) resetVoice();
    else focus(view === 'detail' ? detailFocus(selected) : view === 'handoff' ? 'handoff-back' : view === 'accounts' ? 'add-accounts' : focusReturn.current);
  }, [open, suspended]);
  useEffect(() => { resetVoice(); setChoice(0); if (testState === 'empty') { setView('devices'); setSelectedId(''); } }, [testState]);
  useEffect(() => () => { clearUI(); commandTimers.current.forEach(clearTimeout); }, []);
  useEffect(() => {
    if (!open || suspended) return;
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); back(); return; }
      if (!e.key.startsWith('Arrow') || !root.current?.contains(document.activeElement)) return;
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLSelectElement) return;
      const origin = document.activeElement as HTMLElement; const b = origin.getBoundingClientRect();
      const horizontal = ['ArrowLeft', 'ArrowRight'].includes(e.key); const sign = ['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 1;
      const targets = [...root.current.querySelectorAll<HTMLElement>('button:not(:disabled),select')].filter(el => el !== origin && el.getClientRects().length && el.tabIndex >= 0);
      const matches = targets.map(el => { const r = el.getBoundingClientRect(); const dx = r.x + r.width / 2 - b.x - b.width / 2; const dy = r.y + r.height / 2 - b.y - b.height / 2; const primary = horizontal ? dx : dy; return { el, primary, score: Math.abs(primary) + Math.abs(horizontal ? dy : dx) * 3 }; }).filter(m => m.primary * sign > 8).sort((a, b) => a.score - b.score);
      e.preventDefault(); matches[0]?.el.focus({ preventScroll: true }); matches[0]?.el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    window.addEventListener('keydown', keyboard, true); return () => window.removeEventListener('keydown', keyboard, true);
  });
  function report(state: VoiceState, text: string) { if (!active.current) return; setVoice(state); setMessage(text); if (state === 'success') later(() => { setVoice('idle'); setMessage(''); }, 2600); }
  function execute(command: Intent, targets: HomeDevice[]) {
    setIntent(null); setCandidates([]);
    if (testState === 'disconnected') { report('error', '家庭主机连接中断，请稍后再试。'); return; }
    if (targets.some(expired)) { report('error', '涂鸦账号需要重新授权，请在手机上处理。'); return; }
    if (targets.some(d => d.connection !== 'online')) { report('error', '设备离线或状态未知，暂时无法控制。'); return; }
    if (command.action === 'query') { const d = targets[0]; const fields = metricsFor(d); report('success', `${d.name}：${fields.length ? fields.map(m => `${m.label} ${m.value}`).join('，') : summary(d)}。`); return; }
    if (command.action === 'stop') {
      if (!pending.includes(targets[0].id)) { report('success', '窗帘当前已停止。'); return; }
      requestId.current++; commandTimers.current.forEach(clearTimeout); setPending([]); report('success', '窗帘已停止，保留当前开合位置。'); return;
    }
    // A single in-flight mock command avoids cross-device cancellation races.
    if (pending.length) { report('error', '上一条指令正在执行，请稍候。'); return; }
    if (targets.every(d => command.action === 'level' ? d.level === command.value && (d.kind !== 'light' || d.on) : d.on === (command.action === 'on'))) { report('success', '设备已经处于目标状态。'); return; }
    const id = ++requestId.current; setPending(targets.map(d => d.id)); report('executing', `正在${command.label.replace('它', targets[0].name)}…`); const outcome = testState;
    if (targets[0].kind === 'curtain' && command.action === 'level' && outcome !== 'failed' && outcome !== 'timeout') {
      const from = targets[0].level || 0;
      [1, 2, 3].forEach(step => commandTimers.current.push(setTimeout(() => { if (id === requestId.current) setDevices(current => current.map(d => d.id === targets[0].id ? { ...d, level: Math.round(from + ((command.value || 0) - from) * step / 4), updated: '刚刚' } : d)); }, step * 1400)));
    }
    commandTimers.current.push(setTimeout(() => {
      if (id !== requestId.current) return; setPending([]);
      if (outcome === 'timeout') { report('unknown', '暂未确认执行结果，请稍后查询设备状态。'); return; }
      const succeeded = outcome === 'failed' ? targets.slice(1) : targets;
      if (succeeded.length) setDevices(current => current.map(d => succeeded.some(t => t.id === d.id) ? { ...d, on: command.action === 'level' ? true : command.action === 'on', level: command.action === 'level' ? command.value : d.level, updated: '刚刚' } : d));
      report(outcome === 'failed' ? 'error' : 'success', outcome === 'failed' ? `${succeeded.length ? `${succeeded.length} 台已完成，` : ''}${targets[0].name}执行失败，请稍后重试。` : targets.length > 1 ? `${targets.length} 台灯具已关闭。` : `${targets[0].name}${command.action === 'level' ? `${targets[0].kind === 'curtain' ? '开合' : '亮度'}已调到 ${command.value}%` : command.action === 'on' ? '已开启' : '已关闭'}。`);
    }, targets[0].kind === 'curtain' ? 6000 : 1600));
  }
  function startVoice() {
    if (['listening', 'thinking', 'executing'].includes(voice)) return;
    if (voice === 'confirm' && intent) { execute(intent, candidates); return; }
    if (voice === 'clarify') return;
    clearUI(); const next = intents[choice] || intents[0]; setVoice('listening'); setMessage('正在听，请说…');
    later(() => { setVoice('thinking'); setMessage(`“${next.label}” · 正在理解…`); }, 1300);
    later(() => {
      const targets = selected ? [selected] : next.action === 'query' ? effective.filter(d => d.id === 'env') : effective.filter(d => d.kind === 'light');
      if (!targets.length) { report('error', '还没有找到对应设备，请先在手机上添加。'); return; }
      if (next.all || (!selected && targets.length > 1)) { setCandidates(targets); setIntent(next); setVoice(next.all ? 'confirm' : 'clarify'); setMessage(next.all ? `将关闭 ${targets.length} 台灯具，是否继续？` : '你想打开哪一盏灯？'); focus('candidate-0'); return; }
      execute(next, targets);
    }, 2600);
  }
  function updateSelected(patch: Partial<HomeDevice>) {
    if (!selected || selected.connection !== 'online' || expired(selected) || testState === 'disconnected') return;
    setDevices(current => current.map(d => d.id === selected.id ? { ...d, ...patch, updated: '刚刚' } : d));
  }
  function updateRange(field: 'level' | 'colorTemperature', value: number) {
    updateSelected(field === 'level' ? { level: value } : { colorTemperature: value });
  }
  function rangeBackground(tone: 'brightness' | 'temperature' | 'position', value: number, min: number, max: number) {
    if (tone === 'temperature') return undefined;
    const progress = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    const color = tone === 'position' ? '#78aefc' : '#fff';
    return `linear-gradient(90deg,#3f3f3f 0%,${color} ${progress}%,rgba(30,30,30,.24) ${progress}%,rgba(30,30,30,.24) 100%)`;
  }
  const voiceIdleCopy = selected?.kind === 'light' ? '也许你想改变下灯光？' : selected?.kind === 'curtain' ? '也许你想调整下窗帘？' : selected ? '可以问我设备当前状态' : !effective.length ? '添加设备后，可以用语音查询和控制' : '';
  const controlsAvailable = Boolean(selected && selected.connection === 'online' && !expired(selected) && testState !== 'disconnected');
  const handoffStatus = testState === 'qr-expired' ? '二维码已过期' : testState === 'scanned' ? '请在手机上继续' : testState === 'linked' ? '配置已更新' : testState === 'failed' ? '配置未完成' : '等待手机连接';
  return <section className={`device-overlay home-device-overlay ${open ? 'open' : ''}`} aria-hidden={!open || suspended} inert={!open || suspended}>
    <div ref={root} className="device-modal home-device-modal" role="dialog" aria-modal="true" aria-label="设备中心">
      <aside className="device-sidebar"><button className="device-back" onClick={onClose}><Asset name="device-back-figma.svg" /><span>设备中心</span></button>
        <nav className="home-device-nav" aria-label="设备功能">
          <button className={view === 'accounts' || (view === 'handoff' && handoff?.returnView === 'accounts') ? '' : 'selected'} onClick={() => navigate('devices')}><span><Asset name="device-section-figma.svg" /></span>家庭设备</button>
          <button className={view === 'accounts' || (view === 'handoff' && handoff?.returnView === 'accounts') ? 'selected' : ''} onClick={() => navigate('accounts')}><span className="account-nav-icon"><Asset name="account-section.svg" /></span>接入账号</button>
        </nav>
      </aside>
      <div className="device-main home-device-main">
        {testState === 'disconnected' && <div className="device-connection-banner" role="status">家庭主机连接中断 · 当前显示上次获取的状态</div>}
        {view === 'devices' && <>
          <div className="home-device-toolbar"><div className="home-room-tabs" role="tablist" aria-label="设备房间">{rooms.map(r => <button key={r} role="tab" aria-selected={room === r} onClick={() => { setRoom(r); scroll.current = 0; if (grid.current) grid.current.scrollTop = 0; }}>{r}</button>)}</div>
            <span className="home-device-count">{visible.length} 台设备 · {visible.filter(d => d.connection === 'online').length} 台在线</span>
          </div>
          <div className="home-device-grid" ref={grid}>{visible.map(d => <button className="device-card home-device-card" key={d.id} data-focus={`device-${d.id}`} onClick={() => showDevice(d)} aria-label={`${d.name}，${connectionLabels[d.connection]}，${summary(d)}`}>
            <h2>{d.name}</h2><div className="device-card-connection"><i className={d.connection} />{connectionLabels[d.connection]}</div><div className="device-connection">{d.room}<span />{accountName(d.account)}设备</div><div className={`home-device-card-status ${expired(d) ? 'attention' : ''}`}><small>{expired(d) ? '需重新授权' : summary(d)}</small></div><ProductImage device={d} />
          </button>)}{!visible.length && <div className="home-device-empty"><h2>{effective.length ? '当前空间没有设备' : '家里还没有添加设备'}</h2><p>{effective.length ? '试试切换到其他空间' : '在手机 App 中关联账号，添加你的家庭设备'}</p>{effective.length ? <button className="device-action" onClick={() => setRoom('全部空间')}>查看全部空间</button> : null}</div>}</div>
          <div className="home-device-bottom-fade list-fade" aria-hidden="true" />
          <button className="device-action home-device-add" data-focus="add-devices" onClick={() => showHandoff('添加设备', '使用手机 App 扫码，添加设备并设置所在房间。', 'add-devices')}>＋ 添加设备</button>
        </>}
        {view === 'accounts' && <div className="home-accounts"><div className="home-device-toolbar"><h1>接入账号</h1></div><p className="account-intro">查看账号连接状态，并在手机上完成账号管理</p>
          {testState !== 'empty' ? <div className="home-account-grid">{accounts.map(a => <article key={a.id} className="home-account-card"><span className={`brand-mark ${a.id}`}>{a.mark}</span><h2>{a.name}</h2><p>家庭账号</p><div className={`account-authorization ${testState === 'expired' && a.id === 'tuya' ? 'attention' : ''}`}><i />{testState === 'expired' && a.id === 'tuya' ? '需要重新授权' : '已授权'}</div><div className="account-count"><strong>{effective.filter(d => d.account === a.id).length}</strong><span>台关联设备</span></div>
            <button className="device-action" data-focus={`account-${a.id}`} onClick={() => showHandoff(`${a.name}账号管理`, `使用手机 App 扫码，管理${a.name}账号授权和关联设备。`, `account-${a.id}`)}>账号管理 <span>↗</span></button>
            {testState === 'expired' && a.id === 'tuya' && <button className="device-text-button attention" data-focus="reauth" onClick={() => showHandoff('重新授权涂鸦账号', '使用手机 App 扫码，重新授权涂鸦账号。', 'reauth')}>去手机处理 →</button>}
          </article>)}</div> : <div className="home-device-empty"><span>◎</span><h2>尚未关联品牌账号</h2><p>添加账号后，在这里查看连接状态</p></div>}<p className="account-footer">账号授权与设备配置，在手机 App 中完成</p><button className="device-action home-device-add" data-focus="add-accounts" onClick={() => showHandoff('添加账号', '使用手机 App 扫码，关联小米或涂鸦账号。', 'add-accounts')}>＋ 添加账号</button></div>}
        {view === 'detail' && selected && <div className="home-device-detail" key={selected.id}><button className="device-subpage-back" data-focus="detail-back" aria-label="返回设备列表" onClick={returnList}><Asset name="device-back-figma.svg" /><span>设备详情</span></button><div className="home-device-portrait"><ProductImage device={selected} /></div>
          <div className="home-device-info"><h2>{selected.name}</h2><p className={`detail-state ${expired(selected) ? 'attention' : ''}`}><i className={selected.connection} />{connectionLabels[selected.connection]}<span>｜</span>{selected.room}<span>｜</span>{accountName(selected.account)}设备 · 家庭账号</p>
            {selected.controls?.power || selected.controls?.ranges?.length ? <div className="device-controls">
              {selected.controls?.power && <div className="device-control-row power"><span>设备状态</span><button className="device-power-switch" data-focus="device-power" role="switch" aria-checked={Boolean(selected.on)} disabled={!controlsAvailable} onClick={() => updateSelected({ on: !selected.on })}><i /></button><strong>{selected.on ? '已开启' : '已关闭'}</strong></div>}
              {selected.controls?.ranges?.map(control => {
                const value = selected[control.field] ?? control.min;
                return <label className="device-control-row" key={control.field}><span>{control.label}</span><input data-focus={`device-${control.field}`} className={control.tone} type="range" min={control.min} max={control.max} step={control.step} value={value} style={{ background: rangeBackground(control.tone, value, control.min, control.max) }} disabled={!controlsAvailable || Boolean(control.requiresPower && !selected.on)} onChange={e => updateRange(control.field, Number(e.target.value))} /><output>{value}{control.unit}</output></label>;
              })}
            </div> : <dl>{metricsFor(selected).map(m => <div key={m.label}><dt>{m.label}</dt><dd>{m.value}</dd></div>)}</dl>}
            {!selected.controls?.power && !selected.controls?.ranges?.length && !metricsFor(selected).length && <p className="device-detail-explanation">{selected.connection !== 'online' ? '设备暂时无法连接，恢复连接后将自动更新。' : '状态随家庭服务持续更新，可通过语音查询。'}</p>}
            <p className="device-updated">{testState === 'disconnected' ? '连接恢复后更新' : selected.id === 'air' || selected.id === 'sleep' ? story.ready ? '最近更新｜本轮采集' : '等待本轮采集' : `最近更新｜${selected.updated}`}</p>
          </div><div className="home-device-bottom-fade" aria-hidden="true" /><div className="device-detail-actions"><button className="device-action" data-focus="device-settings" onClick={() => showHandoff(expired(selected) ? '重新授权涂鸦账号' : '设备设置', expired(selected) ? '使用手机 App 扫码，重新授权涂鸦账号。' : `使用手机 App 扫码，设置${selected.name}。`, 'device-settings')}>{expired(selected) ? '去手机处理' : '手机上设置'}</button></div></div>}
        {view === 'handoff' && handoff && <div className="device-handoff"><button className="device-subpage-back" data-focus="handoff-back" aria-label="返回上一页" onClick={back}><Asset name="device-back-figma.svg" /><span>{handoff.title}</span></button><div className="handoff-content"><p className="device-detail-eyebrow">在手机上继续</p><h1>{handoff.title}</h1><p>{handoff.copy}</p>
          <div className={`qr-placeholder ${testState === 'qr-expired' ? 'expired' : ''}`} aria-label="手机二维码待接入"><i /><i /><i /><span>{testState === 'linked' ? '✓' : testState === 'scanned' ? '↗' : testState === 'failed' ? '!' : '⌁'}</span></div><strong role="status">{handoffStatus}</strong><p className="handoff-note">{['scanned', 'linked', 'qr-expired', 'failed'].includes(testState) ? testState === 'linked' ? '可返回列表查看当前设备' : testState === 'qr-expired' ? '请稍后重新发起添加操作' : testState === 'failed' ? '请返回后重新发起，原有设备不会改变' : '配置完成后，电视上的设备信息会同步更新' : '手机连接服务暂未开放'}</p>{testState === 'linked' && <button className="device-action" onClick={back}>返回查看</button>}
        </div></div>}
        {(view === 'devices' || view === 'detail') && <div className={`memory-voice home-device-voice view-${view} ${selected ? 'has-selection' : ''} ${!effective.length ? 'is-empty' : ''} state-${voice}`}>
          {(voice === 'clarify' || voice === 'confirm') && <div className="device-voice-choices">{voice === 'clarify' ? candidates.map((d, i) => <button className="device-action" key={d.id} data-focus={`candidate-${i}`} onClick={() => intent && execute(intent, [d])}>{d.name}</button>) : <button className="device-action" data-focus="candidate-0" onClick={() => intent && execute(intent, candidates)}>确认执行</button>}<button className="device-text-button" onClick={() => { resetVoice(); focus('voice'); }}>取消</button></div>}
          <button className="memory-voice-control" data-focus="voice" onClick={startVoice} disabled={['listening', 'thinking', 'executing'].includes(voice)} aria-label="设备语音交互">{open && !suspended && <span className="memory-voice-orb"><VoicePresence phase={voice === 'thinking' || voice === 'executing' ? 'thinking' : voice === 'idle' ? 'idle' : 'responding'} /></span>}<span className="memory-voice-copy" role="status">{message || voiceIdleCopy}</span></button>
          {effective.length ? <div className="device-voice-examples"><span>可以说</span>{intents.map((item, i) => <button key={item.label} aria-pressed={choice === i} onClick={() => { resetVoice(); setChoice(i); focus('voice'); }}>“{item.label}”</button>)}</div> : null}
        </div>}
      </div>
    </div>
  </section>;
}
