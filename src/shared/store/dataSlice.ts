import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Subject, LabTest, AdverseEvent, Exposure, MedicalHistory, ConcomitantMed, Visit } from '@/shared/types';

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

export const loadData = createAsyncThunk('data/load', async (studyId: string) => {
  try {
    const res = await fetch(`/studies/${studyId}.json`);
    if (!res.ok) throw new Error('Study not found');
    return await res.json();
  } catch {
    return { subjects: [], labs: [], ae: [], ex: [], mh: [], cm: [], visits: [] };
  }
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
        state.subjects = action.payload.subjects || [];
        state.labs = action.payload.labs || [];
        state.ae = action.payload.ae || [];
        state.ex = action.payload.ex || [];
        state.mh = action.payload.mh || [];
        state.cm = action.payload.cm || [];
        state.visits = action.payload.visits || [];
      })
      .addCase(loadData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default dataSlice.reducer;
