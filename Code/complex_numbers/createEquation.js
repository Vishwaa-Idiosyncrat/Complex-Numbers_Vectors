/***********************************************************************************/
// Create Equation
createVector.prototype.create_equation = function(){
  var symbol = this.symbol;
  this.div = d3.select('body').append('div').styles({ 'font-size': this.font_size_normal });
  this.rEquation = this.div.append('div').styles({ 'padding-top': 10 }).append('text')
    .html(`\\( ${symbol}_r = ${Math.round(radius_scale(this.r))} \\cos(${Math.round(this.angle_deg)}^\\circ) \\)<br>`);
  this.θEquation = this.div.append('div').styles({ 'padding-top': 10 }).append('text')
    .html(`\\( ${symbol}_θ = ${Math.round(radius_scale(this.r))} \\sin(${Math.round(this.angle_deg)}^\\circ) \\)`);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}


// // Update equation formatting
// // Replace the equation lines with:
// this.xEquation.html(`\\( ${this.symbol}_r = ${Math.round(radius_scale(this.r))}cos(${Math.round(this.angle_deg)}^\\circ) \\)<br>`);
// this.yEquation.html(`\\( ${this.symbol}_θ = ${Math.round(radius_scale(this.r))}sin(${Math.round(this.angle_deg)}^\\circ) \\)`);

/***********************************************************************************/
// Setup Equation

createVector.prototype.setup_equation = function(){
  this.div.styles({ 'position': 'absolute' })
}

/***********************************************************************************/
// Update Equation

createVector.prototype.update_equation = function(){
  // Temporarily disabling this as we already show the components of the vector
  /*
  this.rEquation.html(`\\( ${this.symbol}_r = ${Math.round(radius_scale(this.r))} \\cos(${Math.round(this.angle_deg)}^\\circ) \\)<br>`);
  this.θEquation.html(`\\( ${this.symbol}_θ = ${Math.round(radius_scale(this.r))} \\sin(${Math.round(this.angle_deg)}^\\circ) \\)`);
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);

  this.div.styles({ 
    'top': this.cy + this.r + 10, 
    'left': this.cx - 0.5*parseInt(this.div.style('width')) 
  });
  */
}

/***********************************************************************************/
// Setup view Equation

createVector.prototype.setup_view_equation = function(){
}