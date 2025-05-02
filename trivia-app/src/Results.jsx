// 3. ☑️ Results Section - When the user submits their answers, another section should appear with the following:
// A message containing the user's name, telling them which questions they answered wrong or right
// A message telling them the correct answer if they answered incorrectly
// A button that will allow them to start over and get another quiz

import React, { useEffect, useRef } from 'react'; // Import useEffect, useRef


export default function Results({ quizParams, quizData, results }) {
    const resultsContainerRef = useRef(null); // Ref for the main container

    // Scroll into view when the component mounts
    useEffect(() => {
        if (resultsContainerRef.current) {
            resultsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []); // Empty dependency array means run only on mount

//Function to handle answer submission, needs quizData and to update quizData and to not allow
return(
    // Attach the internal ref to the main div
    <div ref={resultsContainerRef}>
        <h1>Results</h1>
        <p>Thanks {quizParams.firstName}!</p>
        <h3>Here are your results:</h3>
        <p className="resultTotal">You answered {results.filter(result => result.isCorrect).length} out of {quizData.questions.length} questions correctly.</p>
        <p>Here are the details:</p>
        <ul>
            {results.map((result, index) => (
                <li key={index}>
                    Question: {quizData.questions[index]}<br />
                    Your Answer: {result.userAnswer}<br />
                    Correct Answer: {result.correctAnswer}<br />
                    {result.isCorrect ? "Correct!" : "Incorrect"}
                </li>
            ))}
        </ul>
    
 
        <button onClick={() => window.location.reload()}>Start Over</button>
        {/* This will reload the page, effectively resetting the quiz */}
    </div>
)



       


} // Close the component function