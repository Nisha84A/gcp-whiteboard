import { useState, useRef } from 'react';
import { X, BarChart3, List } from 'lucide-react';
import { Resizable } from 're-resizable';
import { WhiteboardItem as WhiteboardItemType } from '@/types';
import Visualization from './Visualization';

interface WhiteboardItemProps {
  item: WhiteboardItemType;
  onRemove: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onMove: (id: string, x: number, y: number) => void;
}

export default function WhiteboardItemComponent({ item, onRemove, onResize, onMove }: WhiteboardItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current?.parentElement) {
      const parentRect = containerRef.current.parentElement.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - parentRect.left - dragOffset.x);
      const newY = Math.max(0, e.clientY - parentRect.top - dragOffset.y);
      onMove(item.id, newX, newY);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const isChart = item.catalogItem.visualizationType === 'chart';
  const Icon = isChart ? BarChart3 : List;

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', left: `${item.x}px`, top: `${item.y}px` }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Resizable
        defaultSize={{ width: item.width, height: item.height }}
        minWidth={350}
        minHeight={280}
        onResizeStop={(_e, _dir, ref) => {
          onResize(item.id, ref.offsetWidth, ref.offsetHeight);
        }}
        className="rounded-lg shadow-2xl border border-slate-700 overflow-hidden"
        style={{ background: '#1a2744' }}
      >
        <div className="w-full h-full flex flex-col">
          <div
            className="drag-handle flex items-center justify-between px-3 py-2 bg-navy-900 border-b border-slate-700 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${isChart ? 'text-teal-400' : 'text-cyan-400'}`} />
              <span className="text-sm font-semibold text-white truncate">{item.catalogItem.label}</span>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="p-1 hover:bg-red-900/50 rounded text-slate-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-2">
            <Visualization catalogItem={item.catalogItem} />
          </div>
        </div>
      </Resizable>
    </div>
  );
}
