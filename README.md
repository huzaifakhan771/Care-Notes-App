# Care Notes App

A comprehensive care notes application for a nursing home that allows staff to view and add care notes for residents. This application features a React frontend with Redux Toolkit for state management and PouchDB for offline storage, along with a FastAPI backend.

## Features

- View a list of care notes for residents
- Add new care notes
- Offline-first approach with local database synchronization
- Responsive design that works on desktop and mobile devices

## Tech Stack

### Frontend
- React for UI components
- Redux Toolkit for state management
- PouchDB for offline storage
- Axios for API communication

### Backend
- FastAPI for the REST API
- Pydantic for data validation
- Mock database for data storage

## Project Structure

```
Care-Notes-App/
├── backend/             # FastAPI backend
│   ├── app/             # Application package
│   │   ├── routers/     # API routes
│   │   ├── database.py  # Mock database
│   │   ├── main.py      # Main FastAPI application
│   │   └── models.py    # Pydantic models
│   ├── requirements.txt # Python dependencies
│   └── run.py           # Script to run the backend
└── frontend/            # React frontend
    ├── public/          # Static files
    └── src/             # Source code
        ├── api/         # API services
        ├── app/         # Redux store
        ├── components/  # React components
        ├── db/          # PouchDB database
        ├── features/    # Redux slices
        └── App.js       # Main App component
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Care-Notes-App.git
   cd Care-Notes-App
   ```

2. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   python run.py
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Data Flow

1. The frontend polls the backend API every 60 seconds to fetch care notes
2. Fetched notes are stored in the local PouchDB database
3. The most recent 5 notes are loaded from PouchDB into Redux
4. The UI displays the notes from the Redux store
5. When adding a new note, it's sent to the backend API and also stored locally

## API Endpoints

- `GET /care-notes` - Get all care notes
- `POST /care-notes` - Create a new care note
- `GET /care-notes/{note_id}` - Get a specific care note by ID
