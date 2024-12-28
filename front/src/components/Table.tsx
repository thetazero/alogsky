import React, { useEffect, useState } from "react";

interface TableProps {
    table: string[][]; // 2D array representing table rows and cells
    height: number;    // Height of the scrollable container
}

const ScrollableTable: React.FC<TableProps> = ({ table, height }) => {
    const [filled, setFilled] = useState<string[][]>([]);

    useEffect(() => {
        const max_length = table.map((row) => row.length).reduce((a, b) => Math.max(a, b), 0);
        setFilled(
            table.map((row) => {
                const filledRow = [...row];
                while (filledRow.length < max_length) {
                    filledRow.push("-"); // Fill missing cells with a placeholder (e.g., "-")
                }
                return filledRow;
            })
        );
    }, [table]);

    return (
        <div
            className="overflow-x-auto overflow-y-auto level-2 card"
            style={{ maxHeight: height }}
        >
            <table className="table-auto w-full">
                <tbody>
                    {filled.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={rowIndex % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                        >
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className="border-gray-700 px-4 py-2 text-gray-300"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScrollableTable;
