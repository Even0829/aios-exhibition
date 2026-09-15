/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { SectorConfig, AnimationSettings } from './radarTypes';
import { RadarCanvas } from './RadarCanvas';

const CURRENT_SECTORS: SectorConfig[] = [
  {
    id: 's1',
    name: '大扇形',
    radius: 0.96,
    height: 0.82,
    speed: 0.45,
    direction: 1, // 顺时针
    opacity: 0.38,
    color: '#ffffff',
    borderWidth: 1.6,
  },
  {
    id: 's2',
    name: '中扇形',
    radius: 0.68,
    height: 0.58,
    speed: 0.75,
    direction: -1, // 逆时针
    opacity: 0.44,
    color: '#ffffff',
    borderWidth: 1.6,
  },
  {
    id: 's3',
    name: '小扇形',
    radius: 0.40,
    height: 0.35,
    speed: 1.15,
    direction: 1, // 顺时针
    opacity: 0.52,
    color: '#ffffff',
    borderWidth: 1.6,
  },
];

const CURRENT_SETTINGS: AnimationSettings = {
  isPlaying: true,
  speedMultiplier: 1.0,
  tiltAngle: 68,
  solidRingWidth: 6.5,
  showAxes: true,
  showTicks: true,
  showLabels: true,
  showTelemetry: false,
  blendMode: 'lighter',
};

// 初始扇形朝向匹配参考图
const INITIAL_ANGLES = [0.45, 2.55, 5.1];

export default function RadarAnimation() {
  const anglesRef = useRef<number[]>([...INITIAL_ANGLES]);

  return (
    <div className="radar" aria-hidden="true">
      {/* 核心循环动画 */}
      <RadarCanvas
        sectors={CURRENT_SECTORS}
        settings={CURRENT_SETTINGS}
        anglesRef={anglesRef}
      />
    </div>
  );
}
