function options_Validate() {
    var flag = true;
    var inpObj = {
        popSize: Number($("#options_popSize").val()),
        numOfPop: Number($("#options_numOfPop").val()),
        init: Number($("#options_init").val())
    };

    document.getElementById("demo").innerHTML =  typeof inpObj.popSize + " " +
        typeof inpObj.numOfPop + " " + typeof inpObj.init + "<br>" + 
        inpObj.popSize + " " + inpObj.numOfPop + " " + inpObj.init;
    
    /*if (flag === true) {
        document.getElementById("demo").innerHTML =  "proceed";
    } else {
       document.getElementById("demo").innerHTML =  JSON.stringify(inpObj);
        alert("Alert!");
    }*/
}
