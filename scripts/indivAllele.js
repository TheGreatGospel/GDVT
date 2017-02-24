indivAllele_drawChild = function () {
    // Shift to zero-indexed land.
    var zeroIndex = indivAllele.tickTock.ticks() - 1;

    // Drawing a memeber's alleles...
    // Begin by locating where in the DataView should we look.
    var memNo = indivAllele.view.getValue(zeroIndex, 0),
        popNo = indivAllele.view.getValue(zeroIndex, 1),
        posOne = indivAllele.view.getValue(zeroIndex, 2),
        posTwo = indivAllele.view.getValue(zeroIndex, 3),

        x = indivAllele.popPosition[popNo],
        y = indivAllele.options.height - 35 - memNo * indivAllele.rectHeight;
    
    indivAllele.foregroundLayer.fillStyle = indivAllele.currentColors[posOne];
    indivAllele.foregroundLayer.fillRect(
        x, // x co-ordinate.
        y, // y co-ordinate.
        indivAllele.rectWidth, // width of rect.
        indivAllele.rectHeight); // height of rect.
    indivAllele.foregroundLayer.fillStyle = indivAllele.currentColors[posTwo];
    indivAllele.foregroundLayer.fillRect(
        x + indivAllele.rectWidth, // x co-ordinate.
        y, // y co-ordinate.
        indivAllele.rectWidth, // width of rect.
        indivAllele.rectHeight); // height of rect.

    // Stop the timer when we reach the final iteration.
    if (indivAllele.tickTock.ticks() == indivAllele.view.getNumberOfRows()) {
        indivAllele.tickTock.stop();
        
    };

    // Clean-up
    zeroIndex = null;    
};

indivAllele_draw = function() {
    // Refresh the foreground canvas.
    $('#output_iacForeground')[0].width += 0;

    // Pause any current drawing of the indivAllele Chart.
    if (indivAllele.tickTock.running()) {
        indivAllele.tickTock.stop();
    };
    
    // Populate the DataTable//DataView with the most recent information.
    var i = 0,
        temp = [];
    for (var j = 0; j < allSpecies.length; j++) {
        for (var k = 0; k < allSpecies[j].currentPop[0].length; k++) {
            indivAllele.data.setValue(i, 0, k + 1); // Member Number.
            indivAllele.data.setValue(i, 1, j); // Population Number.
            temp = allSpecies[j].allelesUnpack(allSpecies[j].currentPop[0][k]);
            indivAllele.data.setValue(i, 2, temp[0]);
            indivAllele.data.setValue(i, 3, temp[1]);
            i++;
        };
    };
    temp.length = 0;
    temp = null;

    // Commence drawing of the indivAllele Chart.
    indivAllele.tickTock.clear();
    indivAllele.tickTock.bind(2, indivAllele_drawChild);
    indivAllele.tickTock.start();
};

indivAllele_refresh = function () {
    // Pause any current drawing of the indivAllele Chart.
    if (indivAllele.tickTock.running()) {
        indivAllele.tickTock.stop();
    };

    // Refresh the miground and foreground canvases
    $('#output_iacMidground')[0].width += 0;
    $('#output_iacForeground')[0].width += 0;

    // Draw the legend
    indivAllele.currentColors = alleles.getColors();
    var currentLabels = alleles.getLabels();
    indivAllele.midgroundLayer.font = indivAllele.options.legendFont;
    for (var i = 0; i < indivAllele.currentColors.length; i++) {
        indivAllele.midgroundLayer.fillStyle = indivAllele.currentColors[i];
        indivAllele.midgroundLayer.fillRect(
            indivAllele.options.width - 50, // x co-ordinate.
            75 + i * 17, // y co-ordinate.
            25, // width of rect.
            12); // height of rect.
        indivAllele.midgroundLayer.fillStyle = 'black';
        indivAllele.midgroundLayer.fillText(
            currentLabels[i], 
            indivAllele.options.width - 20, // x co-ordinate.
            86 + i * 17 // y co-ordinate.
        );
    };
    i = null;

    // Determine where to draw the left edges.
        var howMuch = (indivAllele.options.width - 115) / parameters.numOfPop; 
    // Determine the width and height of the rects to visualise the individual alleles.
        var trueWorkingWidth = howMuch - 7.5;
        indivAllele.rectHeight = (indivAllele.options.height - 75) / parameters.popSize;
        indivAllele.rectWidth = trueWorkingWidth/2;

    // X-axis 'ticks'.
    if (indivAllele.popPosition == null) {
        indivAllele.popPosition = []; // Save the starting point of the left edge for each
                                          // population.
    } else {
        indivAllele.popPosition.length = 0;
    };
    indivAllele.midgroundLayer.font = indivAllele.options.axisFont;
    indivAllele.midgroundLayer.textAlign = 'center'; // alignment is weird with <canvas>
    for (var i = 0; i < parameters.numOfPop; i++) {
        indivAllele.popPosition.push(60 + i * howMuch);
        indivAllele.midgroundLayer.fillText(
            '#' + (i + 1),
            indivAllele.popPosition[i] + indivAllele.rectWidth, // x co-ordinate.
            indivAllele.options.height - 19 // y co-ordinate.
        );
    };
    i = null;
    howMuch = null;

    // Y-axis gridlines and 'ticks'.
    indivAllele.midgroundLayer.textAlign = 'right';
    indivAllele.midgroundLayer.textBaseline = 'middle';
    var whereToPlot = 0;
    for (var i = 0; i <= 1.0; i += 0.25) {
        whereToPlot = Math.floor(parameters.popSize * i);
        indivAllele.midgroundLayer.fillStyle = 'black';
        indivAllele.midgroundLayer.fillText(
            whereToPlot,
            45, // x co-ordinate.
            indivAllele.options.height - 35 - indivAllele.rectHeight * whereToPlot // y co-ordinate.
        );
        if (i > 0) {
            indivAllele.midgroundLayer.fillStyle = 'gray';
            indivAllele.midgroundLayer.beginPath();
            indivAllele.midgroundLayer.lineWidth = 0.1;
            indivAllele.midgroundLayer.moveTo(
                50, // x co-ordinate.
                indivAllele.options.height - 35 - indivAllele.rectHeight * whereToPlot // y co-ordinate.
            );
            indivAllele.midgroundLayer.lineTo(
                indivAllele.options.width - 60, // x co-ordinate.
                indivAllele.options.height - 35 - indivAllele.rectHeight * whereToPlot // y co-ordinate.
            );
            indivAllele.midgroundLayer.closePath();
            indivAllele.midgroundLayer.stroke();
            };
    };
    i = null;
    whereToPlot = null;
};

