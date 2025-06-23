"""
Run script for the Care Notes API.
This script starts the FastAPI application using Uvicorn.
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
