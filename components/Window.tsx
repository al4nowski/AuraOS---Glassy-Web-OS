
import React, { useState } from 'react';

interface WindowProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  zIndex: number;
  onClick: () => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ title, onClose, onMinimize, zIndex, onClick, children }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onClick();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="absolute glass window-shadow rounded-xl overflow-hidden flex flex-col transition-all duration-300"
      style={{
        width: '700px',
        height: '500px',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: zIndex,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        opacity: 0.95,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={onClick}
    >
      {/* Title Bar */}
      <div 
        className="h-10 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing border-b border-white/10"
        onMouseDown={handleMouseDown}
      >
        <span className="text-white/80 text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          {title}
        </span>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-3 h-3 rounded-full bg-yellow-400/80 hover:bg-yellow-400 transition-colors"
          />
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 bg-black/10">
        {children}
      </div>
    </div>
  );
};

export default Window;
