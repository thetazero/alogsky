import React, { ReactNode, useState } from "react";

export interface TileProps {
    title?: string;
    children?: ReactNode;
    onClose?: () => void;
}

const Tile: React.FC<TileProps> = ({ title, children, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false); // State for expanding the tile

    const handleExpand = () => {
        setIsExpanded(!isExpanded); // Toggle expanded state
    };

    return (
        <div
            className={`level-1 card p-4 shadow-lg transition-all duration-500 ease-in-out ${isExpanded
                ? "h-screen fixed top-0 left-0 z-50" // Remove width classes, use calc for width
                : "w-auto h-auto"
                }`}
            style={{
                width: isExpanded ? "calc(100% - 16px)" : "auto", // Subtract 8px margin on each side (16px total)
                margin: isExpanded ? "8px" : "0", // Add margin of 8px on each side when expanded
            }}
        >
            <div className="flex justify-between items-center mb-3 relative">
                {title && <h2 className="text-xl">{title}</h2>}
                <div className="absolute top-1 right-1 flex gap-2">
                    <button
                        className="text-white hover:text-green-500 transition-colors"
                        onClick={handleExpand}
                        aria-label="Expand"
                    >
                        {isExpanded ? "↩️" : "🔼"}
                    </button>
                    <button
                        className="text-white hover:text-red-500 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>
            </div>
            <div className="text-gray-400 text-base space-y-3 leading-relaxed break-words">
                {children}
            </div>
        </div>
    );
};

export default Tile;
