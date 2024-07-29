const margin = { top: 50, right: 30, bottom: 100, left: 60 },
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

let currentSlide = 0;

const svg = d3.select("#visualization")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3.select("#visualization")
  .append("div")
  .attr("class", "tooltip");


function updateBarChart(data) {
  svg.selectAll("*").remove();

  const x = d3.scaleBand().domain(data.map(d => d.coffee_name)).range([0, width]).padding(0.1);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.total)]).nice().range([height, 0]);

  svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.coffee_name))
    .attr("y", d => y(d.total))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.total))
    .attr("fill", "#4CAF50")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`Coffee: ${d.coffee_name}<br>Total: $${d.total.toFixed(2)}`)
        .style("left", (event.pageX - 40) + "px")
        .style("top", (event.pageY - 60) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold");

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold");

  
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Coffee Type");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Total Amount Spent");
}

function updateScatterPlot(data) {
  svg.selectAll("*").remove();

  const x = d3.scaleBand().domain(data.map(d => d.coffee_name)).range([0, width]).padding(0.1);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.money)]).nice().range([height, 0]);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.coffee_name) + x.bandwidth() / 2)
    .attr("cy", d => y(d.money))
    .attr("r", 5)
    .attr("fill", d => color(d.coffee_name))
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`Coffee: ${d.coffee_name}<br>Money: $${d.money.toFixed(2)}`)
        .style("left", (event.pageX - 40) + "px")
        .style("top", (event.pageY - 60) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

 
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold"); 

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold"); 

 
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Coffee Type");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Total Amount Spent");

  const legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .style("font-weight", "bold") 
    .text(d => d);
}





function updateCashTypeBarChart(data) {
  svg.selectAll("*").remove();

  const aggregatedCashData = d3.rollups(data, v => d3.sum(v, d => d.money), d => d.cash_type)
    .map(([key, value]) => ({ cash_type: key, total: value }));

  const x = d3.scaleBand().domain(aggregatedCashData.map(d => d.cash_type)).range([0, width]).padding(0.1);
  const y = d3.scaleLinear().domain([0, d3.max(aggregatedCashData, d => d.total)]).nice().range([height, 0]);

  svg.selectAll(".bar")
    .data(aggregatedCashData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.cash_type))
    .attr("y", d => y(d.total))
    .attr("width", x.bandwidth())
    .attr("height", d => height - y(d.total))
    .attr("fill", "#4CAF50")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`Cash Type: ${d.cash_type}<br>Total: $${d.total.toFixed(2)}`)
        .style("left", (event.pageX - 40) + "px")
        .style("top", (event.pageY - 60) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold"); 

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold"); 

  
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 50})`)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Cash Type");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Total Amount Spent");
}



function updateLineChart(data) {
  svg.selectAll("*").remove();

  const aggregatedData = d3.rollups(data, v => d3.sum(v, d => d.money), d => d.coffee_name)
    .map(([key, value]) => ({ coffee_name: key, total: value }));

  const x = d3.scaleBand().domain(aggregatedData.map(d => d.coffee_name)).range([0, width]).padding(0.1);
  const y = d3.scaleLinear().domain([0, d3.max(aggregatedData, d => d.total)]).nice().range([height, 0]);

  const line = d3.line()
    .x(d => x(d.coffee_name) + x.bandwidth() / 2)
    .y(d => y(d.total));

  svg.append("path")
    .datum(aggregatedData)
    .attr("fill", "none")
    .attr("stroke", "hotpink") 
    .attr("stroke-width", 2)  
    .attr("d", line);

  svg.selectAll("circle")
    .data(aggregatedData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.coffee_name) + x.bandwidth() / 2)
    .attr("cy", d => y(d.total))
    .attr("r", 5)
    .attr("fill", "hotpink") 
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 1);
      tooltip.html(`Coffee: ${d.coffee_name}<br>Total: $${d.total.toFixed(2)}`)
        .style("left", (event.pageX - 40) + "px")
        .style("top", (event.pageY - 60) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

 
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold"); 

  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px")
    .style("fill", "#555")
    .style("font-weight", "bold");

  
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Coffee Type");

  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .style("fill", "#333")
    .style("font-weight", "bold") 
    .text("Total Amount Spent");
}

d3.csv("data.csv").then(data => {
  data.forEach(d => {
    d.money = +d.money;
  });

  const aggregatedData = d3.rollups(data, v => d3.sum(v, d => d.money), d => d.coffee_name)
    .map(([key, value]) => ({ coffee_name: key, total: value }));

  const slides = [
    () => updateBarChart(aggregatedData),
    () => updateScatterPlot(data),
    () => updateLineChart(data),
    () => updateCashTypeBarChart(data)
  ];

  slides[currentSlide]();

  document.getElementById("next").addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide]();
  });

  document.getElementById("prev").addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    slides[currentSlide]();
  });
}).catch(error => {
  console.error('Error loading the data:', error);
});