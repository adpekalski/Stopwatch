var stopWatch = document.querySelector(".stopwatch");
var time = document.querySelector(".time");
var startButton = document.querySelector(".start");
var pauseButton = document.querySelector(".pause");
var stopButton = document.querySelector(".stop");
var resetButton = document.querySelector(".reset");
var archiveButton = document.querySelector(".history");
var timeList = document.querySelector(".time-list");

var infoSwitch = document.querySelector(".info");
var settingsSwitch = document.querySelector(".settings")
var modalShadow = document.querySelector(".modal-shadow");
var closeSwitch = document.querySelector(".close");
var colorBar = document.querySelector(".color-bar")

var firstColor = document.querySelector(".first-circle");
var secondColor = document.querySelector(".second-circle");
var thirdColor = document.querySelector(".third-circle");
var fourthColor = document.querySelector(".fourth-circle");
var fifthColor = document.querySelector(".fifth-circle");
var sixthColor = document.querySelector(".sixth-circle");

var infoIcon = document.querySelector(".fa-question");
let root = document.documentElement;

var countingIsRunning = false;
var countArchiveClicks = 0;
var countSettingsClicks = 0;
const accumulatedTime = {
  elapsedTime: 0
};

// ---------------------------------------- LOADING PREVIOUS SESSION INFORMATION ---------------------------------------

// color from previous session in new one
root.style.setProperty("--first-color", localStorage.getItem("firstColorDuringExit"));
root.style.setProperty("--third-color", localStorage.getItem("thirdColorDuringExit"));
root.style.setProperty("--fourth-color", localStorage.getItem("fourthColorDuringExit"));

// last time from previous session in new one with "IF" for checking if it was visible
time.textContent = localStorage.getItem("lastSavedTimeMeasurement");
if (localStorage.getItem("lastTimeNotVisible") === "true") {
  time.classList.add("time-hidden");
} else {
  time.classList.remove("time-hidden");
}

// archived times from previous session in new one with "IF" for checking if it was visible
timeList.innerHTML = localStorage.getItem("archiveList");
if (localStorage.getItem("archiveNotVisible") === "true") {
  timeList.classList.add("time-list-hidden");
  countArchiveClicks = 0;
} else {
  timeList.classList.remove("time-list-hidden");
  countArchiveClicks = 1;
}

// previous session measurement
if (localStorage.getItem("timeMeasurementDuringExit") !== null) {
  stopWatch.textContent = localStorage.getItem("timeMeasurementDuringExit");
}

if (localStorage.getItem("elapsedTimeDuringExit") !== 0 && localStorage.getItem("elapsedTimeDuringExit") !== null ){
  accumulatedTime.elapsedTime = parseInt(localStorage.getItem("elapsedTimeDuringExit"));
}

// checking flag for previous session counting and start time
var previousSessionCounting = localStorage.getItem("wasCountingTime");
var previousSessionStartTime = parseInt(localStorage.getItem("previousStartTime"));

// new timer to continue the previous measurement with start time from previous session
if (previousSessionCounting == "true"){
accumulatedTime.startTime = previousSessionStartTime;
  resumeCounting();
  function resumeCounting() {
    countingIsRunning = true;
      accumulatedTime.intervalId = setInterval(() => {
        const elapsedTime = Date.now() - accumulatedTime.startTime + accumulatedTime.elapsedTime;
        const milliseconds = parseInt((elapsedTime % 1000) / 10);
        const seconds = parseInt((elapsedTime / 1000) % 60);
        const minutes = parseInt((elapsedTime / (1000 * 60)) % 60);
        showTime(minutes, seconds, milliseconds);
      }, 10);
  }
}

// ---------------------------------------------------- MAIN PROGRAM ---------------------------------------------------

