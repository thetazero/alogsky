import React from "react";

export interface ChipProps {
    title: string;
    subtitle: string;
}

const Chip: React.FC<ChipProps> = ({ title, subtitle }) => {
    return (
        <div className="p-4 bg-gray-700 rounded-md shadow-md text-center">
            <div className="font-semibold text-lg text-indigo-400">
                {title}
            </div>
            <div className="text-gray-300">{subtitle}</div>
        </div>
    );
};

export default Chip;
