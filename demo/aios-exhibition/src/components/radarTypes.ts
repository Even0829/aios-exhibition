export interface SectorConfig {
  id: string;
  name: string;
  radius: number; // relative to base radius (0.0 - 1.0)
  height: number; // relative to max axis height (0.0 - 1.0)
  speed: number; // rad per second
  direction: 1 | -1; // 1: clockwise, -1: counter-clockwise
  opacity: number;
  color: string;
  borderWidth: number;
}

export interface AnimationSettings {
  isPlaying: boolean;
  speedMultiplier: number;
  tiltAngle: number; // in degrees (e.g. 68deg)
  solidRingWidth: number; // in pixels (e.g. 6.5px)
  showAxes: boolean;
  showTicks: boolean;
  showLabels: boolean;
  showTelemetry: boolean;
  blendMode: 'normal' | 'lighter';
}
