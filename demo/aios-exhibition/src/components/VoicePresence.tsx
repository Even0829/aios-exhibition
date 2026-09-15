import Strands from './strands/Strands';
import type { StrandsProps } from './strands/Strands';

export type VoicePhase = 'idle' | 'thinking' | 'responding';
export type VoiceSeverity = 'normal' | 'warning' | 'emergency';

type VoiceMotion = Pick<StrandsProps, 'count' | 'speed' | 'amplitude' | 'waviness' | 'thickness' | 'glow' | 'intensity'>;

// Motion and semantic colour are independent. Each phase keeps the same
// persistent WebGL globe while changing rhythm, range and luminous strength.
export const voiceMotion: Record<VoicePhase, VoiceMotion> = {
  idle: { count: 3, speed: 0.42, amplitude: 0.8, waviness: 0.85, thickness: 0.85, glow: 2.2, intensity: 0.45 },
  thinking: { count: 4, speed: 1.1, amplitude: 1.35, waviness: 1.7, thickness: 0.72, glow: 1.85, intensity: 0.55 },
  responding: { count: 4, speed: 1.5, amplitude: 1.6, waviness: 1.3, thickness: 0.78, glow: 2.1, intensity: 0.68 },
};
export const voiceColors: Record<VoiceSeverity, string[]> = {
  normal: ['#f916f6', '#1d8fff', '#00daff'],
  warning: ['#4a2100', '#7b2f62', '#c75500', '#ff7a00', '#ffad00', '#ffd34e', '#ffe38a'],
  emergency: ['#46000e', '#97132d', '#e5183f', '#ff3b42', '#ff6a54', '#ff9a73', '#b31964'],
};
const phaseLabels: Record<VoicePhase, string> = {
  idle: '语音助手待命', thinking: '语音助手思考分析', responding: '语音助手正在播报',
};
export function VoicePresence({phase='idle', severity='normal'}: {
  phase?: VoicePhase; severity?: VoiceSeverity;
}) {
  return <div className="voice-presence" aria-label={phaseLabels[phase]} data-phase={phase} data-severity={severity}>
    <Strands {...voiceMotion[phase]} colors={voiceColors[severity]}
      glass glassSize={0.6} scale={0.6} refraction={0.8}
      taper={2.1} />
  </div>;
}
