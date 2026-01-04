
import React from 'react';
import { AppId, AppIcon } from '../types';

interface TaskbarProps {
  apps: AppIcon[];
  openApp: (id: AppId) => void;
  activeAppId: AppId | null;
}

const Taskbar: React.FC<TaskbarProps> = ({ apps, openApp, activeAppId }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center px-4 py-1.5 glass rounded-2xl gap-2 z-[9999] shadow-2xl">
      {/* App Icons */}
      <div className="flex gap-1.5">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all relative group ${
              activeAppId === app.id ? 'bg-white/15 scale-110 shadow-lg' : 'hover:bg-white/10'
            }`}
          >
            <i className={`${app.icon} text-xl`} style={{ color: app.color }}></i>
            {/* Tooltip */}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 glass text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {app.label}
            </span>
            {/* Active Indicator */}
            {activeAppId === app.id && (
              <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Taskbar;
