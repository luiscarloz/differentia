// ===== GAME STATE =====
let gameMode = 'classic';
let difficulty = 'easy';
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let timerInterval = null;
let seconds = 0;
let isLocked = false;

// ===== PERSONAGENS DO MÉTODO LUPA =====
const classicCards = [
    { id: 1, type: 'image', value: 'images/leao.png', label: 'Leao' },
    { id: 2, type: 'image', value: 'images/lobo.png', label: 'Lobo' },
    { id: 3, type: 'image', value: 'images/cobra.png', label: 'Cobra' },
    { id: 4, type: 'image', value: 'images/mosquito.png', label: 'Mosquito' },
    { id: 5, type: 'image', value: 'images/bajo.png', label: 'Bajo' },
    { id: 6, type: 'image', value: 'images/tina.png', label: 'Tina' },
    { id: 7, type: 'image', value: 'images/panda.png', label: 'Panda' },
    { id: 8, type: 'image', value: 'images/coruja.png', label: 'Coruja' },
    { id: 9, type: 'image', value: 'images/leco.png', label: 'Leco' },
    { id: 10, type: 'image', value: 'images/arara.png', label: 'Arara' },
];

// MODO QUIZ: Perguntas e respostas sobre o Método Lupa
const quizCards = [
    { id: 1, question: 'O que o Mapa representa?', answer: 'Mostra o caminho certo a seguir na jornada' },
    { id: 2, question: 'O que a Bussola faz?', answer: 'Aponta a direcao, ajudando a nao se perder' },
    { id: 3, question: 'Para que serve o Pao e a agua?', answer: 'Da forca e energia para continuar' },
    { id: 4, question: 'Quem e o Lobo na jornada?', answer: 'E o inimigo que tenta nos desviar do caminho' },
    { id: 5, question: 'O que a Lupa nos ajuda a fazer?', answer: 'Ver de perto o que ha em nosso coracao' },
    { id: 6, question: 'Pensamento saudavel gera o que?', answer: 'Um sentimento saudavel' },
    { id: 7, question: 'Sentimento saudavel gera o que?', answer: 'Uma comunicacao saudavel' },
    { id: 8, question: 'Comunicacao saudavel gera o que?', answer: 'Uma atitude saudavel' },
    { id: 9, question: 'Qual o nome do rinoceronte?', answer: 'Bajo' },
    { id: 10, question: 'Qual o nome da girafa?', answer: 'Tina' },
];

// ===== NAVIGATION =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    var screen = document.getElementById(id);
    screen.classList.add('active');
    screen.style.animation = 'none';
    screen.offsetHeight;
    screen.style.animation = '';
}

function goHome() {
    stopTimer();
    showScreen('screen-home');
}

function startClassicMode() {
    gameMode = 'classic';
    document.getElementById('difficulty-title').textContent = 'Jogo da Memoria';
    showScreen('screen-difficulty');
}

function startQuizMode() {
    gameMode = 'quiz';
    document.getElementById('difficulty-title').textContent = 'Memoria Quiz';
    showScreen('screen-difficulty');
}

function selectDifficulty(diff) {
    difficulty = diff;
    initGame();
}

// ===== GAME INIT =====
function initGame() {
    var pairsMap = { easy: 4, medium: 6, hard: 8 };
    totalPairs = pairsMap[difficulty];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    flippedCards = [];
    isLocked = false;

    updateStats();
    stopTimer();
    startTimer();

    if (gameMode === 'classic') {
        setupClassicBoard();
    } else {
        setupQuizBoard();
    }

    showScreen('screen-game');
}

function setupClassicBoard() {
    var shuffled = classicCards.slice();
    shuffle(shuffled);
    var selected = shuffled.slice(0, totalPairs);
    cards = [];
    selected.forEach(function(card) {
        cards.push({ id: card.id, type: card.type, value: card.value, label: card.label, uid: card.id + '-a', pairId: card.id });
        cards.push({ id: card.id, type: card.type, value: card.value, label: card.label, uid: card.id + '-b', pairId: card.id });
    });
    shuffle(cards);
    renderBoard();
}

function setupQuizBoard() {
    var shuffled = quizCards.slice();
    shuffle(shuffled);
    var selected = shuffled.slice(0, totalPairs);
    cards = [];
    selected.forEach(function(q) {
        cards.push({
            uid: q.id + '-q',
            pairId: q.id,
            type: 'quiz-question',
            text: q.question
        });
        cards.push({
            uid: q.id + '-a',
            pairId: q.id,
            type: 'quiz-answer',
            text: q.answer
        });
    });
    shuffle(cards);
    renderBoard();
}

