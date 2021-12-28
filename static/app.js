d3.json('data/samples.json').then(data => console.log(data))

var idDrop = d3.select("#selDataset"); 
var demoTable = d3.select("#sample-metadata"); 
var barChart = d3.select("#bar"); 
var bubChart = d3.select("bubble"); 

//create function for dropdown menu 
function init() {
    resetData(); 

    //read in json 
    d3.json("data/samples.json").then((data => {
        data.names.forEach((name => {
            var option = idDrop.append("option"); 
            option.text(name);
        })); 

        var initId = idDrop.property("value")

        plotCharts(initID); 

    }));
}

//function to clear out the data
function resetData() {
    demoTable.html(""); 
    barChart.html(""); 
    bubChart.html(""); 
}; 

//read json and plot charts 
function plotCharts(id) {
    d3.json("data/samples.json").then((data =>  {
        var indivMetadata = data.metadata.filter(participant => participant.id == id)[0];

        Object.entries(indivMetadata).forEach(([key, value]) => {
            var newList = demoTable.append("ul");
            newList.attr("class", "list-group list group-flush"); 

            var listItem = newList.append("li"); 

            listItem.attr("class", "list-group-item p-1 demo-text bg-transparent"); 

            listItem.text(`${key}: ${value}`); 
        }); //close forEach

        var indivSample = data.samples.filter(sample => sample.id == id)[0]; 

        var otuIds = []; 
        var outLabels = []; 
        var sampleValues = []; 

        Object.entries(indivSample).forEach(([key, value]) => {
            switch (key) {
                case "otu_ids": 
                    otuIds.push(value); 
                    break; 
                case "sample_values": 
                    sampleValues.push(value); 
                    break; 
                case "otu_labels": 
                    outLabels.push(value); 
                    break; 
                default: 
                    break; 
            } //close switch 
        }); //close forEach 

        //top ten of each list
        var topOtuIds = otuIds[0].slice(0,10).reverse(); 
        var topOtuLabels = outLabels[0].slice(0,10).reverse();
        var topSampleValues = sampleValues[0].slice(0,10).reverse();

        //store values in format with otu as part of their label for the y-axis 
        var topOtuIdsFormat = topOtuIds.map(otuID => "OTU" + otuID); 

        //plot bar chart 
        var traceBar = {
            x: topSampleValues, 
            y: topOtuIdsFormat, 
            text: topOtuLabels, 
            type: 'bar', 
            orientation: 'h', 
            marker: {
                color: 'rgb(29, 145, 192)'
            }
        };

        var dataBar = [traceBar]; 

        var layoutBar = {
            height: 500,
            width: 600, 
            font: {
                family: 'Quicksand'
            }, 
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            }, 
            title: {
                text: `<b>TopOTUs for Test Subject ${id}</b>`, 
                font: {
                    size: 18, 
                    color: 'rgb(34, 94, 168)'
                }
            }, 
            xaxis: {
                title: "<b>Sample Values</b>", 
                color: 'rgb(34, 94, 168)'
            }, 
            yaxis: {
                tickfont: { size:14 }
            }
        }
        
        Plotly.newPlot("bar", dataBar, layoutBar); 

        //bubble chart 
        var traceBub = {
            x:otuIds[0], 
            y: sampleValues[0], 
            text: outLabels[0], 
            mode: 'markers', 
            marker: {
                size: sampleValues[0], 
                color: otuIds[0], 
                colorscale: 'Y1GnBu'
            }
        }; 

        var dataBub = [traceBub]; 
        var layoutBub = {
            font: {
                family: 'Quicksand'
            }, 
            hoverlabel: {
                font: {
                    family: 'Quicksand'
                }
            }, 
            xaxis: {
                title: "<b>OTU ID</b>", 
                color: 'rgb(34, 94, 168)'
            }, 
            yaxis: {
                title: "<b>Sample Values</b>", 
                color: "rbd(34, 94, 168)"
            }, 
            showlegend: false, 
        }; 

        Plotly.newPlot('bubble', dataBub, layoutBub); 

    })); //close then function 
}; //close PlotChart function

function optionChanged(id) {
    resetData(); 

    plotCharts(id); 
} //close option changed 

init(); 