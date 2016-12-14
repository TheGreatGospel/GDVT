function options_Validate() {
        var errorMsg = "";
        var inpObj = {
            popSize: parseInt($("#option_popSize").val(), 10),
            numOfPop: parseInt($("#option_numOfPop").val(), 10),
            init: parseInt($("#option_init").val(), 10)
        };

        errorMsg += conditionHack(isNaN(inpObj.popSize),
            "The \"Population Size\" has an invalid input! \n",
            inpObj.popSize < 50 || inpObj.popSize > 500,
            "The \"Population Size\" has an invalid input! \n");
        
        errorMsg += conditionHack(isNaN(inpObj.numOfPop),
            "The \"Number of Populations\" has an invalid input! \n",
            inpObj.numOfPop < 1 || inpObj.numOfPop > 10,
            "The \"Number of Populations\" has an invalid input! \n");
        
        errorMsg += conditionHack(isNaN(inpObj.init),
            "The \"Initial Number of Simulations\" has an invalid input! \n",
            inpObj.init < 1,
            "The \"Initial Number of Simulations\" has an invalid input! \n");

        if (errorMsg === "") {
            settings = inpObj;
            $("#demo2").html(settings.popSize + "<br>" +
                             settings.numOfPop + "<br>" + 
                             settings.init + "<br>" +
                             "Hi again");
        } else {
            alert(errorMsg);
        }
    };

/*
document.getElementById("demo").innerHTML =  typeof inpObj.popSize + " " +
    typeof inpObj.numOfPop + " " + typeof inpObj.init + "<br>" + 
    inpObj.popSize + " " + inpObj.numOfPop + " " + inpObj.init;
document.getElementById("demo2").innerHTML = "hi <br>" + errorMsg;

*/