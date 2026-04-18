/* ============================================================
   DIFFERENTIA - Jogos Educativos (Método Lupa)
   ============================================================ */

var state = {
    gameMode: 'memory',
    difficulty: 'easy',
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 0,
    moves: 0,
    isLocked: false,
    timerInterval: null,
    seconds: 0,
    timerEl: null,
    quizPool: [],
    quizIndex: 0,
    quizScore: 0,
    quizTotal: 0,
    wsGrid: [],
    wsWords: [],
    wsFound: 0,
    wsFirstCell: null,
    trailSteps: [],
    trailIndex: 0,
    trailScore: 0,
    trailTotal: 0,
    trailPositions: []
};

// ============================================================
// DADOS DO LIVRO
// ============================================================
var classicCards = [
    { id: 1, value: 'images/leao.png', label: 'Leão' },
    { id: 2, value: 'images/lobo.png', label: 'Lobo' },
    { id: 3, value: 'images/cobra.png', label: 'Cobra' },
    { id: 4, value: 'images/mosquito.png', label: 'Mosquito' },
    { id: 5, value: 'images/bajo.png', label: 'Bajo' },
    { id: 6, value: 'images/tina.png', label: 'Tina' },
    { id: 7, value: 'images/panda.png', label: 'Panda' },
    { id: 8, value: 'images/coruja.png', label: 'Coruja' },
    { id: 9, value: 'images/leco.png', label: 'Leco' },
    { id: 10, value: 'images/arara.png', label: 'Arara' }
];

var quizCards = [
    { id: 1, question: 'O que o Mapa representa?', answer: 'Mostra o caminho certo a seguir na jornada' },
    { id: 2, question: 'O que a Bússola faz?', answer: 'Aponta a direção, ajudando a não se perder' },
    { id: 3, question: 'Para que serve o Pão e a água?', answer: 'Dá força e energia para continuar' },
    { id: 4, question: 'Quem é o Lobo na jornada?', answer: 'É o inimigo que tenta nos desviar do caminho' },
    { id: 5, question: 'O que a Lupa nos ajuda a fazer?', answer: 'Ver de perto o que há em nosso coração' },
    { id: 6, question: 'Pensamento saudável gera o que?', answer: 'Um sentimento saudável' },
    { id: 7, question: 'Sentimento saudável gera o que?', answer: 'Uma comunicação saudável' },
    { id: 8, question: 'Comunicação saudável gera o que?', answer: 'Uma atitude saudável' },
    { id: 9, question: 'Qual o nome do rinoceronte?', answer: 'Bajo' },
    { id: 10, question: 'Qual o nome da girafa?', answer: 'Tina' }
];

var quickQuizQuestions = [
    { q: 'O que o Mapa representa na jornada?', options: ['O caminho certo a seguir', 'Um lugar distante', 'Um livro de receitas', 'Um tesouro escondido'], correct: 0 },
    { q: 'Para que serve a Bússola?', options: ['Para cozinhar', 'Para apontar a direção', 'Para acender fogo', 'Para contar histórias'], correct: 1 },
    { q: 'O Pão e a Água nos dão o que?', options: ['Sono', 'Medo', 'Força e energia', 'Risadas'], correct: 2 },
    { q: 'Quem é o Lobo na jornada?', options: ['Um amigo fiel', 'Um professor', 'O inimigo que tenta desviar', 'Um guia'], correct: 2 },
    { q: 'A Lupa nos ajuda a ver o que?', options: ['Estrelas no céu', 'O coração de perto', 'Letras pequenas', 'Animais distantes'], correct: 1 },
    { q: 'Pensamento saudável gera o que?', options: ['Sono', 'Sentimento saudável', 'Fome', 'Chuva'], correct: 1 },
    { q: 'Sentimento saudável gera o que?', options: ['Comunicação saudável', 'Silêncio', 'Raiva', 'Cansaço'], correct: 0 },
    { q: 'Comunicação saudável gera o que?', options: ['Briga', 'Atitude saudável', 'Tristeza', 'Medo'], correct: 1 },
    { q: 'Qual o nome do rinoceronte?', options: ['Leco', 'Tina', 'Bajo', 'Panda'], correct: 2 },
    { q: 'Qual o nome da girafa?', options: ['Tina', 'Bajo', 'Leco', 'Coruja'], correct: 0 }
];

