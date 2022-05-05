const tooltip = document.getElementById("tooltip");

const createSvg = async () => {
	const moviesRes = await fetch(
		"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
	);

	const movies = await moviesRes.json();
	const width = 960;
	const height = 600;

	const color = d3.scaleOrdinal(d3.schemeSet3);

	const svg = d3
		.select("#container")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	const treemap = d3.treemap().size([width, height]).padding(0);

	const root = d3.hierarchy(movies).sum(d => d.value);

	treemap(root);

	const cell = svg
		.selectAll("g")
		.data(root.leaves())
		.enter()
		.append("g")
		.attr("transform", d => `translate(${d.x0}, ${d.y0})`);

	const tile = cell
		.append("rect")
		.attr("class", "tile")
		.attr("data-name", d => d.data.name)
		.attr("data-category", d => d.data.category)
		.attr("data-value", d => d.data.value)
		.attr("width", d => d.x1 - d.x0)
		.attr("height", d => d.y1 - d.y0)
		.attr("fill", d => color(d.data.category))
		.on("mouseover", (d, i) => {
			const { name, category, value } = d.data;
			tooltip.classList.add("show");
			tooltip.style.left = d3.event.pageX - 300 + "px";
			tooltip.style.top = d3.event.pageY - 150 + "px";
			tooltip.setAttribute("data-value", value);

			tooltip.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Value:</strong> ${value}</p>
      `;
		})
		.on("mouseout", () => {
			tooltip.classList.remove("show");
		});

	cell
		.append("text")
		.selectAll("tspan")
		.data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
		.enter()
		.append("tspan")
		.attr("style", "font-size: 10px")
		.attr("x", 4)
		.attr("y", (d, i) => 15 + i * 15)
		.text(d => d);

	//Creating the legend
	const categories = root
		.leaves()
		.map(n => n.data.category)
		.filter((item, idx, arr) => arr.indexOf(item) === idx); // Filter the ones that are equal one with another

	const blockSize = 20;
	const legendWidth = 800;
	const legendHeight = 40;

	const legend = d3
		.select("body")
		.append("svg")
		.attr("id", "legend")
		.attr("width", legendWidth)
		.attr("height", legendHeight);

	legend
		.selectAll("rect")
		.data(categories)
		.enter()
		.append("rect")
		.attr("class", "legend-item")
		.attr("fill", d => color(d))
		.attr("y", blockSize / 2)
		.attr("x", (_, i) => i * (blockSize + 90) + 10)
		.attr("width", 85)
		.attr("height", blockSize);

	legend
		.append("g")
		.selectAll("text")
		.data(categories)
		.enter()
		.append("text")
		.attr("fill", "black")
		.attr("y", blockSize * 2 - 15)
		.attr("x", (_, i) => i * (blockSize + 90) + 10)
		.text(d => d);
};

createSvg();
