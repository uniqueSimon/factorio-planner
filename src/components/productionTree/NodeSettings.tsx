import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@/reusableComp/Icon";
import { Tooltip } from "@/components/ui/tooltip";
import { machinesPerCategory, moduleSlots } from "@/gameData/misc";
import { Recipe } from "@/types";

export const NodeSettings = (props: {
  recipe: Recipe;
  machineTier?: string;
  productivityModules?: number;
  onUpdateSettings: (machineTier: string, productivityModules: number) => void;
}) => {
  const availableMachines = machinesPerCategory.get(
    props.recipe.category ?? "crafting"
  ) ?? [];
  
  const currentMachine = props.machineTier ?? availableMachines[0];
  const maxModules = moduleSlots.get(currentMachine) ?? 0;
  const currentModules = props.productivityModules ?? 0;

  return (
    <DropdownMenu>
      <Tooltip tooltip="Machine settings">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
          >
            <Settings size={16} />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>

      <DropdownMenuContent align="start" className="w-64">
        <div className="text-xs font-semibold border-b pb-2 mb-2">
          Machine Settings
        </div>

        {/* Machine Tier Selection */}
        <div className="text-xs text-gray-600 mb-1">Machine:</div>
        {availableMachines.map((machine) => (
          <DropdownMenuItem
            key={machine}
            onClick={() => props.onUpdateSettings(machine, currentModules)}
            className={currentMachine === machine ? "bg-gray-100" : ""}
          >
            <Icon item={machine} className="h-5 w-5 overflow-hidden mr-2" />
            <div className="flex-1">{machine}</div>
            {currentMachine === machine && <span className="text-blue-600">✓</span>}
          </DropdownMenuItem>
        ))}

        {/* Productivity Module Selection */}
        {maxModules > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="text-xs text-gray-600 mb-1 mt-2">
              Productivity Modules:
            </div>
            {Array.from({ length: maxModules + 1 }, (_, i) => i).map((count) => (
              <DropdownMenuItem
                key={count}
                onClick={() => props.onUpdateSettings(currentMachine, count)}
                className={currentModules === count ? "bg-gray-100" : ""}
              >
                <Icon item="productivity-module-3" className="h-5 w-5 overflow-hidden mr-2" />
                <div className="flex-1">
                  {count} {count === 1 ? "module" : "modules"}
                  {count > 0 && (
                    <div className="text-xs text-gray-500">
                      +{count * 10}% prod, -{count * 15}% speed
                    </div>
                  )}
                </div>
                {currentModules === count && <span className="text-blue-600">✓</span>}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
