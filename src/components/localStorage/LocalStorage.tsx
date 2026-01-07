import { Cluster } from "@/types";
import { ExportLocalStorage } from "./ExportLocalStorage";
import { ImportLocalStorage } from "./ImportLocalStorage";

export const LocalStorage = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: Cluster[]) => void;
}) => {
  return (
    <div className="p-4 space-y-6 text-gray-700">
      <p>
        Your configurations are automatically stored in the browser’s local
        storage. You can manage them using the options below:
      </p>

      <div className="space-y-2 border-2 rounded-md p-2">
        <h1 className="font-semibold">Export configuration:</h1>
        Save your current setup to a file. Useful for:
        <ul className="list-disc list-inside ml-5 space-y-1 text-gray-600">
          <li>Moving your config to another browser</li>
          <li>Backing up before clearing browser data</li>
          <li>Keeping a copy for later use</li>
        </ul>
        <p>
          Stores saved factories and found alternate recipes in a json-file.{" "}
        </p>
        <ExportLocalStorage savedFactories={props.savedFactories} />
      </div>

      <div className="space-y-2 border-2 rounded-md p-2">
        <h1 className="font-semibold">Import configuration:</h1>
        Load a saved config from a file. Useful for:
        <ul className="list-disc list-inside ml-5 space-y-1 text-gray-600">
          <li>Restoring a backup</li>
          <li>Loading configs from another browser</li>
          <li>Switching between different setups</li>
        </ul>
        <p>
          Imports saved factories and found alternate recipes from a json-file
        </p>
        <ImportLocalStorage setSavedFactories={props.setSavedFactories} />
      </div>
    </div>
  );
};
