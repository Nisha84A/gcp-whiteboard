import { useState, useEffect } from 'react';
import { WhiteboardItem as WhiteboardItemType, CatalogItem } from '@/types';
import { buildCatalogItems } from '@/utils/dataLoader';
import { useDataStore } from '@/stores/dataStore';
import Header from '@/components/Header';
import PageFilters from '@/components/PageFilters';
import Navigation from '@/components/Navigation';
import Whiteboard from '@/components/Whiteboard';

export default function Dashboard() {
  const [catalogItems] = useState<CatalogItem[]>(buildCatalogItems);
  const [whiteboardItems, setWhiteboardItems] = useState<WhiteboardItemType[]>([]);
  const { load, isLoading } = useDataStore();

  useEffect(() => {
    load();
  }, [load]);

  const handleDrop = (catalogItem: CatalogItem, x: number, y: number) => {
    const newItem: WhiteboardItemType = {
      id: `wb-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      catalogItem,
      x: Math.max(0, x - 200),
      y: Math.max(0, y - 20),
      width: catalogItem.visualizationType === 'chart' ? 500 : 600,
      height: 350,
    };
    setWhiteboardItems((prev) => [...prev, newItem]);
  };

  const handleRemove = (id: string) => {
    setWhiteboardItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMove = (id: string, x: number, y: number) => {
    setWhiteboardItems((prev) => prev.map((item) => (item.id === id ? { ...item, x, y } : item)));
  };

  const handleResize = (id: string, width: number, height: number) => {
    setWhiteboardItems((prev) => prev.map((item) => (item.id === id ? { ...item, width, height } : item)));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <PageFilters />
      <div className="flex flex-1 overflow-hidden">
        <Navigation items={catalogItems} loading={isLoading} />
        <Whiteboard
          items={whiteboardItems}
          onDrop={handleDrop}
          onRemove={handleRemove}
          onMove={handleMove}
          onResize={handleResize}
        />
      </div>
    </div>
  );
}
