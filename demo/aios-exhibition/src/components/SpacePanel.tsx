import { useEffect, useRef, useState } from 'react';
import { Asset } from './Primitives';
import RadarAnimation from './RadarAnimation';
import { space, type SpaceView } from '../mock';

export function SpacePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<SpaceView>('packages');
  const [uninstallNotice, setUninstallNotice] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (open) setView('packages');
    setUninstallNotice(false);
    clearTimeout(noticeTimer.current);
    return () => clearTimeout(noticeTimer.current);
  }, [open]);

  function showUninstallNotice() {
    clearTimeout(noticeTimer.current);
    setUninstallNotice(true);
    noticeTimer.current = setTimeout(() => setUninstallNotice(false), 2_600);
  }

  return <section className={`device-overlay space-overlay ${open ? 'open' : ''}`} aria-hidden={!open}>
    <div className="device-modal space-modal" role="dialog" aria-modal="true" aria-label="空间管理">
      <aside className="space-sidebar">
        <button className="space-back" type="button" onClick={onClose} tabIndex={open ? 0 : -1}>
          <Asset name="space-back-figma.svg" /><span>空间管理</span>
        </button>
        <nav aria-label="空间功能">
          {space.sections.map(section => <button
            key={section.id}
            type="button"
            className={view === section.id ? 'active' : ''}
            aria-current={view === section.id ? 'page' : undefined}
            tabIndex={open ? 0 : -1}
            onClick={() => { setView(section.id); setUninstallNotice(false); }}
          >
            <i className={section.tone}><Asset name={section.icon} /></i>
            <span>{section.label}</span>
          </button>)}
        </nav>
      </aside>

      <div className={`space-content view-${view}`}>
        <h1>{space.sections.find(section => section.id === view)?.title}</h1>

        {view === 'packages' && <div className="space-package-grid">{space.packages.map(item => <article className="space-package-card" key={item.id}>
          <div className="space-package-image"><Asset name={item.image} alt={item.name} /></div>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
          <div className="space-package-actions">
            <button type="button" disabled tabIndex={open ? 0 : -1}>{item.installed ? '已安装' : '安装'}</button>
            <button
              type="button"
              className={item.removable ? '' : 'uninstall-disabled'}
              aria-label={item.removable ? '卸载' : '卸载，暂不可用'}
              tabIndex={open ? 0 : -1}
              onClick={item.removable ? undefined : showUninstallNotice}
            >卸载</button>
          </div>
          <div className={`space-uninstall-notice ${uninstallNotice ? 'visible' : ''}`} role="status" aria-live="polite">当前系统默认，暂时禁止卸载</div>
        </article>)}</div>}

        {view === 'model' && <div className="space-model-empty">
          <div className="space-model-radar"><RadarAnimation /></div>
          <p>{space.modelEmpty}</p>
        </div>}

        {view === 'entities' && <div className="space-entity-grid">{space.entities.map(entity => <article className="space-entity-card" key={entity.id}>
          <h2>{entity.name}</h2>
          <p>{entity.room}</p>
          <Asset name={entity.image} className="space-entity-image" alt={entity.name} />
        </article>)}</div>}
      </div>
    </div>
  </section>;
}
