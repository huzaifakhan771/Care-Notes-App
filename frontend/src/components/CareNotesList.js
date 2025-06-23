/**
 * Component for displaying a list of care notes
 */
import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllCareNotes, selectCareNotesStatus, selectCareNotesError } from '../features/careNotes/careNotesSlice';
import './CareNotesList.css';

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
  
  // State for the search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter notes based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim() || notes.length === 0) {
      return notes;
    }
    
    const query = searchQuery.toLowerCase().trim();
    console.log('Filtering notes with query:', query);
    
    const filtered = notes.filter(note => {
      // Smart search: check if the query is contained in the resident name, content, or author name
      const matchesResident = note.residentName.toLowerCase().includes(query);
      const matchesContent = note.content.toLowerCase().includes(query);
      const matchesAuthor = note.authorName.toLowerCase().includes(query);
      
      console.log(`Note ${note.id} - Matches: resident=${matchesResident}, content=${matchesContent}, author=${matchesAuthor}`);
      
      return matchesResident || matchesContent || matchesAuthor;
    });
    
    console.log('Filtered notes count:', filtered.length);
    return filtered;
  }, [notes, searchQuery]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    console.log('Search input changed:', e.target.value);
    setSearchQuery(e.target.value);
  };

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
      <h2 className="page-title">Recent Care Notes</h2>
      <div className="search-bar-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by resident, content, or author..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search care notes"
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div className="search-info">
        {searchQuery && (
          <p>
            Showing {filteredNotes.length} {filteredNotes.length === 1 ? 'result' : 'results'} for: "{searchQuery}"
          </p>
        )}
      </div>
      {filteredNotes.map((note) => (
        <CareNoteItem key={note.id} note={note} />
      ))}
    </div>
  );
};

export default CareNotesList;
