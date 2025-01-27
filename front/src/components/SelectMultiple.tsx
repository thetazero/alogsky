import React, { useState, useRef } from "react";
import { ellipses_text } from "../utils/text";

interface SelectMultipleProps<T> {
    options: T[];
    selected: T[];
    onChange: (selected: T[]) => void;
    renderOption: (option: T) => React.ReactNode; // For custom rendering of options
    getOptionKey?: (option: T) => string | number; // Unique key for each option
}

const SelectMultiple = <T,>({
    options,
    selected,
    onChange,
    renderOption,
    getOptionKey,
}: SelectMultipleProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleOption = (option: T) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            const new_values = [...selected, option].sort()
            onChange(new_values);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
        }
    };

    return (
        <div
            className="relative w-48 level-2 card"
            ref={dropdownRef}
            onBlur={handleBlur}
            tabIndex={-1} // Allow div to receive focus
        >
            {/* Trigger Button */}
            <button
                className="w-full px-4 py-2 text-left rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {selected.length > 0
                    ? ellipses_text(selected.map(renderOption).join(", "), 20)
                    : "Select options"}
                <span className="float-right">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute z-10 w-full mt-1 rounded shadow-lg level-2 bg-white"
                    tabIndex={0} // Allows focus within dropdown
                >
                    <ul className="max-h-48 overflow-auto">
                        {options.map((option) => (
                            <li
                                key={getOptionKey ? getOptionKey(option) : JSON.stringify(option)}
                                className="px-4 py-2"
                            >
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(option)}
                                        onChange={() => toggleOption(option)}
                                        className="appearance-none h-4 w-4 text-gray-300 bg-gray-600 border-gray-600 rounded focus:ring-gray-400 focus:ring-offset-gray-900 checked:bg-blue-600"
                                    />

                                    <span>{renderOption(option)}</span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectMultiple;