// start measurement based on current time data after clicking start button
startButton.addEventListener("click", startCounting);
function startCounting() {
  if(!countingIsRunning){
  countingIsRunning = true;
    accumulatedTime.startTime = Date.now();
    accumulatedTime.intervalId = setInterval(() => {
      const elapsedTime = Date.now() - accumulatedTime.startTime + accumulatedTime.elapsedTime;
      const milliseconds = parseInt((elapsedTime % 1000) / 10);
      const seconds = parseInt((elapsedTime / 1000) % 60);
      const minutes = parseInt((elapsedTime / (1000 * 60)) % 60);
      showTime(minutes, seconds, milliseconds);
    }, 10);
  }
}

// pause timer after clicking pause button
pauseButton.addEventListener("click", pauseCounting);
function pauseCounting() {
  if (countingIsRunning) {
    accumulatedTime.elapsedTime += Date.now() - accumulatedTime.startTime;
    clearInterval(accumulatedTime.intervalId);
    countingIsRunning = false;
  }
}

// stop timer and run archiving function with current value after clicking stop button, display 00:00:00
stopButton.addEventListener("click", stopCounting);
function stopCounting() {
  var stopDateFull = new Date();
  var stopDateTime = stopDateFull.toLocaleTimeString();
  var stopDateTimeSliced = stopDateTime.slice(0,5);
  var stopOnlyDate = stopDateFull.toLocaleDateString();
  var recordDate = stopDateTime + " - " + stopOnlyDate;
  const timeToSave = stopWatch.textContent;
  if (timeToSave !== "00:00:00") {
    time.textContent = "Last time: " + timeToSave;
    archiveTime(timeToSave, recordDate);
    time.classList.remove("time-hidden");
  }
  accumulatedTime.elapsedTime = 0;
  clearInterval(accumulatedTime.intervalId);
  showTime(0, 0, 0);
  countingIsRunning = false;
}

// display current time measurement while adding 0 before values smaller than 10
function showTime(minutes, seconds, milliseconds) {
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (milliseconds < 10) {
    milliseconds = "0" + milliseconds;
  }
  stopWatch.textContent = minutes + ":" + seconds + ":" + milliseconds;
}

// function which adds previously recorded time to list (with correct date) as a new table row
function archiveTime(timeToSave, recordDate) {
  var li = document.createElement("li");
  li.innerHTML = '<table><tr><th class="first-th" align="left"><p>' + recordDate + ":" + '</p></th><th class="second-th" align="right"><p>' + timeToSave + '</p></th></tr></table>';
  timeList.appendChild(li);
}

// toggle archive times after clicking archive button
archiveButton.addEventListener("click", function() {
  countArchiveClicks++;
  if (countArchiveClicks < 2) {
    // first click - show archive
    timeList.classList.remove("time-list-hidden");
  } else {
    // second click - hide archive
    timeList.classList.add("time-list-hidden");
    countArchiveClicks = 0;
  }
});

// delete previous time measurements and archive history after clicking reset button
resetButton.addEventListener("click", killEmAll);
function killEmAll() {
  stopWatch.textContent = "00:00:00";
  time.textContent = "";
  timeList.innerHTML = "";
  recordsSaved = 0;
  accumulatedTime.elapsedTime = 0;
  clearInterval(accumulatedTime.intervalId);
  countingIsRunning = false;
}

// open info window after clicking question mark
infoSwitch.addEventListener("click", showInfo);
function showInfo(){
  modalShadow.classList.add("modal-animation");
}

// close info window after clicking exit button
closeSwitch.addEventListener("click", closeInfo);
function closeInfo(){
  modalShadow.classList.remove("modal-animation");
}

// toggle settings bar after clicking brush mark
settingsSwitch.addEventListener("click", function(){;
  countSettingsClicks++;
  if (countSettingsClicks < 2) {
    // first click - show settings
    colorBar.classList.remove("color-bar-hidden");
  } else {
    // second click - hide settings
    colorBar.classList.add("color-bar-hidden");
    countSettingsClicks = 0;
  }
});

