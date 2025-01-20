import React, { createContext, ReactNode, useContext } from "react";

interface CommandContextType {
    sendMessage: (message: string) => void;
    closePanel: (id: string) => void;
}

const CommandContext = createContext<CommandContextType | undefined>(undefined);

export interface CommandProviderProps {
    children: ReactNode;
}

const CommandProvider: React.FC<CommandProviderProps> = ({ children }) => {
    const sendMessage = (message: string) => {
        console.log(message);
    }
    const closePanel = (id: string) => {
        console.log(id);
    }

    return (
        <CommandContext.Provider value={{ sendMessage, closePanel }}>
            {children}
        </CommandContext.Provider>
    )
}

export const useCommand = () => {
    const context = useContext(CommandContext);
    if (!context) {
        throw new Error("usePanels must be used within a PanelProvider");
    }
    return context;
}

export default CommandProvider;
