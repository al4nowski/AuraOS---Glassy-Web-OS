
import React, { useState, useCallback, useMemo } from 'react';
import { AppId, AppIcon, WindowState } from './types';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import TopBar from './components/TopBar';
import AuraGen from './components/apps/AuraGen';

const APPS: AppIcon[] = [
  { id: 'imageGen', icon: 'fa-solid fa-palette', label: 'Aura Gen', color: '#60a5fa' },
  { id: 'terminal', icon: 'fa-solid fa-terminal', label: 'Terminal', color: '#4ade80' },
  { id: 'files', icon: 'fa-solid fa-folder-open', label: 'Files', color: '#fbbf24' },
  { id: 'settings', icon: 'fa-solid fa-gear', label: 'Settings', color: '#f472b6' },
];

// Higher quality, more modern "glassy" default wallpaper
const DEFAULT_WALLPAPER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

const App: React.FC = () => {
  const [wallpaper, setWallpaper] = useState(DEFAULT_WALLPAPER);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [maxZ, setMaxZ] = useState(10);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const openApp = useCallback((id: AppId) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        return prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: maxZ + 1 } : w);
      }
      const appInfo = APPS.find(a => a.id === id)!;
      return [...prev, { id, title: appInfo.label, isOpen: true, isMinimized: false, zIndex: maxZ + 1 }];
    });
    setMaxZ(prev => prev + 1);
  }, [maxZ]);

  const closeApp = (id: AppId) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const minimizeApp = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
  };

  const focusApp = (id: AppId) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w));
    setMaxZ(prev => prev + 1);
  };

  const handleShutdown = () => {
    setIsShuttingDown(true);
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const activeAppId = useMemo(() => {
    const visible = windows.filter(w => !w.isMinimized);
    if (visible.length === 0) return null;
    return visible.sort((a, b) => b.zIndex - a.zIndex)[0].id;
  }, [windows]);

  if (isShuttingDown) {
    return (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center animate-pulse">
        <i className="fa-solid fa-gem text-blue-500 text-6xl mb-8 opacity-20"></i>
        <div className="text-white/20 text-xs tracking-[0.3em] uppercase">Shutting Down AuraOS...</div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-black transition-all duration-1000"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <TopBar onShutdown={handleShutdown} onOpenApp={openApp} />

      {/* Background Overlay - pointer-events-none is crucial so it doesn't block desktop clicks */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-none"></div>

      {/* Desktop Icons */}
      <div className="absolute top-16 left-8 flex flex-col gap-6">
        {APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className="group flex flex-col items-center gap-1.5 w-24 p-2 rounded-xl hover:bg-white/10 transition-all active:scale-95"
          >
            <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 transition-all">
              <i className={`${app.icon} text-2xl drop-shadow-sm`} style={{ color: app.color }}></i>
            </div>
            <span className="text-white text-[12px] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-90 group-hover:opacity-100">{app.label}</span>
          </button>
        ))}
      </div>

      {/* Windows Manager */}
      {windows.map((win) => win.isOpen && !win.isMinimized && (
        <Window
          key={win.id}
          title={win.title}
          zIndex={win.zIndex}
          onClose={() => closeApp(win.id)}
          onMinimize={() => minimizeApp(win.id)}
          onClick={() => focusApp(win.id)}
        >
          {win.id === 'imageGen' && <AuraGen setWallpaper={setWallpaper} />}
          {win.id === 'terminal' && (
            <div className="font-mono text-sm text-green-400 p-2">
              <p className="mb-2">AuraOS Kernel v1.0.4-aura</p>
              <p className="mb-2 text-white/40">Initializing glassy subsystems...</p>
              <p className="mb-2 text-blue-300">GPU Acceleration: Enabled (Quartz Glass Core)</p>
              <p className="mb-2">system@aura:~$ <span className="animate-pulse">_</span></p>
            </div>
          )}
          {win.id === 'files' && (
            <div className="grid grid-cols-4 gap-4">
              {['Documents', 'Photos', 'Work', 'System', 'Projects', 'Assets'].map(folder => (
                <div key={folder} className="flex flex-col items-center gap-2 p-4 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                  <i className="fa-solid fa-folder text-blue-400/80 text-3xl group-hover:scale-110 group-hover:text-blue-400 transition-all"></i>
                  <span className="text-white/80 text-xs">{folder}</span>
                </div>
              ))}
            </div>
          )}
          {win.id === 'settings' && (
            <div className="text-white space-y-6">
              <h3 className="text-lg font-medium border-b border-white/10 pb-2">Display & Aura</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-sm">Acrylic Transparency</span>
                  <div className="w-12 h-6 bg-blue-600 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-sm">Dynamic Blur Intensity</span>
                  <input type="range" className="accent-blue-500 w-24" />
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-[10px] text-white/40 block mb-3 uppercase font-bold tracking-widest">CURRENT WALLPAPER</span>
                  <div className="h-28 rounded-xl overflow-hidden bg-cover bg-center border border-white/10 shadow-inner" style={{backgroundImage: `url(${wallpaper})`}}></div>
                </div>
              </div>
            </div>
          )}
        </Window>
      ))}

      {/* Taskbar */}
      <Taskbar apps={APPS} openApp={openApp} activeAppId={activeAppId} />

      {/* Ambient particles for extra depth */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-purple-500/5 rounded-full blur-[180px]"></div>
      </div>
    </div>
  );
};

export default App;
