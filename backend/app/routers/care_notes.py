"""
Router for care notes endpoints.
This module defines the API endpoints for care notes.
"""
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from ..models import CareNoteCreate, CareNoteResponse
from ..database import get_all_care_notes, add_care_note, get_care_note_by_id

router = APIRouter(
    prefix="/care-notes",
    tags=["care-notes"],
)

@router.get("", response_model=List[CareNoteResponse])
async def get_care_notes():
    """
    Get all care notes.
    
    Returns:
        List[CareNoteResponse]: A list of all care notes
    """
    return get_all_care_notes()

@router.post("", response_model=CareNoteResponse, status_code=status.HTTP_201_CREATED)
async def create_care_note(care_note: CareNoteCreate):
    """
    Create a new care note.
    
    Args:
        care_note (CareNoteCreate): The care note to create
        
    Returns:
        CareNoteResponse: The created care note
    """
    # Set the current date and time if not provided
    if not care_note.dateTime:
        care_note_dict = care_note.model_dump()
        care_note_dict["dateTime"] = datetime.now().isoformat() + "Z"
    else:
        care_note_dict = care_note.model_dump()
    
    # Add the care note to the database
    new_care_note = add_care_note(care_note_dict)
    
    return new_care_note

@router.get("/{note_id}", response_model=CareNoteResponse)
async def get_care_note(note_id: int):
    """
    Get a care note by ID.
    
    Args:
        note_id (int): The ID of the care note to retrieve
        
    Returns:
        CareNoteResponse: The care note
        
    Raises:
        HTTPException: If the care note is not found
    """
    care_note = get_care_note_by_id(note_id)
    if care_note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Care note with ID {note_id} not found"
        )
    return care_note
