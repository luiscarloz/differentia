// ===== GAME STATE =====
let gameMode = 'classic'; // 'classic' or 'quiz'
let difficulty = 'easy';
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let timerInterval = null;
let seconds = 0;
let isLocked = false;

// ===== CARD DATA =====
// MODO CLÁSSICO: Troque os emojis por imagens quando tiver os arquivos
// Para usar imagens, mude "emoji" para "image" e coloque o caminho em "value"
// Exemplo: { type: 'image', value: 'images/personagem1.png', label: 'Nome' }
const classicCards = [
    { id: 1, type: 'emoji', value: '🦁', label: 'Leão' },
    { id: 2, type: 'emoji', value: '🐘', label: 'Elefante' },
    { id: 3, type: 'emoji', value: '🦋', label: 'Borboleta' },
    { id: 4, type: 'emoji', value: '🐢', label: 'Tartaruga' },
    { id: 5, type: 'emoji', value: '🦊', label: 'Raposa' },
    { id: 6, type: 'emoji', value: '🐙', label: 'Polvo' },
    { id: 7, type: 'emoji', value: '🦜', label: 'Papagaio' },
    { id: 8, type: 'emoji', value: '🐬', label: 'Golfinho' },
];

// MODO QUIZ: Perguntas e respostas (formam pares)
const quizCards = [
    { id: 1, question: 'Qual planeta é conhecido como planeta vermelho?', answer: 'Marte' },
    { id: 2, question: 'Quantas patas tem uma aranha?', answer: '8 patas' },
    { id: 3, question: 'Qual o maior oceano do mundo?', answer: 'Oceano Pacífico' },
    { id: 4, question: 'De que cor são as folhas das árvores?', answer: 'Verdes' },
    { id: 5, question: 'Qual animal é o rei da selva?', answer: 'Leão' },
    { id: 6, question: 'Quantos dias tem uma semana?', answer: '7 dias' },
    { id: 7, question: 'Onde vive o peixe?', answer: 'Na água' },
    { id: 8, question: 'Qual é o maior animal do mundo?', answer: 'Baleia azul' },
];

// ===== NAVIGATION =====
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    screen.classList.add('active');
    // Re-trigger animation
    screen.style.animation = 'none';
    screen.offsetHeight; // force reflow
    screen.style.animation = '';
}

function goHome() {
    stopTimer();
    showScreen('screen-home');
}

function startClassicMode() {
    gameMode = 'classic';
    document.getElementById('difficulty-title').textContent = 'Jogo da Memória';
    showScreen('screen-difficulty');
}

function startQuizMode() {
    gameMode = 'quiz';
    document.getElementById('difficulty-title').textContent = 'Memória Quiz';
    showScreen('screen-difficulty');
}

function selectDifficulty(diff) {
    difficulty = diff;
    initGame();
}

// ===== GAME INIT =====
function initGame() {
    const pairsMap = { easy: 4, medium: 6, hard: 8 };
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
    const selected = classicCards.slice(0, totalPairs);
    // Create pairs
    cards = [];
    selected.forEach(card => {
        cards.push({ ...card, uid: card.id + '-a', pairId: card.id });
        cards.push({ ...card, uid: card.id + '-b', pairId: card.id });
    });
    shuffle(cards);
    renderBoard();
}

function setupQuizBoard() {
    const selected = quizCards.slice(0, totalPairs);
    cards = [];
    selected.forEach(q => {
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
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    // Determine grid columns
    const total = cards.length;
    board.className = 'game-board';
    if (total <= 8) {
        board.classList.add('cols-4');
    } else if (total <= 12) {
        board.classList.add('cols-4');
    } else {
        board.classList.add('cols-4');
    }

    cards.forEach((card, index) => {
        const el = document.createElement('div');
        el.className = 'card';
        el.dataset.index = index;

        let frontContent = '';

        if (gameMode === 'classic') {
            if (card.type === 'image') {
                frontContent = `
                    <div class="card-front">
                        <img src="${sanitizeAttr(card.value)}" alt="${sanitizeAttr(card.label)}">
                        <span class="card-label">${sanitize(card.label)}</span>
                    </div>`;
            } else {
                frontContent = `
                    <div class="card-front">
                        <span class="card-emoji">${card.value}</span>
                        <span class="card-label">${sanitize(card.label)}</span>
                    </div>`;
            }
        } else {
            const isAnswer = card.type === 'quiz-answer';
            frontContent = `
                <div class="card-front quiz-card ${isAnswer ? 'quiz-answer' : ''}">
                    <span class="card-quiz-text">${sanitize(card.text)}</span>
                </div>`;
        }

        el.innerHTML = `
            <div class="card-inner">
                <div class="card-back">
                    <span class="card-back-pattern">?</span>
                </div>
                ${frontContent}
            </div>`;

        el.addEventListener('click', () => flipCard(index, el));
        board.appendChild(el);
    });
}

// ===== GAME LOGIC =====
function flipCard(index, el) {
    if (isLocked) return;
    if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    el.classList.add('flipped');
    flippedCards.push({ index, el, card: cards[index] });

    if (flippedCards.length === 2) {
        moves++;
        updateStats();
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    const isMatch = first.card.pairId === second.card.pairId;

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

        setTimeout(() => {
            first.el.classList.remove('flipped', 'wrong');
            second.el.classList.remove('flipped', 'wrong');
            flippedCards = [];
            isLocked = false;
        }, 900);
    }
}

// ===== TIMER =====
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        document.getElementById('timer').textContent = formatTime(seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
}

// ===== STATS =====
function updateStats() {
    document.getElementById('moves-count').textContent = moves;
    document.getElementById('pairs-count').textContent = `${matchedPairs}/${totalPairs}`;
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
    const colors = ['#f093fb', '#f5576c', '#4facfe', '#43e97b', '#fee140', '#00f2fe'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
            confetti.style.width = (Math.random() * 8 + 6) + 'px';
            confetti.style.height = (Math.random() * 8 + 6) + 'px';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 4000);
        }, i * 40);
    }
}

// ===== UTILS =====
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function sanitizeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
