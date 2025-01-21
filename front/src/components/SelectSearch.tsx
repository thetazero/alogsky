import React, { useState, useRef } from "react";

interface SelectSearchProps<T> {
    options: T[];
    selected: T | null;
    onChange: (selected: T) => void;
    renderOption: (option: T) => React.ReactNode; // For custom rendering of options
    getOptionKey?: (option: T) => string | number; // Unique key for each option
    filterOptions?: (query: string, option: T) => boolean; // Optional custom filter logic
}

const SelectSearch = <T,>({
    options,
    selected,
    onChange,
    renderOption,
    getOptionKey,
    filterOptions = (query, option) =>
        JSON.stringify(option).toLowerCase().includes(query.toLowerCase()), // Default filter logic
}: SelectSearchProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectOption = (option: T) => {
        onChange(option);
        setIsOpen(false);
        setSearchQuery(""); // Clear the search query after selection
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
        }
    };

    // Filter options based on the search query
    const filteredOptions = options.filter((option) =>
        filterOptions(searchQuery, option)
    );

    const focusSearch = () => {
        setTimeout(() => searchRef.current?.select(), 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && filteredOptions.length > 0) {
            selectOption(filteredOptions[0]); // Select the first filtered option
            e.preventDefault(); // Prevent default form submission behavior
        }
    };

    return (
        <div
            className="relative w-48 level-2 card"
            ref={dropdownRef}
            onBlur={handleBlur}
            tabIndex={-1} // Allow div to receive focus
            onClick={focusSearch}
        >
            {/* Trigger Button */}
            <button
                className="w-full px-4 py-2 text-left rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {selected ? renderOption(selected) : "Select option"}
                <span className="float-right">▼</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    className="absolute z-10 w-full mt-1 rounded shadow-lg level-2"
                    tabIndex={0} // Allows focus within dropdown
                >
                    {/* Search Bar */}
                    <div className="p-2">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm level-2"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown} // Add keydown listener for Enter key
                            ref={searchRef}
                        />
                    </div>

                    {/* Options List */}
                    <ul className="max-h-48 overflow-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={getOptionKey ? getOptionKey(option) : JSON.stringify(option)}
                                    className="px-4 py-2"
                                >
                                    <label
                                        className="flex items-center space-x-2 cursor-pointer"
                                        onClick={() => selectOption(option)}
                                    >
                                        {renderOption(option)}
                                    </label>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500 text-sm">
                                No options found
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectSearch;
