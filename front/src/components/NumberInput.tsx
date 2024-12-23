import React, { useState, useEffect } from "react";

interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    min = 1,
    max = 100,
    step = 1,
    label,
    className = "",
}) => {
    const [localValue, setLocalValue] = useState<string>(value.toString());
    const [isEmpty, setIsEmpty] = useState<boolean>(false); // Track if the input is empty

    useEffect(() => {
        // If the value is empty or 0, we set it to min
        if (localValue === "" || value === 0) {
            setLocalValue(min.toString());
            setIsEmpty(true);
        }
    }, [min, value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Allowing empty string input (deleting everything)
        if (newValue === "") {
            setLocalValue("");
            setIsEmpty(true); // Mark as empty
            onChange(min); // Set the value to min when empty
        } else {
            const numValue = Number(newValue);
            if (!isNaN(numValue) && numValue >= min && numValue <= max) {
                setLocalValue(newValue);
                setIsEmpty(false);
                onChange(numValue);
            }
        }
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {label && <label className="text-sm">{label}</label>}
            <input
                type="number"
                value={localValue}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                className={`w-20 p-2 border border-gray-600 bg-gray-800 rounded-sm text-white text-sm ${isEmpty ? 'text-gray-500' : 'text-white'}`}
                style={{
                    "-moz-appearance": "textfield",
                    "-webkit-appearance": "none",
                    "appearance": "none", // hides the up/down arrows
                }}
                placeholder={isEmpty ? min.toString() : ""}
            />
            {/* Hide up and down arrows on Chrome */}
            <style>
                {`
                    input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"]::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                        margin: 0;
                    }
                    input[type="number"] {
                        -moz-appearance: textfield;
                        appearance: none;
                    }
                `}
            </style>
        </div>
    );
};

export default NumberInput;
