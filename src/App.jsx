import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);

  const calculate = (a, b, op) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? "Error" : a / b;
      default: return b;
    }
  };

  const format = (value) => {
    if (value === "Error") return value;
    return String(Number(value.toPrecision(10)));
  };

  const inputNumber = (number) => {
    if (display === "Error") {
      setDisplay(number);
      setWaiting(false);
      return;
    }

    if (waiting) {
      setDisplay(number);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? number : display + number);
    }
  };

  const inputDecimal = () => {
    if (waiting || display === "Error") {
      setDisplay("0.");
      setWaiting(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const chooseOperator = (op) => {
    const current = Number(display);

    if (display === "Error") return;

    if (operator && !waiting) {
      const result = calculate(previous, current, operator);

      if (result === "Error") {
        setDisplay("Error");
        setPrevious(null);
        setOperator(null);
        setWaiting(true);
        return;
      }

      const formatted = format(result);
      setDisplay(formatted);
      setPrevious(Number(formatted));
    } else {
      setPrevious(current);
    }

    setOperator(op);
    setWaiting(true);
  };

  const showResult = () => {
    if (operator === null || previous === null || display === "Error") return;

    const result = calculate(previous, Number(display), operator);
    setDisplay(format(result));
    setPrevious(null);
    setOperator(null);
    setWaiting(true);
  };

  const clear = () => {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaiting(false);
  };

  const deleteLast = () => {
    if (waiting || display === "Error") {
      setDisplay("0");
      setWaiting(false);
    } else {
      setDisplay(display.length > 1 ? display.slice(0, -1) : "0");
    }
  };

  const percentage = () => {
    if (display !== "Error") {
      setDisplay(format(Number(display) / 100));
    }
  };

  const toggleSign = () => {
    if (display !== "Error" && display !== "0") {
      setDisplay(String(Number(display) * -1));
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (/^[0-9]$/.test(e.key)) inputNumber(e.key);
      else if (e.key === ".") inputDecimal();
      else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
      else if (e.key === "Enter" || e.key === "=") showResult();
      else if (e.key === "Backspace") deleteLast();
      else if (e.key === "Escape") clear();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const buttons = [
    { label: "AC", action: clear, type: "special" },
    { label: "+/-", action: toggleSign, type: "special" },
    { label: "%", action: percentage, type: "special" },
    { label: "÷", action: () => chooseOperator("/"), type: "operator" },

    { label: "7", action: () => inputNumber("7") },
    { label: "8", action: () => inputNumber("8") },
    { label: "9", action: () => inputNumber("9") },
    { label: "×", action: () => chooseOperator("*"), type: "operator" },

    { label: "4", action: () => inputNumber("4") },
    { label: "5", action: () => inputNumber("5") },
    { label: "6", action: () => inputNumber("6") },
    { label: "−", action: () => chooseOperator("-"), type: "operator" },

    { label: "1", action: () => inputNumber("1") },
    { label: "2", action: () => inputNumber("2") },
    { label: "3", action: () => inputNumber("3") },
    { label: "+", action: () => chooseOperator("+"), type: "operator" },

    { label: "DEL", action: deleteLast, type: "special" },
    { label: "0", action: () => inputNumber("0") },
    { label: ".", action: inputDecimal },
    { label: "=", action: showResult, type: "equals" }
  ];

  return (
    <div className="calculator-page">
      <header className="navbar">
        <h2>✦ CalcSpace</h2>
        <span>SMART CALCULATOR</span>
      </header>

      <main className="main-content">
        <div className="intro">
          <p className="tagline">SIMPLE. SMART. PRECISE.</p>
          <h1>Your numbers,<br />
            <span>beautifully balanced.</span>
          </h1>
          <p className="subtitle">
            A simple calculator for your everyday calculations.
          </p>
        </div>

        <div className="calculator">
          <div className="calculator-heading">
            <div>
              <small>STANDARD</small>
              <h2>Calculator</h2>
            </div>
            <div className="calculator-icon">✣</div>
          </div>

          <div className="display">
            <div className="display-value">{display}</div>
            <div className="display-label">Ready when you are</div>
          </div>

          <div className="buttons">
            {buttons.map((button, index) => (
              <button
                key={index}
                className={`calc-button ${button.type || ""}`}
                onClick={button.action}
              >
                {button.label}
              </button>
            ))}
          </div>

          <p className="keyboard-tip">
            TIP: You can also use your keyboard
          </p>
        </div>
      </main>

      <footer>
        MADE FOR EVERYDAY MATH · POWERED BY REACT
      </footer>
    </div>
  );
}

export default App;