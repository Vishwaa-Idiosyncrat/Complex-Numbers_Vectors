/***********************************************************************************/

function createVector(data){
  if(navigator.vibrate){ navigator.vibrate([50]); }

  for(var i in data){ this[i] = data[i]; }

  this.vector_color = color(data.vectorID);
  this.gray_color = "gray";
  this.manipulationMode = false;
  this.manipulationActive = false;
  this.moving = false;
  // Example of an array-based approach:
  const complexSymbols = ["z", "w", "u", "v", "p", "q", "r", "s"];
  this.symbol = complexSymbols[data.vectorID] || "z";
  this.visibility = true;
  this.addition_possible = false;
  this.addition_data = {};
  this.addedVectors = data.addedVectors;
  screen_svg.vector_log[data.vectorID] = this;
  if(this.delete_allowed == undefined){ this.delete_allowed = true; }
  if(this.addition_resolution_allowed == undefined){ this.addition_resolution_allowed = true; }
  if(this.addition_change_mode_allowed == undefined){ this.addition_change_mode_allowed = true; }

  this.control_circle_radius = 3*screen_dpi;
  this.control_line_size = 4*screen_dpi;
  this.addition_circle_radius = 2*screen_size;

  if(this.taskScreen == true && this.parent.parent_svg){
    this.parent.parent_svg.append("marker").attrs({ id: "arrow_"+this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
    .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });

    this.parent.parent_svg.append("marker").attrs({ id: "arrow_component_"+this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 3, markerHeight: 3, orient: "auto" })
    .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });

    this.parent.parent_svg.append("marker").attrs({ id: "arrow_gray_"+this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
    .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.gray_color, "fill": this.gray_color });
  } else {
    this.parent.canvas.append("marker").attrs({ id: "arrow_"+this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
    .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });

    this.parent.canvas.append("marker").attrs({ id: "arrow_component_"+this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 3, markerHeight: 3, orient: "auto" })
    .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });

    this.parent.canvas.append("marker").attrs({ id: "arrow_gray_"+this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
    .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.gray_color, "fill": this.gray_color });
  }


  this.create();
  this.setup();
  this.update();
  this.setup_view();
  if(this.addedVectors != true){ this.createEvents(); }
}

/***********************************************************************************/

createVector.prototype.create = function(){

  this.container = this.parent.canvas.append("g").classed("vector_g", true);
  this.circle = this.container.append("circle").data([this]);
  this.xAxis = this.container.append("line");
  this.yAxis = this.container.append("line");

  /*************************** Projection lines and paths ***************************/

  this.xComponent_triangle = this.container.append("path").attr("class", "projection_"+this.vectorID);
  this.yComponent_triangle = this.container.append("path").attr("class", "projection_"+this.vectorID);

  this.xProjection_line = this.container.append("line").attr("class", "projection_"+this.vectorID);
  this.yProjection_line = this.container.append("line").attr("class", "projection_"+this.vectorID);

  this.xProjection_circle = this.container.append("circle").attr("class", "projection_"+this.vectorID);
  this.yProjection_circle = this.container.append("circle").attr("class", "projection_"+this.vectorID);

  this.vector_head_circle = this.container.append("circle").attr("class", "projection_"+this.vectorID);
  this.vector_line_dotted = this.container.append("line").attr("class", "projection_"+this.vectorID);

  /*************************** Vectors ***************************/

  this.vector_line_inactive = this.container.append("line");
  this.vector_line = this.container.append("line");

  this.xComponent_line = this.container.append("line");
  this.yComponent_line = this.container.append("line");

  this.centre_circle = this.container.append("circle");

  /*************************** Controls ***************************/

  this.vector_resolve_rect_g = this.container.append("g");
  this.vector_resolve_rect = this.vector_resolve_rect_g.append("rect").data([this]);

  this.angle_control_line = this.container.append("line").data([this]);
  this.radius_control_circle = this.container.append("circle").data([this]);
  this.centre_control_circle = this.container.append("circle").data([this]);
  this.xComponent_control_circle = this.container.append("circle").data([this]);
  this.yComponent_control_circle = this.container.append("circle").data([this]);
  this.vector_recombine_circle = this.container.append("circle").data([this]);

  /*************************** Addition circle ***************************/

  // this.addition_centre_circle = this.container.append("circle").data([this]);
  this.addition_circle = this.container.append("circle").data([this]);

  /*************************** Extra Controls ***************************/

  this.delete_button = { size: 5*screen_size, size_big: 8*screen_size };
  this.delete_button.posX = -8*screen_size;
  this.delete_button.posY = -8*screen_size;
  this.delete_button.shown = false;
  this.delete_button.active = false;
  this.delete_button.image = this.container.append("image").attrs({ "xlink:href": "../../Images/delete.png", width: 0, height: 0 }).data([this]);

  this.create_text();
  this.create_equation();
}

/***********************************************************************************/

