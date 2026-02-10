import { useLocalStorage } from "@/reusableComp/useLocalStorage";
import { createContext, useContext, ReactNode } from "react";

interface TreeSettingsContextType {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  showRecipeCompressions: boolean;
  setShowRecipeCompressions: (show: boolean) => void;
}

const TreeSettingsContext = createContext<TreeSettingsContextType | undefined>(
  undefined
);

export const TreeSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useLocalStorage<boolean>("editMode", true);
  const [showRecipeCompressions, setShowRecipeCompressions] =
    useLocalStorage<boolean>("showRecipeCompressions", true);

  return (
    <TreeSettingsContext.Provider
      value={{
        editMode,
        setEditMode,
        showRecipeCompressions,
        setShowRecipeCompressions,
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
