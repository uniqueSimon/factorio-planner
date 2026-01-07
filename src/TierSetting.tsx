import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { useTreeSettings } from "./context/TreeSettingsContext";
import { Icon } from "./reusableComp/Icon";

export const TierSetting = () => {
  const { assemblerTier, furnaceTier, setAssemblerTier, setFurnaceTier } =
    useTreeSettings();
  return (
    <div className="flex items-center gap-6 p-2">
      <div className="flex items-center gap-2">
        <div className="text-sm">Assembler tier</div>
        <Select value={assemblerTier} onValueChange={setAssemblerTier}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select tier" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3].map((x) => (
              <SelectItem key={x} value={`assembling-machine-${x}`}>
                <div className="flex items-center gap-2">
                  <Icon
                    item={`assembling-machine-${x}`}
                    className="h-5 w-5 overflow-hidden"
                  />
                  Tier {x}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-sm">Furnace tier</div>
        <Select value={furnaceTier} onValueChange={setFurnaceTier}>
          <SelectTrigger className="w-46">
            <SelectValue placeholder="Select tier" />
          </SelectTrigger>
          <SelectContent>
            {["stone-furnace", "steel-furnace", "electric-furnace"].map((x) => (
              <SelectItem key={x} value={x}>
                <div className="flex items-center gap-2">
                  <Icon item={x} className="h-5 w-5 overflow-hidden" />
                  {x}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
