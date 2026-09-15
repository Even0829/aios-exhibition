import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import RadarAnimation from "./RadarAnimation";
import type { NavigationItem } from "../mock";
export function Asset({
  name,
  className = "",
  alt = "",
  style,
}: {
  name: string;
  className?: string;
  alt?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      className={className}
      src={`/assets/${name}`}
      alt={alt}
      style={style}
      draggable={false}
    />
  );
}
export function Screen({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(() =>
    Math.min(innerWidth / 1920, innerHeight / 1080),
  );
  useEffect(() => {
    const resize = () =>
      setScale(Math.min(innerWidth / 1920, innerHeight / 1080));
    addEventListener("resize", resize);
    return () => removeEventListener("resize", resize);
  }, []);
  return (
    <div className="viewport">
      <main className="screen" style={{ transform: `scale(${scale})` }}>
        {children}
      </main>
    </div>
  );
}
export function CyclingDots() {
  return <span className="standby-dots" aria-hidden="true">{[0, 1, 2].map(i => <i key={i}>.</i>)}</span>;
}
/** Figma 267:5 / 221:403, with user-approved standby motion. */
export function AiosStatus({
  label,
  active = false,
  expanded = false,
  currentPhases = ['感知'],
  severity = 'normal',
}: {
  label: string;
  active?: boolean;
  expanded?: boolean;
  currentPhases?: string[];
  severity?: 'normal' | 'warning' | 'emergency';
}) {
  return (
    <div className={`aios-status ${active ? "active" : ""} ${expanded ? "expanded" : ""}`} data-severity={severity} role="status">
      <span className="standby-label" aria-label={label} aria-hidden={expanded}>
        <span aria-hidden="true">{label.replace(/\.\.\.$/, "")}</span>
        <CyclingDots />
      </span>
      <Asset
        name={active ? "imgEllipse13Active.svg" : "imgEllipse13.svg"}
        className="standby-ring"
      />
      <div className="task-status-content" aria-hidden={!expanded}>
        <div className="task-status-caption">
          <i />
          <span>INT AIOS 正在</span>
          <CyclingDots />
        </div>
        <ol>{['感知', '思考/分析', '决策', '执行', '反馈'].map(phase => <li key={phase} className={currentPhases.includes(phase) ? 'current' : ''}>{phase}</li>)}</ol>
      </div>
    </div>
  );
}
export function GlassCard({
  children,
  className = "",
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "workflow";
}) {
  return (
    <section className={`glass-card ${tone} ${className}`}>{children}</section>
  );
}
export function CalendarCard({
  date,
}: {
  date: { day: string; month: string; weekday: string };
}) {
  return (
    <GlassCard className="summary-card calendar">
      <div className="date-row">
        <strong>{date.day}</strong>
        <span>
          {date.month}
          <br />月
        </span>
        <span>
          周<br />
          {date.weekday}
        </span>
      </div>
      <p className="calendar-note">暂无未完事项</p>
    </GlassCard>
  );
}
export function DeviceCountCard({ count }: { count: number }) {
  return (
    <GlassCard className="summary-card devices">
      <div className="device-symbol">
        <Asset name="imgEllipse6.svg" />
        <Asset name="img1.svg" className="device-glyph" />
      </div>
      <strong>{String(count).padStart(2, "0")}</strong>
      <p>在线设备</p>
    </GlassCard>
  );
}
export function WorkflowCard({
  title,
  description,
  icon,
  illustration,
}: {
  title: string;
  description: string;
  icon: string;
  illustration?: string;
}) {
  return (
    <GlassCard tone="workflow">
      <h2>
        <Asset name={icon} />
        {title}
      </h2>
      <p>{description}</p>
      {illustration && (
        <Asset name={illustration} className="workflow-illustration" />
      )}
    </GlassCard>
  );
}
export function DiscoveryCard({ count }: { count: number }) {
  return (
    <GlassCard tone="workflow" className="discovery-card">
      <h2>
        <Asset name="wake-discovery-icon.png" />
        INT AIOS发现
      </h2>
      <p className="discovery-copy">
        客厅空间出现 <strong>{String(count).padStart(2, "0")}</strong> 人
      </p>
      <Asset name="wake-person.png" className="workflow-illustration" />
    </GlassCard>
  );
}
export function ContextRail({
  steps,
}: {
  steps: string[];
}) {
  const [highlight, setHighlight] = useState(0);
  useEffect(() => {
    if (!steps.length) return;
    const timer = setInterval(() => setHighlight(i => (i + 1) % steps.length), 2200);
    return () => clearInterval(timer);
  }, [steps.length]);
  return (
    <aside className="context-rail">
      <RadarAnimation />
      <ol>
        {steps.map((s, i) => (
          <li key={s} className={i === highlight ? "active" : ""}>
            <Asset
              name={i === highlight ? "imgEllipse8.svg" : "imgEllipse1.svg"}
            />
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <div className="rail-divider" />
    </aside>
  );
}
export function Navigation({
  items,
  onSelect,
  activeId = "home",
}: {
  items: NavigationItem[];
  onSelect: (id: string) => void;
  activeId?: string;
}) {
  return (
    <nav
      aria-label="主导航"
      className="navigation"
      onKeyDown={(e) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
        e.preventDefault();
        const buttons = Array.from(
          e.currentTarget.querySelectorAll<HTMLButtonElement>(
            "button:not(:disabled)",
          ),
        );
        let idx = buttons.indexOf(document.activeElement as HTMLButtonElement);
        idx =
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? buttons.length - 1
              : (idx + (e.key === "ArrowRight" ? 1 : -1) + buttons.length) %
                buttons.length;
        buttons[idx]?.focus();
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          disabled={!item.available}
          aria-current={item.id === activeId ? "page" : undefined}
          onClick={() => onSelect(item.id)}
        >
          <Asset name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
