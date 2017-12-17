document.addEventListener('init', function () {
    document.getElementById("button-single-trip").addEventListener("click", setSingleTrip);
    document.getElementById("button-round-trip").addEventListener("click", setRoundTrip);
    document.getElementById("od-button-origin").addEventListener("click", function (ev) { stationSelector("origin") });
    document.getElementById("od-button-destination").addEventListener("click", function (ev) { stationSelector("destination") });
    document.getElementById("od-button-switch").addEventListener("click", switchStations);
});

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

        // Initialize the search
        var options = {
            shouldSort: true,
            threshold: 0.2,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: ["name"]
        };
        var fuse = new Fuse(stationList, options);
        var resultContainer = document.getElementById("station-search-result");
        var bigLetter = document.getElementById(type + "-bigLetters");
        var gare = document.getElementById(type + "-gare");

        // Search each time the state of the input change
        document.getElementById("station-search-input").addEventListener("input", function() {

            if (this.value !== '') {
                resultContainer.innerHTML = '';
                resultContainer.style.visibility = "visible";
                var result = fuse.search(this.value);

                if (result.length !== 0) {
                    // Print the results in divs
                    result.forEach(function (element) {
                        var resultDiv = document.createElement("ons-list-item");
                        resultDiv.setAttribute("tappable", null);
                        resultDiv.appendChild(document.createTextNode(element["name"]));

                        // Link each element to an eventListener
                        resultDiv.addEventListener("click", function () {
                            bigLetter.innerHTML = element["bigletter"];
                            gare.innerText = element["name"];
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
        });
    }});
}

function switchStations () {
    var bigLetterOrigin = document.getElementById("origin-bigLetters").innerHTML;
    var gareOrigin = document.getElementById("origin-gare").innerHTML;
    var bigLetterDestination = document.getElementById("destination-bigLetters").innerHTML;
    var gareDestination = document.getElementById("destination-gare").innerHTML;

    
}