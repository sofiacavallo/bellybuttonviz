function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let metadataURL = "/metadata/" + sample;
  // Use d3 to select the panel with id of `#sample-metadata`
  let panelMetadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panelMetadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    d3.json(metadataURL).then(function(data) {
      Object.entries(data).forEach(([key, value]) => {
        panelMetadata.append("p").text(`${key}: ${value}`)
        
        //console.log(`${key} ${value}`);
      });
    });
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let chartsURL = "/samples/" + sample;

  d3.json(chartsURL).then(function (data) {
    // @TODO: Build a Bubble Chart using the sample data
    let trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: 'markers',
      text: data.otu_labels,
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Earth"
      }
    };
    // Create the data array for the plot
    let traces = [trace1];

    // Define the plot layout
    let layout = {
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Frequency"},
      showlegend: false,
      height: 600,
      width: 1200
    };

    // Plot the chart to a div tag with id "bubble"
    Plotly.newPlot("bubble", traces, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data2 = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      hovertext: data.otu_labels.slice(0, 10),
      type: 'pie',
    }];
    var layout2 = {
      showlegend: true,
    };
    Plotly.newPlot("pie", data2, layout2);


  })


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
