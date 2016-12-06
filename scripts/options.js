function options_Validate() {
    var flag = true;
    var inpObj = {
        popSize: $("#options_popSize").val(),
        numOfPop: $("#options_numOfPop").val(),
        init: $("#options_init").val()
    };

    document.getElementById("demo").innerHTML =  inpObj.popSize;
    
    /*if (flag === true) {
        document.getElementById("demo").innerHTML =  "proceed";
    } else {
       document.getElementById("demo").innerHTML =  JSON.stringify(inpObj);
        alert("Alert!");
    }*/
}
