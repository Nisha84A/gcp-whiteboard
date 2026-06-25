import { useState, useEffect } from 'react';
import { WhiteboardItem as WhiteboardItemType, CatalogItem } from '@/shared/types';
import { buildCatalogItems } from '@/modules/whiteboard/utils/dataLoader';
import { useAppDispatch, useAppSelector } from '@/shared/store';
import { loadData } from '@/shared/store/dataSlice';
import Header from '@/shared/components/Header';
import PageFilters from '@/modules/whiteboard/components/PageFilters';
import Navigation from '@/modules/whiteboard/components/Navigation';
import Whiteboard from '@/modules/whiteboard/components/Whiteboard';
import QueryPanel from '@/modules/whiteboard/components/QueryPanel';
import QueryModal from '@/modules/whiteboard/components/QueryModal';

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
  const [queryPrefilledSubject, setQueryPrefilledSubject] = useState<string | undefined>();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.data.isLoading);
  const user = useAppSelector((state) => state.auth.user);

  const activeStudyId = useAppSelector((state) => state.study.activeStudyId);

  useEffect(() => {
    if (activeStudyId) {
      dispatch(loadData(activeStudyId));
    }
    fetch('/queries.json').then((r) => r.json()).then(setQueries);
  }, [dispatch, activeStudyId]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.subjid) {
        setQueryPrefilledSubject(detail.subjid);
      }
      setShowQueryModal(true);
    };
    window.addEventListener('open-query-modal', handler);
    return () => window.removeEventListener('open-query-modal', handler);
  }, []);

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
          onClose={() => { setShowQueryModal(false); setQueryPrefilledSubject(undefined); }}
          onSubmit={handleSubmitQuery}
          prefilledSubject={queryPrefilledSubject}
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
