import { CatalogItem, CatalogItemType } from '@/types';
import SubjectTable from './tables/SubjectTable';
import LabTable from './tables/LabTable';
import AETable from './tables/AETable';
import ExposureTable from './tables/ExposureTable';
import MedHistoryTable from './tables/MedHistoryTable';
import ConmedTable from './tables/ConmedTable';
import AESummaryChart from './charts/AESummaryChart';
import AETimelineChart from './charts/AETimelineChart';
import LabTrendChart from './charts/LabTrendChart';

interface VisualizationProps {
  catalogItem: CatalogItem;
}

const componentMap: Record<CatalogItemType, React.ComponentType> = {
  'subject-listing': SubjectTable,
  'patient-profile': SubjectTable,
  'ae-timeline': AETimelineChart,
  'ae-summary': AESummaryChart,
  'conmed': ConmedTable,
  'med-history': MedHistoryTable,
  'lab-trend': LabTrendChart,
  'lab-listing': LabTable,
  'vital-signs': LabTrendChart,
  'exposure': ExposureTable,
};

export default function Visualization({ catalogItem }: VisualizationProps) {
  const Component = componentMap[catalogItem.type];

  if (!Component) {
    return <div className="text-slate-400 text-sm p-4">Unknown visualization type</div>;
  }

  return (
    <div className="w-full h-full">
      <Component />
    </div>
  );
}
