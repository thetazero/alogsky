import React from "react";

export interface BottomGrowsProps {
    topChild: React.ReactNode;
    bottomChild: React.ReactNode;
}

const BottomGrows: React.FC<BottomGrowsProps> = ({ topChild, bottomChild }) => {
    return (
        <div className="grid grid-rows-[auto,1fr] h-full gap-3">
            <div>{topChild}</div>
            <div className="overflow-auto">{bottomChild}</div>
        </div>
    );
};

export default BottomGrows;
