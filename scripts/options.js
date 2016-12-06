function conditionHack(cnd1, msg1, cnd2, msg2) {
    if (cnd1) {
        return msg1;
    } else if (cnd2) {
        return msg2;
    } else {
        return "";
    }
}

function options_Validate() {
    var errorMsg = "";
    var inpObj = {
        popSize: Number($("#options_popSize").val()),
        numOfPop: Number($("#options_numOfPop").val()),
        init: Number($("#options_init").val())
    };

    errorMsg += conditionHack(isNaN(inpObj.popSize),
        "The \"Population Size\" has an invalid input! <br>",
        inpObj.popSize < 50 || inpObj.popSize > 500,
        "The \"Population Size\" has an invalid input! <br>");
    
    errorMsg += conditionHack(isNaN(inpObj.numOfPop),
        "The \"Number of Populations\" has an invalid input! <br>",
        inpObj.numOfPop < 1 || inpObj.numOfPop > 10,
        "The \"Number of Populations\" has an invalid input! <br>");
    
    errorMsg += conditionHack(isNaN(inpObj.init),
        "The \"Initial Number of Simulations\" has an invalid input! <br>",
        inpObj.init < 1,
        "The \"Initial Number of Simulations\" has an invalid input! <br>");

    //document.getElementById("demo").innerHTML =  typeof inpObj.popSize + " " +
    //    typeof inpObj.numOfPop + " " + typeof inpObj.init + "<br>" + 
    //    inpObj.popSize + " " + inpObj.numOfPop + " " + inpObj.init;
    document.getElementById("demo2").innerHTML = "hi <br>" + errorMsg;
}