createVector.prototype.setup = function(){

  this.circle.styles({ "stroke": this.gray_color, "stroke-opacity": 0.5, "stroke-width": 0.1*screen_size, "stroke-dasharray": "3,3", "fill": this.vector_color, "fill-opacity": 0 });
  this.xAxis.styles({ "stroke": this.gray_color, "stroke-opacity": 0.5, "stroke-width": 0.1*screen_size, "stroke-dasharray": "3,3" });
  this.yAxis.styles({ "stroke": this.gray_color, "stroke-opacity": 0.5, "stroke-width": 0.1*screen_size, "stroke-dasharray": "3,3" });

  /*************************** Projection lines and paths ***************************/

  this.xComponent_triangle.styles({ "fill": this.vector_color, "fill-opacity": 0.3, "stroke": "none" });
  this.yComponent_triangle.styles({ "fill": this.vector_color, "fill-opacity": 0.2, "stroke": "none" });

  this.xProjection_line.styles({ "stroke": this.vector_color, "stroke-opacity": 0.6, "stroke-width": 0.15*screen_size, "stroke-dasharray": "3,3" });
  this.yProjection_line.styles({ "stroke": this.vector_color, "stroke-opacity": 0.6, "stroke-width": 0.15*screen_size, "stroke-dasharray": "3,3" });

  this.xProjection_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 0.8 });
  this.yProjection_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 0.8 });

  this.vector_head_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 0.8 });
  this.vector_line_dotted.styles({ "stroke": this.vector_color, "stroke-opacity": 0.6, "stroke-width": 0.2*screen_size, "stroke-dasharray": "3,3" });

  /*************************** Vectors ***************************/

  this.vector_line_inactive.styles({ "stroke": this.gray_color, "stroke-width": 0.4*screen_size }).attrs({ "marker-end": "url(#arrow_gray_" +this.vectorID+ ")" });
  this.vector_line.styles({ "stroke": this.vector_color, "stroke-width": 0.4*screen_size }).attrs({ "marker-end": "url(#arrow_" +this.vectorID+ ")" });

  this.xComponent_line.styles({ "stroke": this.vector_color, "stroke-width": 0.4*screen_size }).attrs({ "marker-end": "url(#arrow_component_" +this.vectorID+ ")" });
  this.yComponent_line.styles({ "stroke": this.vector_color, "stroke-width": 0.4*screen_size }).attrs({ "marker-end": "url(#arrow_component_" +this.vectorID+ ")" });

  this.centre_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 1 });

  /*************************** Controls ***************************/

  this.vector_resolve_rect.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");

  this.angle_control_line.styles({ "stroke": this.vector_color, "stroke-width": this.control_line_size }).attr("class", "invisible");
  this.radius_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.xComponent_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.yComponent_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.centre_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.vector_recombine_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");

  /*************************** Addition circle ***************************/

  this.addition_circle.styles({ "stroke": "none", "fill": this.gray_color, "fill-opacity": 0.3 });
  // this.addition_centre_circle.styles({ "stroke": "none", "fill": this.gray_color }).attr("class", "invisible");

  this.setup_text();
  this.setup_equation();
}

/***********************************************************************************/

