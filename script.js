const display = document.getElementById("display");
const previous = document.getElementById("previous");
const buttons = document.querySelector(".buttons");

let currentValue = "0";
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;
let justCalculated = false;

function updateDisplay() {
    display.value = currentValue;
}

function clearCalculator() {
    currentValue = "0";
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    justCalculated = false;
    previous.textContent = "";
    updateDisplay();
}

function inputNumber(number) {
    if (currentValue === "Error") {
        clearCalculator();
    }

    if (waitingForSecondValue || justCalculated) {
        currentValue = number;
        waitingForSecondValue = false;
        justCalculated = false;
    } else if (currentValue === "0") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function inputDecimal() {
    if (currentValue === "Error") {
        clearCalculator();
    }

    if (waitingForSecondValue || justCalculated) {
        currentValue = "0.";
        waitingForSecondValue = false;
        justCalculated = false;
    } else if (!currentValue.includes(".")) {
        currentValue += ".";
    }

    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (b === 0) {
                return null;
            }
            return a / b;
        default:
            return b;
    }
}

function formatResult(number) {
    if (!Number.isFinite(number)) {
        return null;
    }

    return String(Number(number.toPrecision(12)));
}

function chooseOperator(nextOperator) {
    if (currentValue === "Error") return;

    const inputValue = Number(currentValue);

    if (operator && !waitingForSecondValue) {
        const result = calculate(firstValue, inputValue, operator);

        if (result === null) {
            showError();
            return;
        }

        const formatted = formatResult(result);

        if (formatted === null) {
            showError();
            return;
        }

        currentValue = formatted;
        firstValue = result;
        updateDisplay();
    } else {
        firstValue = inputValue;
    }

    operator = nextOperator;
    waitingForSecondValue = true;
    justCalculated = false;
    previous.textContent = `${currentValue} ${nextOperator}`;
}

function showError() {
    currentValue = "Error";
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    justCalculated = true;
    previous.textContent = "Cannot divide by zero";
    updateDisplay();
}

function showResult() {
    if (!operator || waitingForSecondValue) return;

    const secondValue = Number(currentValue);
    const result = calculate(firstValue, secondValue, operator);

    if (result === null) {
        showError();
        return;
    }

    const formatted = formatResult(result);

    if (formatted === null) {
        showError();
        return;
    }

    previous.textContent =
        `${firstValue} ${operator} ${secondValue} =`;

    currentValue = formatted;
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    justCalculated = true;

    updateDisplay();
}

function deleteLast() {
    if (currentValue === "Error" || justCalculated) {
        clearCalculator();
        return;
    }

    if (waitingForSecondValue) return;

    currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";

    if (currentValue === "-") currentValue = "0";

    updateDisplay();
}

buttons.addEventListener("click", function(event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "delete":
            deleteLast();
            break;
        case "decimal":
            inputDecimal();
            break;
        case "equals":
            showResult();
            break;
    }
});

updateDisplay();