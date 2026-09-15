import { createContext, useContext } from 'react';

/** A scene clock retains remaining timers and progress while another event owns the screen. */
export class Timeline {
  private tasks = new Map<number, { due: number; callback: () => void; interval?: number; native?: number }>();
  private sequence = 0;
  private stoppedAt: number | null = null;
  private elapsedPause = 0;
  now = () => (this.stoppedAt ?? window.performance.now()) - this.elapsedPause;
  private arm(id: number) {
    const task = this.tasks.get(id);
    if (!task || this.stoppedAt !== null) return;
    task.native = window.setTimeout(() => {
      if (!this.tasks.has(id)) return;
      if (task.interval === undefined) this.tasks.delete(id);
      else task.due = this.now() + task.interval;
      task.callback();
      if (task.interval !== undefined) this.arm(id);
    }, Math.max(0, task.due - this.now()));
  }
  setTimeout = (callback: () => void, delay = 0): number => {
    const id = ++this.sequence;
    this.tasks.set(id, { callback, due: this.now() + delay });
    this.arm(id);
    return id;
  };
  clearTimeout = (id?: number) => {
    if (id === undefined) return;
    window.clearTimeout(this.tasks.get(id)?.native);
    this.tasks.delete(id);
  };
  setInterval = (callback: () => void, delay = 0): number => {
    const id = ++this.sequence;
    this.tasks.set(id, { callback, due: this.now() + delay, interval: delay });
    this.arm(id);
    return id;
  };
  clearInterval = this.clearTimeout;
  requestAnimationFrame = (callback: (now: number) => void) => this.setTimeout(() => callback(this.now()), 16);
  cancelAnimationFrame = this.clearTimeout;
  performance = { now: this.now };
  pause() {
    if (this.stoppedAt !== null) return;
    this.stoppedAt = window.performance.now();
    this.tasks.forEach(task => window.clearTimeout(task.native));
  }
  resume() {
    if (this.stoppedAt === null) return;
    this.elapsedPause += window.performance.now() - this.stoppedAt;
    this.stoppedAt = null;
    this.tasks.forEach((_, id) => this.arm(id));
  }
  dispose() {
    this.tasks.forEach(task => window.clearTimeout(task.native));
    this.tasks.clear();
  }
}

export const normalTimeline = new Timeline();
export const TimelineContext = createContext(normalTimeline);
export const useTimeline = () => useContext(TimelineContext);
