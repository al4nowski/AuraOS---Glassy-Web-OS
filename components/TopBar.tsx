
import React, { useState, useEffect, useRef } from 'react';
import { AppId } from '../types';

interface TopBarProps {
  onShutdown: () => void;
  onOpenApp: (id: AppId) => void;
}

interface MenuItem {
  label: string;
  action?: () => void;
  shortcut?: string;
  danger?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onShutdown, onOpenApp }) => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menus: Record<string, MenuItem[]> = {
    'AuraOS': [
      { label: 'About AuraOS', action: () => alert('AuraOS v1.0.4\nModern Glassy Environment') },
      { label: 'System Settings...', action: () => onOpenApp('settings') },
      { label: 'App Store', action: () => alert('Coming soon in v1.1') },
      { label: 'Sleep', action: () => alert('Zzz...') },
      { label: 'Restart', action: () => window.location.reload() },
      { label: 'Shut Down...', action: onShutdown, danger: true },
    ],
    'File': [
      { label: 'New Window', shortcut: '⌘N' },
      { label: 'Open...', shortcut: '⌘O' },
      { label: 'Close Window', shortcut: '⌘W', action: () => alert('Please use window controls') },
    ],
    'Edit': [
      { label: 'Undo', shortcut: '⌘Z' },
      { label: 'Redo', shortcut: '⇧⌘Z' },
      { label: 'Cut', shortcut: '⌘X' },
      { label: 'Copy', shortcut: '⌘C' },
      { label: 'Paste', shortcut: '⌘V' },
    ],
    'View': [
      { label: 'Refresh Desktop', action: () => window.location.reload() },
      { label: 'Enter Full Screen', shortcut: '⌃⌘F' },
      { label: 'Show Desktop' },
    ]
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-8 glass-dark z-[10000] flex items-center justify-between px-4 text-white/90 text-[13px] font-medium border-b border-white/5" ref={menuRef}>
      {/* Left side: Logo & System Menu */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <button 
            onClick={() => handleMenuClick('AuraOS')}
            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${activeMenu === 'AuraOS' ? 'bg-white/20 shadow-inner' : 'hover:bg-white/10'}`}
          >
            <i className="fa-solid fa-gem text-blue-400 text-xs"></i>
            <span className="font-bold tracking-tight">AuraOS</span>
          </button>
          {activeMenu === 'AuraOS' && <Dropdown items={menus['AuraOS']} onClose={() => setActiveMenu(null)} />}
        </div>

        {['File', 'Edit', 'View'].map((name) => (
          <div key={name} className="relative">
            <button 
              onClick={() => handleMenuClick(name)}
              className={`px-3 py-1 rounded transition-all font-light ${activeMenu === name ? 'bg-white/20 shadow-inner opacity-100' : 'hover:bg-white/10 opacity-70'}`}
            >
              {name}
            </button>
            {activeMenu === name && <Dropdown items={menus[name]} onClose={() => setActiveMenu(null)} />}
          </div>
        ))}
      </div>

      {/* Center side: Clock */}
      <div className="absolute left-1/2 -translate-x-1/2 font-semibold tracking-wider tabular-nums">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>

      {/* Right side: Indicators & Quick Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 opacity-70 scale-90">
          <i className="fa-solid fa-magnifying-glass hover:opacity-100 transition-opacity"></i>
          <i className="fa-solid fa-wifi"></i>
          <i className="fa-solid fa-battery-three-quarters"></i>
          <i className="fa-solid fa-sliders"></i>
        </div>
      </div>
    </div>
  );
};

const Dropdown: React.FC<{ items: MenuItem[], onClose: () => void }> = ({ items, onClose }) => (
  <div className="absolute top-8 left-0 w-56 glass window-shadow rounded-xl border border-white/10 py-1.5 z-[10001] animate-in fade-in slide-in-from-top-1 duration-200">
    {items.map((item, i) => (
      <button
        key={i}
        onClick={() => {
          item.action?.();
          onClose();
        }}
        className={`w-full text-left px-4 py-1.5 text-[13px] flex justify-between items-center transition-colors group ${
          item.danger ? 'text-red-400 hover:bg-red-500/20' : 'text-white/90 hover:bg-blue-500/60'
        }`}
      >
        <span className={item.danger ? 'font-bold' : ''}>{item.label}</span>
        {item.shortcut && <span className="text-[10px] opacity-40 group-hover:opacity-80 ml-4 font-mono">{item.shortcut}</span>}
      </button>
    ))}
  </div>
);

export default TopBar;
