function createCanvas(element) {
    var element_width = parseInt(element.style("width"));
    var element_height = parseInt(element.style("height"));
  
    var outer_div = element.append("div").styles({ "width": element_width, "height": element_height });
    screen_svg = {};
    screen_svg.canvas = outer_div.append("svg").styles({ "width": "100%", "height": "100%" });
    screen_svg.vector_log = [];
    screen_svg.vector_list = [];
    screen_svg.vectorID = -1;
    screen_svg.settings = { show_decimals: false };
  
    screen_svg.canvas.on("touchstart", function () {
      d3.event.preventDefault();
    });
  
    screen_svg.canvas.on("touchmove", function () {
      d3.event.preventDefault();
    });
  
    createCanvasEvents();
  
    /*************************** Heading ***************************/
  
    screen_svg.canvas.append("text")
      .styles({ "font-size": 20, "fill": "black", "font-family": "serif" })
      .attrs({ x: 0.5 * element_width, y: 40 })
      .text("Complex Numbers");
  
    /*************************** Refresh Icon ***************************/
  
    refresh_icon_size = 30;
    temp_pos = { x: 0.92 * element_width, y: 50 };
  
    screen_svg.canvas.append("image")
      .attrs({ x: temp_pos.x - 0.5 * refresh_icon_size, y: temp_pos.y - 0.5 * refresh_icon_size, width: refresh_icon_size, height: refresh_icon_size, "xlink:href": "../../Images/settings.svg" });
  
    refresh_icon_circle = screen_svg.canvas.append("circle")
      .styles({ "fill": "gray", "fill-opacity": 0, "stroke": "gray", "stroke-width": 2 })
      .attrs({ cx: temp_pos.x, cy: temp_pos.y, r: 0.8 * refresh_icon_size });

    refresh_icon_circle.on("touchstart", function () {
      d3.select(this).styles({ "fill-opacity": 0.2, "stroke": "#555" });
    })
  
    refresh_icon_circle.on("touchend", function () {
      d3.select(this).styles({ "fill-opacity": 0, "stroke": "gray" });
    })
  
    refresh_icon_circle.on("click", function () {
      swal({
        title: 'Settings',
        html: '<input id="settings_show_decimals" type="checkbox" ' + (screen_svg.settings.show_decimals ? "checked = ''" : "") + ' /> Show Decimals',
        showCloseButton: true,
        confirmButtonText: 'Done',
      }).then((result) => {
        screen_svg.settings.show_decimals = document.getElementById('settings_show_decimals').checked;
        screen_svg.vector_log.forEach(function (vector) {
          if(vector) vector.update();
        });
      });
    });

    temp_pos = { x: 0.92 * innerWidth, y: 12 * screen_size };
    screen_svg.canvas.append("image")
      .attrs({ x: temp_pos.x - 0.5 * refresh_icon_size, y: temp_pos.y - 0.5 * refresh_icon_size, width: refresh_icon_size, height: refresh_icon_size, "xlink:href": "../../Images/refresh.svg" });
  
    refresh_icon_circle = screen_svg.canvas.append("circle")
      .styles({ "fill": "gray", "fill-opacity": 0, "stroke": "gray", "stroke-width": 0.2 * screen_size })
      .attrs({ cx: temp_pos.x, cy: temp_pos.y, r: 0.8 * refresh_icon_size });
  
    refresh_icon_circle.on("touchstart", function () {
      d3.select(this).styles({ "fill-opacity": 0.2, "stroke": "#555" });
    })
  
    refresh_icon_circle.on("touchend", function () {
      d3.select(this).styles({ "fill-opacity": 0, "stroke": "gray" });
    })
  
    refresh_icon_circle.on("click", function () {
      d3.selectAll(".vector_g").remove();
      screen_svg.vector_list = [];
      screen_svg.addition_log = [];
      screen_svg.vectorID = -1;
    })
  
    /*************************** Help Icon ***************************/
  
    screen_svg.canvas
      .append("text")
      .styles({ "font-family": "FontAwesome", "font-size": 24, "dominant-baseline": "central", "text-anchor": "middle", "fill": "#707070", 'cursor': 'pointer' })
      .attrs({ "x": temp_pos.x, y: temp_pos.y + 40 })
      .html("\uf29c")
      .on("click", function () {
        window.open("https://youtu.be/RR1WX6o5hfM", "_default");
      });
  
    /*************************** Footer ***************************/
  
    var temp_text = screen_svg.canvas.append("text")
      .attrs({ x: 0.5 * element_width, y: 0.97 * element_height })
      .styles({ "font-size": 14 });
  
    temp_text.append("tspan")
      .styles({ "color": "gray" })
      .text("- designed by");
  
    temp_text.append("tspan")
      .styles({ "fill": "steelblue", "font-size": 14, "cursor": "hand", "font-weight": "normal", "font-family": "sans-serif" })
      .text(" Learning Sciences Research Group")
      .on("click", function () {
        window.open("http://lsr.hbcse.tifr.res.in/", "_default");
      });
  }
  
  /***********************************************************************************/
  
  function createCanvasEvents() {
    screen_svg.canvas.on("touchstart", function () {
      if (d3.event.touches.length == 2) {
        const touch1 = d3.event.touches[0];
        const touch2 = d3.event.touches[1];
    
        const zx = ((touch1.pageX + touch2.pageX) / 2 - screen_svg.canvas.node().getBoundingClientRect().left) / screen_dpi;
        const zy = ((touch1.pageY + touch2.pageY) / 2 - screen_svg.canvas.node().getBoundingClientRect().top) / screen_dpi;
    
        d3.select('#complexNumberDisplay')
          .style('left', `${(touch1.pageX + touch2.pageX) / 2}px`)
          .style('top', `${(touch1.pageY + touch2.pageY) / 2}px`)
          .text(`z = ${zx.toFixed(1)} + i${zy.toFixed(1)}`);
    
        // Create the vector
        screen_svg.vectorID++;
        const temp_vector = new createVector({
          parent: screen_svg,
          cx: (touch1.pageX + touch2.pageX) / 2,
          cy: (touch1.pageY + touch2.pageY) / 2,
          r: distpoints(touch1.pageX, touch1.pageY, touch2.pageX, touch2.pageY),
          angle_rad: Math.atan2(-(touch2.pageY - touch1.pageY), (touch2.pageX - touch1.pageX)),
          vectorID: screen_svg.vectorID,
          symbol: ['z', 'w', 'u', 'v'][screen_svg.vectorID % 4] // Use complex symbols
        });
        screen_svg.vector_list.push(temp_vector);
      }
    });
  }

