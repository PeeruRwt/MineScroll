const popups = {
    helpBtn: 'helpPopup',
    plusBtn: 'plusPopup',
    settingsBtn: 'settingsPopup',
    mobileHelpBtn: 'helpPopup',
    mobilePlusBtn: 'plusPopup',
    mobileSettingsBtn: 'settingsPopup'
};
const closeButtons = {
    closeHelpPopup: 'helpPopup',
    closePlusPopup: 'plusPopup',
    closeLeaderboardPopup: 'leaderboardPopup',
    closeSettingsPopup: 'settingsPopup'
};
const restartPopup = document.getElementById('popup');
const hamburgerIcon = document.getElementById('hamburgerIcon');
const mobileMenu = document.querySelector('.mobile-menu');
const cursor = document.getElementById('cursor');
const container = document.querySelector('.container');
const content = document.querySelector('.content');
const arrowButton = document.getElementById('arrowButton');
const playButton = document.getElementById('playButton');
const restartButton = document.getElementById('restartButton');
const scoreValue = document.getElementById('scoreValue');
const bestScoreValue = document.getElementById('bestScoreValue');
const finalScore = document.getElementById('finalScore');
const mobileScoreValue = document.getElementById('mobileScoreValue');
const mobileBestScoreValue = document.getElementById('mobileBestScoreValue');
const helpPopup = document.getElementById('helpPopup');
const lineHeight = 23;
const containerHeight = container.clientHeight;
const upperThreshold = containerHeight * 0.25;
let topPosition = 0;
let isGameStarted = false;
let isGameOver = false;
let isMovingDownward = true;
let upwardMovementCount = 0;
let gameTimeout = null;
let score = 0;
let linesMoved = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
bestScoreValue.textContent = bestScore;
mobileBestScoreValue.textContent = bestScore;

let userTexts = [];
let placedTexts = new Set();
let userPlacementCount = 0;
const maxPlacementsPerVisit = 5;
let occupiedLines = new Set();

