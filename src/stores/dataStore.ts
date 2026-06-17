import { create } from 'zustand';
import { Subject, LabTest, AdverseEvent, Exposure, MedicalHistory, ConcomitantMed, Visit } from '@/types';

interface DataState {
  subjects: Subject[];
  labs: LabTest[];
  ae: AdverseEvent[];
  ex: Exposure[];
  mh: MedicalHistory[];
  cm: ConcomitantMed[];
  visits: Visit[];
  isLoading: boolean;
  load: () => Promise<void>;
}

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export const useDataStore = create<DataState>()((set) => ({
  subjects: [],
  labs: [],
  ae: [],
  ex: [],
  mh: [],
  cm: [],
  visits: [],
  isLoading: false,

  load: async () => {
    set({ isLoading: true });
    const [subjects, labs, ae, ex, mh, cm, visits] = await Promise.all([
      fetchJson<Subject>('/subjects.json'),
      fetchJson<LabTest>('/labs.json'),
      fetchJson<AdverseEvent>('/ae.json'),
      fetchJson<Exposure>('/ex.json'),
      fetchJson<MedicalHistory>('/mh.json'),
      fetchJson<ConcomitantMed>('/cm.json'),
      fetchJson<Visit>('/visits.json'),
    ]);
    set({ subjects, labs, ae, ex, mh, cm, visits, isLoading: false });
  },
}));
