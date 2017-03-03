function indivAlleleChart(backgroundCanvas, midgroundCanvas, foregroundCanvas) {
    var layer = [backgroundCanvas[0], midgroundCanvas[0], foregroundCanvas[0]],
      layerContext = [backgroundCanvas[0].getContext('2d'), midgroundCanvas[0].getContext('2d'),
        foregroundCanvas[0].getContext('2d')];
    
    // Setup the size of the visualisation object.
    layer.forEach(function(element, index, array) {
      element.height =  indivAllele.options.height;
      element.width =  indivAllele.options.width;
    });
    
    // Colour in the background with css.
    backgroundCanvas.css('background', indivAllele.options.backgroundColor);
    
    // Draw the axes, axis titles, and the graph title.
    layerContext[0].font = 'bold 12px sans-serif'; // Title font settings.
    layerContext[0].fillText(
      indivAllele.options.title, // Title.
      75, // X co-ordinate.
      15 // Y co-ordinate.
    );
    
    // X-axis title.
    layerContext[0].font = 'italic 11px sans-serif';
    layerContext[0].textAlign = 'center';
    layerContext[0].fillText(
      'Population', 
      (indivAllele.options.width - 30)/2, // x co-ordinate.
      indivAllele.options.height - 5 // y co-ordinate.
    );
    
    // X-axis line.
    layerContext[0].beginPath();
    layerContext[0].lineWidth = 0.25;
    layerContext[0].moveTo(
      50, // x co-ordinate.
      indivAllele.options.height - 30 // y co-ordinate.
    );
    layerContext[0].lineTo(
      indivAllele.options.width - 60, // x co-ordinate.
      indivAllele.options.height - 30 // y co-ordinate.
    );
    layerContext[0].closePath();
    layerContext[0].stroke();
    
    // Y-axis title.
    layerContext[0].save();
    layerContext[0].translate(0, indivAllele.options.height);
    layerContext[0].rotate(-Math.PI/2);
    layerContext[0].textAlign = 'center';
    layerContext[0].fillText(
      'Member Number', 
      indivAllele.options.height/2, // x co-ordinate.
      15 // y co-ordinate.
    );
    layerContext[0].restore();
    
    // Y-axis line.
    layerContext[0].beginPath();
    layerContext[0].lineWidth = 0.25;
    layerContext[0].moveTo(
      50, // x co-ordinate.
      25 // y co-ordinate.
    );
    layerContext[0].lineTo(
      50, // x co-ordinate.
      indivAllele.options.height - 29 // y co-ordinate.
        // 29px(?) to make it pixel perfect.
    );
    layerContext[0].closePath();
    layerContext[0].stroke();
    
    this.refresh = function () {
      // Pause any current drawing of the indivAllele Chart.
      if (indivAllele.tickTock.running()) {
        indivAllele.tickTock.stop();
      };
      
      // Refresh the miground and foreground canvases
      layer[1].width += 0;
      layer[2].width += 0;
      
      // Draw the legend
      if (indivAllele.currentColors != null) {
        indivAllele.currentColors.length = 0; // Flush out the contents if required.
      };
      
      // A bit annoying that we have to '.slice' and whatnot... But the number of 
        // Google API charts outnumber the base Javasript charts.
      indivAllele.currentColors = alleles.getColors().slice().reverse();
      
      layerContext[1].font = '12px sans-serif';
      for (var i = 0; i < indivAllele.currentColors.length; i++) {
        layerContext[1].fillStyle = indivAllele.currentColors[i];
        layerContext[1].fillRect(
          indivAllele.options.width - 50, // x co-ordinate.
          75 + i * 17, // y co-ordinate.
          25, // width of rect.
          12); // height of rect.
        layerContext[1].fillStyle = 'black';
        layerContext[1].fillText(
          alleles.getLabels()[i], 
          indivAllele.options.width - 20, // x co-ordinate.
          86 + i * 17 // y co-ordinate.
        );
      };
      
      // Determine where the left edges for each population is.
      var howMuch = (indivAllele.options.width - 115) / parameters.numOfPop; 
      
      // Determine the width and height of the rects to visualise the individual alleles.
        // We'll adjust them later if required.
      var trueWorkingWidth = howMuch - 7.5;
      indivAllele.rectHeight = (indivAllele.options.height - 55) / parameters.popSize;
      indivAllele.rectWidth = trueWorkingWidth/2;
      
      // X-axis 'ticks'.
      if (indivAllele.popPosition == null) {
        indivAllele.popPosition = []; // Saves the center point for each population.
      } else {
        indivAllele.popPosition.length = 0; // Flush the array.
      };
      
      layerContext[1].font = '11px sans-serif';
      layerContext[1].textAlign = 'center'; // alignment is weird with <canvas>
      for (i = 0; i < parameters.numOfPop; i++) {
        indivAllele.popPosition.push(60 + i * howMuch + indivAllele.rectWidth);
        layerContext[1].fillText(
          '#' + (i + 1),
          indivAllele.popPosition[i], // x co-ordinate.
          indivAllele.options.height - 17 // y co-ordinate.
        );
      };
      
      // Now we adjust 'indivAllele.rectWidth' to prevent the bars from becoming
        // too wide.
      if (indivAllele.rectWidth > 30) {
        indivAllele.rectWidth = 30;
      };
      
      // Y-axis gridlines and 'ticks'.
      layerContext[1].font = '12px sans-serif';
      layerContext[1].textAlign = 'right';
      layerContext[1].textBaseline = 'middle';
      var whereToPlot = 0;
      for (i = 0; i <= 1.0; i += 0.25) {
        whereToPlot = Math.floor(parameters.popSize * i);
        layerContext[1].fillStyle = 'black';
        layerContext[1].fillText(
          whereToPlot,
          45, // x co-ordinate.
          indivAllele.options.height - 30 - indivAllele.rectHeight * whereToPlot // y co-ordinate.
        );
        if (i > 0) {
          layerContext[1].fillStyle = 'gray';
          layerContext[1].beginPath();
          layerContext[1].lineWidth = 0.1;
          layerContext[1].moveTo(
            50, // x co-ordinate.
            indivAllele.options.height - 29 - indivAllele.rectHeight * whereToPlot // y co-ordinate.
          );
          layerContext[1].lineTo(
            indivAllele.options.width - 60, // x co-ordinate.
            indivAllele.options.height - 29 - indivAllele.rectHeight * whereToPlot // y co-ordinate.
          );
          layerContext[1].closePath();
          layerContext[1].stroke();
        };
      };
      
      i = null, howMuch = null, trueWorkingWidth = null, whereToPlot = null;
    };
  
  this.draw = function (whichIndex = 0) {
    // Refresh the foreground canvas.
    layer[2].width += 0;
    
    // Pause any current drawing of the indivAllele Chart.
    if (indivAllele.tickTock.running()) {
        indivAllele.tickTock.stop();
    };
    
    // Populate the DataTable//DataView with the most recent information.
    var i = 0, alleles = [];
    for (var j = 0; j < allSpecies.numOfPop; j++) {
      for (var k = 0; k < allSpecies[j].popSize; k++) {
        indivAllele.data.setValue(i, 0, k + 1); // Member Number.
        indivAllele.data.setValue(i, 1, j); // Population Number.
        alleles = allelesUnpack(allSpecies[j].populations[whichIndex][k]);
        indivAllele.data.setValue(i, 2, alleles[0]);
        indivAllele.data.setValue(i, 3, alleles[1]);
            
        alleles.length = 0;
        i += 1;
      };
    };
    
    // Commence drawing of the indivAllele Chart.
    indivAllele.tickTock.clear();
    indivAllele.tickTock.bind(2, this.drawChild);
    indivAllele.tickTock.start();
    
    i = null, j = null, k = null, alleles = null;
  };
  
  this.drawChild = function () {
    var popNo = indivAllele.tickTock.ticks() - 1, // Shift to zero-indexed land.
        memNo = popNo * allSpecies[popNo].popSize, // Starting (zero) index
        stretchGoal = indivAllele.tickTock.ticks() * allSpecies[popNo].popSize - 1; // End (zero) index
    
    // Drawing member alleles within a population...
    for (memNo; memNo <= stretchGoal; memNo++) {
      layerContext[2].fillStyle = indivAllele.currentColors[indivAllele.data.getValue(memNo, 2)];
      layerContext[2].fillRect(
        indivAllele.popPosition[popNo] - indivAllele.rectWidth, // x co-ordinate.
        indivAllele.options.height - 30 - 
          indivAllele.data.getValue(memNo, 0) * indivAllele.rectHeight, // y co-ordinate.
        indivAllele.rectWidth, // width of rect.
        indivAllele.rectHeight // height of rect.
      );
      layerContext[2].fillStyle = indivAllele.currentColors[indivAllele.data.getValue(memNo, 3)];
      layerContext[2].fillRect(
        indivAllele.popPosition[popNo], // x co-ordinate.
        indivAllele.options.height - 30 - 
          indivAllele.data.getValue(memNo, 0) * indivAllele.rectHeight, // y co-ordinate.
        indivAllele.rectWidth, // width of rect.
        indivAllele.rectHeight // height of rect.
      );
    };
    
    // Stop the timer when we reach the final iteration.
    if (indivAllele.tickTock.ticks() == allSpecies.numOfPop) {
        indivAllele.tickTock.stop();
    };
    
    popNo = null, memNo = null, stretchGoal = null; 
  };

};