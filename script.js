document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === 'user' && password === 'pass') {
        document.getElementById('auth').style.display = 'none';
        document.getElementById('home').style.display = 'block';
    } else {
        alert('Invalid credentials');
    }
});

document.getElementById('quiz-setup-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const numQuestions = parseInt(document.getElementById('num-questions').value, 10);
    const topic = document.getElementById('topic').value;
    const difficulty = document.getElementById('difficulty').value;

    const questions = getQuestionsByTopic(topic, numQuestions);
    startQuiz(questions);
});

function getQuestionsByTopic(topic, numQuestions) {
    const allQuestions = {
        general: [
            { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: "Paris" },
            { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Mark Twain", "Ernest Hemingway", "F. Scott Fitzgerald"], answer: "Harper Lee" },
            { question: "In what year did the Titanic sink?", options: ["1912", "1905", "1898", "1923"], answer: "1912" }
        ],
        math: [
            { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
            { question: "What is the square root of 16?", options: ["2", "3", "4", "5"], answer: "4" },
            { question: "What is 5 * 5?", options: ["20", "25", "30", "35"], answer: "25" }
        ],
        science: [
            { question: "What planet is known as the Red Planet?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Mars" },
            { question: "What is the chemical symbol for water?", options: ["H2O", "O2", "CO2", "HO"], answer: "H2O" },
            { question: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" }
        ]
    };

    let selectedQuestions = allQuestions[topic];
    selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    return selectedQuestions;
}

function startQuiz(questions) {
    let currentQuestionIndex = 0;
    let score = 0;
    let time = 30;
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(() => {
            time--;
            document.getElementById('time').textContent = time;
            if (time <= 0) {
                clearInterval(timerInterval);
                showResult();
            }
        }, 1000);
    }

    function showQuestion(index) {
        if (index >= questions.length) {
            showResult();
            return;
        }

        time = 30;
        document.getElementById('time').textContent = time;
        clearInterval(timerInterval);
        startTimer();

        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = '';

        const question = questions[index];
        const questionEl = document.createElement('div');
        questionEl.classList.add('question');

        const questionText = document.createElement('p');
        questionText.textContent = question.question;
        questionEl.appendChild(questionText);

        question.options.forEach(option => {
            const optionLabel = document.createElement('label');
            optionLabel.textContent = option;

            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = 'question';
            optionInput.value = option;

            optionLabel.insertBefore(optionInput, optionLabel.firstChild);
            questionEl.appendChild(optionLabel);
        });

        questionContainer.appendChild(questionEl);
        document.getElementById('next-question').style.display = 'block';

        const progressBar = document.getElementById('progress-bar');
        const progress = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    document.getElementById('next-question').addEventListener('click', function() {
        const selectedOption = document.querySelector(`input[name="question"]:checked`);
        if (selectedOption) {
            if (selectedOption.value === questions[currentQuestionIndex].answer) {
                score++;
            }
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            alert('Please select an answer');
        }
    });

    function showResult() {
        document.getElementById('quiz').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('score').textContent = `Your score is ${score} out of ${questions.length}`;
        clearInterval(timerInterval);
    }

    document.getElementById('home').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    showQuestion(currentQuestionIndex);
}

document.getElementById('restart-quiz').addEventListener('click', function() {
    document.getElementById('result').style.display = 'none';
    document.getElementById('home').style.display = 'block';
});
