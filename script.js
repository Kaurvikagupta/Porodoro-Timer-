const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const pomodoroBtn = document.getElementById('pomodoro-btn');
const shortBreakBtn = document.getElementById('shortBreak-btn');
const longBreakBtn = document.getElementById('longBreak-btn');

let interval;
let isPaused = true;
let timeRemaining = 25 * 60;
let currentMode = 'pomodoro';

const modes = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

const updateDisplay = () => {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
};

const playSound = () => {
    const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = 0.5;

    oscillator.type = 'sine';
    oscillator.frequency.value = 440;

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
};

const countdown = () => {
    if (timeRemaining > 0) {
        timeRemaining--;
        updateDisplay();
    } else {
        clearInterval(interval);
        isPaused = true;
        playSound();
    }
};

startBtn.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        interval = setInterval(countdown, 1000);
    }
});

pauseBtn.addEventListener('click', () => {
    if (!isPaused) {
        isPaused = true;
        clearInterval(interval);
    }
});

resetBtn.addEventListener('click', () => {
    isPaused = true;
    clearInterval(interval);
    timeRemaining = modes[currentMode];
    updateDisplay();
});

const switchMode = (mode) => {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('bg-opacity-80', 'ring-2', 'ring-white');
    });

    document.getElementById(`${mode}-btn`).classList.add('bg-opacity-80', 'ring-2', 'ring-white');

    isPaused = true;
    clearInterval(interval);
    currentMode = mode;
    timeRemaining = modes[mode];
    updateDisplay();
};

pomodoroBtn.addEventListener('click', () => switchMode('pomodoro'));
shortBreakBtn.addEventListener('click', () => switchMode('shortBreak'));
longBreakBtn.addEventListener('click', () => switchMode('longBreak'));

window.addEventListener('load', () => {
    updateDisplay();
    switchMode('pomodoro');
});