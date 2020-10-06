function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var allSamples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectedSample = allSamples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata2 = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultMetadata = metadata2.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var firstSample = selectedSample[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var result2 = resultMetadata[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = firstSample.otu_ids
    var otuLabeles = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency
    var wfreq = parseFloat(result2.wfreq)
    console.log(wfreq)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var topTenIds = otuIds.slice(0,10).reverse();
    var topTenValues = sampleValues.slice(0,10).reverse();
    
    var otuIdsMapped = topTenIds.map(id => 'OTU ' + id);
    var yticks = otuIdsMapped;

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: topTenValues,
      y: yticks,
      type: "bar",
      orientation: 'h',
      marker: {
        color: 'rgb(133,220,186)'
      }
    };

    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 Bacteria Cultures Found</b>",
      paper_bgcolor: "rgb(195, 141, 158)",
      font: { color: "black", family: "Arial",}
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    
    trace2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabeles,
      mode: 'markers',
      marker: {
        color: otuIds,
        colorscale: "YlGnBu",
        line: {
          color: 'black',
          width: .5
        },
        size: sampleValues 
      }
    };
    
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "<b>Bacteria Cultures Per Samples</b>",
        xaxis: { title: "OTU ID" },
        hovermode: 'closest',
        margins:{
          l: 50,
          r: 50,
          b: 50,
          t: 50,
          pad: 4
        },
        paper_bgcolor: "rgb(65,179,163)",
        font: { color: "black", family: "Arial",}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // D2: 3. Use Plotly to plot the data with the layout.
    
    
    // 4. Create the trace for the gauge chart.
    trace3 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: '<b>Belly Button Washing Frequence</b><br>Scrubs per Week', fontsize: 12 },
      gauge: {
        axis: {
          range: [0, 10],
          tickmode:"array",
          tickvals:["0","2","4","6","8","10"]
        },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ],
        bar: { color: "black" }
      },
      type: "indicator",
      mode: "gauge+number"
    } 
    
    var gaugeData = [trace3]
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 450, 
      height: 450,
      paper_bgcolor: "rgb(195, 141, 158)",
      font: { color: "black", family: "Arial"},
      margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
