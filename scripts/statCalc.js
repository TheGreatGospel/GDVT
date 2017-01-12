
function calculateFST() {
    var current = statsMaster["FST"].length,
        scope = {
            nBar: 0,
            nC: 0,
            nSum: 0,
            nSumSq: 0,
            pDot: 0,
            sSq: 0,
            hDot: 0,
            r: settings.numOfPop
        },
        fstTemp = 0,
        s1 = 0, s2 = 0, s3 = 0;

        /*s1 = [], s2 = [], s3 = [],
        n_bar = 0, n_c = [], arrayTemp = [0, 0, 0], abcdefg = [0, 0, 0, 0, 0, 0],
        n_u = [], n_uu = [], sSq_u = 0, H_uBar = 0,
        p_u = [], P_uu = [], p_bar = 0, rMinusOne = settings.numOfPop - 1,

        i = 0,
        j = 0*/
    
    var j = 0;
    for (var i = 0; i < scope.r; i++) {
        scope.nBar += allSpecies[i].genSize;
        scope.nSum += allSpecies[i].genSize;
        scope.nSumSq += allSpecies[i].genSize*allSpecies[i].genSize;
    };
    scope.nBar = math.fraction(scope.nBar / scope.r);
    scope.nC = math.fraction(1 / (scope.r - 1) * (scope.nSum - scope.nSumSq / scope.nSum));

    while (allSpecies[0].genNumber > current) {
        for (i = 0; i < alleles.pool.length; i++) {
            scope.sSq = 0, scope.pDot = 0, scope.hDot = 0;

            for (j = 0; j < scope.r; j++) {
                scope.pDot += allSpecies[j].freq[current][i];
                scope.hDot += allSpecies[j].freq[current][i] - 2 * allSpecies[j].freq2Up[current][i];
            };
            scope.pDot = math.fraction(scope.pDot / (2 * scope.nSum));
            scope.hDot = math.fraction(scope.hDot / scope.nSum);

            for (j = 0; j < scope.r; j++) {
                scope.sSq += math.fraction(
                    math.pow(
                        allSpecies[j].freq[current][i] / (2 * allSpecies[j].genSize) - scope.pDot, 
                            2)
                );
            };
            scope.sSq = math.fraction(scope.sSq * scope.r / (scope.r - 1));
            
            s1 = math.fraction(s1 +
                math.eval("sSq - 1 / (nBar - 1) * (pDot * (1 - pDot) - (r - 1) / r * sSq - 1 / 4 * hDot)", 
                    scope)
            );

            /*Freq stores in one object*/

            s2 = math.fraction(s2 +
                math.eval("pDot * (1 - pDot) - nBar / (r * (nBar - 1)) * (r * (nBar - nC) / nBar * pDot * (1 - pDot) - 1 / nBar * (nBar - 1 + (r - 1) * (nBar - nC)) * sSq - (nBar - nC) / (4 * nC^2) * hDot)", 
                    scope)
            );

            s3 = math.fraction(s3 + 
                math.eval("nC / nBar * hDot",
                    scope)
            );
        };

        fstTemp = math.number(s1/s2);

        //for (i = 0; i < alleles.pool.length; i++) {
        //    fstTemp += s1[i]/s2[i];
        //};
        
        statsMaster["FST"].push(fstTemp);

        s1 = 0, s2 = 0, s3 = 0;
        current++;
    };
}