const dictionaryWords = [
    
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
    'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
    'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
    'is', 'are', 'was', 'were', 'been', 'has', 'had', 'do', 'does', 'did',
    'shall', 'will', 'should', 'would', 'may', 'might', 'must', 'can', 'could', 'ought',
    'about', 'above', 'across', 'after', 'against', 'along', 'among', 'around', 'at', 'before',
    'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'but', 'by', 'concerning', 'considering',
    'despite', 'down', 'during', 'except', 'for', 'from', 'in', 'inside', 'into', 'like',
    'near', 'of', 'off', 'on', 'onto', 'out', 'outside', 'over', 'past', 'regarding',
    'round', 'since', 'through', 'throughout', 'to', 'toward', 'under', 'underneath', 'until', 'unto',
    'up', 'upon', 'with', 'within', 'without', 'according', 'ahead', 'alongside', 'apart', 'aside',
    'astride', 'atop', 'bar', 'barring', 'because', 'beforehand', 'behindhand', 'belowstairs', 'beneath', 'besides',
    'between', 'betwixt', 'beyond', 'but', 'by', 'circa', 'concerning', 'considering', 'despite', 'down',
    'during', 'except', 'excluding', 'failing', 'following', 'for', 'from', 'given', 'in', 'including',
    'inside', 'into', 'like', 'minus', 'near', 'notwithstanding', 'of', 'off', 'on', 'onto',
    'opposite', 'out', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save',
    'since', 'than', 'through', 'throughout', 'till', 'times', 'to', 'toward', 'under', 'underneath',
    'unlike', 'until', 'up', 'upon', 'versus', 'via', 'with', 'within', 'without', 'worth',
    'a', 'an', 'the', 'some', 'any', 'no', 'every', 'each', 'either', 'neither',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these',
    'those', 'such', 'what', 'which', 'whose', 'another', 'other', 'one', 'two', 'three',
    'first', 'second', 'third', 'last', 'next', 'many', 'few', 'several', 'much', 'little',
    'more', 'most', 'less', 'least', 'enough', 'all', 'both', 'half', 'such', 'same',
    'different', 'own', 'same', 'so', 'as', 'than', 'too', 'very', 'quite', 'rather',
    'somewhat', 'enough', 'indeed', 'still', 'almost', 'enough', 'even', 'just', 'only', 'really',
    'almost', 'enough', 'even', 'just', 'only', 'really', 'almost', 'enough', 'even', 'just',
    'only', 'really', 'almost', 'enough', 'even', 'just', 'only', 'really', 'almost', 'enough',
    'even', 'just', 'only', 'really', 'almost', 'enough', 'even', 'just', 'only', 'really',
    'I', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her',
    'us', 'them', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'yourselves', 'themselves',
    'who', 'whom', 'whose', 'which', 'what', 'that', 'these', 'those', 'anybody', 'anyone',
    'anything', 'each', 'either', 'everybody', 'everyone', 'everything', 'neither', 'nobody', 'none', 'nothing',
    'one', 'other', 'somebody', 'someone', 'something', 'both', 'few', 'many', 'several', 'all',
    'any', 'more', 'most', 'some', 'such', 'no', 'own', 'same', 'so', 'than',
    'too', 'very', 'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might',
    'must', 'ought', 'need', 'dare', 'used', 'do', 'does', 'did', 'doing', 'done',
    'have', 'has', 'had', 'having', 'be', 'am', 'is', 'are', 'was', 'were',
    'being', 'been', 'get', 'gets', 'got', 'gotten', 'getting', 'seem', 'seems', 'seemed',
    'seeming', 'become', 'becomes', 'became', 'becoming', 'remain', 'remains', 'remained', 'remaining', 'appear',
    'appears', 'appeared', 'appearing', 'feel', 'feels', 'felt', 'feeling', 'look', 'looks', 'looked',
    'looking', 'sound', 'sounds', 'sounded', 'sounding', 'taste', 'tastes', 'tasted', 'tasting', 'smell',
    'smells', 'smelled', 'smelling', 'grow', 'grows', 'grew', 'grown', 'growing', 'prove', 'proves',
    'proved', 'proven', 'proving', 'stay', 'stays', 'stayed', 'staying', 'turn', 'turns', 'turned',
    'turning', 'go', 'goes', 'went', 'gone', 'going', 'come', 'comes', 'came', 'coming',
    'run', 'runs', 'ran', 'run', 'running', 'fall', 'falls', 'fell', 'fallen', 'falling',
    'stand', 'stands', 'stood', 'standing', 'sit', 'sits', 'sat', 'sitting', 'lie', 'lies',
    'lay', 'lain', 'lying', 'arise', 'arises', 'arose', 'arisen', 'arising', 'awake', 'awakes',
    'awoke', 'awoken', 'awaking', 'bear', 'bears', 'bore', 'born', 'bearing', 'beat', 'beats',
    'beat', 'beaten', 'beating', 'become', 'becomes', 'became', 'become', 'becoming', 'begin', 'begins',
    'began', 'begun', 'beginning', 'bend', 'bends', 'bent', 'bending', 'bet', 'bets', 'bet',
    'betting', 'bid', 'bids', 'bid', 'bidding', 'bind', 'binds', 'bound', 'binding', 'bite',
    'bites', 'bit', 'bitten', 'biting', 'bleed', 'bleeds', 'bled', 'bleeding', 'blow', 'blows',
    'blew', 'blown', 'blowing', 'break', 'breaks', 'broke', 'broken', 'breaking', 'bring', 'brings',
    'brought', 'bringing', 'build', 'builds', 'built', 'building', 'burn', 'burns', 'burned', 'burning',
    'burst', 'bursts', 'burst', 'bursting', 'buy', 'buys', 'bought', 'buying', 'catch', 'catches',
    'caught', 'catching', 'choose', 'chooses', 'chose', 'chosen', 'choosing', 'come', 'comes', 'came',
    'coming', 'cost', 'costs', 'cost', 'costing', 'cut', 'cuts', 'cut', 'cutting', 'dig',
    'digs', 'dug', 'digging', 'do', 'does', 'did', 'done', 'doing', 'draw', 'draws',
    'drew', 'drawn', 'drawing', 'dream', 'dreams', 'dreamed', 'dreaming', 'drive', 'drives', 'drove',
    'driven', 'driving', 'drink', 'drinks', 'drank', 'drunk', 'drinking', 'eat', 'eats', 'ate',
    'eaten', 'eating', 'fall', 'falls', 'fell', 'fallen', 'falling', 'feed', 'feeds', 'fed',
    'feeding', 'feel', 'feels', 'felt', 'feeling', 'fight', 'fights', 'fought', 'fighting', 'find',
    'finds', 'found', 'finding', 'fly', 'flies', 'flew', 'flown', 'flying', 'forget', 'forgets',
    'forgot', 'forgotten', 'forgetting', 'forgive', 'forgives', 'forgave', 'forgiven', 'forgiving', 'freeze', 'freezes',
    'froze', 'frozen', 'freezing', 'get', 'gets', 'got', 'gotten', 'getting', 'give', 'gives',
    'gave', 'given', 'giving', 'go', 'goes', 'went', 'gone', 'going', 'grow', 'grows',
    'grew', 'grown', 'growing', 'hang', 'hangs', 'hung', 'hanging', 'have', 'has', 'had',
    'having', 'hear', 'hears', 'heard', 'hearing', 'hide', 'hides', 'hid', 'hidden', 'hiding',
    'hit', 'hits', 'hit', 'hitting', 'hold', 'holds', 'held', 'holding', 'hurt', 'hurts',
    'hurt', 'hurting', 'keep', 'keeps', 'kept', 'keeping', 'know', 'knows', 'knew', 'known',
    'knowing', 'lay', 'lays', 'laid', 'laying', 'lead', 'leads', 'led', 'leading', 'learn',
    'learns', 'learned', 'learning', 'leave', 'leaves', 'left', 'leaving', 'lend', 'lends', 'lent',
    'lending', 'let', 'lets', 'let', 'letting', 'lie', 'lies', 'lay', 'lain', 'lying',
    'light', 'lights', 'lit', 'lighting', 'lose', 'loses', 'lost', 'losing', 'make', 'makes',
    'made', 'making', 'mean', 'means', 'meant', 'meaning', 'meet', 'meets', 'met', 'meeting',
    'pay', 'pays', 'paid', 'paying', 'put', 'puts', 'put', 'putting', 'read', 'reads',
    'read', 'reading', 'ride', 'rides', 'rode', 'ridden', 'riding', 'ring', 'rings', 'rang',
    'rung', 'ringing', 'rise', 'rises', 'rose', 'risen', 'rising', 'run', 'runs', 'ran',
    'run', 'running', 'say', 'says', 'said', 'saying', 'see', 'sees', 'saw', 'seen',
    'seeing', 'sell', 'sells', 'sold', 'selling', 'send', 'sends', 'sent', 'sending', 'set',
    'sets', 'set', 'setting', 'shake', 'shakes', 'shook', 'shaken', 'shaking', 'shine', 'shines',
    'shone', 'shining', 'shoot', 'shoots', 'shot', 'shooting', 'show', 'shows', 'showed', 'shown',
    'showing', 'shut', 'shuts', 'shut', 'shutting', 'sing', 'sings', 'sang', 'sung', 'singing',
    'sink', 'sinks', 'sank', 'sunk', 'sinking', 'sit', 'sits', 'sat', 'sitting', 'sleep',
    'sleeps', 'slept', 'sleeping', 'speak', 'speaks', 'spoke', 'spoken', 'speaking', 'spend', 'spends',
    'spent', 'spending', 'stand', 'stands', 'stood', 'standing', 'steal', 'steals', 'stole', 'stolen',
    'stealing', 'stick', 'sticks', 'stuck', 'sticking', 'strike', 'strikes', 'struck', 'struck', 'striking',
    'swear', 'swears', 'swore', 'sworn', 'swearing', 'sweep', 'sweeps', 'swept', 'sweeping', 'swim',
    'swims', 'swam', 'swum', 'swimming', 'take', 'takes', 'took', 'taken', 'taking', 'teach',
    'teaches', 'taught', 'teaching', 'tear', 'tears', 'tore', 'torn', 'tearing', 'tell', 'tells',
    'told', 'telling', 'think', 'thinks', 'thought', 'thinking', 'throw', 'throws', 'threw', 'thrown',
    'throwing', 'understand', 'understands', 'understood', 'understanding', 'wake', 'wakes', 'woke', 'woken', 'waking',
    'wear', 'wears', 'wore', 'worn', 'wearing', 'win', 'wins', 'won', 'winning', 'write',
    'writes', 'wrote', 'written', 'writing'
];

