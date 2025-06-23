/**
 * Redux store configuration
 */
import { configureStore } from '@reduxjs/toolkit';
import careNotesReducer from '../features/careNotes/careNotesSlice';

export const store = configureStore({
  reducer: {
    careNotes: careNotesReducer,
  },
});
