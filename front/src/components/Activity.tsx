import React, { ReactNode } from "react";
import PrettyDate from "./Date";

export interface ActivityProps {
    children?: ReactNode;
    height: number
    title: string
    date: Date
}

const Activity: React.FC<ActivityProps> = ({ children, title, date }) => {

    return (
        <div className="p-4 box-border">
            <div className="border-b border-gray-600 pb-4">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold emph mb-4">{title}</div>
                    <div className="text-sm text-gray-400">
                        <PrettyDate date={date} />
                    </div>
                </div>
                <div className="text-sm text-gray-300">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Activity;
