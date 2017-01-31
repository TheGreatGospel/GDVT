/* Utility function to generate random integers */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Binary random number generator 'struct' */
function randomBinary() {
    /* When randomBinary is initialised, create the following two variables */
    var index = 0; // Keeps track of when to refresh the base
    var base = getRandomInt(-2147483648 , 2147483647);

    this.get = function() {
        var toReturn = base & 1; // Bitwise mask the last bit
        if (index % 32 === 0) {
            /* If the index is divisble by 32, refresh the base and the index*/
            base = getRandomInt(-2147483648 , 2147483647);
            index = 0;
        } else {
            base >>= 1; // Shift the base one bit to the right
            index++; // Increment the index
        }   
        return toReturn;
    }
};

/* jQuery event listeners for the Navigation Bar */
$(document).ready(function(){

    /* jQuery event listener to operate the Navigation Bar */
	$('ul.toolbar li').click(function(){
		var tab_id = $(this).attr('data-tab'); // Returns the tab to swap to

        /* Removes the visibility of the current tab */
		$('ul.toolbar li').removeClass('current');
	    $('.toolbar-content').removeClass('current');

        /* Gives visibility to the tab to swap to */
		$(this).addClass('current');
		$("#"+tab_id).addClass('current');
	})

});