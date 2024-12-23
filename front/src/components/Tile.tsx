import React, { ReactNode } from "react";

export interface TileProps {
    title?: string;
    children?: ReactNode;
    onClose?: () => void;
}

const Tile: React.FC<TileProps> = ({ title, children, onClose }) => {
    return (
        <div className="bg-gray-800 text-white rounded-lg border border-gray-700 p-4 shadow-md transition-transform transform hover:translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-center mb-3">
                {title && <h2 className="text-xl">{title}</h2>}
                <div className="absolute top-1 right-1 flex gap-2">
                    <button
                        className="text-white hover:text-red-500 transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ×
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
