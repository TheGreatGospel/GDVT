/* Utility function to generate random integers */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Binary random number generator 'struct' */
function randomBinary() {
    // When randomBinary is initialised, create the following two variables.
    var index = 0, // Keeps track of when to refresh the base.
		base = getRandomInt(-2147483648 , 2147483647);
	
	this.get = function() {
		var toReturn = base & 1; // Bitwise mask the last bit.
		if (index % 32 === 0) {
			// If the index is divisble by 32, refresh the base and the index.
			base = getRandomInt(-2147483648 , 2147483647);
			index = 0;
		} else {
			base >>= 1; // Shift the base one bit to the right.
			index += 1; // Increment the index.
		}   
		return toReturn;
	};
	
};

/* Setup global variables to refer to the Navigation Bar's HTML DOM elements. */
var navi_bar = $('ul.toolbar li'),
	navi_content = $('.toolbar-content');

/* jQuery event listeners for the Navigation Bar */
$(document).ready(function(){

    // jQuery event listener to operate the Navigation Bar.
	navi_bar.click(function(){
		var navi_item = $(this), // We must use '$(this)' to isolate the navigation item.
			tab_id = navi_item.attr('data-tab'); // Returns the tab to swap to.

        // Removes the visibility of the current tab.
		navi_bar.removeClass('current');
	    navi_content.removeClass('current');

        // Gives visibility to the tab to swap to.
		navi_item.addClass('current');
		$('#' + tab_id).addClass('current');

		navi_item = null, tab_id = null;
	});

});