function renderBoard() {
    var board = document.getElementById('game-board');
    board.innerHTML = '';
    var total = cards.length;
    board.className = 'game-board';
    if (total <= 8) {
        board.classList.add('grid-2x4');
    } else if (total <= 12) {
        board.classList.add('grid-3x4');
    } else {
        board.classList.add('grid-4x4');
    }

    var lupaSvg = '<svg class="card-back-icon" viewBox="0 0 40 40"><circle cx="17" cy="17" r="11" fill="none" stroke="#5a3e28" stroke-width="3"/><line x1="25" y1="25" x2="36" y2="36" stroke="#5a3e28" stroke-width="3" stroke-linecap="round"/></svg>';

    cards.forEach(function(card, index) {
        var el = document.createElement('div');
        el.className = 'card';
        el.dataset.index = index;

        var frontContent = '';

        if (gameMode === 'classic') {
            frontContent =
                '<div class="card-front">' +
                    '<img src="' + sanitizeAttr(card.value) + '" alt="' + sanitizeAttr(card.label) + '" loading="eager">' +
                    '<span class="card-label">' + sanitize(card.label) + '</span>' +
                '</div>';
        } else {
            var isAnswer = card.type === 'quiz-answer';
            var cssClass = isAnswer ? 'quiz-answer' : 'quiz-question';
            frontContent =
                '<div class="card-front quiz-card ' + cssClass + '">' +
                    '<span class="card-quiz-text">' + sanitize(card.text) + '</span>' +
                '</div>';
        }

        el.innerHTML =
            '<div class="card-inner">' +
                '<div class="card-back">' + lupaSvg + '</div>' +
                frontContent +
            '</div>';

        el.addEventListener('click', function() { flipCard(index, el); });
        board.appendChild(el);
    });
}

// ===== GAME LOGIC =====
function flipCard(index, el) {
    if (isLocked) return;
    if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    el.classList.add('flipped');
    flippedCards.push({ index: index, el: el, card: cards[index] });

    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    var first = flippedCards[0];
    var second = flippedCards[1];
    var isMatch = first.card.pairId === second.card.pairId;

    if (isMatch) {
        first.el.classList.add('matched');
        second.el.classList.add('matched');
        matchedPairs++;
        updateStats();
        flippedCards = [];

        if (matchedPairs === totalPairs) {
            setTimeout(winGame, 600);
        }
    } else {
        isLocked = true;
        first.el.classList.add('wrong');
        second.el.classList.add('wrong');

        setTimeout(function() {
            first.el.classList.remove('flipped', 'wrong');
            second.el.classList.remove('flipped', 'wrong');
            flippedCards = [];
            isLocked = false;
        }, 900);
    }
}

// ===== TIMER =====
function startTimer() {
    timerInterval = setInterval(function() {
        seconds++;
        document.getElementById('timer').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function formatTime(s) {
    var m = Math.floor(s / 60).toString().padStart(2, '0');
    var sec = (s % 60).toString().padStart(2, '0');
    return m + ':' + sec;
}

// ===== STATS =====
function updateStats() {
    document.getElementById('moves-count').textContent = moves;
    document.getElementById('pairs-count').textContent = matchedPairs + '/' + totalPairs;
}

// ===== WIN =====
function winGame() {
    stopTimer();
    document.getElementById('win-moves').textContent = moves;
    document.getElementById('win-time').textContent = formatTime(seconds);
    showScreen('screen-win');
    spawnConfetti();
}

function restartGame() {
    initGame();
}

// ===== CONFETTI =====
function spawnConfetti() {
    var colors = ['#6ab04c', '#4a90d9', '#f4d03f', '#e67e22', '#c0392b', '#8B6914'];
    for (var i = 0; i < 50; i++) {
        (function(delay) {
            setTimeout(function() {
                var confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
                confetti.style.width = (Math.random() * 8 + 6) + 'px';
                confetti.style.height = (Math.random() * 8 + 6) + 'px';
                document.body.appendChild(confetti);
                setTimeout(function() { confetti.remove(); }, 4000);
            }, delay);
        })(i * 40);
    }
}

// ===== UTILS =====
function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function sanitize(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function sanitizeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
