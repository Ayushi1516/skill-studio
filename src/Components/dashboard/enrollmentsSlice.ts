import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Enrollment } from '../../types/interfaces';
import type { RootState } from './store';
import toast from 'react-hot-toast';

interface EnrollmentsState {
  items: Enrollment[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: EnrollmentsState = {
  items: [],
  loading: 'idle',
  error: null,
};

export const fetchEnrollments = createAsyncThunk(
  'enrollments/fetchEnrollments',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3001/enrollments?userId=${userId}&_expand=course`);
      if (!response.ok) throw new Error('Server error');
      const data: Enrollment[] = await response.json();
      return data.map((e: Enrollment) => ({ ...e, completedChapters: e.completedChapters || [] }));
    } catch (error) {
      return rejectWithValue('Failed to load your courses.');
    }
  }
);

export const toggleChapter = createAsyncThunk(
  'enrollments/toggleChapter',
  async ({ enrollmentId, chapterId }: { enrollmentId: number; chapterId: number }, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as RootState;
    const originalEnrollments = state.enrollments.items;
    const enrollment = originalEnrollments.find(e => e.id === enrollmentId);

    if (!enrollment) {
      return rejectWithValue('Enrollment not found.');
    }

    const isCompleted = enrollment.completedChapters.includes(chapterId);
    const newCompletedChapters = isCompleted
      ? enrollment.completedChapters.filter(id => id !== chapterId)
      : [...enrollment.completedChapters, chapterId];

    // Optimistically update the UI
    dispatch(enrollmentsSlice.actions.updateEnrollment({ id: enrollmentId, changes: { completedChapters: newCompletedChapters } }));

    try {
      const response = await fetch(`http://localhost:3001/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completedChapters: newCompletedChapters }),
      });
      if (!response.ok) throw new Error('Failed to update progress on the server.');
      // The optimistic update is already correct, so we don't need to do anything on success.
      return { enrollmentId, completedChapters: newCompletedChapters };
    } catch (error) {
      // If the server update fails, roll back the UI change
      dispatch(enrollmentsSlice.actions.setEnrollments(originalEnrollments));
      return rejectWithValue('Failed to update progress. Please try again.');
    }
  }
);

export const enrollmentsSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    setEnrollments: (state, action: PayloadAction<Enrollment[]>) => {
      state.items = action.payload;
    },
    updateEnrollment: (state, action: PayloadAction<{ id: number; changes: Partial<Enrollment> }>) => {
      const { id, changes } = action.payload;
      const index = state.items.findIndex(e => e.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...changes };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => { state.loading = 'pending'; })
      .addCase(fetchEnrollments.fulfilled, (state, action) => { state.loading = 'succeeded'; state.items = action.payload; })
      .addCase(fetchEnrollments.rejected, (state, action) => { state.loading = 'failed'; state.error = action.payload as string; toast.error(action.payload as string); })
      .addCase(toggleChapter.rejected, (_, action) => { toast.error(action.payload as string); });
  },
});

export default enrollmentsSlice.reducer;