var wordSearchBank = {
    easy:   ['LEAO', 'LOBO', 'BAJO', 'MAPA'],
    medium: ['LEAO', 'LOBO', 'BAJO', 'TINA', 'LECO', 'LUPA'],
    hard:   ['LEAO', 'LOBO', 'BAJO', 'TINA', 'LECO', 'COBRA', 'LUPA', 'MAPA']
};

var trailChallenges = [
    { q: 'Pensamento saudável gera...', opts: ['Sentimento saudável', 'Medo'], correct: 0 },
    { q: 'Quem tenta nos desviar do caminho?', opts: ['Lobo', 'Tina'], correct: 0 },
    { q: 'A Bússola serve para...', opts: ['Dormir', 'Apontar direção'], correct: 1 },
    { q: 'A Lupa nos ajuda a ver...', opts: ['TV', 'Nosso coração'], correct: 1 },
    { q: 'O Mapa mostra...', opts: ['Caminho certo', 'Nada'], correct: 0 },
    { q: 'O Pão e a Água dão...', opts: ['Força', 'Sono'], correct: 0 },
    { q: 'Nome do rinoceronte?', opts: ['Leco', 'Bajo'], correct: 1 },
    { q: 'Nome da girafa?', opts: ['Tina', 'Cobra'], correct: 0 },
    { q: 'Comunicação saudável gera...', opts: ['Atitude saudável', 'Briga'], correct: 0 },
    { q: 'Sentimento saudável gera...', opts: ['Comunicação saudável', 'Silêncio'], correct: 0 },
    { q: 'Bajo é um...', opts: ['Pássaro', 'Rinoceronte'], correct: 1 },
    { q: 'Tina é uma...', opts: ['Girafa', 'Cobra'], correct: 0 },
    { q: 'Leco é um...', opts: ['Macaco', 'Leão'], correct: 0 },
    { q: 'A Coruja representa...', opts: ['Sabedoria', 'Preguiça'], correct: 0 },
    { q: 'O que é um coração saudável?', opts: ['Cheio de virtudes', 'Cheio de medo'], correct: 0 },
    { q: 'Atitude saudável vem de...', opts: ['Comunicação saudável', 'Raiva'], correct: 0 },
    { q: 'O tesouro escondido está...', opts: ['Dentro de nós', 'No fundo do mar'], correct: 0 },
    { q: 'A Arara é de que cor?', opts: ['Azul', 'Vermelha'], correct: 0 },
    { q: 'Quem é o Panda?', opts: ['Um amigo da jornada', 'O vilão'], correct: 0 },
    { q: 'Bondade é uma...', opts: ['Virtude', 'Fraqueza'], correct: 0 },
    { q: 'O Mosquito representa...', opts: ['Algo que incomoda', 'Algo bonito'], correct: 0 },
    { q: 'Generosidade significa...', opts: ['Compartilhar com outros', 'Guardar tudo'], correct: 0 },
    { q: 'Paciência é importante para...', opts: ['Crescer bem', 'Ficar parado'], correct: 0 },
    { q: 'Domínio próprio é...', opts: ['Controlar nossas atitudes', 'Mandar nos outros'], correct: 0 }
];

// ============================================================
// NAVEGAÇÃO
// ============================================================
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    var screen = document.getElementById(id);
    screen.classList.add('active');
    window.scrollTo(0, 0);
}

function goHome() {
    stopTimer();
    showScreen('screen-home');
}

function startGame(mode) {
    state.gameMode = mode;
    if (mode === 'memory') {
        setDifficultyDescriptions('4 pares', '6 pares', '8 pares');
        document.getElementById('difficulty-title').textContent = 'Jogo da Memória';
    } else if (mode === 'memquiz') {
        setDifficultyDescriptions('4 pares', '6 pares', '8 pares');
        document.getElementById('difficulty-title').textContent = 'Memória Quiz';
    } else if (mode === 'quiz') {
        setDifficultyDescriptions('5 perguntas', '8 perguntas', '10 perguntas');
        document.getElementById('difficulty-title').textContent = 'Quiz Rápido';
    } else if (mode === 'wordsearch') {
        setDifficultyDescriptions('4 palavras', '6 palavras', '8 palavras');
        document.getElementById('difficulty-title').textContent = 'Caça-Palavras';
    } else if (mode === 'trail') {
        setDifficultyDescriptions('5 passos', '8 passos', '12 passos');
        document.getElementById('difficulty-title').textContent = 'Trilha das Descobertas';
    }
    showScreen('screen-difficulty');
}

