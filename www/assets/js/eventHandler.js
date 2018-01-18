// File internal constants
const LOCALE = "fr-BE";
const WEEKDAYS = getWeekDays();
var calendar;

// App variables - DateSelector
var singleTrip = true;
var hasSelectedTwoDates = false;

var interval = setInterval(function() {
    if(document.readyState === 'complete') {
        clearInterval(interval);
        document.dispatchEvent(new Event('deviceready'));
    }
}, 100);


// PreInit Event - FullScreen handler
document.addEventListener("deviceready", function () {
    //StatusBar.hide();
    calendar = generateCalendar();

    // trains pages
    document.getElementById("button-single-trip").addEventListener("click", setSingleTrip);
    document.getElementById("button-round-trip").addEventListener("click", setRoundTrip);

    document.getElementById("od-button-origin").addEventListener("click", function (ev) { stationSelector("origin") });
    document.getElementById("od-button-destination").addEventListener("click", function (ev) { stationSelector("destination") });
    document.getElementById("od-button-switch").addEventListener("click", switchStations);

    document.getElementById("ob-container").addEventListener("click", dateSelector);
    /*
    document.getElementById("ob-date-first").addEventListener("click", dateSelector);
    document.getElementById("od-date-return").addEventListener("click", dateSelector);
    document.getElementById("ob-date-second").addEventListener("click", dateSelector);
    document.getElementById("ob-date-calendar-icon").addEventListener("click", dateSelector);
    */
    setDateToday();

    // Launching of the app
    showApp();
});

//----------------------------------------------------------------------------------------------------------------------

// INTERNAL file functions

function getWeekDays()
{
    var baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
    var weekDays = [];
    for(var i = 0; i < 7; i++)
    {
        weekDays.push(baseDate.toLocaleDateString(LOCALE, { weekday: 'long' }));
        baseDate.setDate(baseDate.getDate() + 1);
    }
    return weekDays;
}

//----------------------------------------------------------------------------------------------------------------------

// TRAINS page event and elements

function setRoundTrip() {
    var hidden = document.querySelectorAll(".ob-hidden");
    [].forEach.call(hidden, function(div) {
        div.classList.remove("ob-hidden")
    });

    document.getElementById("ob-date-calendar-container").style.width = "unset";
    singleTrip = false;
}

function setSingleTrip() {
    var elements = [];
    elements.push(document.getElementById("ob-date-dr-container"));
    elements.push(document.getElementById("od-date-return"));
    elements.push(document.getElementById("ob-date-second"));

    [].forEach.call(elements, function(div) {
        div.classList.add("ob-hidden")
    });

    document.getElementById("ob-date-calendar-container").style.width = "60%";
    singleTrip = true;
}

function stationSelector(type) {
    var trainNavigator = document.querySelector("#trainNavigator");
    trainNavigator.pushPage("./templates/trains/stationSelector.html", {callback: function () {

        var resultContainer = document.getElementById("station-search-result");
        var bigLetter = document.getElementById(type + "-bigLetters");
        var gare = document.getElementById(type + "-gare");

        // Search each time the user write a bunch of text
        var timeout = null;
        var textInput = document.getElementById("station-search-input");
        textInput.focus();
        textInput.addEventListener("keyup", function() {
            clearTimeout(timeout);
            timeout = setTimeout(function () {

                if (textInput.value !== '') {
                    resultContainer.innerHTML = '';
                    resultContainer.style.visibility = "visible";
                    var results = searchFuzzy(stationList, textInput.value, 5);

                    if (results.length !== 0) {
                        // Print the results in divs
                        results.forEach(function (station) {
                            var resultDiv = document.createElement("ons-list-item");
                            resultDiv.setAttribute("tappable", null);
                            resultDiv.appendChild(document.createTextNode(station));

                            // Link each element to an eventListener
                            resultDiv.addEventListener("click", function () {
                                bigLetter.innerHTML = stationData[station]["bigletter"];
                                gare.innerText = station;
                                trainNavigator.removePage(1);
                            });

                            resultContainer.appendChild(resultDiv)
                        })
                    } else {
                        resultContainer.style.visibility= "hidden";
                    }
                } else {
                    resultContainer.style.visibility= "hidden";
                }

            }, 500);
        });
    }});
}

