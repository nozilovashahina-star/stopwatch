//=====================================================
// DOM ELEMENTS
//=====================================================

const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");

// Stopwatch
const swHour = document.getElementById("sw-hour");
const swMinute = document.getElementById("sw-minute");
const swSecond = document.getElementById("sw-second");

const swStartBtn = document.getElementById("sw-start");
const swResetBtn = document.getElementById("sw-reset");

// Timer
const timerHour = document.getElementById("t-hour");
const timerMinute = document.getElementById("t-minute");
const timerSecond = document.getElementById("t-second");

const timerDisplay = document.getElementById("timer-display");

const timerStartBtn = document.getElementById("timer-start");
const timerResetBtn = document.getElementById("timer-reset");

const timerCard = document.querySelector("#timer .card");


//=====================================================
// HELPER FUNCTIONS
//=====================================================

function format(value) {
    return String(value).padStart(2, "0");
}

function showPage(id) {

    tabs.forEach(tab => tab.classList.remove("active"));
    pages.forEach(page => page.classList.remove("active"));

    document
        .querySelector(`[data-page="${id}"]`)
        .classList.add("active");

    document
        .getElementById(id)
        .classList.add("active");

}


//=====================================================
// STOPWATCH CLASS
//=====================================================

class Stopwatch {

    constructor(hour, minute, second, button) {

        this.hour = hour;
        this.minute = minute;
        this.second = second;

        this.button = button;

        this.interval = null;

        this.running = false;

        this.startTime = 0;

        this.elapsed = 0;

    }

    update() {

        this.elapsed = Date.now() - this.startTime;

        const total = Math.floor(this.elapsed / 1000);

        const hours = Math.floor(total / 3600);

        const minutes = Math.floor((total % 3600) / 60);

        const seconds = total % 60;

        this.hour.textContent = format(hours);

        this.minute.textContent = format(minutes);

        this.second.textContent = format(seconds);

    }

    start() {

        if (this.running) return;

        this.running = true;

        this.startTime = Date.now() - this.elapsed;

        this.button.textContent = "Pause";

        this.button.classList.add("pause");

        this.interval = setInterval(() => {

            this.update();

        }, 1000);

    }

    pause() {

        if (!this.running) return;

        this.running = false;

        clearInterval(this.interval);

        this.button.textContent = "Start";

        this.button.classList.remove("pause");

    }

    toggle() {

        this.running
            ? this.pause()
            : this.start();

    }

    reset() {

        clearInterval(this.interval);

        this.running = false;

        this.elapsed = 0;

        this.hour.textContent = "00";
        this.minute.textContent = "00";
        this.second.textContent = "00";

        this.button.textContent = "Start";

        this.button.classList.remove("pause");

    }

}


//=====================================================
// CREATE STOPWATCH
//=====================================================

const stopwatch = new Stopwatch(

    swHour,
    swMinute,
    swSecond,
    swStartBtn

);

//=====================================================
// TIMER CLASS
//=====================================================

class Timer {

    constructor(display, button, card) {

        this.display = display;
        this.button = button;
        this.card = card;

        this.interval = null;

        this.running = false;

        this.remaining = 0;

    }

    setTime(hours, minutes, seconds) {

        this.remaining =
            (hours * 3600) +
            (minutes * 60) +
            seconds;

        this.updateDisplay();

    }

    updateDisplay() {

        const hours = Math.floor(this.remaining / 3600);

        const minutes = Math.floor((this.remaining % 3600) / 60);

        const seconds = this.remaining % 60;

        this.display.textContent =
            `${format(hours)}:${format(minutes)}:${format(seconds)}`;

    }

    start() {

        if (this.running) return;

        if (this.remaining <= 0) return;

        this.running = true;

        this.button.textContent = "Pause";
        this.button.classList.add("pause");

        this.interval = setInterval(() => {

            this.remaining--;

            this.updateDisplay();

            if (this.remaining <= 0) {

                this.finish();

            }

        }, 1000);

    }

    pause() {

        if (!this.running) return;

        this.running = false;

        clearInterval(this.interval);

        this.button.textContent = "Start";
        this.button.classList.remove("pause");

    }

    toggle() {

        this.running
            ? this.pause()
            : this.start();

    }

    reset() {

        clearInterval(this.interval);

        this.running = false;

        this.remaining = 0;

        this.updateDisplay();

        this.button.textContent = "Start";
        this.button.classList.remove("pause");

    }

    finish() {

        clearInterval(this.interval);

        this.running = false;

        this.remaining = 0;

        this.updateDisplay();

        this.button.textContent = "Start";
        this.button.classList.remove("pause");

        this.card.classList.add("finish");

        setTimeout(() => {

            this.card.classList.remove("finish");

        }, 2400);

    }

}


//=====================================================
// CREATE TIMER
//=====================================================

const timer = new Timer(

    timerDisplay,
    timerStartBtn,
    timerCard

);

//=====================================================
// EVENTS
//=====================================================

// Page Switch
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        showPage(tab.dataset.page);
    });
});


// Stopwatch
swStartBtn.addEventListener("click", () => {
    stopwatch.toggle();
});

swResetBtn.addEventListener("click", () => {
    stopwatch.reset();
});


//=====================================================
// TIMER EVENTS
//=====================================================

timerStartBtn.addEventListener("click", () => {

    if (!timer.running && timer.remaining === 0) {

        const hours = Math.min(99, Number(timerHour.value) || 0);
        const minutes = Math.min(59, Number(timerMinute.value) || 0);
        const seconds = Math.min(59, Number(timerSecond.value) || 0);

        if (hours === 0 && minutes === 0 && seconds === 0) return;

        timer.setTime(hours, minutes, seconds);

    }

    timer.toggle();

});


timerResetBtn.addEventListener("click", () => {

    timer.reset();

    timerHour.value = "";
    timerMinute.value = "";
    timerSecond.value = "";

});


//=====================================================
// INPUT VALIDATION
//=====================================================

function limitInput(input, max) {

    input.addEventListener("input", () => {

        let value = Number(input.value);

        if (isNaN(value)) {

            input.value = "";
            return;

        }

        if (value < 0) value = 0;
        if (value > max) value = max;

        input.value = value;

    });

}

limitInput(timerHour, 99); 
limitInput(timerMinute, 59);
limitInput(timerSecond, 59);   


//=====================================================
// ENTER = START TIMER
//=====================================================

[timerHour, timerMinute, timerSecond].forEach(input => {

    input.addEventListener("keydown", e => {

        if (e.key !== "Enter") return;

        e.preventDefault();

        timerStartBtn.click();

    });

});


//=====================================================
// ESC = RESET TIMER
//=====================================================

document.addEventListener("keydown", e => {

    if (e.key === "Escape") {

        if (document.getElementById("timer").classList.contains("active")) {

            timerResetBtn.click();

        }

    }

});


//=====================================================
// INIT
//=====================================================

showPage("stopwatch");

stopwatch.reset();

timer.reset();
     
