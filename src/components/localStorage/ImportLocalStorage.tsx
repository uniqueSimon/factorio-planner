import { Cluster } from "@/types";
import { Button } from "@/components/ui/button";

export const ImportLocalStorage = (props: {
  setSavedFactories: (savedFactories: Cluster[]) => void;
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = JSON.parse(e.target!.result as string);
        props.setSavedFactories(json.savedFactories);
      };
      reader.readAsText(file);
    }
  };
  return (
    <div>
      <label htmlFor="file-upload">
        <Button asChild>
          <span>Upload File</span>
        </Button>
      </label>
      <input
        id="file-upload"
        className="hidden"
        type="file"
        accept=".json"
        onChange={handleFileUpload}
      />
    </div>
  );
};
