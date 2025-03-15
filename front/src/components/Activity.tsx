import React, { ReactNode } from "react";
import PrettyDate from "./Date";

export interface ActivityProps {
    children?: ReactNode;
    height: number
    title: string
    date: Date
    onClick?: () => void
    color?: "good" | "bad" | "okay"
}

export const color_map = {
    "good": "text-green-300",
    "bad": "text-red-300",
    "okay": "text-yellow-300"
}

const Activity: React.FC<ActivityProps> = ({ children, title, date, color, onClick }) => {

    return (
        <div onClick={onClick}>
            <div className={"flex justify-between items-center" + (children ? " mb-2" : "")}>
                <div className={"text-xl font-bold " + (
                    color ? color_map[color] : "emph"
                )}>{title}</div>
                <div className="text-sm text-gray-400">
                    <PrettyDate date={date} />
                </div>
            </div>
            <div className="text-sm text-gray-300">
                {children}
            </div>
        </div>
    );
};

export default Activity;
