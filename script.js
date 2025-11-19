// Get all the elements
const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timeDisplay = document.getElementById('timeDisplay');
const status = document.getElementById('status');
const timerContainer = document.querySelector('.timer-container');

// Timer variables
let timerInterval;
let timeLeft = 0;
let isRunning = false;

// Update display function
function updateDisplay() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    document.getElementById('displayHours').textContent = 
        hours.toString().padStart(2, '0');
    document.getElementById('displayMinutes').textContent = 
        minutes.toString().padStart(2, '0');
    document.getElementById('displaySeconds').textContent = 
        seconds.toString().padStart(2, '0');
}

// Start timer function
function startTimer() {
    // Get time from inputs
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;

    timeLeft = hours * 3600 + minutes * 60 + seconds;

    // Check if time is valid
    if (timeLeft <= 0) {
        status.textContent = 'Please set a time greater than 0!';
        status.style.color = '#f44336';
        return;
    }

    // Start the timer
    isRunning = true;
    timerInterval = setInterval(() => {
        timeLeft--;
        updateDisplay();

        // Check if timer finished
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishTimer();
            return;
        }

        // Update status
        status.textContent = 'Timer running...';
        status.style.color = 'rgba(255, 255, 255, 0.9)';
    }, 1000);

    // Update UI
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    timerContainer.classList.add('running');
    status.textContent = 'Timer started!';
}

// Pause timer function
function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        pauseBtn.textContent = '▶️ Resume';
        status.textContent = 'Timer paused';
        timerContainer.classList.remove('running');
    } else {
        // Resume timer
        startTimer();
        pauseBtn.textContent = '⏸️ Pause';
    }
}

// Reset timer function
function resetTimer() {
    // Stop timer
    clearInterval(timerInterval);
    isRunning = false;

    // Reset time
    timeLeft = 0;
    hoursInput.value = 0;
    minutesInput.value = 25;
    secondsInput.value = 0;

    // Update UI
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = '⏸️ Pause';
    timerContainer.classList.remove('running', 'finished');
    status.textContent = 'Ready to start!';
    status.style.color = 'rgba(255, 255, 255, 0.9)';
}

// Finish timer function
function finishTimer() {
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    timerContainer.classList.remove('running');
    timerContainer.classList.add('finished');
    status.textContent = 'Time\'s up! 🎉';
    
    // Play a simple beep sound (using Web Audio API)
    playBeep();
}

// Simple beep sound
function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Update display when inputs change
[hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener('input', () => {
        if (!isRunning) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            timeLeft = hours * 3600 + minutes * 60 + seconds;
            updateDisplay();
        }
    });
});

// Initialize display
updateDisplay();