function setDifficultyDescriptions(easy, med, hard) {
    document.getElementById('diff-easy-desc').textContent = easy;
    document.getElementById('diff-medium-desc').textContent = med;
    document.getElementById('diff-hard-desc').textContent = hard;
}

function selectDifficulty(diff) {
    state.difficulty = diff;
    initCurrentGame();
}

function initCurrentGame() {
    state.seconds = 0;
    stopTimer();
    if (state.gameMode === 'memory' || state.gameMode === 'memquiz') {
        initMemoryGame();
    } else if (state.gameMode === 'quiz') {
        initQuizGame();
    } else if (state.gameMode === 'wordsearch') {
        initWordSearchGame();
    } else if (state.gameMode === 'trail') {
        initTrailGame();
    }
}

function restartGame() { initCurrentGame(); }

// ============================================================
// MEMÓRIA
// ============================================================
function initMemoryGame() {
    var pairsMap = { easy: 4, medium: 6, hard: 8 };
    state.totalPairs = pairsMap[state.difficulty];
    state.matchedPairs = 0;
    state.moves = 0;
    state.flippedCards = [];
    state.isLocked = false;
    updateMemoryStats();
    startTimer('timer');
    if (state.gameMode === 'memory') setupClassicBoard();
    else setupQuizMemoryBoard();
    showScreen('screen-game');
}

function setupClassicBoard() {
    var shuffled = classicCards.slice();
    shuffle(shuffled);
    var selected = shuffled.slice(0, state.totalPairs);
    state.cards = [];
    selected.forEach(function(card) {
        state.cards.push({ value: card.value, label: card.label, uid: card.id + '-a', pairId: card.id });
        state.cards.push({ value: card.value, label: card.label, uid: card.id + '-b', pairId: card.id });
    });
    shuffle(state.cards);
    renderMemoryBoard();
}

function setupQuizMemoryBoard() {
    var shuffled = quizCards.slice();
    shuffle(shuffled);
    var selected = shuffled.slice(0, state.totalPairs);
    state.cards = [];
    selected.forEach(function(q) {
        state.cards.push({ uid: q.id + '-q', pairId: q.id, type: 'quiz-question', text: q.question });
        state.cards.push({ uid: q.id + '-a', pairId: q.id, type: 'quiz-answer', text: q.answer });
    });
    shuffle(state.cards);
    renderMemoryBoard();
}

function renderMemoryBoard() {
    var board = document.getElementById('game-board');
    board.innerHTML = '';
    var total = state.cards.length;
    board.className = 'game-board';
    if (total <= 8) board.classList.add('grid-2x4');
    else if (total <= 12) board.classList.add('grid-3x4');
    else board.classList.add('grid-4x4');

    var lupaSvg = '<svg class="card-back-icon" viewBox="0 0 40 40"><circle cx="17" cy="17" r="11" fill="none" stroke="#5a3e28" stroke-width="3"/><line x1="25" y1="25" x2="36" y2="36" stroke="#5a3e28" stroke-width="3" stroke-linecap="round"/></svg>';

    state.cards.forEach(function(card, index) {
        var el = document.createElement('div');
        el.className = 'card';
        el.dataset.index = index;
        var frontContent = '';
        if (state.gameMode === 'memory') {
            frontContent = '<div class="card-front"><img src="' + sanitizeAttr(card.value) + '" alt="' + sanitizeAttr(card.label) + '" loading="eager"><span class="card-label">' + sanitize(card.label) + '</span></div>';
        } else {
            var isAnswer = card.type === 'quiz-answer';
            var cssClass = isAnswer ? 'quiz-answer' : 'quiz-question';
            frontContent = '<div class="card-front quiz-card ' + cssClass + '"><span class="card-quiz-text">' + sanitize(card.text) + '</span></div>';
        }
        el.innerHTML = '<div class="card-inner"><div class="card-back">' + lupaSvg + '</div>' + frontContent + '</div>';
        el.addEventListener('click', function() { flipCard(index, el); });
        board.appendChild(el);
    });
}

