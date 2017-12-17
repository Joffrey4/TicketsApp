"use strict";

var fs = require('fs');
var path = require('path');
const STATIONS = JSON.parse(fs.readFileSync('./stations.json', 'utf8'));

function generateArray() {

    var stationsJSON = [];

    // Loop thought each station of the JSON
    STATIONS.forEach(function (station) {
        // Take only the belgian stations
        if (station["country-code"] === "be") {

            // Use the alternatives when both are available
            if (station["alternative-fr"] !== "" && station["alternative-nl"] !== "") {
                stationsJSON.push(createEntry(station,"alternative-fr"));
                stationsJSON.push(createEntry(station,"alternative-nl"))

                // Otherwise, use the name and the available alternative
            } else {
                stationsJSON.push(createEntry(station,"name"));
                if (station["alternative-fr"] !== "") {
                    stationsJSON.push(createEntry(station,"alternative-fr"))
                } else if (station["alternative-nl"] !== "") {
                    stationsJSON.push(createEntry(station,"alternative-nl"))
                }
            }

            // Add the deutsch language when available
            if (station["alternative-de"] !== "") {
                stationsJSON.push(createEntry(station,"alternative-de"));
            }

            // Add the english language when available
            if (station["alternative-en"] !== "") {
                stationsJSON.push(createEntry(station,"alternative-en"));
            }
        }
    });

    fs.writeFile(path.join(__dirname, "generated/stations.json"), JSON.stringify(stationsJSON), function(err) {
        if(err) {
            return console.log(err);
        } else {
            console.log("Generator run successfully")
        }
    });

    // Generate a list of the internal name
    var internalNames = [];
    stationsJSON.forEach(function (station) {
        if (!isInArray(station['id'], internalNames)) {
            internalNames.push(station['id'])
        }
    });

    fs.writeFile(path.join(__dirname, "generated/internalNames.json"), JSON.stringify(internalNames), function(err) {
        if(err) {
            return console.log(err);
        } else {
            console.log("Generator run successfully")
        }
    });
}

function createEntry(station, name) {
    return {
        "name": station[name],
        "bigletter": capitalizeFirstLetter(removePrefixSuffix(station[name]).substring(0, 4)),
        "id": createInternalName(station)
    }
}

function createInternalName(station) {

    // Find the name to use
    var name;
    if (station["alternative-nl"] !== "") {
        name = station["alternative-nl"]
    } else if (station["alternative-fr"]) {
        name = station["alternative-fr"]
    } else {
        name = station["name"]
    }

    // Codify the name
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // Remove accent
    name = name.toLowerCase(); // Remove capital letter
    name = removePrefixSuffix(name); // Remove prefix and suffix

    return checkSpecificRules(name)
}

function removePrefixSuffix(name) {
    name = name.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } ); // Remove prefix/suffix
    var length = 0;
    var reducedName = "";
    name.forEach(function (subname) {
        if (subname.length > length) {
            length = subname.length;
            reducedName = subname;
        }
    });

    return reducedName
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkSpecificRules(name) {
    // Rules for Brussels - Airport Zaventem: the internal name is "airport"
    if (name === "brussels") {
        return "airport"
    } else {
        return name
    }
}

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

generateArray();