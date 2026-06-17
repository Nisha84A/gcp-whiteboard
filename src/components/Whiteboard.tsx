import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { WhiteboardItem as WhiteboardItemType, CatalogItem } from '@/types';
import WhiteboardItemComponent from './WhiteboardItem';

interface WhiteboardProps {
  items: WhiteboardItemType[];
  onDrop: (item: CatalogItem, x: number, y: number) => void;
  onRemove: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
}

export default function Whiteboard({ items, onDrop, onRemove, onMove, onResize }: WhiteboardProps) {
  const whiteboardRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'catalogItem',
      drop: (item: CatalogItem, monitor) => {
        const clientOffset = monitor.getClientOffset();
        const bounds = whiteboardRef.current?.getBoundingClientRect();
        if (clientOffset && bounds) {
          const x = Math.max(0, clientOffset.x - bounds.left);
          const y = Math.max(0, clientOffset.y - bounds.top);
          onDrop(item, x, y);
        }
      },
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }),
    [onDrop]
  );

  drop(whiteboardRef);

  return (
    <div
      ref={whiteboardRef}
      className={`flex-1 overflow-hidden relative transition-colors
        bg-slate-900/50 dark:bg-slate-900/50
        ${isOver ? 'bg-cyan-900/20' : ''}`}
      style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      {items.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-500">Drop items here from the catalog</p>
            <p className="text-sm text-slate-600 mt-1">Drag listings or visualizations to build your review board</p>
          </div>
        </div>
      )}

      {items.map((item) => (
        <WhiteboardItemComponent
          key={item.id}
          item={item}
          onRemove={onRemove}
          onMove={onMove}
          onResize={onResize}
        />
      ))}
    </div>
  );
}
