indivAllele_refresh = function () {
    // Refresh the miground and foreground canvases
    $('#output_iacMidground')[0].width += 0;
    $('#output_iacForeground')[0].width += 0;

    // Draw the legend
    var currentColors = alleles.getColors(),
        currentLabels = alleles.getLabels();
    indivAllele.midgroundLayer.font = indivAllele.options.legendFont;
    for (var i = 0; i < currentColors.length; i++) {
        indivAllele.midgroundLayer.fillStyle = currentColors[i];
        indivAllele.midgroundLayer.fillRect(indivAllele.options.width - 50, 75 + i * 17, 25, 12);
        indivAllele.midgroundLayer.fillStyle = 'black';
        indivAllele.midgroundLayer.fillText(
            currentLabels[i], 
            indivAllele.options.width - 20, 
            86 + i * 17
        );
    };

    currentColors.length = 0;
    currentLabels.length = 0;
    currentColors = null;
    currentLabels = null;
}

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
        indivAllele.backgroundLayer.fillText('Individual Alleles', 75, 25);

        // X-axis title.
        indivAllele.backgroundLayer.font = indivAllele.options.axisFont;
        indivAllele.backgroundLayer.textAlign = 'center';
        indivAllele.backgroundLayer.fillText(
            'Population', 
            (indivAllele.options.width - 30)/2, 
            indivAllele.options.height - 10
        );

        // X-axis line.
        indivAllele.backgroundLayer.beginPath();
        indivAllele.backgroundLayer.lineWidth = 0.25;
        indivAllele.backgroundLayer.moveTo(50, indivAllele.options.height - 40);
        indivAllele.backgroundLayer.lineTo(
            indivAllele.options.width - 60, 
            indivAllele.options.height - 50
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
             indivAllele.options.height/2,
             15
        );
        indivAllele.backgroundLayer.restore();
        
        // Y-axis line.
        indivAllele.backgroundLayer.beginPath();
        indivAllele.backgroundLayer.lineWidth = 0.25;
        indivAllele.backgroundLayer.moveTo(50, 40);
        indivAllele.backgroundLayer.lineTo(
            50, 
            indivAllele.options.height - 40
        );
        indivAllele.backgroundLayer.closePath();
        indivAllele.backgroundLayer.stroke();
};