
function calculateFST() {
    var current = statsMaster["FST"].length,
        scope = {}, 
        s1 = [], s2 = [], s3 = [],
        j = 0, w = [], x = 0, y = 0, z = 0;

    for (var i = 0; i < settings.numOfPop; i++) {
        x += allSpecies[i].genSize;
        y += allSpecies[i].genSize * allSpecies[i].genSize;
    };

    scope.nSum = x;
    scope.r = settings.numOfPop;
    scope.rMinusOne = settings.numOfPop - 1;
    scope.nBar = math.divide(x, scope.r);
    scope.nBarMinusOne = scope.nBar - 1;
    scope.nC = math.subtract(scope.nSum, math.divide(y, x));

    while (allSpecies[0].genNumber > current) {
        s1.length = 0, s2.length = 0, s3.length = 0;

        for (i = 0; i < alleles.pool.length; i++) {
            x = 0, y = 0, z = 0;
            for (j = 0; j < scope.r; j++) {
                w.push(math.fraction(allSpecies[j].freq[i][current], 2*allSpecies[j].genSize));
                if (settings.debug) {
                    console.log("p_" + alleles.labels[i] + j + ": " + w[j]);
                };
                x = math.multiply(w[j], allSpecies[j].genSize);
                y = math.add(x, y);
            };
            scope.pDot = math.divide(y, scope.nSum);
            if (settings.debug) {
                console.log("p_"+ alleles.labels[i] + ".: " + scope.pDot);
            };

            x = 0, y = 0, z = 0;
            for (j = 0; j < scope.r; j++) {
                x = math.subtract(w[j], scope.pDot);
                y = math.multiply(allSpecies[j].genSize, math.pow(x, 2));

                z = math.add(y, z);
            };
            x = math.multiply(scope.rMinusOne, scope.nBar);
            scope.sSq = math.divide(z, x);
            console.log("s^2_" + alleles.labels[i] + ": " + scope.sSq);

            x = 0, y = 0, z = 0;
            for (j = 0; j < scope.r; j++) {
                x = math.subtract(w[j], math.fraction(allSpecies[j].freq2Up[i][current], allSpecies[j].genSize));
                y = math.multiply(2, allSpecies[j].genSize);

                z = math.add(math.multiply(x, y), z);
            };
            scope.hDot = math.divide(z, scope.nSum);
            console.log("H_" + alleles.labels[i] + ".: " + scope.hDot);

            s1.push(math.number(0)), s2.push(math.number(0)), s3.push(math.number(0));
                scope.a = math.multiply(scope.pDot, math.subtract(1, scope.pDot));

            s1[i] = math.eval("(sSq - (a - rMinusOne*sSq/r - hDot/4)/nBarMinusOne)*10000000", scope);
            console.log("S1_" + alleles.labels[i] + ".: " + s1[i]);
                
                scope.b = math.eval("nBar/(r*(nBar - 1))", scope);
                scope.c = math.eval("(r*(nBar - nC))/nBar", scope);
                scope.d = math.eval("nBar - 1", scope);
                scope.e = math.eval("(r - 1)*(nBar - nC)", scope);
                scope.f = math.eval("d + e", scope);
                scope.g = math.eval("(nBar - nC)/(4*(nC^2))", scope);

            
            s2[i] = math.eval("(a - b*(c*a - f*sSq/nBar - g*hDot))*10000000", scope);
            console.log("S2_" + alleles.labels[i] + ".: " + s2[i]);
            //s3[i] = math.eval("(nC/nBar)*hDot ", scope);  

            w.length = 0;
        };

        x = 0, y = 0, z = 0;

        for (i = 0; i < alleles.pool.length; i++) {
            x = math.add(x, s1[i]);
            y = math.add(y, s2[i]);
        };
        if (y != 0) {
            z = math.divide(x, y);
        } else {
            z = null;
        };
        console.log("FST: " + math.number(z));
        statsMaster["FST"].push(math.number(z));
        current++;

    };

};