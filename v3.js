let setList = [
    'customer',
    'product',
    'rawmat',
    'outsource',
    'time',
    'age1',
    'age2',
    'age3',
    'age4',
    'age5',
    'age7',
    'age8',
    'milking',
    'milking2',
    'milking3',
    'milkinge',
    'milkinge2',
    'gestation',
];

let derivedSet = {
    'links1': ['time', 'product'],
    'links2': ['time', 'rawmat'],
    'links3': ['time', 'customer'],
    'links4': ['time', 'outsource'],
    'links5': ['age1', 'time'],
    'links6': ['age2', 'time'],
    'links7': ['age3', 'time', 'gestation'],
    'links8': ['age4', 'time', 'milking'],
    'links9': ['age5', 'time', 'milkinge', 'gestation'],
    'links10': ['age6', 'time', 'milking2'],
    'links11': ['age3', 'gestation'],
    'links12': ['age3', 'time'],
    'links13': ['age4', 'milking'],
    'links14': ['age5', 'milkinge', 'gestation'],
    'links15': ['age6', 'milking2'],
    'links16': ['age5', 'time'],
    'links17': ['age7', 'time', 'milkinge', 'gestation'],
    'links18': ['age7', 'milkinge', 'gestation'],
    'links19': ['age7', 'time'],
    'links20': ['age8', 'time', 'milking2'],
    'links21': ['age8', 'milking2'],
    'links23': ['age5', 'time', 'milkinge'],
    'links24': ['age7', 'time', 'milkinge2'],
}

let variableMapping = {}

// real examples
// const lingo = '@for(time(t) : @sum(age5(a): @sum(milkingE(rr) : @sum(gestation(b) | b #lt# 9: E1Herd(a,t,rr,b)))) >= 600);';
const lingo = '@for(links9(a,t,rr,b) | a #EQ# 2 #AND# rr #EQ# 2 #AND# b #LE# 2 : E1X(a,t,rr,b) <= 100;	E1Y(a,t,rr,b) <= 20;  E1Herd(a,t,rr,b) >= 10; E1Herd(a,t,rr,b) >= 5;);'.toLowerCase();
// const lingo = '@for(milking3(r): @sum(time(aa) | a #EQ# 1 #OR# b #GT# 2 #AND# c #GT# 3 #AND# d #GT# 4: ABC(t)) = BCD - @sum(time(bb): BCD(r));@sum(time(cc) | a #EQ# 1 #OR# b #GT# 2 #AND# c #GT# 3 #AND# d #GT# 4: ABC(t)) = @sum(time(kj): BCD(aa)) - @sum(time(dd): BCD(r)));'.toLowerCase();
// const lingo = '@for(milking3(r): ABC = BCD - A(r));';
// const lingo = '@for(age7(a) | a #EQ# 11 : @for(age8(ab) | ab #EQ# 3 : @for(time(t) | t #GE# 1 : @for(milking3(r) | r #EQ# 1 : D3Herd(ab,t,r) = ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));'.toLowerCase();
// const lingo = '@for(time(t) | a #EQ# 1 #OR# b #GT# 2 #AND# c #GT# 3 #AND# d #GT# 4: @for(age2(a) | j #EQ# 5 #OR# e #GT# 6 #AND# f #GT# 7 #AND# g #GT# 8: CHerd(a, t) >= PV * AX(t-1); BHerd(a, t) = CX(a-1) + CY(a)))'.toLowerCase();
// const lingo = '@for(time(t):Atotal(t) = @SUM(age1(a): AHerd(a,t));Btotal(t) = @SUM(age2(a): BHerd(a,t));Ctotal(t) = @SUM(age3(a): @SUM(gestation(b) | b #LT# 9: CHerd(a,t,b)));D1total(t) = @SUM(age4(ab): @SUM(milking(r) : D1Herd(ab,t,r)));E1total(t) = @SUM(age5(a): @SUM(milkingE(rr) : @SUM(gestation(b) | b #LT# 9: E1Herd(a,t,rr,b))));D2total(t) = @SUM(age6(ab) : @SUM(milking2(r) : D2Herd(ab,t,r)));E2total(t) = @SUM(age7(a): @SUM(milkingE2(rr) : @SUM(gestation(b) | b #LT# 9: E2Herd(a,t,rr,b))));D3total(t) = @SUM(age8(ab) : @SUM(milking3(r) : D3Herd(ab,t,r))););'.toLowerCase()
// SUM CAN BE NESTED 1337 lines

