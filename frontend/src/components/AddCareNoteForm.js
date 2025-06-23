/**
 * Component for adding a new care note
 */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createCareNoteAsync, selectCareNotesStatus } from '../features/careNotes/careNotesSlice';

/**
 * Component for adding a new care note
 * @returns {JSX.Element} The rendered component
 */
const AddCareNoteForm = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectCareNotesStatus);
  
  // Form state
  const [residentName, setResidentName] = useState('');
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [formError, setFormError] = useState('');
  
  /**
   * Handle form submission
   * @param {Event} e The form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!residentName || !content || !authorName) {
      setFormError('All fields are required');
      return;
    }
    
    // Clear form error
    setFormError('');
    
    // Create care note
    const careNote = {
      residentName,
      content,
      authorName,
      dateTime: new Date().toISOString(),
    };
    
    // Dispatch action to create care note
    dispatch(createCareNoteAsync(careNote));
    
    // Reset form
    setResidentName('');
    setContent('');
    setAuthorName('');
  };
  
  return (
    <div className="card">
      <h2>Add Care Note</h2>
      
      {formError && <div className="error">{formError}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="residentName">Resident Name</label>
          <input
            type="text"
            id="residentName"
            className="form-control"
            value={residentName}
            onChange={(e) => setResidentName(e.target.value)}
            disabled={status === 'loading'}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Note Content</label>
          <textarea
            id="content"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            disabled={status === 'loading'}
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="authorName">Author Name</label>
          <input
            type="text"
            id="authorName"
            className="form-control"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            disabled={status === 'loading'}
          />
        </div>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Adding...' : 'Add Note'}
        </button>
      </form>
    </div>
  );
};

export default AddCareNoteForm;
