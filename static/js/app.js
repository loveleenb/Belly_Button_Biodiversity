function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
    
    d3.json(`/metadata/${sample}`).then(function(sampleData) {
      console.log(sampleData);

      // Use d3 to select the panel with id of `#sample-metadata`
      var panel = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata
      panel.html("");

      // Use `Object.entries` to add each key and value pair to the panel
      // tags for each key-value in the metadata.
      Object.entries(sampleData).forEach(([key, value]) => {
        panel.append("h4").text(`${key}: ${value}`);
      })

    });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sampleData) {
    console.log(sampleData);

     var otu_ids = sampleData.otu_ids;
     var otu_labels = sampleData.otu_labels;
     var sample_values = sampleData.sample_values;

    // @TODO: Build a Bubble Chart using the sample data
    var bubbleChart = {
      type: "scatter",
      mode: "markers",
      name: name,
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      marker:{
        size:sample_values,
        color:otu_ids,
      }
    };

    var layout = {
      margin: { t: 0 },
        xaxis: {title: 'OTU ID'},
    }

    var data = [bubbleChart];
    Plotly.newPlot("bubble", data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieChart = [{
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10,),
      hoverinfo: "hovertext",
      type: "pie"
    }];

    var layout = {
      margin: {t: 0, l: 0}
    }

    Plotly.plot("pie", pieChart, layout); 

  });


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