const totalPages = 625;
const totalLines = 5000;
const linesPerPage = totalLines / totalPages;
const protectedLines = 24;
const contentGenerationChunkSize = 100;

helpPopup.style.display = 'none';
helpPopup.style.opacity = '0';
helpPopup.style.transition = 'opacity 0.3s ease';

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem('hasVisitedBefore')) {
        localStorage.setItem('hasVisitedBefore', 'true');
        setTimeout(() => {
            helpPopup.style.display = 'block';
            setTimeout(() => {
                helpPopup.style.opacity = '1';
            }, 10);
        }, 300);
    }

    initCoreGame();
    
    requestIdleCallback(() => {
        initUI();
        preGenerateContent();
    });

    container.addEventListener('scroll', preventScroll, { passive: false });
    container.addEventListener('scroll', handleContainerScroll);
    document.addEventListener('keydown', preventKeyScroll);
    container.addEventListener('touchmove', preventTouchScroll, { passive: false });
    
    hamburgerIcon.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        mobileMenu.classList.toggle('show');
    });

    document.addEventListener('click', function() {
        hamburgerIcon.classList.remove('active');
        mobileMenu.classList.remove('show');
    });

    if (window.innerWidth > 1020) {
        initShareSidebar();
    }
});

function preventScroll(e) {
    if (!isGameStarted || isGameOver) {
        e.preventDefault();
    }
}

function handleContainerScroll() {
    if (container.scrollTop < 0) {
        container.scrollTop = 0;
    }
    const maxScroll = content.clientHeight - container.clientHeight;
    if (container.scrollTop > maxScroll) {
        container.scrollTop = maxScroll;
    }
}

