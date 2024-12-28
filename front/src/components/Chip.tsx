import React from "react";

export interface ChipProps {
    title: string;
    subtitle: string;
}

const Chip: React.FC<ChipProps> = ({ title, subtitle }) => {
    return (
        <div className="p-4 shadow-md text-center level-2 card">
            <div className="font-semibold text-lg text-indigo-400">
                {title}
            </div>
            <div className="text-gray-300">{subtitle}</div>
        </div>
    );
};

export default Chip;
