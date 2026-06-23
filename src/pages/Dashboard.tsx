import { useState, useEffect } from 'react';
import { WhiteboardItem as WhiteboardItemType, CatalogItem } from '@/types';
import { buildCatalogItems } from '@/utils/dataLoader';
import { useAppDispatch, useAppSelector } from '@/store';
import { loadData } from '@/store/dataSlice';
import Header from '@/components/Header';
import PageFilters from '@/components/PageFilters';
import Navigation from '@/components/Navigation';
import Whiteboard from '@/components/Whiteboard';
import QueryPanel from '@/components/QueryPanel';
import QueryModal from '@/components/QueryModal';

interface Query {
  id: string;
  subjid: string;
  domain: string;
  variable: string;
  issue: string;
  priority: string;
  status: string;
  raisedBy: string;
  raisedDate: string;
}

export default function Dashboard() {
  const [catalogItems] = useState<CatalogItem[]>(buildCatalogItems);
  const [whiteboardItems, setWhiteboardItems] = useState<WhiteboardItemType[]>([]);
  const [queries, setQueries] = useState<Query[]>([]);
  const [showQueries, setShowQueries] = useState(false);
  const [showQueryModal, setShowQueryModal] = useState(false);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.data.isLoading);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(loadData());
    fetch('/queries.json').then((r) => r.json()).then(setQueries);
  }, [dispatch]);

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

  const handleSubmitQuery = (newQuery: { subjid: string; domain: string; variable: string; issue: string; priority: string }) => {
    const query: Query = {
      id: `Q${String(queries.length + 1).padStart(3, '0')}`,
      ...newQuery,
      status: 'OPEN',
      raisedBy: user?.name ? `Dr. ${user.name.split(' ').pop()}` : 'Unknown',
      raisedDate: new Date().toISOString().split('T')[0],
    };
    setQueries((prev) => [query, ...prev]);
    setShowQueryModal(false);
    setShowQueries(true);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      <Header
        queryCount={queries.filter((q) => q.status === 'OPEN').length}
        onQueryClick={() => setShowQueries(!showQueries)}
      />
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
        {showQueries && (
          <QueryPanel
            queries={queries}
            onClose={() => setShowQueries(false)}
            onNewQuery={() => setShowQueryModal(true)}
          />
        )}
      </div>

      {showQueryModal && (
        <QueryModal
          onClose={() => setShowQueryModal(false)}
          onSubmit={handleSubmitQuery}
        />
      )}

      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 px-3 py-1.5 bg-navy-900/80 border border-slate-700 rounded text-slate-400 text-xs backdrop-blur-sm">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        PERFICIENT CONFIDENTIAL
      </div>
    </div>
  );
}
