import { useState, useRef, useEffect, useCallback } from 'react';
import { X, BarChart3, List } from 'lucide-react';
import { Resizable } from 're-resizable';
import { WhiteboardItem as WhiteboardItemType } from '@/types';
import { useAppSelector } from '@/store';
import Visualization from './Visualization';

interface WhiteboardItemProps {
  item: WhiteboardItemType;
  onRemove: (id: string) => void;
  onResize: (id: string, width: number, height: number) => void;
  onMove: (id: string, x: number, y: number) => void;
  onFocus: (id: string) => void;
  zIndex: number;
}

export default function WhiteboardItemComponent({ item, onRemove, onResize, onMove, onFocus, zIndex }: WhiteboardItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current?.parentElement) return;
    e.preventDefault();
    const parentRect = containerRef.current.parentElement.getBoundingClientRect();
    const newX = Math.max(0, e.clientX - parentRect.left - dragOffsetRef.current.x);
    const newY = Math.max(0, e.clientY - parentRect.top - dragOffsetRef.current.y);
    onMove(item.id, newX, newY);
  }, [isDragging, item.id, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const selectedIds = useAppSelector((state) => state.filter.filters.subjectIds);
  const isChart = item.catalogItem.visualizationType === 'chart';
  const Icon = isChart ? BarChart3 : List;

  return (
    <div
      ref={containerRef}
      onMouseDown={() => onFocus(item.id)}
      style={{ position: 'absolute', left: `${item.x}px`, top: `${item.y}px`, zIndex: isDragging ? 9999 : zIndex }}
    >
      <Resizable
        defaultSize={{ width: item.width, height: item.height }}
        minWidth={350}
        minHeight={280}
        onResizeStop={(_e, _dir, ref) => {
          onResize(item.id, ref.offsetWidth, ref.offsetHeight);
        }}
        className="rounded-lg shadow-2xl border border-slate-700"
        style={{ background: '#1a2744', overflow: 'visible' }}
      >
        <div className="w-full h-full flex flex-col overflow-hidden rounded-lg">
          <div
            className="drag-handle flex items-center justify-between px-3 py-2 bg-navy-900 border-b border-slate-700 cursor-grab active:cursor-grabbing select-none shrink-0"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${isChart ? 'text-teal-400' : 'text-cyan-400'}`} />
              <span className="text-sm font-semibold text-white truncate">{item.catalogItem.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 && (
                <span className="text-[9px] font-semibold px-2 py-0.5 bg-cyan-900/50 text-cyan-400 border border-cyan-700 rounded">
                  {selectedIds.length === 1 ? selectedIds[0] : `${selectedIds.length} subjects`}
                </span>
              )}
              <button
                onClick={() => onRemove(item.id)}
                className="p-1 hover:bg-red-900/50 rounded text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
            <Visualization catalogItem={item.catalogItem} />
          </div>
        </div>
      </Resizable>
    </div>
  );
}
