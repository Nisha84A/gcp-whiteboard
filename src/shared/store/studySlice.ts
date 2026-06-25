import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Study {
  id: string;
  name: string;
  phase: string;
  design: string;
  subjects: number;
  status: string;
}

interface StudyState {
  studies: Study[];
  activeStudyId: string;
  isLoading: boolean;
}

const initialState: StudyState = {
  studies: [],
  activeStudyId: '',
  isLoading: false,
};

export const loadStudies = createAsyncThunk('study/loadStudies', async () => {
  const res = await fetch('/studies/index.json');
  return await res.json() as Study[];
});

const studySlice = createSlice({
  name: 'study',
  initialState,
  reducers: {
    setActiveStudy(state, action: PayloadAction<string>) {
      state.activeStudyId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStudies.pending, (state) => { state.isLoading = true; })
      .addCase(loadStudies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studies = action.payload;
      })
      .addCase(loadStudies.rejected, (state) => { state.isLoading = false; });
  },
});

export const { setActiveStudy } = studySlice.actions;
export default studySlice.reducer;