function flipCard(index, el) {
    if (state.isLocked) return;
    if (el.classList.contains('flipped') || el.classList.contains('matched')) return;
    if (state.flippedCards.length >= 2) return;
    el.classList.add('flipped');
    state.flippedCards.push({ index: index, el: el, card: state.cards[index] });
    if (state.flippedCards.length === 2) {
        state.moves++;
        updateMemoryStats();
        checkMemoryMatch();
    }
}

function checkMemoryMatch() {
    var first = state.flippedCards[0];
    var second = state.flippedCards[1];
    state.isLocked = true;
    if (first.card.pairId === second.card.pairId) {
        setTimeout(function() {
            first.el.classList.add('matched');
            second.el.classList.add('matched');
            state.matchedPairs++;
            updateMemoryStats();
            state.flippedCards = [];
            state.isLocked = false;
            if (state.matchedPairs === state.totalPairs) setTimeout(winMemoryGame, 400);
        }, 550);
    } else {
        setTimeout(function() {
            first.el.classList.add('wrong');
            second.el.classList.add('wrong');
            setTimeout(function() {
                first.el.classList.remove('wrong');
                second.el.classList.remove('wrong');
                setTimeout(function() {
                    first.el.classList.remove('flipped');
                    second.el.classList.remove('flipped');
                    state.flippedCards = [];
                    state.isLocked = false;
                }, 400);
            }, 500);
        }, 550);
    }
}

function updateMemoryStats() {
    document.getElementById('moves-count').textContent = state.moves;
    document.getElementById('pairs-count').textContent = state.matchedPairs + '/' + state.totalPairs;
}

function winMemoryGame() {
    stopTimer();
    var stats = '<p>Jogadas: <strong>' + state.moves + '</strong></p><p>Tempo: <strong>' + formatTime(state.seconds) + '</strong></p>';
    showWinScreen('Parabéns!', 'Você encontrou todos os pares!', stats);
}

// ============================================================
// QUIZ RÁPIDO
// ============================================================
function initQuizGame() {
    var countMap = { easy: 5, medium: 8, hard: 10 };
    state.quizTotal = countMap[state.difficulty];
    state.quizIndex = 0;
    state.quizScore = 0;
    var pool = quickQuizQuestions.slice();
    shuffle(pool);
    state.quizPool = pool.slice(0, state.quizTotal);
    document.getElementById('sq-progress').textContent = '1/' + state.quizTotal;
    document.getElementById('sq-score').textContent = '0';
    showScreen('screen-superquiz');
    renderQuizQuestion();
}

function renderQuizQuestion() {
    var q = state.quizPool[state.quizIndex];
    document.getElementById('sq-progress').textContent = (state.quizIndex + 1) + '/' + state.quizTotal;
    document.getElementById('sq-question').textContent = q.q;
    document.getElementById('sq-progress-fill').style.width = ((state.quizIndex / state.quizTotal) * 100) + '%';

    var indexedOptions = q.options.map(function(text, i) { return { text: text, originalIndex: i }; });
    shuffle(indexedOptions);

    var container = document.getElementById('sq-options');
    container.innerHTML = '';
    indexedOptions.forEach(function(opt) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt.text;
        btn.addEventListener('click', function() {
            handleQuizAnswer(btn, opt.originalIndex === q.correct, q.correct, indexedOptions);
        });
        container.appendChild(btn);
    });
}

function handleQuizAnswer(btn, isCorrect, correctOriginalIndex, indexedOptions) {
    var allBtns = document.querySelectorAll('.quiz-option');
    allBtns.forEach(function(b) { b.disabled = true; });
    if (isCorrect) {
        btn.classList.add('correct');
        state.quizScore++;
        document.getElementById('sq-score').textContent = state.quizScore;
    } else {
        btn.classList.add('wrong');
        allBtns.forEach(function(b, i) {
            if (indexedOptions[i].originalIndex === correctOriginalIndex) b.classList.add('correct');
        });
    }
    setTimeout(function() {
        state.quizIndex++;
        if (state.quizIndex >= state.quizTotal) winQuizGame();
        else renderQuizQuestion();
    }, 1400);
}

