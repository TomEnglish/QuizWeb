# React Trivia Quiz App

This is a simple quiz application built with React and Vite. It allows users to test their knowledge by answering multiple-choice questions fetched from the Open Trivia Database API. Users can select the category and difficulty level for the quiz.

## Features

*   Select quiz category and difficulty.
*   Fetch and display multiple-choice questions from the Open Trivia Database API.
*   Submit answers and receive immediate feedback (though feedback display isn't explicitly mentioned, submitting answers is a core feature).
*   View results, including the final score and a list of questions with correct/incorrect answers.
*   Option to start a new quiz using the same category and difficulty settings.
*   Option to start over completely with new settings.
*   Handles API errors, including rate limiting.
*   Automatically scrolls the view to the results section when the quiz is finished and back to the questions when starting a new quiz with the same settings.
*   Basic CSS styling for presentation.

## Setup and Running

To run this project locally:

1.  **Navigate to the project directory:**
    ```bash
    cd trivia-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:5173` (or another port if 5173 is busy).

## Project Structure

The main application code resides in the `src` directory. Key components include:

*   `main.jsx`: The entry point of the React application, responsible for rendering the initial `Welcome` component.
*   `Welcome.jsx`: The initial screen where users select the quiz category and difficulty, and which renders the `Questions` component upon selection.
*   `CategorySelect.jsx`: A reusable component for the category dropdown within `Welcome.jsx`.
*   `Questions.jsx`: Displays the quiz questions, handles answer selection and submission.
*   `Results.jsx`: Displays the final score and the list of questions with answers after the quiz is completed.
*   `App.css` / `index.css`: Files containing the CSS styles for the application.
