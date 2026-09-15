import { useMemo, useState } from 'react';
import { Asset } from './Primitives';

type DeviceFilter = 'all' | 'online' | 'offline';
type DeviceItem = {
  id: string;
  name: string;
  room: string;
  online: boolean;
  image: string;
};

const devices: DeviceItem[] = [
  { id: 'rf', name: '射频设备', room: '客厅', online: true, image: 'device-rf-figma.png' },
  { id: 'sleep', name: '睡眠监测设备', room: '客厅', online: true, image: 'device-sleep-figma.png' },
  { id: 'air', name: '空气消杀机', room: '客厅', online: true, image: 'device-air-figma.png' },
  { id: 'camera', name: '视频摄像头', room: '客厅', online: true, image: 'device-camera-figma.png' },
  { id: 'robot', name: '家庭机器人', room: '客厅', online: false, image: 'device-robot-figma.png' },
  { id: 'ac', name: '空调系统', room: '客厅', online: false, image: 'device-ac-figma.png' },
  { id: 'bp', name: '血压仪', room: '卧室', online: false, image: 'device-bp-figma.png' },
  { id: 'oxygen', name: '血氧仪', room: '卧室', online: false, image: 'device-oxygen-figma.png' },
];

const filters: { id: DeviceFilter; label: string }[] = [
  { id: 'all', label: '全部设备' },
  { id: 'online', label: '在线设备' },
  { id: 'offline', label: '离线设备' },
];

export function DevicePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filter, setFilter] = useState<DeviceFilter>('all');
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(devices.map(device => [device.id, device.online])),
  );
  const visibleDevices = useMemo(() => devices.filter(device =>
    filter === 'all' || (filter === 'online' ? device.online : !device.online),
  ), [filter]);

  return <section className={`device-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
    <div className="device-modal" role="dialog" aria-modal="true" aria-label="设备管理">
      <aside className="device-sidebar">
        <button className="device-back" type="button" onClick={onClose} tabIndex={open ? 0 : -1}>
          <Asset name="device-back-figma.svg" /><span>设备管理</span>
        </button>
        <div className="device-section-current"><span><Asset name="device-section-figma.svg" /></span>服务设备</div>
      </aside>
      <div className="device-main">
        <div className="device-filters" role="tablist" aria-label="设备状态筛选">
          {filters.map(item => <button key={item.id} type="button" role="tab" aria-selected={filter === item.id} tabIndex={open ? 0 : -1} onClick={() => setFilter(item.id)}>{item.label}</button>)}
        </div>
        <div className="device-grid">
          {visibleDevices.map(device => <article className="device-card" key={device.id}>
            <h2>{device.name}</h2>
            <div className={`device-connection ${device.online ? 'online' : 'offline'}`}><i />{device.online ? '在线' : '离线'}<span />{device.room}</div>
            <button
              className="device-switch"
              type="button"
              role="switch"
              aria-label={`${device.name}开关`}
              aria-checked={device.online && enabled[device.id]}
              disabled={!device.online}
              tabIndex={open ? 0 : -1}
              onClick={() => setEnabled(current => ({ ...current, [device.id]: !current[device.id] }))}
            ><i /></button>
            <Asset name={device.image} className="device-product" alt={device.name} />
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}
