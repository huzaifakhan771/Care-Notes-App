/**
 * Main App component
 */
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCareNotesAsync } from './features/careNotes/careNotesSlice';
import CareNotesList from './components/CareNotesList';
import AddCareNoteForm from './components/AddCareNoteForm';

/**
 * Main App component
 * @returns {JSX.Element} The rendered component
 */
const App = () => {
  const dispatch = useDispatch();
  const pollingIntervalRef = useRef(null);
  
  // Fetch care notes on component mount
  useEffect(() => {
    // Fetch care notes initially
    dispatch(fetchCareNotesAsync());
    
    // Set up polling interval (every 60 seconds)
    pollingIntervalRef.current = setInterval(() => {
      dispatch(fetchCareNotesAsync());
    }, 60000);
    
    // Clean up interval on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [dispatch]);
  
  return (
    <div className="container">
      <header className="header">
        <h1>Care Notes Application</h1>
      </header>
      
      <div className="row">
        <div className="column">
          <CareNotesList />
        </div>
        
        <div className="column">
          <AddCareNoteForm />
        </div>
      </div>
    </div>
  );
};

export default App;