function winQuizGame() {
    var pct = Math.round((state.quizScore / state.quizTotal) * 100);
    var msg = '';
    if (pct === 100) msg = 'Perfeito! Você é um verdadeiro explorador!';
    else if (pct >= 70) msg = 'Muito bem! Você aprendeu muito!';
    else if (pct >= 50) msg = 'Bom trabalho! Continue explorando!';
    else msg = 'Vamos tentar de novo? Você consegue!';
    var stats = '<p>Acertos: <strong>' + state.quizScore + '/' + state.quizTotal + '</strong></p><p>Aproveitamento: <strong>' + pct + '%</strong></p>';
    showWinScreen('Quiz Completo!', msg, stats, pct >= 50);
}

// ============================================================
// CAÇA-PALAVRAS
// ============================================================
function initWordSearchGame() {
    var sizeMap = { easy: 7, medium: 9, hard: 11 };
    var size = sizeMap[state.difficulty];
    var words = wordSearchBank[state.difficulty].slice();
    state.wsFound = 0;
    state.wsFirstCell = null;
    var grid = buildWordSearchGrid(size, words);
    state.wsGrid = grid.grid;
    state.wsWords = grid.placements;
    renderWordSearchGrid(size);
    renderWordSearchWords();
    updateWordSearchStats();
    startTimer('ws-timer');
    showScreen('screen-wordsearch');
}

function buildWordSearchGrid(size, words) {
    var directions;
    if (state.difficulty === 'easy') directions = [[0, 1], [1, 0]];
    else if (state.difficulty === 'medium') directions = [[0, 1], [1, 0], [1, 1]];
    else directions = [[0, 1], [1, 0], [1, 1], [-1, 1]];

    var grid = [];
    for (var i = 0; i < size; i++) grid.push(new Array(size).fill(null));
    var placements = [];

    words.forEach(function(word) {
        var placed = false;
        for (var attempt = 0; attempt < 100 && !placed; attempt++) {
            var dir = directions[Math.floor(Math.random() * directions.length)];
            var dr = dir[0], dc = dir[1];
            var endR = (size - 1) - (word.length - 1) * (dr > 0 ? 1 : 0);
            var startR_min = (word.length - 1) * (dr < 0 ? 1 : 0);
            var endC = (size - 1) - (word.length - 1) * (dc > 0 ? 1 : 0);
            var startC_min = (word.length - 1) * (dc < 0 ? 1 : 0);
            var r = startR_min + Math.floor(Math.random() * (endR - startR_min + 1));
            var c = startC_min + Math.floor(Math.random() * (endC - startC_min + 1));
            var fits = true;
            for (var k = 0; k < word.length; k++) {
                var rr = r + dr * k, cc = c + dc * k;
                if (grid[rr][cc] !== null && grid[rr][cc] !== word[k]) { fits = false; break; }
            }
            if (fits) {
                var coords = [];
                for (var j = 0; j < word.length; j++) {
                    var rr2 = r + dr * j, cc2 = c + dc * j;
                    grid[rr2][cc2] = word[j];
                    coords.push({ r: rr2, c: cc2 });
                }
                placements.push({ word: word, coords: coords, found: false });
                placed = true;
            }
        }
    });

    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var rI = 0; rI < size; rI++) {
        for (var cI = 0; cI < size; cI++) {
            if (grid[rI][cI] === null) grid[rI][cI] = letters[Math.floor(Math.random() * letters.length)];
        }
    }
    return { grid: grid, placements: placements };
}

function renderWordSearchGrid(size) {
    var gridEl = document.getElementById('ws-grid');
    gridEl.innerHTML = '';
    gridEl.style.gridTemplateColumns = 'repeat(' + size + ', 1fr)';
    for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
            var cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.dataset.r = r; cell.dataset.c = c;
            cell.textContent = state.wsGrid[r][c];
            cell.addEventListener('click', (function(row, col, cellEl) {
                return function() { handleWordSearchTap(row, col, cellEl); };
            })(r, c, cell));
            gridEl.appendChild(cell);
        }
    }
}

function renderWordSearchWords() {
    var wordsEl = document.getElementById('ws-words');
    wordsEl.innerHTML = '';
    state.wsWords.forEach(function(w) {
        var span = document.createElement('span');
        span.className = 'ws-word';
        span.dataset.word = w.word;
        span.textContent = w.word;
        wordsEl.appendChild(span);
    });
}

