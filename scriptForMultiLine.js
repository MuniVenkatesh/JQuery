//function to draw a multi series line chart
var lineChart=function(data){
  var margin = {top: 20, right: 140, bottom: 40, left: 90},
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var x = d3.time.scale()  //x-axis range
    .range([0, width]);

var y = d3.scale.linear()  //y-axis range
    .range([height, 0]);

var color = d3.scale.category10(); //color scale of category10

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()                      //line object
    .interpolate("monotone")
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.arrest); });

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dateObj=[];
  data.forEach(function(d){
    d.year=+d.year;
    dateObj.push(new Date(d.year,0,1));
    d.arrested=+d.arrested;
    d.notArrested=+d.notArrested;
  });
  xAxis.ticks(data.length);
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));
  var assault = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d,i) {
        return {year: dateObj[i], arrest: +d[name]};
      })
    };
  });

  x.domain(d3.extent(dateObj, function(d,i) { return dateObj[i];  })); // x-axis domain

  y.domain([0,
            d3.max(assault, function(c) { return d3.max(c.values, function(v) { return v.arrest; }); })  // y-axis domain
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor","end")
      .attr("dx","-0.5em")
      .attr("dy","-0.1em")
      .attr("transform","rotate(-70)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy","-4em")
      .style("text-anchor", "end")
      .style("font-size","17px")
      .style("font-weight","bold")
      .style("font-family","sans-serif")
      .text("No.of Arrests & Non-Arrests over Years");

  var result = svg.selectAll(".chart")
      .data(assault).enter()
    .append("g")
      .attr("class", "chart");

  result.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  // appends text at end of each line
  result.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.arrest) + ")"; })
      .text(function(d) { return d.name.toUpperCase(); });

};
