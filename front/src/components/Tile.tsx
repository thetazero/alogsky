import React, { ReactNode, useState } from "react";
import { AiOutlineClose, AiOutlineExpandAlt, AiOutlineShrink } from "react-icons/ai"; // Import specific icons
import BottomGrows from "./BottomGrows";
import { useCommand } from "../CommandProvider";
import { useMediaQuery } from "../utils/screen_size";

export interface TileProps {
    title?: string;
    children?: ReactNode;
    id: string;
}

const Tile: React.FC<TileProps> = ({ title, children, id }) => {
    const [isExpanded, setIsExpanded] = useState(false); // State for expanding the tile
    const isSmallScreen = useMediaQuery("(max-width: 640px)"); // Check if the screen is small
    const { closePanel } = useCommand();

    const onClose = () => {
        closePanel(id);
    }

    const handleExpand = () => {
        setIsExpanded(!isExpanded); // Toggle expanded state
    };

    const maxHeight = (is_small: boolean) => {
        if (is_small) {
            return "90vh"
        }
        return "60vh"
    }

    const calcHeight = (is_small: boolean) => {
        if (is_small) return "90vh"
        return "auto"
    }

    return (
        <div
            className={`level-1 card p-4 shadow-lg transition-all duration-500 ease-in-out ${isExpanded ? "h-screen fixed top-0 left-0 z-50" : "relative w-auto h-auto"
                }`}
            style={{
                width: isExpanded ? "calc(100% - 16px)" : "auto", // Subtract 8px margin on each side (16px total)
                margin: isExpanded ? "8px" : "0", // Add margin of 8px on each side when expanded
                minHeight: "30vh",
                height: isExpanded ? "calc(100% - 16px)" : calcHeight(isSmallScreen),
                maxHeight: isExpanded ? undefined : maxHeight(isSmallScreen),
            }}
        >

            <div className="absolute top-1 right-1 flex gap-2 p-4">
                <button
                    className="text-white hover:text-green-500 transition-colors"
                    onClick={handleExpand}
                    aria-label="Expand"
                >
                    {isExpanded ? (
                        <AiOutlineShrink className="w-5 h-5" />
                    ) : (
                        <AiOutlineExpandAlt className="w-5 h-5" />
                    )}
                </button>
                <button
                    className="text-white hover:text-red-500 transition-colors"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <AiOutlineClose className="w-5 h-5" />
                </button>
            </div>
            <BottomGrows
                topChild={
                    <div className="flex justify-between items-center">
                        {title && <h2 className="text-xl">{title}</h2>}
                    </div>
                }
                bottomChild={
                    children
                }
            />
        </div>
    );
};

export default Tile;
