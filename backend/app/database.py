"""
Mock database module for the Care Notes application.
This module provides a simple in-memory database for storing care notes.
"""
from datetime import datetime
from typing import Dict, List, Optional
from uuid import uuid4

# Mock database for care notes
care_notes_db: List[Dict] = [
    {
        "id": 1,
        "residentName": "Alice Johnson",
        "dateTime": "2024-09-17T10:30:00Z",
        "content": "Medication administered as scheduled.",
        "authorName": "Nurse Smith"
    },
    {
        "id": 2,
        "residentName": "Bob Williams",
        "dateTime": "2024-09-17T11:45:00Z",
        "content": "Assisted with physical therapy exercises.",
        "authorName": "Dr. Brown"
    }
]

def get_all_care_notes() -> List[Dict]:
    """
    Retrieve all care notes from the database.
    
    Returns:
        List[Dict]: A list of all care notes
    """
    return care_notes_db

def add_care_note(care_note: Dict) -> Dict:
    """
    Add a new care note to the database.
    
    Args:
        care_note (Dict): The care note to add
        
    Returns:
        Dict: The added care note with an ID
    """
    # Generate a new ID (in a real DB this would be handled automatically)
    new_id = max([note["id"] for note in care_notes_db], default=0) + 1
    
    # Create a new care note with the generated ID
    new_care_note = {
        "id": new_id,
        **care_note
    }
    
    # Add the new care note to the database
    care_notes_db.append(new_care_note)
    
    return new_care_note

def get_care_note_by_id(note_id: int) -> Optional[Dict]:
    """
    Retrieve a care note by its ID.
    
    Args:
        note_id (int): The ID of the care note to retrieve
        
    Returns:
        Optional[Dict]: The care note if found, None otherwise
    """
    for note in care_notes_db:
        if note["id"] == note_id:
            return note
    return None
