import { useLocalStorage } from "@/reusableComp/useLocalStorage";
import { createContext, useContext, ReactNode } from "react";

interface TreeSettingsContextType {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  assemblerTier: AssemblerTier;
  setAssemblerTier: (assembler: AssemblerTier) => void;
  furnaceTier: FurnaceTier;
  setFurnaceTier: (furnace: FurnaceTier) => void;
}

type AssemblerTier =
  | "assembling-machine-1"
  | "assembling-machine-2"
  | "assembling-machine-3";

type FurnaceTier = "stone-furnace" | "steel-furnace" | "electric-furnace";

const TreeSettingsContext = createContext<TreeSettingsContextType | undefined>(
  undefined
);

export const TreeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useLocalStorage<boolean>("editMode", true);
  // machine tiers
  const [assemblerTier, setAssemblerTier] = useLocalStorage<AssemblerTier>(
    "assemblerTier",
    "assembling-machine-1"
  );
  const [furnaceTier, setFurnaceTier] = useLocalStorage<FurnaceTier>(
    "furnaceTier",
    "stone-furnace"
  );
  return (
    <TreeSettingsContext.Provider
      value={{
        editMode,
        setEditMode,
        assemblerTier,
        furnaceTier,
        setAssemblerTier,
        setFurnaceTier,
      }}
    >
      {children}
    </TreeSettingsContext.Provider>
  );
};

export const useTreeSettings = () => {
  const context = useContext(TreeSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useTreeSettings must be used within a TreeSettingsProvider"
    );
  }
  return context;
};

// Deprecated: Use useTreeSettings instead
export const useEditMode = useTreeSettings;
