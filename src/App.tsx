import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocalStorage } from "./reusableComp/useLocalStorage";
import { Cluster } from "./types";
import { LocalStorage } from "./components/localStorage/LocalStorage";
import { NaviagationBar } from "./NavigationBar";
import { Home } from "./Home";
import { DirtyStateProvider } from "./DirtyStateContext";
import { TreeSettingsProvider } from "./context/TreeSettingsContext";

export const App = () => {
  const [savedFactories, setSavedFactories] = useLocalStorage<Cluster[]>(
    "saved-factories",
    []
  );
  return (
    <div className="flex flex-col h-screen">
      <Router>
        <DirtyStateProvider>
          <NaviagationBar />
          <Routes>
            <Route
              path="/factorio-planner/"
              element={
                <TreeSettingsProvider>
                  <Home
                    savedFactories={savedFactories}
                    setSavedFactories={setSavedFactories}
                  />
                </TreeSettingsProvider>
              }
            />
            <Route
              path="/factorio-planner/local-storage"
              element={
                <LocalStorage
                  savedFactories={savedFactories}
                  setSavedFactories={setSavedFactories}
                />
              }
            />
          </Routes>
        </DirtyStateProvider>
      </Router>
    </div>
  );
};
