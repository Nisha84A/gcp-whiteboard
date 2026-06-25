import { CatalogItem, CatalogItemType } from '@/shared/types';
import SubjectTable from '@/modules/whiteboard/components/tables/SubjectTable';
import LabTable from '@/modules/whiteboard/components/tables/LabTable';
import AETable from '@/modules/whiteboard/components/tables/AETable';
import ExposureTable from '@/modules/whiteboard/components/tables/ExposureTable';
import MedHistoryTable from '@/modules/whiteboard/components/tables/MedHistoryTable';
import ConmedTable from '@/modules/whiteboard/components/tables/ConmedTable';
import VisitGrid from '@/modules/whiteboard/components/tables/VisitGrid';
import AESummaryChart from '@/modules/whiteboard/components/charts/AESummaryChart';
import AETimelineChart from '@/modules/whiteboard/components/charts/AETimelineChart';
import LabTrendChart from '@/modules/whiteboard/components/charts/LabTrendChart';
import PatientProfile from '@/modules/whiteboard/components/panels/PatientProfile';

interface VisualizationProps {
  catalogItem: CatalogItem;
}

const componentMap: Partial<Record<CatalogItemType, React.ComponentType>> = {
  'subject-listing': SubjectTable,
  'patient-profile': PatientProfile,
  'ae-timeline': AETimelineChart,
  'ae-summary': AESummaryChart,
  'conmed': ConmedTable,
  'med-history': MedHistoryTable,
  'lab-trend': LabTrendChart,
  'lab-listing': LabTable,
  'vital-signs': LabTrendChart,
  'exposure': ExposureTable,
  'visit-grid': VisitGrid,
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
