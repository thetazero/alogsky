import React, { createContext, useContext, useState } from "react";
import { TrainingDataSet } from "./analysis/analysis";
import Tile from "./components/Tile";
import panelComponentType from "./tiles/tileType";
import { RunData } from "./types";
import RunTile from "./tiles/RunTile";

interface CommandContextType {
    sendMessage: (message: string) => void;
    closePanel: (id: string) => void;
    addPanel: (tile: panelComponentType, id: string) => void;
    inspectRun: (run: RunData) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export interface CommandProviderProps {
    defaultTiles: Array<{ component: panelComponentType; id: string, data?: any }>;
    parseErrors: string[];
    dataset: TrainingDataSet;
}

const CommandProvider: React.FC<CommandProviderProps> = ({ defaultTiles, parseErrors, dataset }) => {
    const [tiles, setTiles] = useState<Array<{ component: panelComponentType; id: string, data?: any }>>(defaultTiles);

    const sendMessage = (message: string) => {
        console.log("Message:", message);
    };

    const addPanel = (component: panelComponentType, id: string) => {
        setTiles((prev) => [...prev, { component, id }]);
    };

    const closePanel = (id: string) => {
        setTiles((prev) => prev.filter((tile) => tile.id !== id));
    };

    const inspectRun = (run: RunData) => {
        setTiles((prev) => [...prev, { component: RunTile, id: "current_inspected_run", data: run }]);
    };

    return (
        <CommandContext.Provider value={{ sendMessage, closePanel, addPanel, inspectRun }}>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,_minmax(500px,_1fr))] gap-5 p-4 mx-auto">
                {tiles.map(({ component: Component, id, data }) => (
                    <Component key={id} dataset={dataset} id={id} data={data} />
                ))}
                {parseErrors.length > 0 && (
                    <Tile title="Parse Errors" id='parse-errors'>
                        <ul>
                            {parseErrors.map((error, i) => (
                                <li key={i}>{error}</li>
                            ))}
                        </ul>
                    </Tile>
                )}
            </div>
        </CommandContext.Provider>
    );
};

export const useCommand = () => {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error("useCommand must be used within a CommandProvider");
    }
    return context;
};

export default CommandProvider;
