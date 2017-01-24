
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
    scope.nBarMinusnC = math.subtract(scope.nBar, scope.nC);

    while (allSpecies[0].genNumber > current) {

        for (i = 0; i < alleles.pool.length; i++) {
            x = 0, y = 0, z = 0;
            for (j = 0; j < scope.r; j++) {
                w.push(math.fraction(allSpecies[j].freq[i][current], 2*allSpecies[j].genSize));
                if (settings.debug) {
                    console.log("p_" + alleles.labels[i] + j + ": " + w[j]);
                };

                x = math.multiply(w[j], allSpecies[j].genSize);
                y = math.add(x, y);

                x = math.subtract(w[j], math.fraction(allSpecies[j].freq2Up[i][current], allSpecies[j].genSize));
                x = math.multiply(math.multiply(2, allSpecies[j].genSize), x);
                z = math.add(x, z);
            };

            scope.pDot = math.divide(y, scope.nSum);
            if (settings.debug) {
                console.log("p_"+ alleles.labels[i] + ".: " + scope.pDot);
            };

            scope.hDot = math.divide(z, scope.nSum);
            if (settings.debug) {
                console.log("H_" + alleles.labels[i] + ".: " + scope.hDot);
            };

            x = 0, y = 0, z = 0;
            for (j = 0; j < scope.r; j++) {
                x = math.subtract(w[j], scope.pDot);
                y = math.multiply(allSpecies[j].genSize, math.square(x));

                z = math.add(y, z);
            };
            x = math.multiply(scope.rMinusOne, scope.nBar);
            
            scope.sSq = math.divide(z, x);
            if (settings.debug) {
                console.log("s^2_" + alleles.labels[i] + ": " + scope.sSq);
            };
            
            s1.push(math.number(0)), s2.push(math.number(0)), s3.push(math.number(0));
                scope.a = math.fraction(math.multiply(scope.pDot, math.subtract(1, scope.pDot)));

            //s1[i] = math.eval("(sSq - (a - rMinusOne*sSq/r - hDot/4)/nBarMinusOne)*10000000", scope);
            s1[i] = math.multiply(10000000,
                math.subtract(scope.sSq,
                    math.divide(
                        math.subtract(scope.a,
                            math.subtract(
                                math.divide(
                                    math.multiply(scope.rMinusOne, scope.sSq), scope.r
                                ),
                            math.divide(scope.hDot, 4))
                        ),
                    scope.nBarMinusOne)
                )
            );
            if (settings.debug) {
                console.log("S1_" + alleles.labels[i] + ".: " + s1[i]);
            };
                scope.b = math.fraction(math.divide(scope.nBar, math.multiply(scope.r, scope.nBarMinusOne)));
                scope.c = math.fraction(math.divide(math.multiply(scope.nBarMinusnC, scope.r), scope.nBar));
                scope.d = math.fraction(math.add(scope.nBar, math.multiply(scope.rMinusOne, scope.nBarMinusnC))); // scope.d == scope.f
                scope.e = math.fraction(math.divide(scope.nBarMinusnC, math.multiply(4, math.square(scope.nC)))); // scope.e == scope.g
            
            //s2[i] = math.eval("(a - b*(c*a - f*sSq/nBar - g*hDot))*10000000", scope);
            s2[i] = math.multiply(10000000,
                math.subtract(scope.a,
                    math.multiply(scope.b,
                        math.subtract(math.multiply(scope.c, scope.a),
                            math.subtract(math.divide(math.multiply(scope.d, scope.sSq), scope.nBar),
                                math.multiply(scope.e, scope.hDot)
                            )
                        )
                    )
                )
            );
            if (settings.debug) {
                console.log("S2_" + alleles.labels[i] + ".: " + s2[i]);
            };
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
            z = math.null;
        };
        if (settings.debug) {
            console.log("FST: " + math.number(z));
        };
        statsMaster["FST"].push(math.number(z));
        
        s1.length = 0, s2.length = 0, s3.length = 0;
        current++;
    };

};