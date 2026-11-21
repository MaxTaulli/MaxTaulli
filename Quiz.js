
// DNS Quiz - JavaScript

// Store the correct answers for each question
const correctAnswers = {
    q1: "a",
    q2: "b",
    q3: ["a", "b", "d"],
    q4: ["domain", "domains"],
    q5: "a",
    q6: ["root", "root server"],
    q7: "b",
    q8: "a",
    q9: "a",
    q10: "a"
};

// Keep track of the quiz timer
let timeRemaining = 600;
let timerInterval;
let quizStarted = false;
let quizFinished = false;

const quizForm = document.getElementById("quiz-form");
const timerDisplay = document.getElementById("timer");
const resultsSection = document.getElementById("results");
const submitButton = document.getElementById("submit-quiz");
const resetButton = document.getElementById("reset-quiz");

// Start the 10-minute timer
function startTimer() {
    if (quizStarted || quizFinished) {
        return;
    }

    clearInterval(timerInterval);

    timeRemaining = 600;
    quizStarted = true;

    // Enable all question fields and their inputs
    quizForm.querySelectorAll("fieldset").forEach(fieldset => {
        fieldset.disabled = false;
    });

    quizForm.querySelectorAll("input").forEach(input => {
        input.disabled = false;
    });

    // Enable submit button
    submitButton.disabled = false;

    // Disable start button
    document.getElementById("start-quiz").disabled = true;

    updateTimerDisplay();

    timerInterval = setInterval(function () {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            gradeQuiz();
        }
    }, 1000);
}

// Display the remaining time
function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    timerDisplay.textContent =
        "Time Remaining: " +
        minutes + ":" +
        String(seconds).padStart(2, "0");
}

// Get the student's answer for a question
function getAnswer(questionName) {
    const selected = quizForm.querySelectorAll(
        '[name="' + questionName + '"]:checked'
    );

    if (selected.length > 0) {
        return Array.from(selected).map(input => input.value);
    }

    const textInput = quizForm.elements[questionName];

    if (textInput && textInput.type === "text") {
        return [textInput.value.trim().toLowerCase()];
    }

    return [];
}

// Check whether the student's answer is correct
function checkAnswer(questionName) {
    const studentAnswer = getAnswer(questionName);
    const correctAnswer = correctAnswers[questionName];

    // Check multiple-selection questions
    if (Array.isArray(correctAnswer) && questionName === "q3") {
        return studentAnswer.length === correctAnswer.length &&
            correctAnswer.every(answer => studentAnswer.includes(answer));
    }

    // Check fill-in-the-blank questions
    if (Array.isArray(correctAnswer)) {
        return correctAnswer.includes(studentAnswer[0]);
    }

    // Check regular multiple-choice questions
    return studentAnswer[0] === correctAnswer;
}

// Grade the quiz and display results
function gradeQuiz() {
    if (quizFinished) {
        return;
    }

    quizFinished = true;
    clearInterval(timerInterval);

    let score = 0;
    const totalQuestions = 10;

    const correctAnswerText = {
        q1: "Domain Name System",
        q2: "IP addresses",
        q3: "A record, MX record, and CNAME record",
        q4: "Domain or domains",
        q5: "To help find the IP address for a domain name",
        q6: "Root",
        q7: "A record",
        q8: "To make repeated lookups faster",
        q9: "ICANN",
        q10: "To direct queries toward the appropriate top-level domain servers"
    };

    let resultHTML = "<h2>Quiz Results</h2>";

    // Check every question
    for (let i = 1; i <= totalQuestions; i++) {
        const questionName = "q" + i;
        const isCorrect = checkAnswer(questionName);
        const studentAnswer = getAnswer(questionName);

        if (isCorrect) {
            score++;
            resultHTML +=
                "<div class='question-result correct'>" +
                "<p>Question " + i + ": Correct!</p>";
        } else {
            resultHTML +=
                "<div class='question-result incorrect'>" +
                "<p>Question " + i + ": Incorrect.</p>";
        }

        const displayedAnswer = Array.isArray(studentAnswer)
            ? studentAnswer.join(", ")
            : studentAnswer;

        resultHTML +=
            "<p>Your answer: " +
            (displayedAnswer || "No answer") +
            "</p>";

        resultHTML +=
            "<p>Correct answer: " +
            correctAnswerText[questionName] +
            "</p></div>";
    }

    // Calculate final score
    const percentage = Math.round((score / totalQuestions) * 100);

    // Calculate time spent
    const timeSpent = 600 - timeRemaining;
    const minutesSpent = Math.floor(timeSpent / 60);
    const secondsSpent = timeSpent % 60;

    const passed = percentage >= 70;

    resultHTML += "<hr>";
    resultHTML += "<h3>Final Score: " + score +
        " out of " + totalQuestions + "</h3>";
    resultHTML += "<h3>Percentage: " + percentage + "%</h3>";

    resultHTML += passed
        ? "<div class='score-box passed'><h3>Result: Passed!</h3></div>"
        : "<div class='score-box failed'><h3>Result: Failed.</h3></div>";

    resultHTML +=
        "<p>Time Spent: " + minutesSpent + " minutes and " +
        secondsSpent + " seconds</p>";

    resultsSection.innerHTML = resultHTML;

    // Prevent additional answers after submission
    quizForm.querySelectorAll("input").forEach(input => {
        input.disabled = true;
    });

    submitButton.disabled = true;
}

// Submit button
submitButton.addEventListener("click", gradeQuiz);

// Reset button
resetButton.addEventListener("click", function () {
    clearInterval(timerInterval);

    quizForm.reset();
    resultsSection.innerHTML = "";

    timeRemaining = 600;
    quizStarted = false;
    quizFinished = false;

    // Disable questions until Start Quiz is clicked
    quizForm.querySelectorAll("fieldset").forEach(fieldset => {
        fieldset.disabled = true;
    });

    // Disable submit button
    submitButton.disabled = true;

    // Enable start button
    document.getElementById("start-quiz").disabled = false;

    updateTimerDisplay();
});

// Start the timer when the user clicks Start Quiz
document.getElementById("start-quiz").addEventListener("click", startTimer);
