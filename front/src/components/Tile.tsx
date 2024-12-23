import React, { ReactNode } from "react";

export interface TileProps {
    title?: string;
    children?: ReactNode; // To allow for child components
    onClose?: () => void; // Optional callback for the close button
}

const Tile: React.FC<TileProps> = ({ title, children, onClose }) => {
    return (
        <div className="tile">
            <div className="tile-header">
                {
                    title && <h2>{title}</h2>
                }
                <button
                    className="tile-close-button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
            <div className="tile-content">
                {children}
            </div>
        </div>
    );
};

export default Tile;
