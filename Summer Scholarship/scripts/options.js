function options_Validate() {
    var inpObj = {
        popSize: $("#options_popSize").val(),
        numOfPop: $("#options_numOfPop").val(),
        init: $("#options_init").val()
    };

    document.getElementById("demo").innerHTML =  JSON.stringify(inpObj);
} 

//Need to add loadSimulate() to button event
function loadOptions_Child() {
    return "<div id='subheading' class='jsBody_Child'>" +
        "Options" +
    "</div>" +
    "<div id='options_hold' class='jsBody_Child'>" +
        "<div id='options_lTable'>" +
            "Population Size: <br>" +
            "Number of Populations: <br>" +
            "Initial Number of Simulations: <br>" +
        "</div>" +
        "<div id='options_rTable'>" +
            "<input id='options_popSize' value=50> <div class='tooltip'>*" +
                "<div class='tooltiptext'>Input a value from 50-500.</div></div> <br>" +
            "<input id='options_numOfPop' value=5> <div class='tooltip'>*" +
                "<div class='tooltiptext'>Input a value from 1-10.</div></div> <br>" +
            "<input id='options_init' value=1> <div class='tooltip'>*" +
                "<div class='tooltiptext'>Input a value greater than 0.</div></div> <br>" +
        "</div>" +
    "</div>" +
    "<div class='jsBody_Child'>" +
        "<button type='button' class='button' onclick='options_Validate()'>Simulate</button>" +
    "</div>"
}

/*

<div id="subheading" class="jsBody_Child">
    Options
</div>
<div id="options_hold" class="jsBody_Child">
    <div id="options_lTable">
        Population Size: <br>
        Number of Populations: <br>
        Initial Number of Simulations: <br>
    </div>
        <div id="options_rTable">
        <input id="options_popSize" value=50> <div class="tooltip">
        <div class="tooltiptext">Input a value from 50-500.</div></div> <br>
        <input id="options_numOfPop" value=5> <div class="tooltip">*
        <div class="tooltiptext">Input a value from 1-10.</div></div> <br>
        <input id="options_init" value=1> <div class="tooltip">*
        <div class="tooltiptext">Input a value greater than 0.</div></div> <br>
    </div>
</div>
<div class="jsBody_Child">
    <button type="button" class="button" onclick="options_Validate()">Simulate</button>
</div>
*/