// sum examples

// @sum(age7(a) | a #EQ# 11 : ED2(a,t));
// @sum(age7(a) | a #EQ# 11 : @sum(age8(ab) | ab #EQ# 3 : @sum(time(t) | t #GE# 1 : @sum(milking3(r) | r #EQ# 1 : ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));

// @SUM(time(t): AX(t));

// derived example
// @for(links5(a,t) | a #GE# 6 #AND# t #GT# 1 : AHerd(a,t) = AHerd(a-1,t-1)+AX(a,t)-AY(a,t));
// const lingo = '@for(links5(a,t) | a #GE# 6 #AND# t #GT# 1 : AHerd(a,t) = AHerd(a-1,t-1)+AX(a,t)-AY(a,t));'.toLowerCase();
// const lingo = 'AHerdTotal = @SUM(age1(a) : AHerd0(a));'.toLowerCase();
// const lingo = 'AM0 = AM10 + AM20;'.toLowerCase();
// for / pass
// condition / pass
// normal string with @for / pass

// TODO
// sum / pass
// for with derived set /
// pure normal string without @for

// line seperator

const debugMode = false;

const logger = (string) => (debugMode) ? console.log(string) : null; 

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const isInList = (input) => {
    logger('SEARCHING ' + input);
    for (let i = 0 ; i < setList.length ; ++i) {

        if (input == setList[i]) {
            logger('FOUND !');
            return true;
        }
    }

    return false;
}

const isDerived = (input) => {
    return derivedSet[input] != null;
}

function isNumber(val){
    return !isNaN(val)
}

