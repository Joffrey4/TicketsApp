// Fullscreen handler
document.addEventListener("deviceready", function () {
    StatusBar.hide();
});

// Init Event handler - Ordered by loading priority
document.addEventListener('init', function () {
    document.getElementById("od-button-origin").addEventListener("click", function (ev) { stationSelector("origin") });
    document.getElementById("od-button-destination").addEventListener("click", function (ev) { stationSelector("destination") });
    document.getElementById("button-single-trip").addEventListener("click", setSingleTrip);
    document.getElementById("button-round-trip").addEventListener("click", setRoundTrip);
    document.getElementById("od-button-switch").addEventListener("click", switchStations);

    showApp();
});

//----------------------------------------------------------------------------------------------------------------------

// EVENTS: trains page

function setRoundTrip() {
    var hidden = document.querySelectorAll(".ob-hidden");
    [].forEach.call(hidden, function(div) {
        div.classList.remove("ob-hidden")
    });
}

function setSingleTrip() {
    var elements = [];
    elements.push(document.getElementById("ob-date-dr-container"));
    elements.push(document.getElementById("od-date-return"));
    elements.push(document.getElementById("ob-date-second"));

    [].forEach.call(elements, function(div) {
        div.classList.add("ob-hidden")
    });
}

function stationSelector(type) {
    var trainNavigator = document.querySelector("#trainNavigator");
    trainNavigator.pushPage("./templates/trains/stationSelector.html", {callback: function () {

        var resultContainer = document.getElementById("station-search-result");
        var bigLetter = document.getElementById(type + "-bigLetters");
        var gare = document.getElementById(type + "-gare");

        // Search each time the user write a bunch of text
        var timeout = null;
        var textInput = document.getElementById("station-search-input")
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
    var bigLetterOrigin = document.getElementById("origin-bigLetters").innerHTML;
    var gareOrigin = document.getElementById("origin-gare").innerHTML;
    var bigLetterDestination = document.getElementById("destination-bigLetters").innerHTML;
    var gareDestination = document.getElementById("destination-gare").innerHTML;

    
}

// EVENTS Post-loading

function showApp() {
    var trainNavigator = document.querySelector("#trainNavigator");
    trainNavigator.pushPage("./templates/trains/stationSelector.html", {callback: function () {
        trainNavigator.removePage(1, {callback: function () {
            navigator.splashscreen.hide();
        }})
    }});
}