// from data.js
var tableData = data;

var tbody = d3.select("tbody");

//Update the html with the info from the data file
tableData.forEach((sighting) => {
    var row = tbody.append("tr");
    Object.entries(sighting).forEach(([key, value]) => {
        var cell = row.append("td");
        cell.text(value);
    });
});


// Select the submit button
var submit = d3.select("#filter-btn");

// Complete the click handler for the form
submit.on("click", function () {

    //Clear the contents of the table
    tbody.text('');

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var input = d3.select('.form-control');

    // Get the value property of the input element
    var inputValue = input.property('value');
    console.log(inputValue);

    // Use the form input to filter the data by date
    var filteredData = tableData.filter(sighting => {
        return sighting.datetime == inputValue
    });
    console.log(filteredData);

    filteredData.forEach((sighting) => {
        var row = tbody.append("tr");
        Object.entries(sighting).forEach(([key, value]) => {
            var cell = row.append("td");
            cell.text(value);
        });
    });
});

// Level 2

//Find Unique values for each column for dropdowns
// Date
var date = []
tableData.filter(sighting => {
    return date.push(sighting.datetime);
});
dateUnique = [...new Set(date)];
console.log(dateUnique);

// City
var City = tableData.map(sighting => {
    return sighting.city;
});
cityUnique = [...new Set(City)];
console.log(cityUnique);

// State
var State = []
tableData.filter(sighting => {
    return State.push(sighting.state);
});
stateUnique = [...new Set(State)];
console.log(stateUnique);

// Country
var Country = []
tableData.filter(sighting => {
    return Country.push(sighting.country);
});
countryUnique = [...new Set(Country)];
console.log(countryUnique);

// Shape
var Shape = []
tableData.filter(sighting => {
    return Shape.push(sighting.shape);
});
shapeUnique = [...new Set(Shape)];
console.log(shapeUnique);

// Go through each unqiue list and create selectable dropdowns

//Update the html with the info from the data file
dateUnique.forEach((dt) => {
    var dropdownDate = d3.select(".date.form-control");
    var options = dropdownDate.append("option");
    options.text(dt);
});

cityUnique.forEach((cty) => {
    var dropdownDate = d3.select(".city.form-control");
    var options = dropdownDate.append("option");
    options.attr("value", cty).text(cty);
});

stateUnique.forEach(st => {
    var dropdownDate = d3.select(".state.form-control");
    var options = dropdownDate.append("option");
    options.attr("value", st).text(st);
});

countryUnique.forEach((ctry) => {
    var dropdownDate = d3.select(".country.form-control");
    var options = dropdownDate.append("option");
    options.attr("value", ctry).text(ctry);
});

shapeUnique.forEach((shp) => {
    var dropdownDate = d3.select(".shape.form-control");
    var options = dropdownDate.append("option");
    options.attr("value", shp).text(shp);
});

// var dropdownCity = d3.select(".city form-control");

//Update the html with the info from the data file
// City.forEach((city) => {
//     var option = dropdownDate.append("option");
//     option.attr("value", city).text(city);
// });