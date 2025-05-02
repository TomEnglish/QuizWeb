import Results from './Results.jsx';

// 2. Question Form - When the user submits the form to get the question, another form should appear with the following:
// The question - the type will always be multiple choice
// The answers as a radio button group with labels - these must be looped through and displayed, not pulled individually 
// A submit button
// A conditional render that will show a message if the API call encounters an error
// An error message, stopping the form submit, if an answer isn't chosen. 
import React from 'react';
import {useState, useEffect, useRef} from 'react'; // Import useState, useEffect, useRef

// Utility function to decode HTML entities
function decodeHtmlEntities(text) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}


export default function Questions({
    quizParams, 
    quizData, setQuizData,
}) // Removed fetchQuiz and setFetchQuiz props, removed setQuizParams (not allowing reset of paramsfrom Questions)
{

        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
 // Single effect to handle fetching when params are valid and questions are needed
const [quizResults, setQuizResults] = useState(null); // State to hold results after submission
const [isNewQuizCooldown, setIsNewQuizCooldown] = useState(false); // State for button cooldown
const [shouldScrollToTop, setShouldScrollToTop] = useState(false); // State to trigger scroll after load
const questionsHeadingRef = useRef(null); // Ref for the heading element

 // Effect to fetch data when parameters change or questions are empty
 useEffect(() => {
     // Condition to fetch: category and difficulty must be set, and questions must be empty
     const shouldFetch = quizParams.category && quizParams.difficulty && (!quizData.questions || quizData.questions.length === 0);
     
     // Use AbortController to cancel fetch on cleanup/re-run
     const controller = new AbortController();
     const signal = controller.signal;

        const fetchQuizData = async () => {
            // Check if the signal was aborted before starting
            if (signal.aborted) {
                console.log("Fetch aborted before starting.");
                return;
            }
            
            console.log("Fetching quiz data..."); // Simplified log
            // Pass signal to fetch
            setLoading(true);
            setError(null);
            
            const url = `https://opentdb.com/api.php?amount=10&category=${quizParams.category}&difficulty=${quizParams.difficulty}&type=multiple`;
            console.log('Fetching quizzes from:', url);
        
            try {
                const response = await fetch(url, { signal }); // Pass signal here
                if (!response.ok) {
                    throw new Error(`API request failed ${response.status}`);
                }
                const data = await response.json();
                console.log("API Response", data); // Log the whole response for debugging
                
                let transformedData = { // Initialize with default structure
                    questions: [],
                    correctAnswers: [],
                    incorrectAnswers: [],
                    possibleAnswers: [],
                    userAnswers: []
                };
                
                // Check response code from API
                if (data.response_code !== 0) {
                     throw new Error(`API returned error code: ${data.response_code}`);
                }

                if (data.results && data.results.length > 0) {
                    transformedData = { // Re-assign if data exists
                        questions: data.results.map(item => decodeHtmlEntities(item.question)),
                        correctAnswers: data.results.map(item => decodeHtmlEntities(item.correct_answer)),
                        incorrectAnswers: data.results.map(item =>
                            // Ensure incorrect_answers is an array before mapping
                            (Array.isArray(item.incorrect_answers) ? item.incorrect_answers : [])
                            .map(ans => decodeHtmlEntities(ans))
                        ),
                        possibleAnswers: data.results.map(item => {
                            // Ensure incorrect_answers is always an array before spreading
                            const incorrect = Array.isArray(item.incorrect_answers) ? item.incorrect_answers : [];
                            // Decode answers before combining and shuffling
                            const decodedCorrect = decodeHtmlEntities(item.correct_answer);
                            const decodedIncorrect = incorrect.map(ans => decodeHtmlEntities(ans));
                            return [decodedCorrect, ...decodedIncorrect].sort(() => Math.random() - 0.5);
                        }),
                        userAnswers: Array(data.results.length).fill(null) // Initialize with null instead of ""? Or check logic later
                    };
                } else {
                    console.log("API returned no results.");
                    // Keep transformedData as the initial empty structure
                }

                console.log("Transformed Data:", transformedData);
                setQuizData(transformedData);
                // setLoading(false) is handled in finally block
            } catch (error) {
                 // Only set error state if it's not an AbortError (common in StrictMode)
                 if (error.name !== 'AbortError') {
                     console.error("Error fetching quiz data:", error);
                     setError(error);
                 } else {
                     console.log("Fetch aborted (likely due to StrictMode cleanup), ignoring error state update.");
                 }
                 // Do not reset fetchQuiz here, maybe allow retry? Or handle upstream.
            } finally {
                 setLoading(false); // Ensure loading is set to false in both success and error cases
            }
        };

        if (shouldFetch) {
            console.log("Conditions met, initiating fetch.");
            fetchQuizData();
        } else {
            console.log("Conditions not met for fetching.");
        }

        // Cleanup function: Abort fetch if effect re-runs or component unmounts
        return () => {
            console.log("Effect cleanup: Aborting fetch controller.");
            controller.abort();
        };
    }, [quizParams.category, quizParams.difficulty, quizData.questions?.length, setQuizData]); // Depend on the conditions checked, use optional chaining

    // Effect to scroll to top after new questions load
    useEffect(() => {
        console.log("Scroll-up effect triggered. Questions Length:", quizData.questions?.length, "ShouldScroll:", shouldScrollToTop); // Log entry point based on questions
        // Only scroll if new questions have loaded AND we explicitly requested a scroll
        if (quizData.questions?.length > 0 && shouldScrollToTop && questionsHeadingRef.current) { // Check ref explicitly and questions length
            console.log("Conditions met (new questions loaded). Scrolling to:", questionsHeadingRef.current); // Log before scroll
            questionsHeadingRef.current.scrollIntoView({ behavior: 'smooth' });
            setShouldScrollToTop(false); // Reset the flag after scrolling
        } else if (quizData.questions?.length > 0 && shouldScrollToTop && !questionsHeadingRef.current) {
            console.warn("Scroll conditions met (new questions loaded), but questionsHeadingRef.current is not available yet."); // Log if ref is missing
        }
    }, [quizData.questions, shouldScrollToTop, setShouldScrollToTop]); // Run when questions data or the scroll flag changes
    
    // do not submit if any answer does not have a selection

console.log("Rendering Questions component. State:", { loading, error, quizData });
    return (
        <div>
            <h3 ref={questionsHeadingRef}>Quiz Questions</h3>
            {loading && <p>Loading...</p>}
            {error && (
                <p>
                    Error loading questions:
                    {/* Check if the error is a 429 rate limit error */}
                    {error.message && error.message.includes('429')
                        ? " Too many requests. Please wait 5 seconds and try starting a new quiz."
                        : ` ${error.message}` /* Show generic error message otherwise */}
                </p>
            )}
            {!loading && !error && Array.isArray(quizData.questions) && quizData.questions.length > 0 ? (
                quizData.questions.map((question, index) => (
                <div key={index}>
                    <h4>{question}</h4>
                    <div>
                        {/* Check if possibleAnswers for this index is an array before mapping */}
                        {Array.isArray(quizData.possibleAnswers?.[index]) ? (
                            quizData.possibleAnswers[index].map((answer, answerIndex) => (
                                <div key={answerIndex}>
                                    <input
                                        type="radio"
                                        name={`question-${index}`} // Use unique name per question group
                                        value={answer}
                                        // Check if userAnswer for this question exists before setting checked
                                        checked={quizData.userAnswers?.[index] === answer}
                                        onChange={(event) => {
                                            setQuizData((prevData) => {
                                                const newUserAnswers = [...(prevData.userAnswers || [])]; // Ensure userAnswers is an array
                                                newUserAnswers[index] = event.target.value; // Update answer for this index
                                                return {
                                                    ...prevData,
                                                    userAnswers: newUserAnswers
                                                    }
                                                });
                                            }}
                                    />
                                    <label>{answer}</label>
                                </div>
                            ))
                        ) : (
                            <p>No answers available for this question.</p> // Fallback if answers aren't an array
                        )}
                    </div>
                </div>
            ))
            ) : (
                 !loading && !error && <p>No questions loaded. Try starting a new quiz.</p> // Message if no questions and not loading/error
            )}
        {/* button to submit answers...where to send it?*/ }
            <button
                onClick={() => {
                    // Handle answer submission
                    const correctAnswers = quizData.correctAnswers;
                    const userAnswers = quizData.userAnswers;
                    const calculatedResults = userAnswers.map((userAnswer, index) => ({
                        question: quizData.questions[index],
                        correctAnswer: correctAnswers[index],
                        userAnswer: userAnswer,
                        isCorrect: userAnswer === correctAnswers[index]
                    }));
                    console.log("Calculated Results:", calculatedResults);
                    setQuizResults(calculatedResults); // Set the state here
                }}
            >
                Submit Answers
            </button>
            {/* Conditionally render Results only when quizResults state is populated, pass ref down */}
            {quizResults && <Results results={quizResults} quizParams={quizParams} quizData={quizData} />}
            {/* button to start over and get another full quiz */}
            <button
                onClick={() => {
                    // Prevent rapid clicks hitting API rate limit
                    if (isNewQuizCooldown) return;

                    console.log("Starting new quiz with same parameters...");
                    setIsNewQuizCooldown(true); // Start cooldown
                    setQuizResults(null); // Clear previous results
                    setQuizData({ // Reset data to trigger fetch
                        questions: [],
                        correctAnswers: [],
                        incorrectAnswers: [],
                        possibleAnswers: [],
                        userAnswers: []
                    });
                    setShouldScrollToTop(true); // Signal that we need to scroll once loading finishes

                    // End cooldown after 5 seconds
                    setTimeout(() => {
                        setIsNewQuizCooldown(false);
                    }, 5000);
                }
            }
            disabled={isNewQuizCooldown} // Disable button during cooldown
            >
                {isNewQuizCooldown ? "Waiting..." : "Start New Quiz"}
            </button>

              
            
            
           
        </div>
    );
}