function initCoreGame() {
    mobileScoreValue.textContent = score;
    mobileBestScoreValue.textContent = bestScore;
    
    const savedCursorSize = localStorage.getItem('cursorSize') || '2';
    const savedCursorColor = localStorage.getItem('cursorColor');
    cursor.style.width = `${savedCursorSize}px`;
    
    if (!savedCursorColor) {
        cursor.style.backgroundColor = document.body.classList.contains('dark-mode') ? 'white' : 'black';
    } else {
        cursor.style.backgroundColor = savedCursorColor;
    }
    
    document.querySelectorAll('.color-option').forEach(option => {
        if (option.dataset.color === savedCursorColor) {
            option.classList.add('selected');
        }
    });
}

function initUI() {
    const cursorSizeInput = document.getElementById('cursorSizeInput');
    cursorSizeInput.value = localStorage.getItem('cursorSize') || '2';
    
    cursorSizeInput.addEventListener('input', function() {
        const rawValue = this.value;
        if (rawValue.length > 0) {
            let size = parseFloat(rawValue);
            if (isNaN(size)) size = 2;
            size = Math.max(1, Math.min(5, size));
            this.value = size;
            cursor.style.width = `${size}px`;
            localStorage.setItem('cursorSize', size);
        }
    });
    
    cursorSizeInput.addEventListener('blur', function() {
        if (this.value === '') {
            this.value = 2;
            cursor.style.width = '2px';
            localStorage.setItem('cursorSize', '2');
        }
    });
    
    const numberInput = document.getElementById('numberInput');
    const timesMaxText = document.getElementById('timesMaxText');
    
    numberInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (value > 100) {
            this.value = 100;
            timesMaxText.textContent = 'max.100';
            timesMaxText.style.opacity = '1';
            setTimeout(() => {
                timesMaxText.style.opacity = '0';
            }, 2000);
        } else if (value < 1) {
            this.value = 1;
        }
    });
}

for (const [btnId, popupId] of Object.entries(popups)) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (restartPopup.style.display === 'block') {
                restartPopup.style.display = 'none';
            }
            for (const popup of Object.values(popups)) {
                const popupElement = document.getElementById(popup);
                if (popup === popupId) {
                    popupElement.style.display = 'block';
                    setTimeout(() => {
                        popupElement.style.opacity = '1';
                    }, 10);
                } else {
                    popupElement.style.opacity = '0';
                    setTimeout(() => {
                        popupElement.style.display = 'none';
                    }, 300);
                }
            }
            hamburgerIcon.classList.remove('active');
            mobileMenu.classList.remove('show');
        });
    }
}

for (const [btnId, popupId] of Object.entries(closeButtons)) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const popupElement = document.getElementById(popupId);
            popupElement.style.opacity = '0';
            setTimeout(() => {
                popupElement.style.display = 'none';
                if (restartPopup.style.display === 'none' && isGameOver) {
                    restartPopup.style.display = 'block';
                }
            }, 300);
            hamburgerIcon.classList.remove('active');
            mobileMenu.classList.remove('show');
        });
    }
}

document.addEventListener('click', (e) => {
    let clickedInsidePopup = false;
    for (const popupId of Object.values(popups)) {
        const popup = document.getElementById(popupId);
        if (popup && popup.contains(e.target)) {
            clickedInsidePopup = true;
            break;
        }
    }
    
    if (!clickedInsidePopup) {
        for (const popupId of Object.values(popups)) {
            const popupElement = document.getElementById(popupId);
            popupElement.style.opacity = '0';
            setTimeout(() => {
                popupElement.style.display = 'none';
            }, 300);
        }
        if (restartPopup.style.display === 'none' && isGameOver) {
            restartPopup.style.display = 'block';
        }
        hamburgerIcon.classList.remove('active');
        mobileMenu.classList.remove('show');
    }
});

function preventKeyScroll(e) {
    if ((!isGameStarted || isGameOver) && (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown')) {
        e.preventDefault();
    }
}

function preventTouchScroll(e) {
    if (!isGameStarted || isGameOver) {
        e.preventDefault();
    }
}

const plusInput = document.getElementById("plusInput");
plusInput.addEventListener("input", function () {
    if (this.value.length > 50) {
        this.value = this.value.slice(0, 50);
    }
});

plusInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const inputText = plusInput.value.trim();
        if (inputText) {
            placeUserText(inputText);
            document.getElementById("plusPopup").style.display = "none";
            hamburgerIcon.classList.remove('active');
            mobileMenu.classList.remove('show');
            
            if (isGameOver) {
                restartPopup.style.display = 'block';
            }
        } else {
            alert("Please enter some text!");
        }
    }
});

document.getElementById("fullscreenBtn").addEventListener("click", function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

document.getElementById("mobileFullscreenBtn").addEventListener("click", function () {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
    document.querySelector('.mobile-menu').classList.remove('show');
    hamburgerIcon.classList.remove('active');
});

const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
    if (!localStorage.getItem('cursorColor')) {
        cursor.style.backgroundColor = this.checked ? 'white' : 'black';
    }
});

