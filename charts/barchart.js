function drawChart_a1_v1() {
	let div_id = "#barchart";

	// Definition of the div target dimentions
	let ratio = 3; // 3 width = 1 height
	let win_width = d3.select(div_id).node().getBoundingClientRect().width;
	let win_height = win_width / ratio;

	// set the dimensions and margins of the graph
	let margin = { top: 30, right: 0, bottom: 100, left: 100 };
	let width = 500;
	let height = 400 ;



	let svg = d3.select(div_id)
		.append("svg")
		.attr("width",600)
  		.attr("height", 550)
		.style("background-color","ccc");

	let xScale = d3.scaleBand().range([0, width]).padding(0.4),
		yScale = d3.scaleLinear().range([height, 0]);

	let g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.csv("data/wafflechart_pie_bubble.csv").then(function (data) {
		data.forEach(function (d) {
			d.Total_Cases = +d.Total_Cases;
		});

		// Sort data in descending order based on Total_Cases
		data.sort(function (a, b) {
			return b.Total_Cases - a.Total_Cases;
		});

		// Extract the top 20 countries by Total_Cases
		let top20 = data.slice(0, 20);

		// Calculate the sum of Total_Cases for the other countries
		let other = data.slice(20, data.length);
		let sum = d3.sum(other, function (d) { return d.Total_Cases });

		// Use top20 to create the chart
		xScale.domain(top20.map(function (d) { return d.Country; }));
		yScale.domain([0, d3.max(top20, function (d) { return d.Total_Cases; })]);

		g.append("g")
			
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(xScale))
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", "-.6em")
			.attr("transform", "rotate(-65)");

		g.append("g")
			.append("text")
			.attr("x", width/2)
			.attr("y", height + 70)
			.attr('text-anchor', 'end')
			.attr('stroke', 'black')
			.text("Country")

		g.append("g")
			.call(d3.axisLeft(yScale).tickFormat(function (d) { return d; }))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -15)
			.attr('dy', '-5em')
			.attr('stroke', 'black')
			.text('Count')
			.style("font-size", "12px")
		g.append("text")
			.attr("x", (width / 2))
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("font-size", "14px")
			.style("font-weight","bold")
			.text("Comparing Total cases among Top 20 countries using Line chart");
			
		g.selectAll(".bar")
			.data(top20)
			.enter().append("rect")
			.attr("class", "bar")
			.on("mouseover", onMouseOver) // Add listener for event
			.on("mouseout", onMouseOut)
			.attr("x", function (d) { return xScale(d.Country); })
			.attr("y", function (d) { return yScale(d.Total_Cases); })
			.attr("width", xScale.bandwidth())
			.transition()
			.ease(d3.easeLinear)
			.duration(500)
			.delay(function (d, i) { return i * 50 })
			.attr("height", function (d) { return height - yScale(d.Total_Cases); });

		d3.select('#other')
			.html(`
						 <h2>Others</h2>
						 <div> Count: ${sum}</div>
					 `);
	});


	// Mouseover event handler

	function onMouseOver(d, i) {
		// Get bar's xy values, ,then augment for the tooltip
		let xPos = d.pageX + 10;
		let yPos = d.pageY - 10;

		// Update Tooltip's position and value
		d3.select('#tooltip')
			.style('left', xPos + 'px')
			.style('top', yPos + 'px')
			.html(`
				<h2>${i.Country}</h2>
				<div> Total_Cases: ${i.Total_Cases.toLocaleString()}</div>
			`);

		d3.select('#tooltip').classed('hidden', false);

		d3.select(this).attr('class', 'highlight')
		d3.select(this)
			.transition() // I want to add animnation here
			.duration(500)
			.attr('width', xScale.bandwidth() + 5)
			.attr('y', function (d) { return yScale(d.Total_Cases) - 10; })
			.attr('height', function (d) { return height - yScale(d.Total_Cases) + 10; })

	}

	// Mouseout event handler
	function onMouseOut(d, i) {
		d3.select(this).attr('class', 'bar')
		d3.select(this)
			.transition()
			.duration(500)
			.attr('width', xScale.bandwidth())
			.attr('y', function (d) { return yScale(d.Total_Cases); })
			.attr('height', function (d) { return height - yScale(d.Total_Cases) })

		d3.select('#tooltip').classed('hidden', true);
	}
	
}

drawChart_a1_v1()
