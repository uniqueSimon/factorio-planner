import { FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useTreeSettings } from "@/context/TreeSettingsContext";

export const TreeSettings = () => {
  const {
    editMode,
    setEditMode,
    showRecipeCompressions,
    setShowRecipeCompressions,
  } = useTreeSettings();
  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm px-4 py-2 flex gap-4">
        <p className="font-semibold">Tree settings:</p>
        <FormItem label="Edit mode" className="mb-0">
          <Switch checked={editMode} onChange={setEditMode} />
        </FormItem>
        <FormItem label="Show recipe compressions" className="mb-0">
          <Switch
            checked={showRecipeCompressions}
            onChange={setShowRecipeCompressions}
          />
        </FormItem>
      </div>
    </>
  );
};
