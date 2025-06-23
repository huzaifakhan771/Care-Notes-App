/**
 * Redux slice for care notes
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCareNotes, createCareNote } from '../../api/careNotesApi';
import { getRecentCareNotes, syncCareNotesFromServer, addCareNote } from '../../db/pouchdb';

// Initial state
const initialState = {
  notes: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  syncStatus: 'idle', // 'idle' | 'syncing' | 'succeeded' | 'failed'
  syncError: null,
};

// Async thunk for fetching care notes from the API and syncing to local DB
export const fetchCareNotesAsync = createAsyncThunk(
  'careNotes/fetchCareNotes',
  async (_, { rejectWithValue }) => {
    try {
      // Fetch care notes from the API
      const careNotes = await fetchCareNotes();
      
      // Sync care notes to the local database
      await syncCareNotesFromServer(careNotes);
      
      // Get the most recent 5 care notes from the local database
      const recentNotes = await getRecentCareNotes(5);
      
      return recentNotes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for creating a new care note
export const createCareNoteAsync = createAsyncThunk(
  'careNotes/createCareNote',
  async (careNote, { rejectWithValue }) => {
    try {
      // Create the care note on the server
      const createdNote = await createCareNote(careNote);
      
      // Add the care note to the local database
      await addCareNote(createdNote);
      
      // Get the most recent 5 care notes from the local database
      const recentNotes = await getRecentCareNotes(5);
      
      return recentNotes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the care notes slice
const careNotesSlice = createSlice({
  name: 'careNotes',
  initialState,
  reducers: {
    // Reducer for updating the notes from the local database
    updateNotesFromLocalDB: (state, action) => {
      state.notes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch care notes
      .addCase(fetchCareNotesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCareNotesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload;
      })
      .addCase(fetchCareNotesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Create care note
      .addCase(createCareNoteAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCareNoteAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload;
      })
      .addCase(createCareNoteAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions
export const { updateNotesFromLocalDB } = careNotesSlice.actions;

// Export selectors
export const selectAllCareNotes = (state) => state.careNotes.notes;
export const selectCareNotesStatus = (state) => state.careNotes.status;
export const selectCareNotesError = (state) => state.careNotes.error;

// Export reducer
export default careNotesSlice.reducer;