const soundToggle = document.getElementById("soundToggle");
const cursorSound = new Audio('https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3');
const gameEndSound = new Audio('gameover.mp3');
cursorSound.volume = 0.1;
gameEndSound.volume = 1;

soundToggle.addEventListener("change", function () {
    if (this.checked) {
        cursorSound.volume = 0;
        gameEndSound.volume = 0;
    } else {
        cursorSound.volume = 1;
        gameEndSound.volume = 1.5;
    }
});

const hardModeToggle = document.querySelector("#settingsPopup input[type='checkbox']");
let isHardMode = false;

hardModeToggle.addEventListener("change", function () {
    isHardMode = this.checked;
});

const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
    option.addEventListener('click', function() {
        const color = this.dataset.color;
        cursor.style.backgroundColor = color;
        localStorage.setItem('cursorColor', color);
        
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
    });
});

function preGenerateContent() {
    generateContentChunk(0, 500);
    setTimeout(() => {
        generateContentChunk(500, totalLines);
        placeDictionaryWords();
    }, 300);
}

function generateRandomContent() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const words = ['I am 21', 'ipsum', 'dolor', 'Dollar bill', 'amet', 'consectetur', 'Broke', 'elit', 'sed', 'do', 'eiusmod', 'Peeru', 'incididunt', 'ut', 'Help', 'et', 'You can do it', 'magna', 'aliqua'];
    const randomType = Math.random() < 0.5 ? 'character' : 'word';

    if (randomType === 'character') {
        return {
            content: characters[Math.floor(Math.random() * characters.length)],
            type: 'character'
        };
    } else {
        return {
            content: words[Math.floor(Math.random() * words.length)],
            type: 'word'
        };
    }
}

function placeDictionaryWords() {
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const wordsContainer = document.getElementById("dictionaryWordsContainer");

    wordsContainer.innerHTML = '';

    const dictionaryDensity = isHardMode ? 0.15 : 0.10;
    const batchSize = 500;
    let currentLine = 0;
    
    function processBatch() {
        const endLine = Math.min(currentLine + batchSize, totalLines);
        
        for (; currentLine < endLine; currentLine++) {
            if (currentLine >= protectedLines && Math.random() < dictionaryDensity) {
                const word = dictionaryWords[Math.floor(Math.random() * dictionaryWords.length)];
                const wordElement = document.createElement("div");
                wordElement.className = "dictionary-word";
                
                const randomValue = Math.random();
                if (randomValue < 0.05) {
                    wordElement.classList.add('dark-grey');
                } else if (randomValue < 0.1) {
                    const colorClasses = ['blue-color', 'red-color', 'yellow-color', 'green-color'];
                    const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
                    wordElement.classList.add(randomColor);
                }

                wordElement.textContent = word;
                wordElement.style.left = `${Math.floor(Math.random() * (containerWidth - 50))}px`;
                wordElement.style.top = `${currentLine * lineHeight}px`;
                wordsContainer.appendChild(wordElement);
            }
        }
        
        if (currentLine < totalLines) {
            requestAnimationFrame(processBatch);
        }
    }
    
    processBatch();
}

function generateContentChunk(startLine, endLine) {
    const contentContainer = document.getElementById("userTextContainer");
    const colorClasses = [
        'blue-color',
        'red-color',
        'yellow-color',
        'green-color'
    ];

    const userTextElements = Array.from(contentContainer.querySelectorAll('.user-text.colored'));
    contentContainer.innerHTML = '';
    userTextElements.forEach(el => contentContainer.appendChild(el));

    const randomDensity = isHardMode ? 0.15 : 0.12;

    for (let currentLine = startLine; currentLine < endLine; currentLine++) {
        if (currentLine >= protectedLines && Math.random() < randomDensity) {
            const randomContent = generateRandomContent();
            const textElement = document.createElement("div");
            textElement.className = "user-text";
            
            const randomValue = Math.random();
            if (randomValue < 0.05) {
                textElement.classList.add('dark-grey');
            } else if (randomValue < 0.1) {
                const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
                textElement.classList.add(randomColor);
            }

            textElement.textContent = randomContent.content;
            textElement.style.left = `${Math.floor(Math.random() * (container.clientWidth - 50))}px`;
            textElement.style.top = `${currentLine * lineHeight}px`;
            contentContainer.appendChild(textElement);
        }
    }
}

