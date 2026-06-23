export interface Subject {
  id: string;
  arm: string;
  age: number;
  sex: string;
  site: string;
  status: string;
  enrol: number;
  vital: string;
  dthdy?: number;
  dthcaus?: string;
}

export interface LabTest {
  subjid: string;
  lbtest: string;
  lbstresn: number;
  lbstresu: string;
  lbdy: number;
  lbnrlo: number;
  lbnrhi: number;
}

export interface AdverseEvent {
  subjid: string;
  aeterm: string;
  aesev: string;
  aestdy: number;
  aeendy: number;
  aerel: string;
}

export interface Exposure {
  subjid: string;
  extrt: string;
  exdose: number;
  exdosu: string;
  exroute: string;
  exdosfrq: string;
  exstdy: number;
  exendy: number;
  excomp: boolean;
}

export interface MedicalHistory {
  subjid: string;
  mhdecod: string;
  mhcat: string;
  mhoccur: string;
  mhstat: string;
}

export interface ConcomitantMed {
  subjid: string;
  cmtrt: string;
  cmdose: number;
  cmdosu: string;
  cmroute: string;
  cmstdy: number;
  cmendy: number;
  cmongo: boolean;
}

export interface Visit {
  subjid: string;
  visit: string;
  visitdy: number;
  complete: boolean;
}

export type DataType = 'subjects' | 'labs' | 'ae' | 'ex' | 'mh' | 'cm' | 'visits';

export type CatalogItemType =
  | 'subject-listing'
  | 'patient-profile'
  | 'ae-timeline'
  | 'ae-summary'
  | 'conmed'
  | 'med-history'
  | 'lab-trend'
  | 'lab-listing'
  | 'vital-signs'
  | 'exposure'
  | 'visit-grid'
  | 'dm-concierge'
  | 'site-enrollment';

export interface CatalogItem {
  id: string;
  label: string;
  description: string;
  type: CatalogItemType;
  category: string;
  visualizationType: 'table' | 'chart';
}

export interface WhiteboardItem {
  id: string;
  catalogItem: CatalogItem;
  x: number;
  y: number;
  width: number;
  height: number;
}
