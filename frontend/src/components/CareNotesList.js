/**
 * Component for displaying a list of care notes
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllCareNotes, selectCareNotesStatus, selectCareNotesError } from '../features/careNotes/careNotesSlice';

/**
 * Format a date string to a more readable format
 * @param {string} dateString The date string to format
 * @returns {string} The formatted date string
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

/**
 * Component for displaying a single care note
 * @param {Object} props The component props
 * @param {Object} props.note The care note to display
 * @returns {JSX.Element} The rendered component
 */
const CareNoteItem = ({ note }) => {
  return (
    <div className="card care-note">
      <div className="care-note-header">
        <h3>{note.residentName}</h3>
        <span>{formatDate(note.dateTime)}</span>
      </div>
      <div className="care-note-content">
        <p>{note.content}</p>
      </div>
      <div className="care-note-author">
        <p>By: {note.authorName}</p>
      </div>
    </div>
  );
};

/**
 * Component for displaying a list of care notes
 * @returns {JSX.Element} The rendered component
 */
const CareNotesList = () => {
  const notes = useSelector(selectAllCareNotes);
  const status = useSelector(selectCareNotesStatus);
  const error = useSelector(selectCareNotesError);

  // Show loading state
  if (status === 'loading') {
    return <div className="loading">Loading care notes...</div>;
  }

  // Show error state
  if (status === 'failed') {
    return <div className="error">Error: {error}</div>;
  }

  // Show empty state
  if (notes.length === 0) {
    return <div>No care notes found.</div>;
  }

  // Show the list of care notes
  return (
    <div>
      <h2>Recent Care Notes</h2>
      {notes.map((note) => (
        <CareNoteItem key={note.id} note={note} />
      ))}
    </div>
  );
};

export default CareNotesList;
