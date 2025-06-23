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

// Wait for the index to be created before proceeding
const ensureIndexCreated = async () => {
  try {
    // Get the indexes to make sure they exist
    const result = await careNotesDB.getIndexes();
    const hasDateTimeIndex = result.indexes.some(
      index => index.def && index.def.fields && index.def.fields.some(field => field.dateTime)
    );
    
    // If the dateTime index doesn't exist, create it
    if (!hasDateTimeIndex) {
      await careNotesDB.createIndex({
        index: { fields: ['dateTime'] }
      });
    }
  } catch (error) {
    console.error('Error ensuring index:', error);
  }
};

// Call the function to ensure the index is created
ensureIndexCreated();

/**
 * Get all care notes from the database
 * @returns {Promise<Array>} A promise that resolves to an array of care notes
 */
export const getAllCareNotes = async () => {
  try {
    // First ensure the index exists
    await ensureIndexCreated();
    
    const result = await careNotesDB.find({
      selector: { dateTime: { $exists: true } },
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
    // First ensure the index exists
    await ensureIndexCreated();
    
    const result = await careNotesDB.find({
      selector: { dateTime: { $exists: true } },
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
    // Generate a unique ID for the care note if it doesn't have one
    const timestamp = Date.now();
    const id = careNote.id || `local_${timestamp}`;
    const docId = `care_note_${id}`;
    
    // Check if a document with this ID already exists
    let existingDoc = null;
    try {
      existingDoc = await careNotesDB.get(docId);
    } catch (error) {
      // Document doesn't exist, which is fine for a new note
      if (error.name !== 'not_found') {
        throw error;
      }
    }
    
    // Prepare the note with the correct ID fields
    const noteWithId = {
      ...careNote,
      _id: docId,
      id: id,
      dateTime: careNote.dateTime || new Date().toISOString()
    };
    
    // If the document exists, include its revision to update it
    if (existingDoc) {
      noteWithId._rev = existingDoc._rev;
    }
    
    // Add or update the care note in the database
    const result = await careNotesDB.put(noteWithId);
    
    // Return the care note with the ID and revision
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
    if (!Array.isArray(careNotes) || careNotes.length === 0) {
      console.log('No care notes to sync');
      return;
    }
    
    // Get all existing notes from the database
    const existingNotes = await getAllCareNotes();
    
    // Create a map of existing note IDs for quick lookup
    const existingNoteMap = new Map();
    existingNotes.forEach(note => {
      existingNoteMap.set(note.id.toString(), note);
    });
    
    // Process each note from the server
    for (const note of careNotes) {
      const noteId = note.id.toString();
      const docId = `care_note_${noteId}`;
      
      // Check if the note already exists in the database
      if (!existingNoteMap.has(noteId)) {
        try {
          // Try to get the document first to check if it exists
          try {
            await careNotesDB.get(docId);
            // If we get here, the document exists but wasn't in our map
            // We'll update it instead of adding it
            const existingDoc = await careNotesDB.get(docId);
            await careNotesDB.put({
              ...note,
              _id: docId,
              _rev: existingDoc._rev
            });
          } catch (getError) {
            // Document doesn't exist, so we can add it
            if (getError.name === 'not_found') {
              await careNotesDB.put({
                ...note,
                _id: docId
              });
            } else {
              throw getError;
            }
          }
        } catch (putError) {
          console.error(`Error adding/updating note ${noteId}:`, putError);
          // Continue with the next note even if this one fails
        }
      }
    }
    
    console.log(`Synced ${careNotes.length} care notes from server`);
  } catch (error) {
    console.error('Error syncing care notes from server:', error);
    throw error;
  }
};

export default careNotesDB;