function switchStations () {
    // Get the two stations
    var originBigLetter = document.getElementById("origin-bigLetters");
    var originGare = document.getElementById("origin-gare");
    var destinationBigLetter = document.getElementById("destination-bigLetters");
    var destinationGare = document.getElementById("destination-gare");

    // Set the temp var
    var tempOriginBigLetter = originBigLetter.innerText;
    var tempOriginGare = originGare.innerText;

    // Exchange
    originBigLetter.innerText = destinationBigLetter.innerText;
    originGare.innerText = destinationGare.innerText;
    destinationBigLetter.innerText = tempOriginBigLetter;
    destinationGare.innerText = tempOriginGare
}

function dateSelector() {
    var trainNavigator = document.querySelector("#trainNavigator");
    trainNavigator.pushPage("./templates/trains/dateSelector.html", {callback: function () {

        // Remove the loading circle and append the calendar
        document.getElementById("ds-progress-circle-container").remove();
        var childElement = document.getElementById("ds-validator");
        var parentElement = childElement.parentNode;
        parentElement.insertBefore(calendar, childElement);

        // Remove the remain return date if it's single trip
        if (singleTrip) {
            var currentReturn = document.getElementById("ds-return");
            if (currentReturn !== null) {
                currentReturn.className = "ds-cell ds-day";
                currentReturn.removeAttribute("id");
            }
        }

        // Handle the validation
        document.getElementById("ds-validator-button").addEventListener("click", function (ev) {
            const DAYSORDER = [6, 0, 1, 2, 3, 4, 5];
            var rawSingle = document.getElementById("ds-validator-handler-single").innerText;
            var rawReturn = document.getElementById("ds-validator-handler-return").innerText;

            if (rawSingle !== "") {
                // Print a new single date if it changed
                var singleDate = new Date(rawSingle);
                var localSingleString = singleDate.toLocaleDateString(LOCALE, {month: 'short', day: 'numeric'});
                var singleWeekDay = WEEKDAYS[DAYSORDER[singleDate.getDay()]];

                document.getElementById("date-depart-day").innerText = localSingleString;
                document.getElementById("date-depart-weekday").innerText = singleWeekDay;
                document.getElementById("date-depart-code").innerText = rawSingle;
            }

            var dateReturnDay = document.getElementById("date-return-day");
            var dateReturnWeekDay = document.getElementById("date-return-weekday");
            var dateReturnCode = document.getElementById("date-return-code");

            // Print a new return date if it's needed
            if (singleTrip === false && rawReturn !== "") {
                var returnDate = new Date(rawReturn);
                var localReturnString = returnDate.toLocaleDateString(LOCALE, {month: 'short', day: 'numeric'});
                var returnWeekDay = WEEKDAYS[DAYSORDER[returnDate.getDay()]];

                dateReturnDay.innerText = localReturnString;
                dateReturnWeekDay.innerText = returnWeekDay;
                dateReturnCode.innerText = rawReturn;

            } else if (rawSingle !== "") {
                // Check the return date to be later or equal as the single day
                var rawDateReturn = document.getElementById("date-return-code").innerText;

                if (new Date(rawDateReturn) < singleDate) {
                    dateReturnDay.innerText = localSingleString;
                    dateReturnWeekDay.innerText = singleWeekDay;
                    dateReturnCode.innerText = rawSingle;
                }
            }
            closingTab()
        });

        document.getElementById("train-dateSelector-back-button").onClick = function() {
            closingTab()
        };

        // Handle the closing of the tab
        function closingTab() {
            var replacement = document.createElement("div");
            replacement.id = "ds-progress-circle-container";
            parentElement.insertBefore(replacement, childElement);

            calendar.remove();
            trainNavigator.removePage(1);
        }
    }});
}

