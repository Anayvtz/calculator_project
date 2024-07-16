
let displayValue = '';

// functions
function appendToDisplay(value) {
    displayValue += value;
    document.getElementById('display').value = displayValue;
}

function clearDisplay() {
    displayValue = '';
    document.getElementById('display').value = displayValue;
}

function calculate() {
    try {
        let result = evaluate(displayValue);
        displayValue = result.toString();

        document.getElementById('display').value = displayValue;
    } catch (err) {
        displayValue = 'Error';
        document.getElementById('display').value = displayValue;
    }
}

function parseMathExpression(expression) {
    let operations = [];
    let operands = [];

    // extract operations
    for (let i = 0; i < expression.length; i++) {
        if (expression[i] == '+' || expression[i] == '-' || expression[i] == '/' || expression[i] == '*') {
            operations.push({ index: i, operator: expression[i] });
        }
    }

    // extract operands
    let startIx = 0;
    for (let i = 0; i < operations.length; i++) {
        let operation = operations[i];
        let operand = expression.substring(startIx, operation.index).trim();
        operands.push(parseFloat(operand));
        startIx = operation.index + 1;
    }
    operands.push(parseFloat(expression.substring(startIx).trim()));

    return { operations, operands };
}

// slice didnt work so i have this
function sliceOne(arr, index) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        if (i != index) {
            newArr.push(arr[i]);
        }
    }
    return [...newArr];
}
function evaluate(expression) {
    let { operations, operands } = parseMathExpression(expression);

    // evaluate / *
    for (let i = 0; i < operations.length; i++) {
        let operation = operations[i];
        let operator = operation.operator;
        if (operator == '*' || operator == '/') {
            let left = operands[i];
            let right = operands[i + 1];
            let result = operator == '*' ? left * right : left / right;
            operands[i] = result;
            operands = sliceOne(operands, i + 1);  // replace with result
            operations = sliceOne(operations, i); // remove
            i--;
        }
    }

    // evaluate + -
    while (operations.length > 0) {
        let left = operands.shift();
        let right = operands.shift();
        let operator = operations.shift().operator;
        let result = operator == '+' ? left + right : left - right;
        operands.unshift(result);
    }

    // final result
    return operands[0];
}