const conditionToPy = (condition) => {

    condition = condition.trim();

    condition = condition.replace(/#eq#/g, '==');
    condition = condition.replace(/#ge#/g, '>=');
    condition = condition.replace(/#le#/g, '<=');
    condition = condition.replace(/#gt#/g, '>');
    condition = condition.replace(/#lt#/g, '<');
    condition = condition.replace(/#and#/g, '&&');
    condition = condition.replace(/#or#/g, '||');

    let valueMemory = '';
    let startValue = false;
    let startPosition = 0;
    let endPosition = 0;

    let variableName = '';

    for (let i = 0 ; i < condition.length ; ++i) {

        if (
            condition[i] == '=' ||
            condition[i] == '>' ||
            condition[i] == '<'
        ) {
            if (condition[i + 1] == '=') {
                continue;
            }
            startPosition = i;
            startValue = true;

            // find variable name
            let startReadName = false;
            for (let m = i ; m >= 0 ; --m) {
                if (m == 0) {
                    variableName += condition[m];
                    break;
                }
                if (condition[m] == ' ') {
                    if (startReadName) {
                        startReadName = false;
                        break;
                    } else {
                        startReadName = true;
                        continue;
                    }
                }

                if (startReadName) {
                    variableName += condition[m];
                }
            }
            // find variable name 
            continue;
        }

        if (condition[i] == ' ') {
            continue;
        }

        if (!isNumber(condition[i]) && startValue || i == condition.length - 1) {

            if (i == condition.length - 1) {
                valueMemory += condition[i];
            }
            endPosition = i;
            if (i == condition.length - 1) {
                condition = condition.substring(0, startPosition + 1).trim() + ` at(${valueMemory}, ${variableMapping[variableName.trim()]}_range)`;
                break
            } else {
                condition = condition.substring(0, startPosition + 1).trim() + ` at(${valueMemory}, ${variableMapping[variableName.trim()]}_range) ` + condition.substring(endPosition, condition.length);
            }
            variableName = '';
            startValue = false;
            valueMemory = '';
        }

        if (startValue) {
            valueMemory += condition[i];
        }
    }

    return condition;
}

let output = '';
let sumOutput = '';
let outputSumIndex = 0;
let rawOutput = '';
let rawSumOutput = '';
let operator = '';
let sumOperator = '';

let sumList = [];

let lastSetName = '';

const genTab = (tabSize) => {
    for (let i = 0 ; i < tabSize ; ++i) {
        output += '\t';
    }
}

const process = (input, tabSize) => {

    let memory = '';
    let setMemory = '';
    let command = '';
    let condition = '';

    for (let i = 0 ; i < input.length ; ++i) {
        
        // empty string zone
        if (input[i] == ' ')
            continue;

        if (input[i] == '|') {
            for (k = i + 1 ; k < input.length ; ++k) {
                if (input[k] == ':')
                    break

                condition += input[k];
            }
            logger('CONDITION ' + condition);
        }

        // command zone
        if (input[i] == '(') {
            if (memory == '@for') {
                command = 'for';
                memory = '';
                continue
            } 
            
            if (isInList(memory) || isDerived(memory)) {
                setMemory = memory;
                memory = '';
                continue
            }

            
        }

        // end zone
        if (input[i] == ')') {
            if (setMemory != '') {
                if (isDerived(setMemory)) {
                    for (let count = 0 ; count < derivedSet[setMemory].length ; ++count) {
                        tabSize = tabSize + count;
                        genTab(tabSize);
                        output += `for ${memory.split(',')[count]} in ${derivedSet[setMemory][count]}_range:\n`
                        variableMapping[memory.split(',')[count].trim()] = derivedSet[setMemory][count].trim();
                    }
                } else {
                    genTab(tabSize);
                    output += `for ${memory} in ${setMemory}_range:\n`
                    variableMapping[memory.trim()] = setMemory.trim();
                }
                lastSetName = setMemory;
                setMemory = ''
                memory = '';
                continue
            } 
            
        }

        // next zone :
        if (input[i] == ':') {

            if (condition != '') {
                genTab(++tabSize);
                output += `if (${conditionToPy(condition).trim()}):\n`
                lastSetName = '';
                // TODO: add processCondition here
            }

            let openBracket = 1
            let closeBracket = 0
            let slicedString = '';
            let finishPoint = -1;
            for (let j = i + 1; j < input.length ; ++j) {
                if (input[j] == '(') {
                    openBracket++;
                } else if (input[j] == ')') {
                    closeBracket++;
                    if (openBracket == closeBracket) {
                        if (slicedString.includes('@for')) {
                            process(slicedString, tabSize + 1);
                        } else {
                            processString(slicedString, tabSize + 1);
                            const splitedRawOutput = rawOutput.split('\n');

                            for (let t = 0 ; t < splitedRawOutput.length - 1 ; ++t) {
                                genTab(tabSize + 1);
                                for (let m = 0 ; m < sumList.length ; ++m) {
                                    splitedRawOutput[t] = splitedRawOutput[t].trim().replace('$$' + m, 'lpSum(tmp_' + sumList[m] + ')')
                                }
                                output += `model += ${splitedRawOutput[t].trim()}\n`
                            }

                        }
                        finishPoint = j
                        break
                    }
                }
                slicedString += input[j];
            } 
            if (finishPoint != -1) {
                i = finishPoint
                memory = '';
                setMemory = '';
                command = '';
                condition = '';
                continue
            }
        }
        
        memory += input[i];
    }
}

const processString = (input, tabSize) => {
    logger('THESE ARE COMMON STRING');
    logger(input.trim());

    // find sum

    let sumMemory = '';
    let startGetSum = false;
    let startPosition = -1;
    let endPosition = -1;
    for (let i = 0 ; i < input.length ; ++i) {
        if (input[i] == '@') {
            startGetSum = true;
            startPosition = i;
        }

        if (input[i] == '(') {
            if (sumMemory.trim() == '@sum') {
                sumMemory += input[i]; // add (
                openBracket = 1;
                closeBracket = 0;
                for (let k = i + 1; k < input.length ; ++k) {

                    sumMemory += input[k];

                    if (input[k] == '(') 
                        openBracket++;
                    
                    if (input[k] == ')')
                        closeBracket++;

                    if (openBracket == closeBracket) {
                        endPosition = k;
                        genTab(tabSize);
                        const randomNumber = Math.floor(Math.random() * 10000) + 100;
                        sumList.push(randomNumber);
                        output += 'tmp_' + randomNumber + ' = []\n';
                        processSumString(sumMemory, tabSize, randomNumber);
                        logger('PROCESS SUM ' + sumMemory);
                        sumMemory = '';

                        logger('SLICED STRING is ' + input.slice(startPosition, endPosition));
                        input = input.replace(input.slice(startPosition, endPosition + 1), '$$$' + outputSumIndex++);
                        logger(input);
                        
                        break;
                    }
                }
            }
            startGetSum = false;
        }

        if (startGetSum) {
            sumMemory += input[i];
        }
    }
    // end find sum

    let memory = '';

    let ignoreOperator = false;

    for (let i = 0 ; i < input.length ; ++i) {
        // empty string zone
        if (input[i] == ' ')
            continue;

        if (input[i] == '(') {
            ignoreOperator = true;
        }
        
        if (input[i] == ')') {
            ignoreOperator = false;
        }

        if (!ignoreOperator) {
            if (input[i] == '>' || input[i] == '<') {
                if (input[i+1] == '=') {
                    operator = input[i] + input[i+1];
                    i++;
                } else {
                    operator = input[i];
                }

                // process raw output
                convertVariableToInfo(memory);
                memory = '';
                continue;
            }

            if (input[i] == '+' || input[i] == '-' || input[i] == '*' || input[i] == '/' || input[i] == '=') {
                operator = input[i] == '=' ? '==' : input[i]
                convertVariableToInfo(memory);
                memory = '';
                continue;
            }
        }

        memory += input[i];

        if (i == input.length - 1 || input[i] == ';') {
            operator = ''
            convertVariableToInfo(memory);
            memory = '';
            logger('CHUNK ' + input.slice(i+1, input.length));
            rawOutput += '\n';
            processString(input.slice(i+1, input.length), tabSize);
            break;
        }
    }


    // genTab(tabSize)
    // output += input.trim();
}

const convertVariableToInfo = (memory) => {
    if (memory.includes('(') || memory.includes(')')) {
        let variableName = '';
        let variableScope = '';
        let subMemory = '';
        for (let k = 0 ; k < memory.length ; ++k) {
            if (memory[k] == ' ')
                continue;

            if (memory[k] == '(') {
                variableName = subMemory;
                subMemory = '';
                continue;
            }

            if (memory[k] == ')') {
                variableScope = subMemory;
                break;
            }

            subMemory += memory[k];
        }

        logger(`variableName=${variableName} variableScope=${variableScope}`);
        rawOutput += `d[kk('${variableName.trim()}',${variableScope})] ${operator} `
    } else {
        // constant
        // rawOutput += memory.trim() + ' ' + operator + ' ';
        logger('constant=' + memory.trim());
        rawOutput += `${memory.trim()} ${operator} `
    }
}

const sumConvertVariableToInfo = (memory) => {
    if (memory.includes('(') || memory.includes(')')) {
        let variableName = '';
        let variableScope = '';
        let subMemory = '';
        for (let k = 0 ; k < memory.length ; ++k) {
            if (memory[k] == ' ')
                continue;

            if (memory[k] == '(') {
                variableName = subMemory;
                subMemory = '';
                continue;
            }

            if (memory[k] == ')') {
                variableScope = subMemory;
                break;
            }

            subMemory += memory[k];
        }

        logger(`variableName=${variableName} variableScope=${variableScope}`);
        rawSumOutput += `d[kk('${variableName.trim()}',${variableScope})] ${operator} `
    } else {
        // constant
        // rawOutput += memory.trim() + ' ' + operator + ' ';
        logger('constant=' + memory.trim());
        rawSumOutput += `${memory.trim()} ${operator} `
    }
}

const processSumString = (input, tabSize, randomNumber) => {
    let memory = '';
    let setMemory = '';
    let command = '';
    let condition = '';

    for (let i = 0 ; i < input.length ; ++i) {
        
        // empty string zone
        if (input[i] == ' ')
            continue;

        if (input[i] == '|') {
            for (k = i + 1 ; k < input.length ; ++k) {
                if (input[k] == ':')
                    break

                condition += input[k];
            }
            logger('CONDITION ' + condition);
        }

        // command zone
        if (input[i] == '(') {
            if (memory == '@sum') {
                command = 'sum';
                memory = '';
                continue
            } 
            
            if (isInList(memory) || isDerived(memory)) {
                setMemory = memory;
                memory = '';
                continue
            }

            
        }

        // end zone
        if (input[i] == ')') {
            if (setMemory != '') {
                if (isDerived(setMemory)) {
                    for (let count = 0 ; count < derivedSet[setMemory].length ; ++count) {
                        tabSize = tabSize + count;
                        genTab(tabSize);
                        output += `for ${memory.split(',')[count]} in ${derivedSet[setMemory][count]}_range:\n`
                        variableMapping[memory.split(',')[count].trim()] = derivedSet[setMemory][count].trim();
                    }
                } else {
                    genTab(tabSize);
                    output += `for ${memory} in ${setMemory}_range:\n`
                    variableMapping[memory.trim()] = setMemory.trim();
                }
                lastSetName = setMemory;
                setMemory = ''
                memory = '';
                continue
            } 
            
        }

        // next zone :
        if (input[i] == ':') {

            if (condition != '') {
                genTab(++tabSize);
                output += `if (${conditionToPy(condition)}):\n`;
                lastSetName = '';
                // TODO: add processCondition here
            }

            let openBracket = 1
            let closeBracket = 0
            let slicedString = '';
            let finishPoint = -1;
            for (let j = i + 1; j < input.length ; ++j) {
                if (input[j] == '(') {
                    openBracket++;
                } else if (input[j] == ')') {
                    closeBracket++;
                    if (openBracket == closeBracket) {
                        if (slicedString.includes('@sum')) {
                            processSumString(slicedString, tabSize + 1, randomNumber);
                        } else {
                            logger('CONSTANT SECTION');
                            genTab(tabSize + 1);
                            output += `tmp_${randomNumber}.append(${processSumNormalString(slicedString).trim()})` + '\n'
                            rawSumOutput = '';
                        }
                        finishPoint = j
                        break
                    }
                }
                slicedString += input[j];
            } 
            if (finishPoint != -1) {
                i = finishPoint
                memory = '';
                setMemory = '';
                command = '';
                condition = '';
                continue
            }
        }
        
        memory += input[i];
    }
}

const processSumNormalString = (input) => {

    let memory = '';

    let ignoreOperator = false;

    for (let i = 0 ; i < input.length ; ++i) {
        // empty string zone
        if (input[i] == ' ')
            continue;

        if (input[i] == '(') {
            ignoreOperator = true;
        }
        
        if (input[i] == ')') {
            ignoreOperator = false;
        }

        if (!ignoreOperator) {
            if (input[i] == '>' || input[i] == '<') {
                if (input[i+1] == '=') {
                    sumOperator = input[i] + input[i+1];
                    i++;
                } else {
                    sumOperator = input[i];
                }

                // process raw output
                sumConvertVariableToInfo(memory);
                memory = '';
                continue;
            }

            if (input[i] == '+' || input[i] == '-' || input[i] == '*' || input[i] == '/' || input[i] == '=') {
                sumOperator = input[i] == '=' ? '==' : input[i]
                sumConvertVariableToInfo(memory);
                memory = '';
                continue;
            }
        }

        memory += input[i];

        if (i == input.length - 1 || input[i] == ';') {
            sumOperator = ''
            sumConvertVariableToInfo(memory);
            memory = '';
            logger('CHUNK ' + input.slice(i+1, input.length));
            break;
        }
    }

    return rawSumOutput;
}

if (!lingo.includes('@for')) {
    processString(lingo, 0);
    const splitedRawOutput = rawOutput.split('\n');

    for (let t = 0 ; t < splitedRawOutput.length - 1 ; ++t) {
        for (let m = 0 ; m < sumList.length ; ++m) {
            splitedRawOutput[t] = splitedRawOutput[t].trim().replace('$$' + m, 'lpSum(tmp_' + sumList[m] + ')')
        }
        output += `model += ${splitedRawOutput[t].trim()}\n`
    }
} else {
    process(lingo, 0);
}
console.log(output);

// genTab(0);
// const randomNumber = Math.floor(Math.random() * 10000) + 100;
// sumList.push(randomNumber);
// output += 'tmp_' + randomNumber + ' = []\n';
// processSumString('@sum(age7(a) | a #EQ# 11 : @sum(age8(ab) | ab #EQ# 3 : @sum(time(t) | t #GE# 1 : @sum(milking3(r) | r #EQ# 1 : ED2(a,t) + D3X(ab,t,r) - D3Y(ab,t,r)))));', 0);
// logger(output);