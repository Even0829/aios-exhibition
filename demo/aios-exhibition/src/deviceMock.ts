/** Mock associations/capabilities; not evidence of real HA support. */
export type AccountId = 'tuya' | 'xiaomi';
export type DeviceTest = 'normal' | 'offline' | 'unknown' | 'expired' | 'disconnected' | 'failed' | 'timeout' | 'empty' | 'scanned' | 'linked' | 'qr-expired';
export type Metric = { label: string; value: string };
export type DeviceStory = { ready: boolean; present: boolean; airRunning: boolean; air: Metric[]; body: Metric[] };
export type DeviceRangeControl = {
  field: 'level' | 'colorTemperature'; label: string; min: number; max: number; step: number; unit: string;
  tone: 'brightness' | 'temperature' | 'position'; requiresPower?: boolean;
};
export type DeviceControls = { power?: boolean; ranges?: DeviceRangeControl[] };
export type HomeDevice = {
  id: string; name: string; room: string; account: AccountId;
  kind: 'sensor' | 'light' | 'curtain' | 'air' | 'ac' | 'camera' | 'robot';
  connection: 'online' | 'offline' | 'unknown'; image?: string;
  on?: boolean; level?: number; colorTemperature?: number; updated: string; metrics?: Metric[]; controls?: DeviceControls;
};
export const accounts = [{ id: 'tuya' as const, name: '涂鸦', mark: 'tuya' }, { id: 'xiaomi' as const, name: '小米', mark: 'mi' }];
export const connectionLabels = { online: '在线', offline: '离线', unknown: '状态未知' };
export function createDevices(): HomeDevice[] {
  return [
    { id: 'rf', name: '射频设备', room: '客厅', account: 'tuya', kind: 'sensor', connection: 'online', image: 'device-rf-figma.png', updated: '等待采集' },
    { id: 'sleep', name: '睡眠监测设备', room: '客厅', account: 'tuya', kind: 'sensor', connection: 'online', image: 'device-sleep-figma.png', updated: '等待采集' },
    { id: 'air', name: '空气消杀机', room: '客厅', account: 'tuya', kind: 'air', connection: 'online', image: 'device-air-figma.png', updated: '等待采集' },
    { id: 'camera', name: '视频摄像头', room: '客厅', account: 'tuya', kind: 'camera', connection: 'online', image: 'device-camera-figma.png', updated: '等待采集' },
    { id: 'robot', name: '家庭机器人', room: '客厅', account: 'xiaomi', kind: 'robot', connection: 'offline', image: 'device-robot-figma.png', updated: '今天 09:20' },
    { id: 'ac', name: '空调系统', room: '客厅', account: 'xiaomi', kind: 'ac', connection: 'offline', image: 'device-ac-figma.png', updated: '今天 09:20' },
    { id: 'bp', name: '血压仪', room: '卧室', account: 'tuya', kind: 'sensor', connection: 'offline', image: 'device-bp-figma.png', updated: '今天 08:30' },
    { id: 'oxygen', name: '血氧仪', room: '卧室', account: 'tuya', kind: 'sensor', connection: 'offline', image: 'device-oxygen-figma.png', updated: '今天 08:30' },
    { id: 'bedroom-light', name: '卧室床头灯', room: '卧室', account: 'xiaomi', kind: 'light', connection: 'online', image: 'device-floor-lamp-figma.png', on: false, level: 40, colorTemperature: 3000, updated: '刚刚', controls: { power: true, ranges: [{ field: 'colorTemperature', label: '色温', min: 2000, max: 6500, step: 500, unit: 'k', tone: 'temperature', requiresPower: true }, { field: 'level', label: '亮度', min: 0, max: 100, step: 10, unit: '%', tone: 'brightness', requiresPower: true }] } },
    { id: 'living-light', name: '客厅落地灯', room: '客厅', account: 'tuya', kind: 'light', connection: 'online', image: 'device-floor-lamp-figma.png', on: true, level: 60, colorTemperature: 2000, updated: '刚刚', controls: { power: true, ranges: [{ field: 'colorTemperature', label: '色温', min: 2000, max: 6500, step: 500, unit: 'k', tone: 'temperature', requiresPower: true }, { field: 'level', label: '亮度', min: 0, max: 100, step: 10, unit: '%', tone: 'brightness', requiresPower: true }] } },
    { id: 'curtain', name: '客厅窗帘', room: '客厅', account: 'tuya', kind: 'curtain', connection: 'online', image: 'device-curtain.png', level: 50, updated: '刚刚', controls: { ranges: [{ field: 'level', label: '开合', min: 0, max: 100, step: 10, unit: '%', tone: 'position' }] } },
    { id: 'env', name: '温湿度传感器', room: '卧室', account: 'tuya', kind: 'sensor', connection: 'online', image: 'device-env.png', updated: '刚刚', metrics: [{ label: '温度', value: '25.6℃' }, { label: '湿度', value: '56%' }] },
  ];
}
export function deviceSummary(d: HomeDevice, story: DeviceStory): string {
  if (d.connection !== 'online') return d.connection === 'offline' ? '暂时无法连接' : '暂未获取状态';
  if (d.kind === 'light') return d.on ? `已开启 · 亮度 ${d.level}%` : '已关闭';
  if (d.kind === 'curtain') return `开合 ${d.level}%`;
  if (d.id === 'air') return story.airRunning ? '空气服务执行中' : '环境感知待命';
  if (d.id === 'sleep') return story.ready ? '持续监测中' : '等待采集';
  if (d.id === 'rf') return story.present ? '已感知有人' : '暂无人在场';
  if (d.id === 'camera') return story.present ? '感知中' : '感知待命';
  return d.metrics?.map(m => m.value).join(' · ') || '已连接';
}
export const deviceTestOptions: { id: DeviceTest; label: string }[] = [
  { id: 'normal', label: '恢复正常设备状态' }, { id: 'offline', label: '灯具离线' }, { id: 'unknown', label: '灯具状态未知' },
  { id: 'expired', label: '涂鸦授权过期' }, { id: 'disconnected', label: '家庭主机连接中断' },
  { id: 'failed', label: '控制失败' }, { id: 'timeout', label: '控制结果未确认' }, { id: 'empty', label: '暂无设备与账号' },
  { id: 'scanned', label: '手机已扫码' }, { id: 'linked', label: '手机配置已完成' }, { id: 'qr-expired', label: '二维码已过期' },
];
