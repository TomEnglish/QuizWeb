// Welcome message | Title of the Page | Instructions

//     - Figure out a way, that blends with the UI, to give the user instructions so they know exactly what to do
// A text box and label for the user's first name
// A dropdown and label for the question category - the user must have at least 4 choices that the API supports
// A dropdown and label for the question difficulty - use all three choices the API supports
// A submit button
// An error message, stopping the form submit, if any of these inputs aren't filled out or selected.  They are all required.
// An error message, stopping the form submit, if an answer isn't chosen. // NOTE: The input in the text box and dropdowns must be stored in a state object, NOT in three separate state variables  
import React, { useState } from 'react';
import './App.css';
//import Questions from './Questions.jsx';
import CategorySelect from './CategorySelect.jsx';
import Questions from './Questions.jsx';
export default function Welcome() {
//OBJ needs: firstName, category, difficulty
  // State to track the selected value ??need to move this to the Welcome or app component

    const difficulties = ['easy', 'medium', 'hard'];
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    // This function should trigger rendering Questions
    const handleQuizButton =()=>{
        setQuizSubmitted(true);
        console.log('Quiz submitted, rendering Questions component');
    }

    const [quizParams, setQuizParams] = useState({
        firstName: '',
        category: '',
        difficulty: ''
    });

    const [quizData, setQuizData] = useState({
        questions: [], // Use empty array
        correctAnswers: [], // Use empty array
        incorrectAnswers: [], // Use empty array
        possibleAnswers: [], // Use empty array
        userAnswers: [] // Use empty array
    });

    // triggerQuiz function is not needed if handleQuizButton does its job


    //Quiz request on Questions component


    return (
        //Welcome msg>
        
        <div>   
        <div className="welcome">
        <h1>Quiz Generator Web, Welcome!</h1>
        </div>
        
        <div className="instructions">
            <h3>How to Generate a Quiz:</h3>
            <p>Fill out your first name and select the category and difficulty of the quiz desired. The number of questions defaults to 10.</p> 
            <div className="inputForm">
                <label>First Name:</label>
                <input
                    type="text"
                    value={quizParams.firstName}
                    onChange={(x) =>
                        setQuizParams((prevState) => ({
                            ...prevState,
                            firstName: x.target.value
                        }))
                    }
                    required
                    placeholder="Enter your first name"
                />
            </div>
            <div className="category">
                <CategorySelect category={quizParams} setCategory={setQuizParams} />
            </div>
            <div className="difficulty">
                <label>Question Difficulty:</label> 
                
                <select 
                    value={quizParams.difficulty} 
                    onChange={(x)=>
                    setQuizParams((prevState) => ({
                        ...prevState,
                        difficulty: x.target.value
                    }))
                }>
                <option value="" disabled>Select an option:</option>    
                {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                        {difficulty}
                    </option>
                ))}
                </select>  
            </div>  
            {/* <p>{quizParams.firstName}</p> 
            <p>{quizParams.category}</p> 
            <p>{quizParams.difficulty}</p>  */}
            <p>Enter Criteria Above to Enable Request</p>
            {quizParams.firstName === '' || quizParams.category === '' || quizParams.difficulty === '' ? (
                <p className="error">Please fill out all fields.</p>
            ) : <button onClick={handleQuizButton}>Request Quiz</button>}
           {quizSubmitted && <Questions 
            quizParams={quizParams} 
            setQuizParams={setQuizParams}
            quizData={quizData} 
            setQuizData={setQuizData} 
            // fetchQuiz and setFetchQuiz props are removed
            />}
        </div>
   </div>
    
        
       
        //Text box and label for the user's first name
        //Dropdown and label for the question category
        //Dropdown and label for the question difficulty
        //Submit button
        //Error message, stopping the form submit, if any of these inputs aren't filled out or selected. They are all required.
    )




};