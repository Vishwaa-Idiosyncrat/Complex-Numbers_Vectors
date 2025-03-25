/***********************************************************************************/
// Create text

createVector.prototype.create_text = function(){
  this.font_size_normal = 1.85*screen_size;
  this.font_size_small = 1.7*screen_size;

  this.text_3 = {};
  this.text_3.data = {
    posX: 0, posY: -this.r - 1.5*this.font_size_normal,
    textBox: { "fill": this.vector_color, "fill-opacity": 0.1, width: 8*this.font_size_normal, height: 1.8*this.font_size_normal },
    tspans: [
      {
    index: 0,
    value: this.symbol + " = ", // e.g. "z = "
    "dominant-baseline": "middle",
    "font-size": this.font_size_normal,
    fill: this.vector_color,
    "font-family": "sans-serif"
  },
  {
    index: 1,
    value: 0, // will hold z_x (real part)
    "dominant-baseline": "middle",
    "font-size": this.font_size_normal,
    fill: "black",
    "font-family": "sans-serif"
  },
  {
    index: 2,
    value: " + i ", // literal text "+ i "
    "dominant-baseline": "middle",
    "font-size": this.font_size_normal,
    fill: "black",
    "font-family": "sans-serif"
  },
  {
    index: 3,
    value: 0, // will hold z_y (imag part)
    "dominant-baseline": "middle",
    "font-size": this.font_size_normal,
    fill: "black",
    "font-family": "sans-serif"
  }, 
    ]
  }

  this.text_3.group = this.container.append("g");
  this.text_3.textBox = this.text_3.group.append("rect");
  this.text_3.text = this.text_3.group.append("text");
  this.text_3.tspans = [];
  for(i in this.text_3.data.tspans){
    this.text_3.tspans[i] = this.text_3.text.append("tspan");
  }


 /* // New complex-number text: display as "z = [real] + i [imag]"
  createVector.prototype.create_text = function(){
    // Set the base font size as before
    this.font_size_normal = 1.85 * screen_size;

    // Compute the real and imaginary parts using existing properties.
    // (Assuming: real part = r * cos(angle) and imaginary part = r * sin(angle))
    var realPart = Math.round(radius_scale(this.r * Math.cos(this.angle_rad)) * 10) / 10;
    var imagPart = Math.round(radius_scale(this.r * Math.sin(this.angle_rad)) * 10) / 10;

    // Create a new text group for the complex number
    this.text_complex = {};
    this.text_complex.data = {
      posX: 0, 
      posY: -this.r - 1.5 * this.font_size_normal,
      text: "z = " + realPart + " + i " + imagPart
    };

    // Append the text group to the container
    this.text_complex.group = this.container.append("g");
    this.text_complex.text = this.text_complex.group.append("text")
        .styles({ "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" })
        .attrs({ x: this.text_complex.data.posX, y: this.text_complex.data.posY })
        .text(this.text_complex.data.text);
  }*/

  this.text_2 = {};
  this.text_2.data = {
    posX: 0, posY: -this.r - 1.5*this.font_size_normal,
    textBox: { "fill": this.vector_color, "fill-opacity": 0.1, width: 8*this.font_size_normal, height: 1.8*this.font_size_normal },
    tspans: [
      { index: 0, "value": this.symbol, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 1, "value": "r", "dominant-baseline": "mathematical", "font-size": this.font_size_small, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 2, "value": " ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 3, "value": Math.round(radius_scale(this.r)*10)/10, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 4, "value": " ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 5, "value": this.symbol, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 6, "value": "θ", "dominant-baseline": "mathematical", "font-size": this.font_size_small, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 7, "value": " ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 8, "value": Math.round(this.angle_deg*10)/10+"\u00B0", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
    ]
  }

  this.text_2.group = this.container.append("g");
  this.text_2.textBox = this.text_2.group.append("rect");
  this.text_2.text = this.text_2.group.append("text");
  this.text_2.tspans = [];
  for(i in this.text_2.data.tspans){
    this.text_2.tspans[i] = this.text_2.text.append("tspan");
  }

  this.text_1 = {};
  this.text_1.data = {
    textBox: { "fill": this.vector_color, "fill-opacity": 0.5, width: 1.2*this.font_size_normal, height: 1.8*this.font_size_normal },
    posY: -this.r - 1.5*this.font_size_normal,
    tspans: [
      { index: 0, "value": this.symbol+"\u0305", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" }
    ]
  }
  this.text_1.data.posX = -0.5*this.text_2.data.textBox.width-0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect

  this.text_1.group = this.container.append("g");
  this.text_1.textBox = this.text_1.group.append("rect");
  this.text_1.text = this.text_1.group.append("text");
  this.text_1.tspans = [];
  for(i in this.text_1.data.tspans){
    this.text_1.tspans[i] = this.text_1.text.append("tspan");
  }

}

/***********************************************************************************/
// Setup text

createVector.prototype.setup_text = function(){

  // Text box 3
  var box = this.text_3.textBox;
  var box_data = this.text_3.data.textBox;
  box.styles({ "fill": box_data["fill"], "fill-opacity": box_data["fill-opacity"] });

  // Text 3
  for(i in this.text_3.tspans){
    var tspan = this.text_3.tspans[i];
    var tspan_data = this.text_3.data.tspans[i];
    tspan.styles({ "font-size": tspan_data["font-size"], "dominant-baseline": tspan_data["dominant-baseline"], "fill": tspan_data["fill"], "font-family": tspan_data["font-family"] });
  }

  // Text box 2
  var box = this.text_2.textBox;
  var box_data = this.text_2.data.textBox;
  box.styles({ "fill": box_data["fill"], "fill-opacity": box_data["fill-opacity"] });

  // Text 2
  for(i in this.text_2.tspans){
    var tspan = this.text_2.tspans[i];
    var tspan_data = this.text_2.data.tspans[i];
    tspan.styles({ "font-size": tspan_data["font-size"], "dominant-baseline": tspan_data["dominant-baseline"], "fill": tspan_data["fill"], "font-family": tspan_data["font-family"] });
  }

  // Text box 1
  var box = this.text_1.textBox;
  var box_data = this.text_1.data.textBox;
  box.styles({ "fill": box_data["fill"], "fill-opacity": box_data["fill-opacity"] });

  // Text 1
  for(i in this.text_1.tspans){
    var tspan = this.text_1.tspans[i];
    var tspan_data = this.text_1.data.tspans[i];
    tspan.styles({ "font-size": tspan_data["font-size"], "dominant-baseline": tspan_data["dominant-baseline"], "fill": tspan_data["fill"], "font-family": tspan_data["font-family"] });
  }

}

/***********************************************************************************/
// Update text

createVector.prototype.update_text = function(){
  this.text_2.data.tspans[3].value = this.parent.settings.show_decimals == true ? Math.round(radius_scale(this.r)*10)/10 : Math.round(radius_scale(this.r));
  this.text_2.data.tspans[8].value = (this.parent.settings.show_decimals == true ? Math.round(this.angle_deg*10)/10 : Math.round(this.angle_deg))+"\u00B0";
  let zx = radius_scale(this.r) * Math.cos(this.angle_rad);
  let zy = radius_scale(this.r) * Math.sin(this.angle_rad);
  if (this.parent.settings.show_decimals) {
    zx = Math.round(zx * 10) / 10;
    zy = Math.round(zy * 10) / 10;
  } else {
    zx = Math.round(zx);
    zy = Math.round(zy);
  }
  this.text_3.data.tspans[1].value = zx;
  this.text_3.data.tspans[3].value = zy;

  if(this.vector_mode == "polar"){
    this.text_1.data.posY = -this.r - 1.5*this.font_size_normal;
    this.text_2.data.posY = -this.r - 1.5*this.font_size_normal;
    this.text_3.data.posY = -this.r - 1.5*this.font_size_normal;
  }

  if(this.vector_mode == "cartesian"){
    this.text_1.data.posY = -this.r - 2.45*this.font_size_normal;
    this.text_2.data.posY = -this.r - 3.4*this.font_size_normal;
    this.text_3.data.posY = -this.r - 1.5*this.font_size_normal;
  }

  if(this.addedVectors == true){
    if(this.object != undefined){
      var resultant = this.object.resultant;

      if(this.position == "first"){
        this.text_1.data.posY = -resultant.r - 3.4*this.font_size_normal;
        this.text_2.data.posY = -resultant.r - 3.4*this.font_size_normal;
        this.text_3.data.posY = -resultant.r - 3.4*this.font_size_normal;
        this.text_1.data.posX = -1*this.text_2.data.textBox.width - 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
        this.text_2.data.posX = -0.5*this.text_2.data.textBox.width;
        this.text_3.data.posX = -0.5*this.text_2.data.textBox.width;
        // this.text_3.data.posX = -1*this.text_2.data.textBox.width - 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
      }

      if(this.position == "second"){
        if(this.object.addition_mode == "triangle"){
          this.text_1.data.posY = this.object.vector_1.yComponent_length - resultant.r - 1.5*this.font_size_normal;
          this.text_2.data.posY = this.object.vector_1.yComponent_length - resultant.r - 1.5*this.font_size_normal;
          this.text_3.data.posY = this.object.vector_1.yComponent_length - resultant.r - 1.5*this.font_size_normal;
          this.text_1.data.posX = -this.object.vector_1.xComponent_length - 1*this.text_2.data.textBox.width - 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
          this.text_2.data.posX = -this.object.vector_1.xComponent_length - 0.5*this.text_2.data.textBox.width;
          this.text_3.data.posX = -this.object.vector_1.xComponent_length - 0.5*this.text_2.data.textBox.width;
          // this.text_3.data.posX = -this.object.vector_1.xComponent_length - 1*this.text_2.data.textBox.width - 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
        }
        if(this.object.addition_mode == "parallelogram"){
          this.text_1.data.posY = 0 - resultant.r - 1.5*this.font_size_normal;
          this.text_2.data.posY = 0 - resultant.r - 1.5*this.font_size_normal;
          this.text_3.data.posY = 0 - resultant.r - 1.5*this.font_size_normal;
          this.text_1.data.posX = -1*this.text_2.data.textBox.width - 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
          this.text_2.data.posX = -0.5*this.text_2.data.textBox.width;
          this.text_3.data.posX = -0.5*this.text_2.data.textBox.width;
          // this.text_3.data.posX = -1*this.text_2.data.textBox.width - 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
        }
      }

      if(this.position == "resultant"){
        this.text_1.data.posY = -resultant.r - 2.45*this.font_size_normal;
        this.text_2.data.posY = -resultant.r - 2.45*this.font_size_normal;
        this.text_3.data.posY = -resultant.r - 2.45*this.font_size_normal;
        this.text_1.data.posX = -0*this.text_2.data.textBox.width + 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
        this.text_2.data.posX = 0.5*this.text_2.data.textBox.width + 1*this.text_1.data.textBox.width;
        this.text_3.data.posX = 0.5*this.text_2.data.textBox.width + 1*this.text_1.data.textBox.width;
        // this.text_3.data.posX = -0*this.text_2.data.textBox.width + 0.5*this.text_1.data.textBox.width; // x coordinate of the midpoint of the rect
      }

    }
  }

  // Text box 3
  var box = this.text_3.textBox;
  var data = this.text_3.data;
  var box_data = this.text_3.data.textBox;
  box.attrs({ x: data.posX-0.5*box_data.width, y: data.posY-0.5*box_data.height, width: box_data.width, height: box_data.height });

  // Text 3
  this.text_3.text.attrs({ x: this.text_3.data.posX, y: this.text_3.data.posY })
  for(i in this.text_3.tspans){
    var tspan = this.text_3.tspans[i];
    var tspan_data = this.text_3.data.tspans[i];
    tspan.text(tspan_data["value"]);
  }

  // Text box 2
  var box = this.text_2.textBox;
  var data = this.text_2.data;
  var box_data = this.text_2.data.textBox;
  box.attrs({ x: data.posX-0.5*box_data.width, y: data.posY-0.5*box_data.height, width: box_data.width, height: box_data.height });

  // Text 2
  this.text_2.text.attrs({ x: this.text_2.data.posX, y: this.text_2.data.posY })
  for(i in this.text_2.tspans){
    var tspan = this.text_2.tspans[i];
    var tspan_data = this.text_2.data.tspans[i];
    tspan.text(tspan_data["value"]);
  }

  if(this.manipulationPossible == false){
    this.text_1.data.posX = 0;
  }

  // Text box 1
  var box = this.text_1.textBox;
  var data = this.text_1.data;
  var box_data = this.text_1.data.textBox;
  box.attrs({ x: data.posX-0.5*box_data.width, y: data.posY-0.5*box_data.height, width: box_data.width, height: box_data.height, rx: 0.3*box_data.width, ry: 0.3*box_data.width });

  // Text 1
  this.text_1.text.attrs({ x: this.text_1.data.posX, y: this.text_1.data.posY })
  for(i in this.text_1.tspans){
    var tspan = this.text_1.tspans[i];
    var tspan_data = this.text_1.data.tspans[i];
    tspan.text(tspan_data["value"]);
  }

}

/***********************************************************************************/
// Setup view text

createVector.prototype.setup_view_text = function(){
  if(this.vector_mode == "polar"){
    this.text_3.text.styles({ "display": "none" });
    this.text_3.textBox.styles({ "display": "none" });
  }
  if(this.vector_mode == "cartesian"){
    this.text_3.text.styles({ "display": null });
    this.text_3.textBox.styles({ "display": null });
  }
}
