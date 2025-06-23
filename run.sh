#!/bin/bash

# Run the backend and frontend servers simultaneously

# Start the backend server
echo "Starting the backend server..."
cd backend
python run.py &
BACKEND_PID=$!

# Wait for the backend server to start
sleep 2

# Start the frontend server
echo "Starting the frontend server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Function to handle script termination
cleanup() {
  echo "Stopping servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit
}

# Register the cleanup function for script termination
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Both servers are running. Press Ctrl+C to stop."
wait
