import React, { useState } from 'react';
import { ArrowLeft, Delete, Calculator as CalcIcon } from 'lucide-react';

interface CalculatorWidgetProps {
    onBack: () => void;
    darkMode: boolean;
}

const CalculatorWidget: React.FC<CalculatorWidgetProps> = ({ onBack, darkMode }) => {
    const [display, setDisplay] = useState('0');
    const [previousValue, setPreviousValue] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplay(digit);
            setWaitingForOperand(false);
        } else {
            setDisplay(display === '0' ? digit : display + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplay('0.');
            setWaitingForOperand(false);
            return;
        }

        if (!display.includes('.')) {
            setDisplay(display + '.');
        }
    };

    const clear = () => {
        setDisplay('0');
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(false);
    };

    const toggleSign = () => {
        const value = parseFloat(display);
        setDisplay(String(-value));
    };

    const inputPercent = () => {
        const value = parseFloat(display);
        setDisplay(String(value / 100));
    };

    const performOperation = (nextOperator: string) => {
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            setPreviousValue(inputValue);
        } else if (operator) {
            const result = calculate(previousValue, inputValue, operator);
            setDisplay(String(result));
            setPreviousValue(result);
        }

        setWaitingForOperand(true);
        setOperator(nextOperator);
    };

    const calculate = (left: number, right: number, op: string): number => {
        switch (op) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '×':
                return left * right;
            case '÷':
                return right !== 0 ? left / right : 0;
            default:
                return right;
        }
    };

    const equals = () => {
        if (operator === null || previousValue === null) return;

        const inputValue = parseFloat(display);
        const result = calculate(previousValue, inputValue, operator);

        setDisplay(String(result));
        setPreviousValue(null);
        setOperator(null);
        setWaitingForOperand(true);
    };

    const backspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1));
        } else {
            setDisplay('0');
        }
    };

    // Handle keyboard input
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') {
                inputDigit(e.key);
            } else if (e.key === '.') {
                inputDecimal();
            } else if (e.key === '+') {
                performOperation('+');
            } else if (e.key === '-') {
                performOperation('-');
            } else if (e.key === '*') {
                performOperation('×');
            } else if (e.key === '/') {
                e.preventDefault();
                performOperation('÷');
            } else if (e.key === 'Enter' || e.key === '=') {
                equals();
            } else if (e.key === 'Escape') {
                clear();
            } else if (e.key === 'Backspace') {
                backspace();
            } else if (e.key === '%') {
                inputPercent();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    const Button: React.FC<{
        onClick: () => void;
        className?: string;
        children: React.ReactNode;
    }> = ({ onClick, className = '', children }) => (
        <button
            onClick={onClick}
            className={`p-4 rounded-xl font-semibold text-xl transition-all active:scale-95 ${className}`}
        >
            {children}
        </button>
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
                <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
                    <CalcIcon size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">计算器</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">支持键盘输入</p>
                </div>
            </div>

            {/* Display */}
            <div className="mb-4 p-4 rounded-2xl bg-slate-100 dark:bg-slate-700">
                <div className="text-right">
                    {previousValue !== null && operator && (
                        <div className="text-sm text-slate-400 dark:text-slate-500 mb-1">
                            {previousValue} {operator}
                        </div>
                    )}
                    <div className="text-4xl font-bold text-slate-800 dark:text-white overflow-x-auto">
                        {display.length > 12 ? parseFloat(display).toExponential(6) : display}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-4 gap-2">
                {/* Row 1 */}
                <Button
                    onClick={clear}
                    className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500"
                >
                    AC
                </Button>
                <Button
                    onClick={toggleSign}
                    className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500"
                >
                    ±
                </Button>
                <Button
                    onClick={inputPercent}
                    className="bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500"
                >
                    %
                </Button>
                <Button
                    onClick={() => performOperation('÷')}
                    className={`${operator === '÷' ? 'bg-orange-300 dark:bg-orange-600' : 'bg-orange-400 dark:bg-orange-500'} text-white hover:bg-orange-500 dark:hover:bg-orange-400`}
                >
                    ÷
                </Button>

                {/* Row 2 */}
                <Button
                    onClick={() => inputDigit('7')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    7
                </Button>
                <Button
                    onClick={() => inputDigit('8')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    8
                </Button>
                <Button
                    onClick={() => inputDigit('9')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    9
                </Button>
                <Button
                    onClick={() => performOperation('×')}
                    className={`${operator === '×' ? 'bg-orange-300 dark:bg-orange-600' : 'bg-orange-400 dark:bg-orange-500'} text-white hover:bg-orange-500 dark:hover:bg-orange-400`}
                >
                    ×
                </Button>

                {/* Row 3 */}
                <Button
                    onClick={() => inputDigit('4')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    4
                </Button>
                <Button
                    onClick={() => inputDigit('5')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    5
                </Button>
                <Button
                    onClick={() => inputDigit('6')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    6
                </Button>
                <Button
                    onClick={() => performOperation('-')}
                    className={`${operator === '-' ? 'bg-orange-300 dark:bg-orange-600' : 'bg-orange-400 dark:bg-orange-500'} text-white hover:bg-orange-500 dark:hover:bg-orange-400`}
                >
                    −
                </Button>

                {/* Row 4 */}
                <Button
                    onClick={() => inputDigit('1')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    1
                </Button>
                <Button
                    onClick={() => inputDigit('2')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    2
                </Button>
                <Button
                    onClick={() => inputDigit('3')}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    3
                </Button>
                <Button
                    onClick={() => performOperation('+')}
                    className={`${operator === '+' ? 'bg-orange-300 dark:bg-orange-600' : 'bg-orange-400 dark:bg-orange-500'} text-white hover:bg-orange-500 dark:hover:bg-orange-400`}
                >
                    +
                </Button>

                {/* Row 5 */}
                <Button
                    onClick={() => inputDigit('0')}
                    className="col-span-1 bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    0
                </Button>
                <Button
                    onClick={backspace}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    <Delete size={20} className="mx-auto" />
                </Button>
                <Button
                    onClick={inputDecimal}
                    className="bg-white dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                >
                    .
                </Button>
                <Button
                    onClick={equals}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                >
                    =
                </Button>
            </div>
        </div>
    );
};

export default CalculatorWidget;
