// function makeResponsive() {

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
        d3.max(censusData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);

    return xLinearScale;

}

// Create y scale function
// function used for updating y-scale var upon click on axis label
function yScale(censusData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}

// function used for updating xAxis var upon click on axis label
function transitionAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for updating yAxis var upon click on axis label
function transitionYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function transitionCircles($circlesSel, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    $circlesSel.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return $circlesSel;
}

function transitionText($textSel, newXScale, newYScale, chosenXAxis, chosenYAxis) {

    $textSel.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]) + 3);
    return $textSel;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, $circlesSel) {

    if (chosenXAxis === "poverty") {
        var xlabel = "In Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        var xlabel = "Age (Median)";
    }
    else if (chosenXAxis === "income") {
        var xlabel = "Household Income (Median)";
    }

    if (chosenYAxis === "healthcare") {
        var ylabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokers (%)";
    }
    else if (chosenYAxis === "obesity") {
        var ylabel = "Obese (%)";
    }

    // Step 1: Append a div to the body to create tooltips, assign it a class
    // =======================================================
    var $toolTip = d3.select("#scatter").append("div")
        .attr("class", "d3-tip");

    // Step 2: Add an onmouseover event to display a tooltip
    // ========================================================
    $circlesSel.on("mouseover", function (d, i) {
        $toolTip.style("display", "block");
        $toolTip.html(`${d.state}<br> ${xlabel}:${d[chosenXAxis]}<br>${ylabel}:${d[chosenYAxis]}`)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");
    })
        //d3.event.pageX and pageY are the X,Y location of the mouse current location

        // Step 3: Add an onmouseout event to make the tooltip invisible
        .on("mouseout", function () {
            $toolTip.style("display", "none");
        });
    return $circlesSel;
}


// Retrieve data from the CSV file and execute everything below

//d3.csv("assets/data/data.csv", function(censusData) {
function successfunction(censusData) {

    console.log(censusData);

    // parse data
    censusData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
        data.abbr = data.abbr;
        data.state = data.state;
    });
    
    console.log(chosenXAxis)
    console.log(chosenYAxis)

    // xLinearScale function above csv import
    var xLinearScale = xScale(censusData, chosenXAxis);

    
    // yLinearScale function above csv import
    var yLinearScale = yScale(censusData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
       // .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);



    // append initial circles
    var $circlesSel = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .classed('stateCircle', true)
   
    var $textSel = chartGroup.selectAll("text.stateText")
        .data(censusData)
        .enter()
        .append("text")
        .classed('stateText', true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 3)
        .text(d => d.abbr)
    

    // Create group for  3 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("data-value", "poverty")
        .classed("active", true)
        .classed("aText", true)
        .attr("data-axis", "xaxis")
        .text("In Poverty (%)");

    var ageLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("data-value", "age")
        .classed("inactive", true)
        .classed("aText", true)
        .attr("data-axis", "xaxis")
        .text("Age (Median)");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("data-value", "income")
        .classed("inactive", true)
        .classed("aText", true)
        .attr("data-axis", "xaxis")
        .text("Household Income (Median)");

    // Create group for  3 y- axis labels
    var labelsGroup = chartGroup.append("g")

    var healthLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("data-value", "healthcare")
        .classed("active", true)
        .classed("aText", true)
        .attr("data-axis", "yaxis")
        .text("Lacks Healthcare (%)");

    var smokesLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 20 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("data-value", "smokes")
        .classed("inactive", true)
        .classed("aText", true)
        .attr("data-axis", "yaxis")
        .text("Smokers (%)");

    var obesityLabel = labelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 40 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("data-value", "obesity")
        .classed("inactive", true)
        .classed("aText", true)
        .attr("data-axis", "yaxis")
        .text("Obese (%)");

    // updateToolTip function above csv import
    var $circlesSel = updateToolTip(chosenXAxis, chosenYAxis, $circlesSel);

    // x axis labels event listener
    d3.selectAll(".aText")
        .on("click", function () {
            // get value of selection
            var axis = d3.select(this).attr("data-axis");
            if (axis === "xaxis") {

                // replaces chosenXaxis with value
                chosenXAxis = d3.select(this).attr("data-value");

                console.log(chosenXAxis)
                console.log(chosenYAxis)

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(censusData, chosenXAxis);

                // updates x axis with transition
                xAxis = transitionAxes(xLinearScale, xAxis);

                // updates circles with new x values
                $circlesSel = transitionCircles($circlesSel, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // updates text in circles with new x values
                $textSel = transitionText($textSel, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // updates tooltips with new info
                $circlesSel = updateToolTip(chosenXAxis, chosenYAxis, $circlesSel);

                // changes classes to change bold text
                if (chosenXAxis === "poverty") {
                    povertyLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
            else if (axis === "yaxis") {

                // replaces chosenXaxis with value
                chosenYAxis = d3.select(this).attr("data-value");

                console.log(chosenXAxis)
                console.log(chosenYAxis)

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(censusData, chosenYAxis);

                // updates y axis with transition
                yAxis = transitionYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                $circlesSel = transitionCircles($circlesSel, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // updates text in circles with new x values
                $textSel = transitionText($textSel, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

                // updates tooltips with new info
                $circlesSel = updateToolTip(chosenXAxis, chosenYAxis, $circlesSel);

                // changes classes to change bold text
                if (chosenYAxis === "healthcare") {
                    healthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "smokes") {
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "obesity") {
                    healthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
            }
        });
}

d3.csv("assets/data/data.csv").then(successfunction);

// }
// // When the browser loads, makeResponsive() is called.
// makeResponsive();

// // When the browser window is resized, responsify() is called.
// d3.select(window).on("resize", makeResponsive);