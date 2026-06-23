import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
}

const initialState: DataState = {
  subjects: [],
  labs: [],
  ae: [],
  ex: [],
  mh: [],
  cm: [],
  visits: [],
  isLoading: false,
};

async function fetchJson<T>(url: string): Promise<T[]> {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export const loadData = createAsyncThunk('data/load', async () => {
  const [subjects, labs, ae, ex, mh, cm, visits] = await Promise.all([
    fetchJson<Subject>('/subjects.json'),
    fetchJson<LabTest>('/labs.json'),
    fetchJson<AdverseEvent>('/ae.json'),
    fetchJson<Exposure>('/ex.json'),
    fetchJson<MedicalHistory>('/mh.json'),
    fetchJson<ConcomitantMed>('/cm.json'),
    fetchJson<Visit>('/visits.json'),
  ]);
  return { subjects, labs, ae, ex, mh, cm, visits };
});

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subjects = action.payload.subjects;
        state.labs = action.payload.labs;
        state.ae = action.payload.ae;
        state.ex = action.payload.ex;
        state.mh = action.payload.mh;
        state.cm = action.payload.cm;
        state.visits = action.payload.visits;
      })
      .addCase(loadData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default dataSlice.reducer;