function handleWordSearchTap(r, c, cellEl) {
    if (!state.wsFirstCell) {
        state.wsFirstCell = { r: r, c: c, el: cellEl };
        cellEl.classList.add('selecting');
    } else {
        var first = state.wsFirstCell;
        if (first.r === r && first.c === c) {
            first.el.classList.remove('selecting');
            state.wsFirstCell = null;
            return;
        }
        cellEl.classList.add('selecting');
        var cells = getLineCells(first, { r: r, c: c });
        var match = null;
        if (cells) {
            for (var i = 0; i < state.wsWords.length; i++) {
                var w = state.wsWords[i];
                if (w.found) continue;
                if (coordsMatch(w.coords, cells) || coordsMatchReverse(w.coords, cells)) { match = w; break; }
            }
            if (!match) {
                // Tentar match por letras
                var letters = cells.map(function(p) { return state.wsGrid[p.r][p.c]; }).join('');
                var reversed = letters.split('').reverse().join('');
                for (var j = 0; j < state.wsWords.length; j++) {
                    var ww = state.wsWords[j];
                    if (ww.found) continue;
                    if ((ww.word === letters || ww.word === reversed) && cells.length === ww.word.length) { match = ww; break; }
                }
            }
        }
        if (match) {
            match.found = true;
            state.wsFound++;
            cells.forEach(function(p) {
                var c2 = document.querySelector('.ws-cell[data-r="' + p.r + '"][data-c="' + p.c + '"]');
                if (c2) { c2.classList.remove('selecting'); c2.classList.add('found'); }
            });
            var wordEl = document.querySelector('.ws-word[data-word="' + match.word + '"]');
            if (wordEl) wordEl.classList.add('found');
            updateWordSearchStats();
            if (state.wsFound >= state.wsWords.length) setTimeout(winWordSearchGame, 600);
        } else {
            var secEl = cellEl;
            setTimeout(function() {
                first.el.classList.remove('selecting');
                secEl.classList.remove('selecting');
            }, 300);
        }
        state.wsFirstCell = null;
    }
}

function getLineCells(a, b) {
    var dr = b.r - a.r, dc = b.c - a.c;
    var isH = dr === 0 && dc !== 0;
    var isV = dc === 0 && dr !== 0;
    var isD = Math.abs(dr) === Math.abs(dc) && dr !== 0;
    if (!isH && !isV && !isD) return null;
    var steps = Math.max(Math.abs(dr), Math.abs(dc));
    var stepR = dr === 0 ? 0 : (dr > 0 ? 1 : -1);
    var stepC = dc === 0 ? 0 : (dc > 0 ? 1 : -1);
    var cells = [];
    for (var i = 0; i <= steps; i++) cells.push({ r: a.r + stepR * i, c: a.c + stepC * i });
    return cells;
}

function coordsMatch(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i].r !== b[i].r || a[i].c !== b[i].c) return false;
    return true;
}

function coordsMatchReverse(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) if (a[i].r !== b[b.length - 1 - i].r || a[i].c !== b[b.length - 1 - i].c) return false;
    return true;
}

function updateWordSearchStats() {
    document.getElementById('ws-found').textContent = state.wsFound + '/' + state.wsWords.length;
}

function winWordSearchGame() {
    stopTimer();
    var stats = '<p>Palavras encontradas: <strong>' + state.wsFound + '/' + state.wsWords.length + '</strong></p><p>Tempo: <strong>' + formatTime(state.seconds) + '</strong></p>';
    showWinScreen('Caça-Palavras Concluído!', 'Você achou todas as palavras!', stats);
}

// ============================================================
// TRILHA
// ============================================================
function initTrailGame() {
    var stepsMap = { easy: 5, medium: 8, hard: 12 };
    state.trailTotal = stepsMap[state.difficulty];
    state.trailIndex = 0;
    state.trailScore = 0;
    state.trailQuit = false;
    var pool = trailChallenges.slice();
    shuffle(pool);
    state.trailSteps = pool.slice(0, state.trailTotal);
    renderTrailBoard();
    updateTrailStats();
    showScreen('screen-trail');
}