function placeUserText(text) {
    if (placedTexts.has(text)) {
        alert("You can only place your text once per visit!");
        return;
    }

    if (userPlacementCount >= maxPlacementsPerVisit) {
        alert("You can only place text 5 times per visit!");
        return;
    }

    const timesToDisplay = parseInt(document.getElementById("numberInput").value) || 1;
    const times = Math.min(Math.max(timesToDisplay, 1), 100);

    const colors = [
        'rgb(66, 133, 244)',
        'rgb(219, 68, 55)',
        'rgb(244, 180, 0)',
        'rgb(15, 157, 88)'
    ];

    for (let i = 0; i < times; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "user-text colored";
        
        const asterisk = document.createElement("span");
        asterisk.className = "asterisk";
        asterisk.textContent = "*";
        
        const textElement = document.createElement("span");
        textElement.textContent = text;
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        asterisk.style.color = randomColor;
        textElement.style.color = randomColor;

        wrapper.appendChild(asterisk);
        wrapper.appendChild(textElement);

        document.getElementById("userTextContainer").appendChild(wrapper);

        const textWidth = wrapper.offsetWidth;

        document.getElementById("userTextContainer").removeChild(wrapper);

        const containerRect = container.getBoundingClientRect();
        const maxLeft = containerRect.width - textWidth;

        const randomPage = Math.floor(Math.random() * totalPages);
        const randomLineInPage = Math.floor(Math.random() * linesPerPage);
        const randomTop = (randomPage * linesPerPage + randomLineInPage) * lineHeight;
        const randomLeft = Math.floor(Math.random() * maxLeft);

        wrapper.style.left = `${Math.max(0, Math.min(randomLeft, maxLeft))}px`;
        wrapper.style.top = `${randomTop}px`;

        document.getElementById("userTextContainer").appendChild(wrapper);

        userTexts.push({ text, element: wrapper });
    }

    placedTexts.add(text);
    userPlacementCount++;

    document.getElementById("plusInput").value = "";
}

document.getElementById("placeButton").addEventListener("click", () => {
    const inputText = document.getElementById("plusInput").value.trim();
    if (inputText) {
        placeUserText(inputText);
        document.getElementById("plusPopup").style.display = "none";
        hamburgerIcon.classList.remove('active');
        mobileMenu.classList.remove('show');
        
        if (isGameOver) {
            restartPopup.style.display = 'block';
        }
    } else {
        alert("Please enter some text!");
    }
});

function getRandomSpeed() {
    const fractionalValues = [
        5.0, 5.3, 5.6, 5.9, 6.2, 6.5, 6.8, 7.1, 7.4, 7.7, 8.0, 8.3, 8.6, 8.9, 9.2, 9.5, 
        9.8, 10.1, 10.4, 10.7, 11.0, 11.3, 11.6, 11.9, 12.2, 12.5, 12.8, 13.1, 13.4, 13.7, 
        14.0, 14.3, 14.6, 14.9, 15.2, 15.5, 15.8, 16.1, 16.4, 16.7, 17.0, 17.3, 17.6, 17.9, 
        18.2, 18.5, 18.8, 19.1, 19.4, 19.7, 20.0
    ];
    
    let baseSpeed;
    if (!isHardMode) {
        if (score <= 50) {
            const progress = score / 50;
            baseSpeed = 5 + (progress * 10); // Start at 5x speed
        } else {
            const post50Progress = Math.min(1, (score - 50) / 50);
            baseSpeed = 15 + (post50Progress * 5);
        }
    } else {
        if (score <= 50) {
            const progress = score / 50;
            baseSpeed = 5 + (progress * 15); // Start at 5x speed
        } else {
            if (Math.random() < 0.005) {
                baseSpeed = 20 + (Math.random() * 5);
            } else {
                baseSpeed = 20;
            }
        }
    }

    if (Math.random() < 0.5) {
        return fractionalValues[Math.floor(Math.random() * fractionalValues.length)];
    }
    return parseFloat(baseSpeed.toFixed(1));
}

function isCursorOutOfBounds() {
    const cursorRect = cursor.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return (
        cursorRect.top < containerRect.top ||
        cursorRect.bottom > containerRect.bottom
    );
}

function updateScore() {
    if (isMovingDownward) {
        linesMoved++;
        if (linesMoved % 8 === 0) {
            score++;
            scoreValue.textContent = score;
            mobileScoreValue.textContent = score;
            
            scoreValue.classList.add('score-pop');
            setTimeout(() => {
                scoreValue.classList.remove('score-pop');
            }, 300);
            
            if (score > bestScore) {
                bestScore = score;
                bestScoreValue.textContent = bestScore;
                mobileBestScoreValue.textContent = bestScore;
                localStorage.setItem('bestScore', bestScore);
            }
        }
    }
}

