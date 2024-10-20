let timer;    let timeLeft = 3600;  // 1 hour    let testId = null;    let currentQuestionIndex = 0;    let answeredQuestions = new Set(); // To track answered questions    async function enterTest() {        testId = document.getElementById('test-id').value;        const response = await fetch(`/api/tests/test_by_id?test_id=${testId}`);        if (response.status === 404) {            alert("Тест с таким ID не найден");            return;        }        const test = await response.json();        loadTest(test);        startTimer();    }    function loadTest(test) {        document.getElementById('test-room').style.display = 'none';        document.getElementById('test-container').style.display = 'block';        const container = document.getElementById('questions-container');        container.innerHTML = ''; // Clear previous questions        // Add questions        test.questions.forEach((question, index) => {            const questionElem = document.createElement('div');            questionElem.classList.add('question');            questionElem.innerHTML = `                <p>${index + 1}. ${question.text}</p>            `;            // Sort answer options            const sortedOptions = question.options.sort((a, b) => a.text.localeCompare(b.text));            sortedOptions.forEach(option => {                const optionElem = document.createElement('div');                optionElem.classList.add('option');                optionElem.innerHTML = `                    <input type="radio" name="question_${question.id}" value="${option.id}" hidden>                    <label>${option.text}</label>                `;                // Add click event listener to the option                optionElem.onclick = () => {                    const radioButton = optionElem.querySelector('input[type="radio"]');                    radioButton.checked = true; // Check the radio button                    markAnswered(index); // Mark the question as answered                    if (index < test.questions.length - 1) {                        showQuestion(currentQuestionIndex + 1); // Move to the next question                    } else {                        toggleSubmitButton(); // Check if we should show the submit button                    }                };                questionElem.appendChild(optionElem);            });            container.appendChild(questionElem);        });        createPagination(test.questions.length);        showQuestion(currentQuestionIndex);    }    function createPagination(totalQuestions) {        const pagination = document.getElementById('pagination');        pagination.innerHTML = ''; // Clear previous pagination        for (let i = 0; i < totalQuestions; i++) {            const button = document.createElement('button');            button.className = 'page-button';            button.innerText = i + 1;            button.onclick = () => showQuestion(i);            pagination.appendChild(button);        }    }    function showQuestion(index) {        const questions = document.querySelectorAll('.question');        questions.forEach((question, i) => {            question.style.display = (i === index) ? 'block' : 'none';        });        currentQuestionIndex = index;        // Highlight the answered question        const paginationButtons = document.querySelectorAll('.page-button');        paginationButtons.forEach((button, i) => {            button.classList.toggle('answered', answeredQuestions.has(i));        });        // Show submit button if all questions are answered        toggleSubmitButton();    }    function markAnswered(index) {        answeredQuestions.add(index);        const paginationButtons = document.querySelectorAll('.page-button');        paginationButtons[index].classList.add('answered');        // Show submit button if all questions are answered        toggleSubmitButton();    }    function toggleSubmitButton() {        const questionsCount = answeredQuestions.size;        const totalQuestions = document.querySelectorAll('.question').length;        document.getElementById('submit-button').style.display = (questionsCount === totalQuestions) ? 'block' : 'none';    }    function startTimer() {        timer = setInterval(() => {            timeLeft--;            const minutes = Math.floor(timeLeft / 60);            const seconds = timeLeft % 60;            document.getElementById('timer').innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;            if (timeLeft <= 0) {                clearInterval(timer);                submitTest();            }        }, 1000);    }    async function submitTest() {        const answers = [];        const questions = document.querySelectorAll('[name^="question_"]');        let allAnswered = true;        questions.forEach(q => {            const questionId = q.name.split('_')[1];            const isChecked = document.querySelector(`[name="question_${questionId}"]:checked`);            if (isChecked) {                answers.push({                    question_id: questionId,                    answer_id: isChecked.value                });            } else {                allAnswered = false;            }        });        if (!allAnswered) {            alert('Ты не ответил на все вопросы.');            return;        }        await fetch(`/api/tests/${testId}/submit_answer`, {            method: 'POST',            headers: { 'Content-Type': 'application/json' },            body: JSON.stringify({ answers: answers })        });        // Show completion message without hiding the last question        document.getElementById('completion-message').style.display = 'block';        document.getElementById('submit-button').style.display = 'none';        // Redirect to the main page after a short delay        setTimeout(() => {            window.location.href = '/'; // Redirect to the main page        }, 2000); // 2 seconds delay    }