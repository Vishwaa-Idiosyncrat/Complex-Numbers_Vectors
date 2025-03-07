/***********************************************************************************/
function createVector(data) {
  if (navigator.vibrate) navigator.vibrate([50]);

  // Initialize properties from data
  for (let key in data) this[key] = data[key];
  
  // Visual styling
  this.vector_color = color(data.vectorID);
  this.gray_color = "#666";
  this.manipulationMode = false;
  this.componentized = false;

  // Complex number configuration
  this.complexSymbols = ['z', 'w', 'u', 'v'];
  this.symbol = this.complexSymbols[data.vectorID % 4];
  
  // Size calculations
  this.control_circle_radius = 3 * screen_dpi;
  this.control_line_size = 4 * screen_dpi;
  this.addition_circle_radius = 2 * screen_size;

  // Create visual elements
  this.create();
  this.setup();
  this.update();
  this.setup_view();
  
  if (!this.addedVectors) this.createEvents();
}

/***********************************************************************************/
createVector.prototype.create = function() {
  // Main container
  this.container = this.parent.canvas.append("g")
    .classed("vector_g", true)
    .attr("transform", `translate(${this.cx},${this.cy})`);

  // 1. Base Circle
  this.circle = this.container.append("circle")
    .attr("r", this.r)
    .style("stroke", this.gray_color)
    .style("stroke-opacity", 0.5)
    .style("fill", "none");

  // 2. Vector Line with Round Head
  this.vector_line = this.container.append("line")
    .style("stroke", this.vector_color)
    .style("stroke-width", 0.4 * screen_size)
    .attr("marker-end", `url(#arrow_${this.vectorID})`);

  // 3. Vector Head Circle
  this.vector_head = this.container.append("circle")
    .attr("r", 0.8 * screen_size)
    .style("fill", this.vector_color);

  // 4. Axis Lines
  this.xAxis = this.container.append("line")
    .style("stroke", this.gray_color)
    .style("stroke-dasharray", "3,3");

  this.yAxis = this.container.append("line")
    .style("stroke", this.gray_color)
    .style("stroke-dasharray", "3,3");

  // 5. Component Projections
  this.xComponent_line = this.container.append("line")
    .style("stroke", this.vector_color)
    .style("stroke-dasharray", "3,3");

  this.yComponent_line = this.container.append("line")
    .style("stroke", this.vector_color)
    .style("stroke-dasharray", "3,3");

  // 6. Control Elements
  this.centre_circle = this.container.append("circle")
    .attr("r", 0.8 * screen_size)
    .style("fill", this.vector_color);

  // 7. Complex Number Display
  this.complexDisplay = this.container.append("text")
    .classed("complex-number", true)
    .style("font-size", "1.2em")
    .style("fill", this.vector_color);
};

/***********************************************************************************/
createVector.prototype.update = function() {
  if (isNaN(this.r) || isNaN(this.angle_rad)) return;

  // Update vector geometry
  this.angle_deg = ((this.angle_rad * 180 / Math.PI + 360) % 360).toFixed(1);
  this.xComponent_length = this.r * Math.cos(this.angle_rad);
  this.yComponent_length = this.r * Math.sin(this.angle_rad);

  // Update visual elements
  this.circle.attr("r", this.r);
  
  this.vector_line
    .attr("x2", this.xComponent_length)
    .attr("y2", -this.yComponent_length);

  this.vector_head
    .attr("cx", this.xComponent_length)
    .attr("cy", -this.yComponent_length);

  this.xAxis
    .attr("x1", -this.r)
    .attr("x2", this.r);

  this.yAxis
    .attr("y1", -this.r)
    .attr("y2", this.r);

  // Update complex number display
  const real = (this.xComponent_length / screen_dpi).toFixed(1);
  const imag = (Math.abs(this.yComponent_length) / screen_dpi).toFixed(1);
  
  this.complexDisplay
    .attr("x", this.xComponent_length + 10)
    .attr("y", -this.yComponent_length + 5)
    .text(`${real} ${this.yComponent_length >= 0 ? '+' : '-'} i${imag}`);
};

/***********************************************************************************/
createVector.prototype.setup = function() {
  // Create vector markers
  const createMarker = (id, color) => {
    return this.parent.canvas.append("marker")
      .attr("id", id)
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 9.3)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("circle")
      .attr("cx", 5)
      .attr("cy", 5)
      .attr("r", 3)
      .style("fill", color)
      .style("stroke", color);
  };

  createMarker(`arrow_${this.vectorID}`, this.vector_color);
  createMarker(`arrow_gray_${this.vectorID}`, this.gray_color);
};

/***********************************************************************************/
createVector.prototype.setup_view = function() {
  // Initial visibility states
  this.xComponent_line.style("display", "none");
  this.yComponent_line.style("display", "none");
  this.centre_circle.style("display", this.manipulationMode ? null : "none");
  
  if (this.vector_mode === "polar") {
    this.vector_line.style("display", null);
    this.xComponent_line.style("display", "none");
    this.yComponent_line.style("display", "none");
  } else {
    this.vector_line.style("display", "none");
    this.xComponent_line.style("display", null);
    this.yComponent_line.style("display", null);
  }
};

/***********************************************************************************/
createVector.prototype.createEvents = function() {
  // Drag handler for vector manipulation
  const dragHandler = d3.drag()
    .on("start", (d) => {
      d.temp_pos = {
        x: d3.event.sourceEvent.touches[0].pageX,
        y: d3.event.sourceEvent.touches[0].pageY,
        cx: d.cx,
        cy: d.cy
      };
    })
    .on("drag", (d) => {
      if (!d.movementAllowed) return;
      d.cx = d.temp_pos.cx + (d3.event.sourceEvent.touches[0].pageX - d.temp_pos.x);
      d.cy = d.temp_pos.cy + (d3.event.sourceEvent.touches[0].pageY - d.temp_pos.y);
      d.container.attr("transform", `translate(${d.cx},${d.cy})`);
      d.update();
    });

  this.vector_line.call(dragHandler);
  this.centre_circle.call(dragHandler);
};