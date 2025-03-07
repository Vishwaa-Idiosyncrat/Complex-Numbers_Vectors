/***********************************************************************************/
function createVector(data) {
  if (navigator.vibrate) navigator.vibrate([50]);

  // Initialize properties
  for (let i in data) this[i] = data[i];
  this.vector_color = color(data.vectorID);
  this.gray_color = "#666";
  this.manipulationMode = false;
  this.componentized = false;

  // Complex number configuration
  this.complexSymbols = ['z', 'w', 'u', 'v'];
  this.symbol = this.complexSymbols[data.vectorID % 4];
  this.vector_log = screen_svg.vector_log;
  this.vector_log[data.vectorID] = this;

  // Visual parameters
  this.control_circle_radius = 3 * screen_dpi;
  this.control_line_size = 4 * screen_dpi;
  this.addition_circle_radius = 2 * screen_size;

  /*************************** Marker Definitions ***************************/
  const createMarker = (id, color) => {
    return this.parent.canvas.append("marker")
      .attrs({
        id: id,
        viewBox: "0 0 10 10",
        refX: 9.3,
        refY: 5,
        markerWidth: 6,
        markerHeight: 6,
        orient: "auto"
      })
      .append("circle")
      .attrs({ cx: 5, cy: 5, r: 3 })
      .styles({ "stroke": color, "fill": color });
  };

  createMarker(`arrow_${this.vectorID}`, this.vector_color);
  createMarker(`arrow_component_${this.vectorID}`, this.vector_color);
  createMarker(`arrow_gray_${this.vectorID}`, this.gray_color);

  this.create();
  this.setup();
  this.update();
  this.setup_view();
  if (!this.addedVectors) this.createEvents();
}

/***********************************************************************************/
createVector.prototype.create = function() {
  this.container = this.parent.canvas.append("g").classed("vector_g", true);
  
  // Core elements
  this.circle = this.container.append("circle").data([this]);
  this.vector_line = this.container.append("line")
    .styles({ "stroke": this.vector_color, "stroke-width": 0.4 * screen_size })
    .attrs({ "marker-end": `url(#arrow_${this.vectorID})` });

  // Component displays
  this.realDisplay = this.container.append("text")
    .classed("component-display", true)
    .styles({ "font-size": "1.2em", "fill": this.vector_color, "display": "none" });

  this.imagDisplay = this.container.append("text")
    .classed("component-display", true)
    .styles({ "font-size": "1.2em", "fill": this.vector_color, "display": "none" });

  // Control elements
  this.vector_head_circle = this.container.append("circle")
    .attrs({ r: 0.4 * screen_size })
    .styles({ "fill": this.vector_color });

  // Projection elements
  this.xComponent_line = this.container.append("line");
  this.yComponent_line = this.container.append("line");
};

/***********************************************************************************/
createVector.prototype.update = function() {
  if (isNaN(this.r) || isNaN(this.angle_rad)) return;

  // Calculate components
  this.angle_deg = ((this.angle_rad * 180 / Math.PI + 360) % 360).toFixed(1);
  this.xComponent_length = this.r * Math.cos(this.angle_rad);
  this.yComponent_length = this.r * Math.sin(this.angle_rad);

  // Update visual elements
  this.container.attr("transform", `translate(${this.cx},${this.cy})`);
  this.vector_line.attrs({ x2: this.xComponent_length, y2: -this.yComponent_length });
  this.vector_head_circle.attrs({ 
    cx: this.xComponent_length,
    cy: -this.yComponent_length
  });

  // Update component displays
  if (this.componentized) {
    const real = (this.xComponent_length / screen_dpi).toFixed(1);
    const imag = (this.yComponent_length / screen_dpi).toFixed(1);
    
    this.realDisplay
      .attr("x", this.xComponent_length + 5)
      .attr("y", -this.yComponent_length - 15)
      .text(`Real: ${real}`)
      .style("display", null);

    this.imagDisplay
      .attr("x", this.xComponent_length + 5)
      .attr("y", -this.yComponent_length + 15)
      .text(`Imag: ${imag}`)
      .style("display", null);
  }
};

/***********************************************************************************/
createVector.prototype.resolveComponents = function() {
  this.componentized = true;
  this.vector_line.style("stroke-dasharray", "5,5");
  this.realDisplay.style("display", null);
  this.imagDisplay.style("display", null);
  this.update();
};

createVector.prototype.recombineComponents = function() {
  this.componentized = false;
  this.vector_line.style("stroke-dasharray", "none");
  this.realDisplay.style("display", "none");
  this.imagDisplay.style("display", "none");
  this.update();
};

/***********************************************************************************/
createVector.prototype.setup = function() {
  // Style initial elements
  this.circle.styles({
    "stroke": this.gray_color,
    "stroke-opacity": 0.5,
    "fill-opacity": 0
  });

  this.xComponent_line.styles({
    "stroke": this.vector_color,
    "stroke-width": 0.4 * screen_size
  }).attr("marker-end", `url(#arrow_component_${this.vectorID})`);

  this.yComponent_line.styles({
    "stroke": this.vector_color,
    "stroke-width": 0.4 * screen_size
  }).attr("marker-end", `url(#arrow_component_${this.vectorID})`);
};

/***********************************************************************************/
createVector.prototype.setup_view = function() {
  // Initial visibility states
  this.vector_head_circle.style("display", this.componentized ? "none" : null);
  this.xComponent_line.style("display", "none");
  this.yComponent_line.style("display", "none");
  
  if (this.vector_mode === "cartesian") {
    this.vector_line.style("display", "none");
    this.xComponent_line.style("display", null);
    this.yComponent_line.style("display", null);
  }
};

/***********************************************************************************/
createVector.prototype.createEvents = function() {
  // Event handlers for vector manipulation
  const dragHandler = d3.drag()
    .on("start", (d) => {
      if (!d.manipulationMode) return;
      d.temp_pos = { x: d3.event.x, y: d3.event.y };
    })
    .on("drag", (d) => {
      if (!d.manipulationMode) return;
      d.cx += d3.event.dx;
      d.cy += d3.event.dy;
      d.update();
    });

  this.vector_line.call(dragHandler);
};