indivAllele_initialise = function () {
    // Setup the size of the visualisation object.
    $('#output_iacBackground')[0].height = indivAllele.options.height;
    $('#output_iacBackground')[0].width = indivAllele.options.width;
    $('#output_iacMidground')[0].height = indivAllele.options.height;
    $('#output_iacMidground')[0].width = indivAllele.options.width;
    $('#output_iacForeground')[0].height = indivAllele.options.height;
    $('#output_iacForeground')[0].width = indivAllele.options.width;
    
    // Colour in the background with css.
    $('#output_iacBackground').css('background', indivAllele.options.backgroundColor);

    // Draw the axes, axis titles, and the graph title.
        // Title.
        indivAllele.backgroundLayer.font = indivAllele.options.titleFont;
        indivAllele.backgroundLayer.fillText(
            'Individual Alleles', 
            75, // x co-ordinate.
            20 // y co-ordinate.
        );

        // X-axis title.
        indivAllele.backgroundLayer.font = indivAllele.options.axisTitleFont;
        indivAllele.backgroundLayer.textAlign = 'center';
        indivAllele.backgroundLayer.fillText(
            'Population', 
            (indivAllele.options.width - 30)/2, // x co-ordinate.
            indivAllele.options.height - 5 // y co-ordinate.
        );

        // X-axis line.
        indivAllele.backgroundLayer.beginPath();
        indivAllele.backgroundLayer.lineWidth = 0.25;
        indivAllele.backgroundLayer.moveTo(
            50, // x co-ordinate.
            indivAllele.options.height - 35 // y co-ordinate.
        );
        indivAllele.backgroundLayer.lineTo(
            indivAllele.options.width - 60, // x co-ordinate.
            indivAllele.options.height - 35 // y co-ordinate.
        );
        indivAllele.backgroundLayer.closePath();
        indivAllele.backgroundLayer.stroke();

        // Y-axis title.
        indivAllele.backgroundLayer.save();
        indivAllele.backgroundLayer.translate(0, indivAllele.options.height);
        indivAllele.backgroundLayer.rotate(-Math.PI/2);
        indivAllele.backgroundLayer.textAlign = 'center';
        indivAllele.backgroundLayer.fillText(
            'Member Number', 
             indivAllele.options.height/2, // x co-ordinate.
             15 // y co-ordinate.
        );
        indivAllele.backgroundLayer.restore();
        
        // Y-axis line.
        indivAllele.backgroundLayer.beginPath();
        indivAllele.backgroundLayer.lineWidth = 0.25;
        indivAllele.backgroundLayer.moveTo(
            50, // x co-ordinate.
            30 // y co-ordinate.
        );
        indivAllele.backgroundLayer.lineTo(
            50, // x co-ordinate.
            indivAllele.options.height - 35 // y co-ordinate.
        );
        indivAllele.backgroundLayer.closePath();
        indivAllele.backgroundLayer.stroke();
};