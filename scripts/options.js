function options_Validate() {
    var flag = true;
    var inpObj = {
        popSize: $("#options_popSize").val(),
        numOfPop: $("#options_numOfPop").val(),
        init: $("#options_init").val()
    };

    if (typeof inpObj.popSize === "number") {
        if (inpObj.popSize < 50 || inpObj.popSize > 500) {
            flag = false;
        } else {
            settings.popSize = inpObj.popSize;
        }
    } else {
        flag = false;
    }

    if (typeof inpObj.numOfPop === "number") {
        if (inpObj.numOfPop < 1 || inpObj.popSize > 10) {
            flag = false;
        } else {
            settings.numOfPop = inpObj.numOfPop;
        }
    } else {
        flag = false;
    }


    if (typeof inpObj.init === "number") {
        if (inpObj.init < 1) {
            flag = false;
        } else {
            settings.init = inpObj.init;
        }
    } else {
        flag = false;
    }

    if (flag === true) {
        document.getElementById("demo").innerHTML =  "proceed";
    } else {
        document.getElementById("demo").innerHTML =  JSON.stringify(inpObj);
        alert("Alert!");
    }
}
