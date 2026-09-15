// Adapted from the user-provided circular-dial-loop-animation.zip.
import React, { useEffect, useRef } from 'react';
import { SectorConfig, AnimationSettings } from './radarTypes';

interface RadarCanvasProps {
  sectors: SectorConfig[];
  settings: AnimationSettings;
  anglesRef: React.MutableRefObject<number[]>;
  onAngleUpdate?: (angles: number[]) => void;
}

export const RadarCanvas: React.FC<RadarCanvasProps> = ({
  sectors,
  settings,
  anglesRef,
  onAngleUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Keep latest props in refs for animation loop
  const sectorsRef = useRef(sectors);
  const settingsRef = useRef(settings);

  useEffect(() => {
    sectorsRef.current = sectors;
  }, [sectors]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationFrameId: number;
    let lastTimestamp = performance.now();
    let lastAngleCallbackTime = 0;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = { width: container.clientWidth, height: container.clientHeight };
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr * rect.width / 600, 0, 0, dpr * rect.height / 600, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const render = (now: number) => {
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      const currentSettings = settingsRef.current;
      const currentSectors = sectorsRef.current;

      // Update angles if playing
      if (currentSettings.isPlaying) {
        for (let i = 0; i < currentSectors.length; i++) {
          const s = currentSectors[i];
          const delta = s.direction * s.speed * currentSettings.speedMultiplier * dt;
          anglesRef.current[i] = (anglesRef.current[i] + delta) % (Math.PI * 2);
          if (anglesRef.current[i] < 0) {
            anglesRef.current[i] += Math.PI * 2;
          }
        }
      }

      // Notify parent of updated angles throttled to ~15fps for UI
      if (now - lastAngleCallbackTime > 66 && onAngleUpdate) {
        lastAngleCallbackTime = now;
        onAngleUpdate([...anglesRef.current]);
      }

      const width = 600;
      const height = 600;

      // Clear with deep dark slate/black
      ctx.clearRect(0, 0, width, height);

      // Center point: balanced for whole 2.5D geometry (base dial + top axis)
      const cx = width / 2;
      const cy = height * 0.60;

      // Tilt ratio: ratio between vertical radius and horizontal radius
      // e.g. tilt 68 deg -> sin(90 - 68) = sin(22 deg) ≈ 0.375
      const tiltRad = (currentSettings.tiltAngle * Math.PI) / 180;
      const tiltRatio = Math.sin((90 - currentSettings.tiltAngle) * Math.PI / 180);

      // Calculate base radius scale dynamically to fit screen beautifully
      const maxAvailableR = Math.min(width * 0.44, (height - cy) / Math.max(tiltRatio, 0.2) * 0.95);
      const baseRadius = Math.min(240, maxAvailableR);
      const axisMaxHeight = baseRadius * 1.18;

      ctx.save();

      // ==========================================
      // 1. DRAW BASE DIAL (ANGLED CIRCULAR BASE)
      // ==========================================
      const drawEllipseRing = (
        r: number,
        color = 'rgba(255, 255, 255, 0.4)',
        lineWidth = 1,
        dash: number[] = []
      ) => {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash(dash);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.ellipse(cx, cy, r, r * tiltRatio, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      // Outer dashed/segmented boundary ring (tick segments around perimeter)
      const outerSegments = 48;
      const outerRingR = baseRadius * 1.08;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < outerSegments; i++) {
        const a1 = (i / outerSegments) * Math.PI * 2;
        const a2 = a1 + (Math.PI * 2 / outerSegments) * 0.55;
        ctx.beginPath();
        ctx.ellipse(cx, cy, outerRingR, outerRingR * tiltRatio, 0, a1, a2);
        ctx.stroke();
      }
      ctx.restore();

      // Solid prominent outer ring (thickened solid white ring per user request)
      const solidRingWidth = currentSettings.solidRingWidth ?? 6.5;
      drawEllipseRing(baseRadius, '#ffffff', solidRingWidth);
      drawEllipseRing(baseRadius * 0.965, 'rgba(255, 255, 255, 0.35)', 1);

      // Concentric inner coordinate rings
      drawEllipseRing(baseRadius * 0.82, 'rgba(255, 255, 255, 0.25)', 1);
      drawEllipseRing(baseRadius * 0.66, 'rgba(255, 255, 255, 0.45)', 1.2);
      drawEllipseRing(baseRadius * 0.50, 'rgba(255, 255, 255, 0.25)', 1);
      drawEllipseRing(baseRadius * 0.36, 'rgba(255, 255, 255, 0.45)', 1.2);
      drawEllipseRing(baseRadius * 0.20, 'rgba(255, 255, 255, 0.3)', 1);
      drawEllipseRing(baseRadius * 0.08, 'rgba(255, 255, 255, 0.7)', 1.5);
      drawEllipseRing(baseRadius * 0.03, 'rgba(255, 255, 255, 0.9)', 1);

      // Radial crosshair spokes and angle marks
      if (currentSettings.showAxes) {
        const radialDivisions = 8;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.32)';
        ctx.lineWidth = 1;
        for (let i = 0; i < radialDivisions; i++) {
          const angle = (i / radialDivisions) * Math.PI * 2;
          const x2 = cx + Math.cos(angle) * (baseRadius * 1.08);
          const y2 = cy + Math.sin(angle) * (baseRadius * 1.08) * tiltRatio;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Small tick marks along the outer perimeter inside the solid ring
      if (currentSettings.showTicks) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1.2;
        const tickCount = 64;
        for (let i = 0; i < tickCount; i++) {
          const angle = (i / tickCount) * Math.PI * 2;
          const rInner = baseRadius * 0.915;
          const rOuter = baseRadius * 0.965;
          const x1 = cx + Math.cos(angle) * rInner;
          const y1 = cy + Math.sin(angle) * rInner * tiltRatio;
          const x2 = cx + Math.cos(angle) * rOuter;
          const y2 = cy + Math.sin(angle) * rOuter * tiltRatio;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Front Dial Labels "00" and "12" matching the reference prototype
      if (currentSettings.showLabels) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Position right at the bottom front of the base ellipse
        const frontY = cy + baseRadius * 1.08 * tiltRatio + 8;
        ctx.fillText('00', cx - 22, frontY);
        ctx.fillText('12', cx + 22, frontY);

        // Subtle side markers "06" and "18" for orientation completeness
        ctx.font = '11px "Space Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText('06', cx - baseRadius * 1.15, cy - 6);
        ctx.fillText('18', cx + baseRadius * 1.15, cy - 6);
        ctx.fillText('24', cx, cy - baseRadius * 1.15 * tiltRatio - 14);
        ctx.restore();
      }

      // ==========================================
      // 2. DRAW THREE ROTATING TRANSPARENT SECTORS
      // ==========================================
      // Composite mode: lighter / source-over creates exquisite layered translucency
      ctx.save();
      if (currentSettings.blendMode === 'lighter') {
        ctx.globalCompositeOperation = 'lighter';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      // Sort sectors by radius or draw large -> medium -> small
      // Large sector is drawn first so smaller sectors layer gracefully
      for (let i = 0; i < currentSectors.length; i++) {
        const sector = currentSectors[i];
        const angle = anglesRef.current[i];
        const sRadius = baseRadius * sector.radius;
        const sHeight = axisMaxHeight * sector.height;

        ctx.save();

        // Build the 3D parametric quadrant path projected to screen:
        // In 3D: for parameter t from 0 to PI/2:
        // r(t) = sRadius * sin(t)
        // z(t) = sHeight * cos(t)
        // x(t) = r(t) * cos(angle)
        // y(t) = r(t) * sin(angle)
        // 2D projection:
        // px = cx + x(t)
        // py = cy + y(t) * tiltRatio - z(t)
        ctx.beginPath();
        // Start at center base
        ctx.moveTo(cx, cy);

        // Line up along the central vertical axis to top anchor of this sector
        ctx.lineTo(cx, cy - sHeight);

        // Smooth arc along outer boundary
        const steps = 48;
        for (let step = 0; step <= steps; step++) {
          const t = (step / steps) * (Math.PI / 2);
          const r = sRadius * Math.sin(t);
          const z = sHeight * Math.cos(t);
          const px = cx + r * Math.cos(angle);
          const py = cy + r * Math.sin(angle) * tiltRatio - z;
          ctx.lineTo(px, py);
        }

        // Line from ground tip back to center base
        ctx.lineTo(cx, cy);
        ctx.closePath();

        // Fill with semi-transparent white
        ctx.fillStyle = `rgba(255, 255, 255, ${sector.opacity})`;
        ctx.fill();

        // Crisp luminous boundary stroke
        ctx.strokeStyle = `rgba(255, 255, 255, 0.95)`;
        ctx.lineWidth = sector.borderWidth;
        ctx.stroke();

        // Subtle ground radial line accent
        ctx.strokeStyle = `rgba(255, 255, 255, 0.8)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + sRadius * Math.cos(angle),
          cy + sRadius * Math.sin(angle) * tiltRatio
        );
        ctx.stroke();

        // Tiny tip beacon dot on ground
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(
          cx + sRadius * Math.cos(angle),
          cy + sRadius * Math.sin(angle) * tiltRatio,
          2.5,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // ==========================================
      // 3. DRAW CENTRAL VERTICAL AXIS (Z-AXIS)
      // ==========================================
      // Rendered on top of base and sectors so the central pillar is always sharply defined
      ctx.save();
      const axisTopY = cy - axisMaxHeight - 24;

      // Central vertical line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, axisTopY);
      ctx.stroke();

      // Top arrow point ^
      const arrowSize = 8;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx, axisTopY - 6);
      ctx.lineTo(cx - arrowSize, axisTopY + arrowSize);
      ctx.lineTo(cx, axisTopY + arrowSize * 0.6);
      ctx.lineTo(cx + arrowSize, axisTopY + arrowSize);
      ctx.closePath();
      ctx.fill();

      // Elevation notch tags on the vertical axis corresponding to sector heights
      for (let i = 0; i < currentSectors.length; i++) {
        const sector = currentSectors[i];
        const notchY = cy - axisMaxHeight * sector.height;

        // Notch line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - 7, notchY);
        ctx.lineTo(cx + 7, notchY);
        ctx.stroke();

        // HUD Bracket tag [- ] as seen in the reference screenshot
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx + 9, notchY - 2.5, 12, 5);
        ctx.fillStyle = '#111215';
        ctx.fillRect(cx + 12, notchY - 1, 6, 2);
      }

      // Base pivot bearing ring
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // Continue animation loop
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [onAngleUpdate]);

  return (
    <div
      ref={containerRef}
      id="radar-canvas-container"
      className="radar-canvas-container"
    >
      <canvas
        ref={canvasRef}
        id="radar-canvas"
        className="radar-canvas"
      />
    </div>
  );
};
