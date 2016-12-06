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

    if (isNaN(inpObj.numOfPop)) {
        errorMsg += "The \"Number of Populations\" has an invalid input! <br>";
        if (inpObj.popSize < 50 || inpObj.popSize > 500) {
            errorMsg += "The \"Population Size\" has an invalid input! <br>";
        } else {
            settings.popSize = inpObj.popSize;
        }
    }

    if (isNaN(inpObj.init)) {
        errorMsg += "The \"Initial Number of Simulations\" has an invalid input! <br>";
    }

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
