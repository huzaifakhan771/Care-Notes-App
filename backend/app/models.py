"""
Pydantic models for the Care Notes application.
These models define the data structures used in the API.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class CareNoteBase(BaseModel):
    """Base model for care notes with common fields."""
    residentName: str = Field(..., description="Name of the resident")
    content: str = Field(..., description="Content of the care note")
    authorName: str = Field(..., description="Name of the author of the note")

class CareNoteCreate(CareNoteBase):
    """Model for creating a new care note."""
    dateTime: Optional[str] = Field(None, description="Date and time of the note (ISO format)")

class CareNoteResponse(CareNoteBase):
    """Model for care note responses from the API."""
    id: int = Field(..., description="Unique identifier for the care note")
    dateTime: str = Field(..., description="Date and time of the note (ISO format)")

    class Config:
        """Pydantic configuration."""
        from_attributes = True