function renderTrailBoard() {
    var board = document.getElementById('trail-map');
    board.innerHTML = '';
    var total = state.trailTotal + 1;
    var positions = generateTrailPositions(total);

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'trail-path-svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('preserveAspectRatio', 'none');
    var pathStr = 'M ' + positions[0].x + ' ' + positions[0].y;
    for (var i = 1; i < positions.length; i++) {
        var prev = positions[i - 1], curr = positions[i];
        var midX = (prev.x + curr.x) / 2;
        var midY = (prev.y + curr.y) / 2 + (i % 2 === 0 ? -4 : 4);
        pathStr += ' Q ' + midX + ' ' + midY + ', ' + curr.x + ' ' + curr.y;
    }
    var path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', pathStr);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#8B6914');
    path.setAttribute('stroke-width', '0.8');
    path.setAttribute('stroke-dasharray', '2 1.5');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    board.appendChild(svg);

    positions.forEach(function(pos, i) {
        var spot = document.createElement('div');
        spot.className = 'trail-spot';
        if (i === 0) spot.classList.add('current');
        if (i === positions.length - 1) {
            spot.classList.add('treasure');
            spot.innerHTML = '<svg viewBox="0 0 30 30" width="22" height="22"><rect x="4" y="12" width="22" height="14" rx="2" fill="#8B6914" stroke="#5a3e28" stroke-width="1.5"/><rect x="4" y="12" width="22" height="5" rx="2" fill="#a07828"/><rect x="12" y="14" width="6" height="4" fill="#f4d03f"/></svg>';
        } else {
            spot.textContent = i + 1;
        }
        spot.style.left = pos.x + '%';
        spot.style.top = pos.y + '%';
        spot.dataset.index = i;
        board.appendChild(spot);
    });

    var player = document.createElement('div');
    player.className = 'trail-player';
    player.id = 'trail-player';
    player.innerHTML = '<svg viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4"/><path d="M 4 22 Q 4 14, 12 14 Q 20 14, 20 22 Z"/></svg>';
    player.style.left = positions[0].x + '%';
    player.style.top = positions[0].y + '%';
    board.appendChild(player);

    state.trailPositions = positions;
    setTimeout(showNextTrailChallenge, 700);
}

function generateTrailPositions(count) {
    var positions = [];
    var perRow = 3;
    var rows = Math.ceil(count / perRow);
    var marginX = 15, marginY = 12;
    var availW = 100 - marginX * 2;
    var availH = 100 - marginY * 2;
    var stepY = rows > 1 ? availH / (rows - 1) : 0;
    var stepX = availW / (perRow - 1);
    for (var i = 0; i < count; i++) {
        var row = Math.floor(i / perRow);
        var col = i % perRow;
        if (row % 2 === 1) col = (perRow - 1) - col;
        var x = marginX + col * stepX;
        var y = marginY + row * stepY;
        x += (Math.random() - 0.5) * 4;
        y += (Math.random() - 0.5) * 2;
        positions.push({ x: x, y: y });
    }
    return positions;
}

function showNextTrailChallenge() {
    if (state.trailQuit) return;
    if (state.trailIndex >= state.trailTotal) {
        setTimeout(winTrailGame, 600);
        return;
    }
    var challenge = state.trailSteps[state.trailIndex];
    document.getElementById('trail-modal-text').textContent = challenge.q;
    var opts = challenge.opts.map(function(text, i) { return { text: text, originalIndex: i }; });
    shuffle(opts);
    var optsEl = document.getElementById('trail-modal-options');
    optsEl.innerHTML = '';
    opts.forEach(function(opt) {
        var btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt.text;
        btn.addEventListener('click', function() {
            handleTrailAnswer(btn, opt.originalIndex === challenge.correct, challenge.correct, opts);
        });
        optsEl.appendChild(btn);
    });
    document.getElementById('trail-modal').classList.add('active');
}

function handleTrailAnswer(btn, isCorrect, correctOriginalIndex, opts) {
    var allBtns = document.querySelectorAll('#trail-modal-options .quiz-option');
    allBtns.forEach(function(b) { b.disabled = true; });
    if (isCorrect) {
        btn.classList.add('correct');
        state.trailScore++;
    } else {
        btn.classList.add('wrong');
        allBtns.forEach(function(b, i) {
            if (opts[i].originalIndex === correctOriginalIndex) b.classList.add('correct');
        });
    }
    setTimeout(function() {
        document.getElementById('trail-modal').classList.remove('active');
        advanceTrailPlayer();
    }, 1300);
}

