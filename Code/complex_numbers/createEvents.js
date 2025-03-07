/***********************************************************************************/

createVector.prototype.createEvents = function(){

  this.temp_pos = {};

  /*************************** Circle Events ***************************/

  var drag_circle = d3.drag();
  this.circle.call(drag_circle);

  drag_circle.on("start", function(d){
    if(d.manipulationMode == false && d3.event.sourceEvent.type == "touchstart"){
      d.temp_pos.x = d3.event.sourceEvent.targetTouches[0].pageX;
      d.temp_pos.y = d3.event.sourceEvent.targetTouches[0].pageY;
      d.temp_pos.cx = d.cx;
      d.temp_pos.cy = d.cy;
    }
  })

  drag_circle.on("drag", function(d){
    if(d.manipulationMode == false && d.movementAllowed == true){
      d.cx = d.temp_pos.cx + (d3.event.sourceEvent.targetTouches[0].pageX - d.temp_pos.x);
      d.cy = d.temp_pos.cy + (d3.event.sourceEvent.targetTouches[0].pageY - d.temp_pos.y);
      d.checkForAddition();
      d.update();
    }
  })

  drag_circle.on("end", function(d){
    if(d.addition_possible){
      if(d.addition_data.position == "first"){ d.create_addition_centre_circle(); }
      if(d.addition_data.position == "second"){ d.addition_data.patner.create_addition_centre_circle(); }
    }
  })

  /*************************** Addition Centre Circle Events ***************************/

  this.create_addition_centre_circle = function(){
    this.addition_centre_circle = this.parent.canvas.append("circle")
      .styles({ "fill": this.gray_color, "fill-opacity": 0, "stroke": "none" })
      .attrs({ cx: this.cx, cy: this.cy, r: this.control_circle_radius })
      .data([this]);

    this.addition_centre_circle.on("touchstart",function(d){
      d3.select(this).styles({ "fill-opacity": 0.4 });
      d.temp_circle = d.parent.canvas.append("circle")
        .styles({ "fill": this.gray_color, "fill-opacity": 0.3, "stroke": "none" })
        .attrs({ cx: d.addition_data.patner.xComponent_coordinate, cy: d.addition_data.patner.yComponent_coordinate, r: d.control_circle_radius })
        .on("touchstart", function(){
          // // window.navigator.vibrate(200);
          d.addVectors();
        })
    })

    this.addition_centre_circle.on("touchend",function(d){
      d3.select(this).styles({ "fill-opacity": 0 });
      d.temp_circle.remove();
    })
  }

  /*************************** Long press on Centre Events ***************************/

  this.dispatch = d3.dispatch("long_press");

  this.dispatch.on("long_press", function(d){
    if(d.delete_allowed == true){
      d.delete_button.shown = true;
      d.delete_button.image
      .transition().duration(500)
      .attrs({ x: d.delete_button.posX-0.5*d.delete_button.size, y: d.delete_button.posY-0.5*d.delete_button.size, width: d.delete_button.size, height: d.delete_button.size });
    }
  })

  /*************************** Centre Circle Events ***************************/

  this.centre_control_circle.on("touchstart", function(d){
    d3.select(this).attr("class", "visible");
    if(d.manipulationMode == false){ this.timer = setTimeout(function(){ d.dispatch.call("long_press", this, d); }, 600); }
    if(d.manipulationMode == true && d.vector_mode == "cartesian"){
      this.timer = setTimeout(function(){ d.vector_recombine_circle.styles({ "display": null }).attr("class", "visible"); }, 100);
    }
  })

  this.centre_control_circle.on("touchmove", function(d){
    var button = d.delete_button;
    if(button.shown == true){
      var temp_dist = distpoints(d3.event.targetTouches[0].pageX, d3.event.targetTouches[0].pageY, d.cx+button.posX, d.cy+button.posY);
      if(temp_dist < 0.5*button.size){ button.active = true } else { button.active = false; }
      if(button.active == true){ button.image.attrs({ x: button.posX-0.5*button.size_big, y: button.posY-0.5*button.size_big, width: button.size_big, height: button.size_big }) }
      else { button.image.attrs({ x: button.posX-0.5*button.size, y: button.posY-0.5*button.size, width: button.size, height: button.size }) }
    }
  })

  this.centre_control_circle.on("touchend", function(d){
    d3.select(this).attr("class", "invisible");
    clearTimeout(this.timer);
    d.vector_recombine_circle.styles({ "display": "none" });

    var button = d.delete_button;
    if(button.active == false){
      button.shown = false;
      button.image
      .transition().duration(1000)
      .attrs({ width: 0, height: 0, x: 0, y: 0 });
    } else {
      d.container.styles({ "display": "none" });
      for(i in d.parent.vector_list){ if(d.parent.vector_list[i].vectorID == d.vectorID){ d.parent.vector_list.splice(i, 1); } }
    }

  })

  this.centre_control_circle.on("click", function(d){
    d.manipulationMode = !d.manipulationMode;
    // // window.navigator.vibrate(200);
    d.toggleManipulationMode();
  })

  /*************************** Vector recombine circle Events ***************************/

  this.vector_recombine_circle.on("touchstart", function(d){
    // // window.navigator.vibrate(200);
    d.recombine_vector();
  })

  /*************************** Radius control circle Events ***************************/

  var radius_control_circle_drag = d3.drag();
  this.radius_control_circle.call(radius_control_circle_drag);

  radius_control_circle_drag.on("start", function(d){
    if(d3.event.sourceEvent.type == "touchstart"){
      d3.select(this).attr("class", "visible");
      // document.getElementById('beep').play();
      d.temp_pos.dist = distpoints(0,0, d3.event.x, d3.event.y);
      d.temp_pos.r = d.r;
      // window.navigator.vibrate([25]);
    }
  })

  radius_control_circle_drag.on("drag", function(d){
    if(d3.event.sourceEvent.type == "touchmove"){
      temp_dist = distpoints(0,0, d3.event.x, d3.event.y);
      temp_r = d.temp_pos.r + (temp_dist - d.temp_pos.dist);
      if( !isNaN(temp_r) && temp_r >= 0 ){ d.r = temp_r; }
      d.update();
    }
  })

  radius_control_circle_drag.on("end", function(d){
    d3.select(this).attr("class", "invisible");
  })

  /*************************** Angle control line Events ***************************/

  var angle_control_line_drag = d3.drag();
  this.angle_control_line.call(angle_control_line_drag);

  angle_control_line_drag.on("start", function(d){
    if(d3.event.sourceEvent.type == "touchstart"){
      d3.select(this).attr("class", "visible");
      // document.getElementById('beep').play();
      // window.navigator.vibrate([25]);
    }
  })

  angle_control_line_drag.on("drag", function(d){
    if(d3.event.sourceEvent.type == "touchmove"){
      temp_angle_rad = Math.atan2(-d3.event.y, d3.event.x);
      if( !isNaN(temp_angle_rad) ){ d.angle_rad = temp_angle_rad; }
      d.update();
    }
  })

  angle_control_line_drag.on("end", function(d){
    d3.select(this).attr("class", "invisible");
  })

  /*************************** xComponent control circle Events ***************************/

  var xComponent_control_circle_drag = d3.drag();
  this.xComponent_control_circle.call(xComponent_control_circle_drag);

  xComponent_control_circle_drag.on("start", function(d){
    if(d3.event.sourceEvent.type == "touchstart"){
      d3.select(this).attr("class", "visible");
      // document.getElementById('beep').play();
      d.temp_pos.xComponent_length = d.xComponent_length;
      d.temp_pos.yComponent_length = d.yComponent_length;
      // window.navigator.vibrate([25]);
    }
  })

  xComponent_control_circle_drag.on("drag", function(d){
    if(d3.event.sourceEvent.type == "touchmove"){
      d.temp_pos.xComponent_length += d3.event.dx;
      temp_r = Math.sqrt(d.temp_pos.xComponent_length*d.temp_pos.xComponent_length + d.temp_pos.yComponent_length*d.temp_pos.yComponent_length);
      temp_angle_rad = Math.atan2(d.temp_pos.yComponent_length, d.temp_pos.xComponent_length);

      if( !isNaN(temp_r) && !isNaN(temp_angle_rad) ){ d.r = temp_r; d.angle_rad = temp_angle_rad; }
      d.update();
    }
  })

  xComponent_control_circle_drag.on("end", function(d){
    d3.select(this).attr("class", "invisible");
  })

  /*************************** yComponent control circle Events ***************************/

  var yComponent_control_circle_drag = d3.drag();
  this.yComponent_control_circle.call(yComponent_control_circle_drag);

  yComponent_control_circle_drag.on("start", function(d){
    if(d3.event.sourceEvent.type == "touchstart"){
      d3.select(this).attr("class", "visible");
      // document.getElementById('beep').play();
      d.temp_pos.xComponent_length = d.xComponent_length;
      d.temp_pos.yComponent_length = d.yComponent_length;
      // window.navigator.vibrate([25]);
    }
  })

  yComponent_control_circle_drag.on("drag", function(d){
    if(d3.event.sourceEvent.type == "touchmove"){
      d.temp_pos.yComponent_length -= d3.event.dy;
      temp_r = Math.sqrt(d.temp_pos.xComponent_length*d.temp_pos.xComponent_length + d.temp_pos.yComponent_length*d.temp_pos.yComponent_length);
      temp_angle_rad = Math.atan2(d.temp_pos.yComponent_length, d.temp_pos.xComponent_length);

      if( !isNaN(temp_r) && !isNaN(temp_angle_rad) ){ d.r = temp_r; d.angle_rad = temp_angle_rad; }
      d.update();
    }
  })

  yComponent_control_circle_drag.on("end", function(d){
    d3.select(this).attr("class", "invisible");
  })

  /*************************** Vector resolve rect Events ***************************/

  var tempArray = [], temp_resolved = false;

  this.vector_resolve_rect.on("touchstart", function(d){
    tempArray = [];
    temp_resolved = false;
    if(d3.event.targetTouches.length == 2){ d3.selectAll(".projection_"+d.vectorID).styles({ "display": null }); }
    else{ d3.selectAll(".projection_"+d.vectorID).styles({ "display": "none" }); }
  })

  this.vector_resolve_rect.on("touchmove", function(d){
    if(d3.event.targetTouches.length == 2){
      tempArray.push(d3.event);
      if(tempArray.length > 5){ tempArray.splice(0,1); }
      dist_1 = distpoints(tempArray[0].targetTouches[0].pageX, tempArray[0].targetTouches[0].pageY, tempArray[0].targetTouches[1].pageX, tempArray[0].targetTouches[1].pageY);
      dist_2 = distpoints(tempArray[tempArray.length-1].targetTouches[0].pageX, tempArray[tempArray.length-1].targetTouches[0].pageY, tempArray[tempArray.length-1].targetTouches[1].pageX, tempArray[tempArray.length-1].targetTouches[1].pageY);
      temp_speed = (dist_1-dist_2)/(tempArray[0].timeStamp-tempArray[tempArray.length-1].timeStamp);
      if(temp_speed > 0.4 && !temp_resolved && d.resolution_allowed){
        // // window.navigator.vibrate(200);
        d.resolve_vector();
        temp_resolved = true;
      }
    } else{ tempArray = []; }
  })

  this.vector_resolve_rect.on("touchend", function(d){
    if(d.vector_mode == "polar"){ d3.selectAll(".projection_"+d.vectorID).styles({ "display": "none" }); }
    tempArray = [];

    temp_resolved = false;
  })

  /*************************** Centre Addition Circle ***************************/

  // this.addition_centre_circle.on("touchstart", function(d){
  //   d3.select(this).styles({ "opacity": 0.4 });
  //   var patner = vector_list[d.addition_data.patner];
  //   patner.addition_circle.styles({ "display": null, "fill-opacity": 0.4 });
  // })
  //
  // this.addition_centre_circle.on("touchend", function(d){
  //   d3.select(this).styles({ "opacity": 0 });
  //   var patner = vector_list[d.addition_data.patner];
  //   patner.addition_circle.styles({ "display": "none" });
  // })

  /*************************** Addition Circle ***************************/

  // this.addition_circle.on("touchstart", function(d){
  //   console.log(d);
  // })

  /***************************  ***************************/

}

/***********************************************************************************/