// changing main colors in style
firstColor.addEventListener("click", () => {
  root.style.setProperty("--first-color", "#FF3131");
  root.style.setProperty("--third-color", "#fff");
  root.style.setProperty("--fourth-color", "#000");
});

secondColor.addEventListener("click", () => {
  root.style.setProperty("--first-color", "#7FFF00");
  root.style.setProperty("--third-color", "#fff");
  root.style.setProperty("--fourth-color", "#000");
});

thirdColor.addEventListener("click", () => {
  root.style.setProperty("--first-color", "#F148FB");
  root.style.setProperty("--third-color", "#fff");
  root.style.setProperty("--fourth-color", "#000");
});

fourthColor.addEventListener("click", () => {
  root.style.setProperty("--first-color", "#FFD300");
  root.style.setProperty("--third-color", "#fff");
  root.style.setProperty("--fourth-color", "#000");
});

fifthColor.addEventListener("click", () => {
  root.style.setProperty("--first-color", "#3CB9FC");
  root.style.setProperty("--third-color", "#fff");
  root.style.setProperty("--fourth-color", "#000");
});

sixthColor.addEventListener("click", () => {
  root.style.setProperty("--first-color", "#FAF9F6");
  root.style.setProperty("--third-color", "#000");
  root.style.setProperty("--fourth-color", "#fff");
});

// ---------------------------------------- SAVING INFORMATION TO LOCAL STORAGE ----------------------------------------

// saving information before closing window
document.onvisibilitychange = () => {
  if (document.visibilityState === 'hidden') {
    // take color from previous sesion
    localStorage.setItem("firstColorDuringExit", root.style.getPropertyValue("--first-color"));
    localStorage.setItem("thirdColorDuringExit", root.style.getPropertyValue("--third-color"));
    localStorage.setItem("fourthColorDuringExit", root.style.getPropertyValue("--fourth-color"));
    // take finished time record from previous sesion and check visibility
    localStorage.setItem("lastSavedTimeMeasurement", time.textContent);
    localStorage.setItem("lastTimeNotVisible", time.classList.contains("time-hidden"));
    // take archived times from previous sesion and check visibility, update records number
    localStorage.setItem("archiveList", timeList.innerHTML);
    localStorage.setItem("archiveNotVisible", timeList.classList.contains("time-list-hidden"));
    // used to store previous time value for abillity to start it again in new one
    localStorage.setItem("timeMeasurementDuringExit", stopWatch.textContent);
    localStorage.setItem("elapsedTimeDuringExit", accumulatedTime.elapsedTime);
    // take counting flag and start time from active session
    localStorage.setItem("wasCountingTime", countingIsRunning);
    localStorage.setItem("previousStartTime", accumulatedTime.startTime);
  }
};

window.addEventListener("pagehide", (event) => {
  if (event.persisted) {
    // take color from previous sesion
    localStorage.setItem("firstColorDuringExit", root.style.getPropertyValue("--first-color"));
    localStorage.setItem("thirdColorDuringExit", root.style.getPropertyValue("--third-color"));
    localStorage.setItem("fourthColorDuringExit", root.style.getPropertyValue("--fourth-color"));
    // take finished time record from previous sesion and check visibility
    localStorage.setItem("lastSavedTimeMeasurement", time.textContent);
    localStorage.setItem("lastTimeNotVisible", time.classList.contains("time-hidden"));
    // take archived times from previous sesion and check visibility, update records number
    localStorage.setItem("archiveList", timeList.innerHTML);
    localStorage.setItem("archiveNotVisible", timeList.classList.contains("time-list-hidden"));
    // used to store previous time value for abillity to start it again in new one
    localStorage.setItem("timeMeasurementDuringExit", stopWatch.textContent);
    localStorage.setItem("elapsedTimeDuringExit", accumulatedTime.elapsedTime);
    // take counting flag and start time from active session
    localStorage.setItem("wasCountingTime", countingIsRunning);
    localStorage.setItem("previousStartTime", accumulatedTime.startTime);
  }
}, false);