function advanceTrailPlayer() {
    if (state.trailQuit) return;
    state.trailIndex++;
    var spots = document.querySelectorAll('.trail-spot');
    if (spots[state.trailIndex - 1]) {
        spots[state.trailIndex - 1].classList.remove('current');
        spots[state.trailIndex - 1].classList.add('visited');
    }
    var nextPos = state.trailPositions[state.trailIndex];
    var player = document.getElementById('trail-player');
    if (player && nextPos) {
        player.style.left = nextPos.x + '%';
        player.style.top = nextPos.y + '%';
    }
    if (spots[state.trailIndex]) spots[state.trailIndex].classList.add('current');
    updateTrailStats();
    setTimeout(showNextTrailChallenge, 900);
}

function updateTrailStats() {
    document.getElementById('trail-position').textContent = state.trailIndex + '/' + state.trailTotal;
    document.getElementById('trail-stars').textContent = state.trailScore;
}

function quitTrail() {
    state.trailQuit = true;
    document.getElementById('trail-modal').classList.remove('active');
    var answered = state.trailIndex;
    if (answered === 0) { goHome(); return; }
    var pct = Math.round((state.trailScore / answered) * 100);
    var msg = 'Você respondeu ' + answered + ' de ' + state.trailTotal + ' perguntas.';
    var stats = '<p>Acertos: <strong>' + state.trailScore + '/' + answered + '</strong></p><p>Aproveitamento: <strong>' + pct + '%</strong></p>';
    showWinScreen('Jogo Encerrado', msg, stats, pct >= 50);
}

function winTrailGame() {
    var pct = Math.round((state.trailScore / state.trailTotal) * 100);
    var msg = '';
    if (pct === 100) msg = 'Você chegou ao tesouro sem errar nenhum passo!';
    else if (pct >= 70) msg = 'Você chegou ao tesouro! Muito bem!';
    else msg = 'Você chegou ao tesouro! Continue praticando!';
    var stats = '<p>Passos: <strong>' + state.trailTotal + '</strong></p><p>Acertos: <strong>' + state.trailScore + '/' + state.trailTotal + '</strong></p>';
    showWinScreen('Tesouro Encontrado!', msg, stats);
}

// ============================================================
// TIMER
// ============================================================
function startTimer(elId) {
    state.seconds = 0;
    stopTimer();
    state.timerEl = elId;
    if (elId) document.getElementById(elId).textContent = '00:00';
    state.timerInterval = setInterval(function() {
        state.seconds++;
        if (state.timerEl) {
            var el = document.getElementById(state.timerEl);
            if (el) el.textContent = formatTime(state.seconds);
        }
    }, 1000);
}

function stopTimer() {
    if (state.timerInterval) { clearInterval(state.timerInterval); state.timerInterval = null; }
}

function formatTime(s) {
    var m = Math.floor(s / 60).toString().padStart(2, '0');
    var sec = (s % 60).toString().padStart(2, '0');
    return m + ':' + sec;
}

// ============================================================
// VITÓRIA
// ============================================================
function showWinScreen(title, subtitle, statsHtml, withConfetti) {
    document.getElementById('win-title').textContent = title;
    document.getElementById('win-subtitle').textContent = subtitle;
    document.getElementById('win-stats').innerHTML = statsHtml;
    showScreen('screen-win');
    if (withConfetti !== false) spawnConfetti();
}

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

// ============================================================
// UTILS
// ============================================================
function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i]; arr[i] = arr[j]; arr[j] = temp;
    }
    return arr;
}

function sanitize(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function sanitizeAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============================================================
// SW (PWA)
// ============================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').catch(function(err) {
            console.log('SW registration failed:', err);
        });
    });
}

// ============================================================
// HTML ENTRY-POINT WRAPPERS (match onclick handlers in index.html)
// ============================================================
function startClassicMode() { startGame('memory'); }
function startQuizMode() { startGame('memquiz'); }
function startSuperQuiz() { startGame('quiz'); }
function startWordSearch() { startGame('wordsearch'); }
function startTrail() { startGame('trail'); }
function startSequence() {
    alert('Jogo "Sequência" em construção. Disponível nas próximas versões.');
}
function advanceTrail() { advanceTrailPlayer(); }
function resetSequence() { /* placeholder until sequence game is implemented */ }