function setDateToday() {
    var date = new Date();
    var todayDay = date.toLocaleDateString(LOCALE, {month: 'short', day: 'numeric'});
    var todayWeekDay = WEEKDAYS[date.getDay()];

    document.getElementById("date-depart-day").innerText = todayDay;
    document.getElementById("date-depart-weekday").innerText = todayWeekDay;
    document.getElementById("date-return-day").innerText = todayDay;
    document.getElementById("date-return-weekday").innerText = todayWeekDay;

    var dateCode = date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate();
    document.getElementById("date-depart-code").innerText = dateCode;
    document.getElementById("date-return-code").innerText = dateCode;
}

function generateCalendar() {
    // Create the calendar base div
    var calendar = document.createElement("div");
    calendar.className = "ds-calendar";

    // Initialize the constants for today
    const DAYSORDER = [1, 2, 3, 4, 5, 6, 0];
    var dateToday = new Date();
    var dateThisMonth = dateToday.getMonth();
    var monthReport = 0;
    var yearReport = 0;

    var isCalendarGenerated = false;
    var totalDayCounter = 0;

    while (!isCalendarGenerated) {

        // define the current generated month and year
        var currentMonth = dateThisMonth + 1 + monthReport;
        if (currentMonth > 12) {
            currentMonth = currentMonth - 12;
            yearReport = 1
        }

        // Get the first day of the month - And the amount of days in this month
        var currentYear = dateToday.getFullYear() + yearReport;
        var dateCurrentMonth = new Date(currentYear + "-" + currentMonth + "-01");
        var monthFirstDay = dateCurrentMonth.getDay();
        var daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

        var currentDay = 1;
        var isMonthGenerated = false;
        var isFirstWeek = true;

        // Create this month base div
        var month = document.createElement("div");
        month.className = "ds-month-container";
        var monthTextDiv = document.createElement("div");
        monthTextDiv.className = "ds-month-text";
        var monthTextNode = document.createTextNode(capitalizeFirstLetter(dateCurrentMonth.toLocaleDateString(LOCALE, {month: 'long'})));
        monthTextDiv.appendChild(monthTextNode);
        month.appendChild(monthTextDiv);
        var cellContainer = document.createElement("div");
        cellContainer.className = "ds-month";

        while (!isMonthGenerated) {
            var cell;
            if (isFirstWeek) {
                var hasFoundFirstDay = false;
                for (var j = 0; j < 7; j++) {
                    if (DAYSORDER[j] === monthFirstDay || hasFoundFirstDay) {
                        cell = getExistingCell(currentYear, currentMonth, currentDay, dateToday);
                        currentDay += 1;
                        hasFoundFirstDay = true;
                    } else {
                        cell = createCell("", false, false, false);
                    }
                    if (j === 6) {
                        isFirstWeek = false;
                    }
                    cellContainer.appendChild(cell)
                }
            } else {
                for (var k = 0; k < 7; k++) {
                    if (currentDay <= daysInMonth) {
                        cell = getExistingCell(currentYear, currentMonth, currentDay, dateToday);
                        currentDay += 1;
                    } else {
                        cell = createCell("", false, false, false);
                    }
                    cellContainer.appendChild(cell)
                }
                if (currentDay > daysInMonth) {
                    isMonthGenerated = true;
                }
            }
        }
        // Insert the result in the DOM
        month.appendChild(cellContainer);
        calendar.appendChild(month);

        // Update the values for next loop
        monthReport += 1;
        if (totalDayCounter === 180) {
            isCalendarGenerated = true;
        }
    }
    return calendar;

    function createCell(currentYear, currentMonth, currentDay, filled, disabled, today) {
        var cell = document.createElement("div");
        cell.className = "ds-cell";

        if (filled) {
            cell.className += " ds-day";
            var text = document.createElement("div");
            text.className = "ds-day-text";

            if (disabled) {
                text.className += " ds-day-disabled"
            } else if (today) {
                cell.className += " ds-today";
                cell.id = "ds-single"
            }

            if (!disabled) {
                var dateHandler = document.createElement("div");
                dateHandler.className = "undisplay";
                var dateText = document.createTextNode(currentYear + "-" + currentMonth + "-" + currentDay);
                dateHandler.appendChild(dateText);
                cell.appendChild(dateHandler);

                cell.addEventListener("click", function (ev) {
                    var cellDateCode = cell.childNodes[0].innerText;

                    // Handle the selection of this cell as single trip date
                    if (singleTrip === true || hasSelectedTwoDates === true) {
                        resetPreviousSelectedDays();
                        setAsNewSingleDay();
                        document.getElementById("ds-validator-handler-single").innerText = cellDateCode;
                        hasSelectedTwoDates = false;
                    }
                    // Handle the selection of this cell as return trip date
                    else {
                        var singleDateHandler = document.getElementById("ds-validator-handler-single").innerText;
                        var thisCellDate = new Date(cellDateCode);

                        if ((singleDateHandler !== "" && thisCellDate >= new Date(singleDateHandler)
                                || singleDateHandler === "" && (thisCellDate >= new Date(document.getElementById("date-depart-code").innerText)))) {
                            setAsNewReturnDay();
                            document.getElementById("ds-validator-handler-return").innerText = cellDateCode;
                            hasSelectedTwoDates = true;
                        }
                    }

                    // Reset the previous selected days
                    function resetPreviousSelectedDays() {
                        var currentSingle = document.getElementById("ds-single");
                        if (currentSingle !== null) {
                            currentSingle.className = "ds-cell ds-day";
                            currentSingle.removeAttribute("id");
                        }
                        var currentReturn = document.getElementById("ds-return");
                        if (currentReturn !== null) {
                            currentReturn.className = "ds-cell ds-day";
                            currentReturn.removeAttribute("id");
                        }
                    }
                    // Set this cell as the new selected single trip day
                    function setAsNewSingleDay() {
                        cell.className += " ds-today";
                        cell.id = "ds-single";
                    }
                    // Set this cell as the new selected day
                    function setAsNewReturnDay() {
                        cell.className += " ds-today";
                        cell.id = "ds-return";
                    }
                })
            }

            var textNode = document.createTextNode(currentDay);
            text.appendChild(textNode);
            cell.appendChild(text);
        }
        return cell
    }

    function getExistingCell(currentYear, currentMonth, currentDay, dateToday) {
        var cell;
        var dateCurrentDay = new Date(currentYear, currentMonth - 1, currentDay);

        if (dateCurrentDay.getDate() === dateToday.getDate()
            && dateCurrentDay.getMonth() === dateToday.getMonth()
            && dateCurrentDay.getFullYear() === dateToday.getFullYear()) {
            cell = createCell(currentYear, currentMonth, currentDay, true, false, true); // Create today cell
            totalDayCounter += 1;
        } else if (dateCurrentDay < dateToday || totalDayCounter === 180) {
            cell = createCell(currentYear, currentMonth, currentDay, true, true, false); // Create disabled cell
        } else {
            cell = createCell(currentYear, currentMonth, currentDay, true, false, false); // Create filled cell
            totalDayCounter += 1;
        }
        return cell;
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

//----------------------------------------------------------------------------------------------------------------------

// OTHERS elements

function showApp() {
    var trainNavigator = document.querySelector("#trainNavigator");
    trainNavigator.pushPage("./templates/trains/stationSelector.html", {animationOptions: {duration: 0, delay: 0}, callback: function () {
        trainNavigator.removePage(1, {animationOptions: {duration: 0, delay: 0}, callback: function () {
            navigator.splashscreen.hide();
        }})
    }});
}