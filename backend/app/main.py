"""
Main FastAPI application for the Care Notes API.
This module sets up the FastAPI application and includes the routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import care_notes

# Create the FastAPI application
app = FastAPI(
    title="Care Notes API",
    description="API for managing care notes in a nursing home",
    version="1.0.0",
)

# Add CORS middleware to allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, this should be restricted to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the care notes router
app.include_router(care_notes.router)

@app.get("/")
async def root():
    """
    Root endpoint that returns a welcome message.
    
    Returns:
        dict: A welcome message
    """
    return {"message": "Welcome to the Care Notes API"}