function changeCursorColor() {
    const colors = [
        'rgb(66, 133, 244)',
        'rgb(219, 68, 55)',
        'rgb(244, 180, 0)',
        'rgb(15, 157, 88)'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    cursor.style.backgroundColor = randomColor;
    setTimeout(() => {
        const savedColor = localStorage.getItem('cursorColor');
        cursor.style.backgroundColor = savedColor || (document.body.classList.contains('dark-mode') ? 'white' : 'black');
    }, 3000 + Math.random() * 1000);
}

function triggerGameEndVibration() {
    if ("vibrate" in navigator) {
        navigator.vibrate([500]);
    }
}

function handlePageTransition() {
    container.classList.add('new-page-transition');
    
    generateContentChunk(0, totalLines);
    placeDictionaryWords();
    
    setTimeout(() => {
        container.classList.remove('new-page-transition');
    }, 500);
}

function moveCursor() {
    const totalContentHeight = content.clientHeight;
    const lastLineThreshold = totalContentHeight - (24 * lineHeight);

    if (topPosition >= lastLineThreshold) {
        handlePageTransition();
        
        container.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        topPosition = 24 * lineHeight;
    }

    if (topPosition + lineHeight <= totalContentHeight && topPosition >= 0) {
        const randomLeft = Math.random() * (container.clientWidth - cursor.clientWidth);
        cursor.style.left = `${randomLeft}px`;

        if (isHardMode) {
            if (Math.random() < 0.08) {
                topPosition += lineHeight * (Math.floor(Math.random() * 2) + 2);
            }
            if (Math.random() < 0.05) {
                changeCursorColor();
            }
        }

        const randomJump = Math.random();
        if (randomJump < 0.07) {
            topPosition += lineHeight * 2;
        } else if (randomJump < 0.14) {
            topPosition += lineHeight * 3;
        } else {
            if (linesMoved < 24) {
                isMovingDownward = true;
            } else {
                if (topPosition <= upperThreshold && Math.random() < 0.2 && upwardMovementCount < 2) {
                    isMovingDownward = false;
                    upwardMovementCount++;
                } else {
                    isMovingDownward = true;
                    upwardMovementCount = 0;
                }
            }
            if (isMovingDownward) {
                topPosition += lineHeight;
                updateScore();
            } else {
                topPosition -= lineHeight;
            }
        }

        // Fixed cursor alignment with lines
        cursor.style.top = `${Math.floor(topPosition / lineHeight) * lineHeight}px`;

        if (!soundToggle.checked) {
            cursorSound.currentTime = 0;
            cursorSound.play();
        }

        if (isCursorOutOfBounds()) {
            container.classList.add('out-of-bounds');
            cursor.classList.add('no-blink');
            restartPopup.style.display = 'block';
            isGameOver = true;
            finalScore.textContent = score;
            triggerGameEndVibration();
            if (!soundToggle.checked) {
                gameEndSound.currentTime = 0;
                gameEndSound.play();
            }
            return;
        }

        const randomSpeed = getRandomSpeed();
        const delay = isHardMode ? 650 / randomSpeed : 850 / randomSpeed;
        gameTimeout = setTimeout(moveCursor, delay);
    }
    else {
        cursor.style.display = 'none';
        cursor.classList.add('no-blink');
        container.classList.add('out-of-bounds');
        restartPopup.style.display = 'block';
        isGameOver = true;
        finalScore.textContent = score;
        
        triggerGameEndVibration();
        
        if (!soundToggle.checked) {
            gameEndSound.currentTime = 0;
            gameEndSound.play();
        }
    }
}

function resetGame() {
    if (gameTimeout) {
        clearTimeout(gameTimeout);
        gameTimeout = null;
    }

    container.classList.remove('out-of-bounds');
    void container.offsetWidth;
    
    restartPopup.style.display = 'none';
    
    topPosition = 0;
    isGameStarted = true;
    isGameOver = false;
    playButton.style.display = 'none';
    isMovingDownward = true;
    upwardMovementCount = 0;
    linesMoved = 0;
    score = 0;
    scoreValue.textContent = '0';
    mobileScoreValue.textContent = '0';
    
    cursor.style.display = 'block';
    cursor.style.top = '0px';
    cursor.style.left = '0px';
    cursor.classList.remove('no-blink');
    
    container.scrollTop = 0;
    
    moveCursor();
    
    const userTextContainer = document.getElementById("userTextContainer");
    const dictionaryContainer = document.getElementById("dictionaryWordsContainer");
    
    const userPlacedTexts = Array.from(userTextContainer.querySelectorAll('.user-text.colored'));
    
    userTextContainer.innerHTML = '';
    dictionaryContainer.innerHTML = '';
    
    userPlacedTexts.forEach(text => userTextContainer.appendChild(text));
    
    let currentLine = 0;
    
    function generateContentChunk() {
        const endLine = Math.min(currentLine + contentGenerationChunkSize, totalLines);
        
        const startLine = currentLine < protectedLines ? protectedLines : currentLine;
        
        if (startLine < endLine) {
            const fragment = document.createDocumentFragment();
            
            for (let line = startLine; line < endLine; line++) {
                if (Math.random() < (isHardMode ? 0.15 : 0.12)) {
                    const randomContent = generateRandomContent();
                    const textElement = document.createElement("div");
                    textElement.className = "user-text";
                    
                    const randomValue = Math.random();
                    if (randomValue < 0.05) {
                        textElement.classList.add('dark-grey');
                    } else if (randomValue < 0.1) {
                        const colorClasses = ['blue-color', 'red-color', 'yellow-color', 'green-color'];
                        const randomColor = colorClasses[Math.floor(Math.random() * colorClasses.length)];
                        textElement.classList.add(randomColor);
                    }

                    textElement.textContent = randomContent.content;
                    textElement.style.left = `${Math.floor(Math.random() * (container.clientWidth - 50))}px`;
                    textElement.style.top = `${line * lineHeight}px`;
                    fragment.appendChild(textElement);
                }
            }
            
            userTextContainer.appendChild(fragment);
            currentLine = endLine;
        }
        
        if (currentLine < totalLines) {
            requestIdleCallback(generateContentChunk);
        } else {
            placeDictionaryWords();
        }
    }
    
    requestIdleCallback(generateContentChunk);
}

function startGame() {
    if (!isGameStarted) {
        isGameStarted = true;
        playButton.style.display = 'none';
        cursor.style.display = 'block';
        
        container.removeEventListener('scroll', preventScroll);
        container.removeEventListener('scroll', handleContainerScroll);
        document.removeEventListener('keydown', preventKeyScroll);
        container.removeEventListener('touchmove', preventTouchScroll);
        
        moveCursor();
    }
}

playButton.addEventListener('click', startGame);

restartButton.addEventListener('click', resetGame);

arrowButton.addEventListener('click', () => {
    if (!isGameOver && isGameStarted) {
        container.scrollBy({
            top: 100,
            behavior: 'smooth'
        });
    }
});

document.addEventListener('keydown', (event) => {
    if ((event.key === 's' || event.key === 'S' || event.key === 'ArrowDown') && !isGameOver && isGameStarted) {
        container.scrollBy({
            top: 100,
            behavior: 'smooth'
        });
    }
});

let touchStartY = 0;
container.addEventListener('touchstart', (event) => {
    if (!isGameOver && isGameStarted) {
        touchStartY = event.touches[0].clientY;
        event.preventDefault();
    }
});

container.addEventListener('touchmove', (event) => {
    if (!isGameOver && isGameStarted) {
        const touchEndY = event.touches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        container.scrollBy({
            top: -deltaY * 1.5,
            behavior: 'auto'
        });
        touchStartY = touchEndY;
        event.preventDefault();
    }
});

function initShareSidebar() {
    const shareButtons = document.querySelectorAll('.share-button');
    const sidebar = document.querySelector('.social-share-sidebar');
    const toggleCollapse = document.querySelector('.toggle-collapse');
    let isCollapsed = false;

    setTimeout(() => {
        toggleCollapse.classList.remove('visible');
    }, 2000);

    toggleCollapse.addEventListener('click', function() {
        isCollapsed = !isCollapsed;
        
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            toggleCollapse.classList.add('collapsed');
            toggleCollapse.innerHTML = '<i class="fas fa-chevron-left"></i>';
        } else {
            sidebar.classList.remove('collapsed');
            toggleCollapse.classList.remove('collapsed');
            toggleCollapse.innerHTML = '<i class="fas fa-chevron-right"></i>';
        }
        
        if (isCollapsed) {
            setTimeout(() => {
                toggleCollapse.classList.remove('visible');
            }, 1000);
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (e.clientX < 70 && !isCollapsed) {
            toggleCollapse.classList.add('visible');
        } else if (e.clientX > 70 && !isCollapsed) {
            toggleCollapse.classList.remove('visible');
        }
        
        if (isCollapsed && e.clientX < 30) {
            toggleCollapse.classList.add('visible');
        } else if (isCollapsed && e.clientX > 30) {
            toggleCollapse.classList.remove('visible');
        }
    });

    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const platform = this.getAttribute('data-platform');
            shareOnPlatform(platform);
        });
    });

    function shareOnPlatform(platform) {
        const currentUrl = encodeURIComponent(window.location.href);
        const currentTitle = encodeURIComponent(document.title);
        let shareUrl = '';

        switch(platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
                window.open(shareUrl, 'fb-share-dialog', 'width=626,height=436');
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${currentTitle}`;
                window.open(shareUrl, 'twitter-share', 'width=550,height=420');
                break;
            case 'pinterest':
                const image = document.querySelector('meta[property="og:image"]')?.content || '';
                shareUrl = `https://pinterest.com/pin/create/button/?url=${currentUrl}&media=${encodeURIComponent(image)}&description=${currentTitle}`;
                window.open(shareUrl, 'pinterest-share', 'width=750,height=600');
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
                window.open(shareUrl, 'linkedin-share', 'width=600,height=500');
                break;
            case 'email':
                shareUrl = `mailto:?subject=${currentTitle}&body=Check%20this%20out:%20${currentUrl}`;
                window.location.href = shareUrl;
                break;
            case 'more':
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        url: window.location.href
                    }).catch(console.error);
                } else {
                    alert('More sharing options would open here');
                }
                break;
        }
    }
}