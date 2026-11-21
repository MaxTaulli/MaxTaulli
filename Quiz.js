
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
    clearInterval(timerInterval);

    timeRemaining = 600;
    quizStarted = true;
    quizFinished = false;

    updateTimerDisplay();

    timerInterval = setInterval(function () {
        timeRemaining--;
        updateTimerDisplay();

        // Automatically submit when time runs out
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

        if (isCorrect) {
            score++;
            resultHTML +=
                "<p class='correct'>Question " + i +
                ": Correct!</p>";
        } else {
            resultHTML +=
                "<p class='incorrect'>Question " + i +
                ": Incorrect.</p>";
        }

        resultHTML +=
            "<p>Correct answer: " +
            correctAnswerText[questionName] +
            "</p>";
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
        ? "<h3 class='correct'>Result: Passed!</h3>"
        : "<h3 class='incorrect'>Result: Failed.</h3>";

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

    resultsSection.innerHTML = "";

    quizForm.querySelectorAll("input").forEach(input => {
        input.disabled = false;
    });

    submitButton.disabled = false;

    startTimer();
});

// Start the timer when the page loads
startTimer();