createVector.prototype.update = function(){

  if( isNaN(this.r) || isNaN(this.angle_rad) || isNaN(this.cx) || isNaN(this.cy)){ return }

  /*************************** Component dimensions ***************************/

  this.angle_deg = this.angle_rad*180/Math.PI;
  if(this.angle_deg < 0){ this.angle_deg += 360; }

  this.xComponent_length = this.r*Math.cos(this.angle_rad);
  this.yComponent_length = this.r*Math.sin(this.angle_rad);

  this.xComponent_coordinate = this.cx + this.r*Math.cos(this.angle_rad);
  this.yComponent_coordinate = this.cy - this.r*Math.sin(this.angle_rad);

  /*************************** Container ***************************/

  this.container.attrs({ "transform": "translate(" +this.cx+ "," +this.cy+ ")" });
  this.circle.attrs({ cx: 0, cy: 0, r: this.r });
  this.xAxis.attrs({ x1: -this.r, y1: 0, x2: this.r, y2: 0 });
  this.yAxis.attrs({ y1: -this.r, x1: 0, y2: this.r, x2: 0 });

  /*************************** Projection lines and paths ***************************/

  this.xComponent_triangle.attrs({ d: line_gen([ [0,0], [this.xComponent_length, 0], [this.xComponent_length, -this.yComponent_length] ]) });
  this.yComponent_triangle.attrs({ d: line_gen([ [0,0], [0, -this.yComponent_length], [this.xComponent_length, -this.yComponent_length] ]) });

  this.xProjection_line.attrs({ x1: this.xComponent_length, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });
  this.yProjection_line.attrs({ x1: 0, y1: -this.yComponent_length, x2: this.xComponent_length, y2: -this.yComponent_length });

  this.xProjection_circle.attrs({ cx: this.xComponent_length, cy: 0, r: 0.4*screen_size });
  this.yProjection_circle.attrs({ cx: 0, cy: -this.yComponent_length, r: 0.4*screen_size });

  this.vector_head_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: 0.4*screen_size });
  this.vector_line_dotted.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });

  /*************************** Vectors ***************************/

  this.vector_line_inactive.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });
  this.vector_line.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });

  if(this.addedVectors != true){
    this.xComponent_line.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: 0 });
    this.yComponent_line.attrs({ x1: 0, y1: 0, x2: 0, y2: -this.yComponent_length });
  }

  this.centre_circle.attrs({ cx: 0, cy: 0, r: 0.8*screen_size });

  /*************************** Addition circle ***************************/

  this.addition_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: this.addition_circle_radius });
  // this.addition_centre_circle.attrs({ cx: 0, cy: 0, r: this.control_circle_radius });

  /*************************** Controls ***************************/

  this.vector_resolve_rect_g.attrs({ "transform": "rotate(" +(-this.angle_deg)+ ")" });
  this.vector_resolve_rect.attrs({ x: 0, y: -10*screen_dpi, width: this.r, height: 20*screen_dpi });

  this.angle_control_line.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });
  this.radius_control_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: this.control_circle_radius });
  this.xComponent_control_circle.attrs({ cx: this.xComponent_length, cy: 0, r: this.control_circle_radius });
  this.yComponent_control_circle.attrs({ cx: 0, cy: -this.yComponent_length, r: this.control_circle_radius });

  this.centre_control_circle.attrs({ cx: 0, cy: 0, r: this.control_circle_radius });
  this.vector_recombine_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: this.control_circle_radius });

  /*************************** Vectors are added ***************************/

  // if(this.vectorsAdded == true){
  //   if(this.addition_data.position == "first"){
  //     this.addition_data.patner.cx = this.cx + this.xComponent_length;
  //     this.addition_data.patner.cy = this.cy - this.yComponent_length;
  //     this.addition_data.patner.update();
  //     this.updateAddedVectors();
  //   }
  //   else{ this.addition_data.patner.updateAddedVectors(); }
  // }

  this.update_text();
  this.update_equation();
}

/***********************************************************************************/

createVector.prototype.setup_view = function(){

  this.vector_line_inactive.styles({ "display": "none" });
  this.vector_recombine_circle.styles({ "display": "none" });
  this.addition_circle.styles({ "display": "none" });
  // this.addition_centre_circle.styles({ "display": "none" });

  /*************************** Hide all controls ***************************/

  this.vector_resolve_rect.styles({ "display": "none" });

  this.angle_control_line.styles({ "display": "none" });
  this.radius_control_circle.styles({ "display": "none" });
  this.xComponent_control_circle.styles({ "display": "none" });
  this.yComponent_control_circle.styles({ "display": "none" });

  /*************************** Manipulation not possible ***************************/

  if(this.manipulationPossible == false){
    this.vector_line_inactive.styles({ "display": null });

    this.vector_line.styles({ "display": "none" });
    this.circle.styles({ "display": "none" });
    this.xAxis.styles({ "display": "none" });
    this.yAxis.styles({ "display": "none" });
    this.centre_circle.styles({ "fill": this.gray_color });
    this.vector_resolve_rect.styles({ "display": "none" });
    this.angle_control_line.styles({ "display": "none" });
    this.radius_control_circle.styles({ "display": "none" });
    this.xComponent_control_circle.styles({ "display": "none" });
    this.yComponent_control_circle.styles({ "display": "none" });
    this.centre_control_circle.styles({ "display": "none" });
    this.xComponent_line.styles({ "display": "none" });
    this.yComponent_line.styles({ "display": "none" });
    d3.selectAll(".projection_"+this.vectorID).styles({ "display": "none" });

    this.text_2.text.styles({ "display": "none" });
    this.text_2.textBox.styles({ "display": "none" });
    this.text_3.text.styles({ "display": "none" });
    this.text_3.textBox.styles({ "display": "none" });

    return
  }

  /*************************** Controls ***************************/

  if(this.manipulables.r == false){ this.radius_control_circle.attrs({ "display": "none" }); }
  if(this.manipulables.angle == false){ this.angle_control_line.attrs({ "display": "none" }); }
  if(this.manipulables.xComponent == false){ this.xComponent_control_circle.attrs({ "display": "none" }); }
  if(this.manipulables.yComponent == false){ this.yComponent_control_circle.attrs({ "display": "none" }); }

  if(this.resolution_allowed == false){ this.vector_resolve_rect.attrs({ "display": "none" }); }

  /*************************** vector mode ***************************/

  if(this.vector_mode == "polar"){
    this.xComponent_line.styles({ "display": "none" });
    this.yComponent_line.styles({ "display": "none" });
    d3.selectAll(".projection_"+this.vectorID).styles({ "display": "none" });
  }

  if(this.vector_mode == "cartesian"){
    this.vector_line.styles({ "display": "none" });
    this.xProjection_circle.styles({ "display": "none" });
    this.yProjection_circle.styles({ "display": "none" });
  }

  this.setup_view_text();
  this.setup_view_equation();

}

/***********************************************************************************/
