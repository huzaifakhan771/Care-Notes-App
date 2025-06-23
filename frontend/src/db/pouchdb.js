/**
 * PouchDB database module for offline storage
 */
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

// Register the find plugin
PouchDB.plugin(PouchDBFind);

// Create the care notes database
const careNotesDB = new PouchDB('care_notes');

// Create indexes for querying
careNotesDB.createIndex({
  index: { fields: ['dateTime'] }
}).catch(err => console.error('Error creating index:', err));

/**
 * Get all care notes from the database
 * @returns {Promise<Array>} A promise that resolves to an array of care notes
 */
export const getAllCareNotes = async () => {
  try {
    const result = await careNotesDB.find({
      selector: {},
      sort: [{ dateTime: 'desc' }]
    });
    return result.docs;
  } catch (error) {
    console.error('Error getting care notes:', error);
    throw error;
  }
};

/**
 * Get the most recent care notes from the database
 * @param {number} limit The maximum number of care notes to return
 * @returns {Promise<Array>} A promise that resolves to an array of care notes
 */
export const getRecentCareNotes = async (limit = 5) => {
  try {
    const result = await careNotesDB.find({
      selector: {},
      sort: [{ dateTime: 'desc' }],
      limit
    });
    return result.docs;
  } catch (error) {
    console.error('Error getting recent care notes:', error);
    throw error;
  }
};

/**
 * Add a care note to the database
 * @param {Object} careNote The care note to add
 * @returns {Promise<Object>} A promise that resolves to the added care note
 */
export const addCareNote = async (careNote) => {
  try {
    // Generate a unique ID for the care note
    const id = `care_note_${Date.now()}`;
    
    // Add the ID and _id fields to the care note
    const noteWithId = {
      ...careNote,
      _id: id,
      id: careNote.id || id
    };
    
    // Add the care note to the database
    const result = await careNotesDB.put(noteWithId);
    
    // Return the care note with the ID
    return {
      ...noteWithId,
      _rev: result.rev
    };
  } catch (error) {
    console.error('Error adding care note:', error);
    throw error;
  }
};

/**
 * Sync care notes from the server to the local database
 * @param {Array} careNotes The care notes to sync
 * @returns {Promise<void>} A promise that resolves when the sync is complete
 */
export const syncCareNotesFromServer = async (careNotes) => {
  try {
    // Get all care notes from the database
    const existingNotes = await getAllCareNotes();
    
    // Create a map of existing note IDs
    const existingNoteIds = new Set(existingNotes.map(note => note.id));
    
    // Filter out notes that already exist in the database
    const newNotes = careNotes.filter(note => !existingNoteIds.has(note.id));
    
    // Add each new note to the database
    for (const note of newNotes) {
      await addCareNote({
        ...note,
        _id: `care_note_${note.id}`
      });
    }
  } catch (error) {
    console.error('Error syncing care notes from server:', error);
    throw error;
  }
};

export default careNotesDB;
