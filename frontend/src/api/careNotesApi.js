/**
 * API service for care notes
 */
import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://localhost:8000';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all care notes from the API
 * @returns {Promise<Array>} A promise that resolves to an array of care notes
 */
export const fetchCareNotes = async () => {
  try {
    const response = await api.get('/care-notes');
    return response.data;
  } catch (error) {
    console.error('Error fetching care notes:', error);
    throw error;
  }
};

/**
 * Create a new care note
 * @param {Object} careNote The care note to create
 * @returns {Promise<Object>} A promise that resolves to the created care note
 */
export const createCareNote = async (careNote) => {
  try {
    const response = await api.post('/care-notes', careNote);
    return response.data;
  } catch (error) {
    console.error('Error creating care note:', error);
    throw error;
  }
};

export default api;
