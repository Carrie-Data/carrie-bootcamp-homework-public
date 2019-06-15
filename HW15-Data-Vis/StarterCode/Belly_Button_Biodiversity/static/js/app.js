function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use d3 to select the panel with id of `#sample-metadata`
  var metaDataSel = d3.select('#sample-metadata');

  // Use `d3.json` to fetch the metadata for a sample
  // Use `.html("") to clear any existing metadata
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  d3.json("/metadata/" + sample).then((sample_metadata) => {
    metaDataSel.html('');
    Object
      .entries(sample_metadata)
      .forEach(([key, value]) =>
        metaDataSel
          .append('div')
          .text(`${key}: ${value}`));
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
  d3.json("/metadata/" + sample).then((sample_metadata) => {
    var level = (sample_metadata.WFREQ * 180) / 10

    // Trig to calc meter point
    var degrees = 180 - level,
      radius = .5;
    var radians = degrees * Math.PI / 180;
    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
      type: 'scatter',
      x: [0], y: [0],
      marker: { size: 28, color: '850000' },
      showlegend: false,
      name: 'washings',
      text: level,
      hoverinfo: 'text+name'
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ['0-1', '1-2', '2-3', '3-4',
        '4-5', '5-6', '6-7', '7-8', '8-9'].reverse(),
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['rgba(14, 127, 0, .5)', 'rgba(50,135,10,.5)', 'rgba(110, 154, 22, .5)',
          'rgba(140, 176, 32, .5)', 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
          'rgba(210, 206, 145, .5)', 'rgba(222, 216, 175, .5)', 'rgba(232, 226, 202, .5)',
          'rgba(255, 255, 255, 0)']
      },
      labels: ['0-1', '1-2', '2-3', '3-4',
        '4-5', '5-6', '6-7', '7-8', '8-9'].reverse(),
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];

    var layout = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 600,
      width: 600,
      xaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      },
      yaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      }
    };

    Plotly.newPlot('gauge', data, layout);
  });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots  

  // @TODO: Build a Pie Chart 
  d3.json("/samples/" + sample)
    .then((sample) => {

      var pie_trace = {
        labels: sample.otu_ids.slice(0, 10),
        values: sample.sample_values.slice(0, 10),
        hovertext: sample.otu_labels.slice(0, 10),
        type: 'pie'
      };

      var pie_chart = [pie_trace];

      var layout = {
        title: "Distribution of top 10 Bacteria",
      };

      Plotly.newPlot("pie", pie_chart, layout);
    });

  // @TODO: Build a Bubble Chart using the sample dataUse otu_ids for the x values.
  d3.json("/samples/" + sample)
    .then((sample) => {

      var bubbleTrace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: 'markers',
        marker: {
          size: sample.sample_values,
          color: sample.otu_ids
        }
      };

      var bubbleTraceChart = [bubbleTrace];

      var layout = {
        title: 'Belly Button Bacteria',
        showlegend: false,
        height: 600,
        width: 1600,
        xaxis: {
          title: 'OTU ID'
        }
      };

      Plotly.newPlot('bubble', bubbleTraceChart, layout);
    });
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


