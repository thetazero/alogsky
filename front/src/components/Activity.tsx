import React, { ReactNode } from "react";
import PrettyDate from "./Date";

export interface ActivityProps {
    children?: ReactNode;
    height: number
    title: string
    date: Date
}

const Activity: React.FC<ActivityProps> = ({ children, height, title, date }) => {

    return (
        <div className="activity"
            style={{ height }}
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold emph">{title}</h2>
                <div className="text-sm">
                    <PrettyDate date={date} />
                </div>
            </div>
            <div className="text-sm">
                {children}
            </div>
        </div>
    );
};

export default Activity;
