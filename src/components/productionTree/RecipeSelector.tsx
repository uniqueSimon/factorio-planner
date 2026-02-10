import { Plus, RotateCcw, Trash } from "lucide-react";
import { useState } from "react";
import { Recipe } from "../../types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Icon } from "@/reusableComp/Icon";
import { Tooltip } from "@/components/ui/tooltip";
import { machinesPerCategory, producerSpeeds, productivityModuleBonus, productivityModuleSpeedPenalty } from "@/gameData/misc";
import { useTreeSettings } from "@/context/TreeSettingsContext";
import { RecipeCompression } from "./RecipeCompression";
import { NodeSettings } from "./NodeSettings";
import { formatName } from "@/lib/utils";

export const RecipeToAdd = (props: {
  availableRecipes: string[];
  onSelectRecipe: (recipe: string) => void;
}) => {
  return (
    <DropdownMenu>
      <Tooltip tooltip="Add recipe">
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
          >
            <Plus size={16} />
          </Button>
        </DropdownMenuTrigger>
      </Tooltip>

      <DropdownMenuContent align="start">
        {props.availableRecipes.map((recipe) => (
          <DropdownMenuItem
            key={recipe}
            onClick={() => props.onSelectRecipe(recipe)}
          >
            <Icon item={recipe} />
            <div>{formatName(recipe)}</div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const RecipeSelected = (props: {
  availableRecipes: Recipe[];
  recipe: Recipe;
  rate: number;
  machineTier?: string;
  productivityModules?: number;
  onClear: () => void;
  onSelectNew: (producedIn: string) => void;
  onUpdateSettings: (machineTier: string, productivityModules: number) => void;
  onRateChange: (newRate: number) => void;
}) => {
  const { editMode, showRecipeCompressions } = useTreeSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  
  // Get available machines for this recipe category
  const machines = machinesPerCategory.get(
    props.recipe.category ?? "crafting"
  )!;
  
  // Use node-local machine tier if set, otherwise use highest tier (last in array)
  const currentMachine = props.machineTier ?? machines[machines.length - 1];
  
  const speed = producerSpeeds.get(currentMachine ?? "other") ?? 1;
  const productivityModules = props.productivityModules ?? 0;
  
  // Apply speed penalty and productivity bonus
  const speedPenalty = 1 - (productivityModules * productivityModuleSpeedPenalty);
  const productivityBonus = 1 + (productivityModules * productivityModuleBonus);
  const effectiveSpeed = speed * speedPenalty;
  const ratePerMachine =
    (props.recipe.amount / (props.recipe.energy_required ?? 0.5)) * effectiveSpeed * productivityBonus;
  const machineCount = props.rate / ratePerMachine;

  const handleLabelClick = () => {
    setEditValue(String(machineCount));
    setIsEditing(true);
  };

  const handleSubmit = () => {
    const numValue = parseFloat(editValue) || 0;
    const newRate = numValue * ratePerMachine;
    props.onRateChange(newRate);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-0.5 mb-1 bg-gray-400" />
      {isEditing ? (
        <input
          type="number"
          step="0.1"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="text-xs w-12 px-1 py-0.5 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary text-center"
        />
      ) : (
        <Tooltip tooltip={`${parseFloat(machineCount.toFixed(4))} machines`} delay={500}>
          <div
            className="text-xs pt-1 cursor-pointer hover:text-primary"
            onClick={handleLabelClick}
          >
            {machineCount.toFixed(1)}
          </div>
        </Tooltip>
      )}
      <div className="relative">
        <Tooltip
          tooltip={
            <div className="space-y-2">
              <div className="font-bold border-b pb-1">{formatName(currentMachine)}</div>
              <div className="text-sm">{formatName(props.recipe.name)}</div>
              
              {/* Recipe Details */}
              <div className="text-xs space-y-1">
                <div className="font-semibold">Ingredients:</div>
                {props.recipe.ingredients.map((ing) => (
                  <div key={ing.name} className="flex items-center gap-1 ml-2">
                    <Icon item={ing.name} className="h-4 w-4 overflow-hidden" />
                    <span>{formatName(ing.name)}</span>
                    <span className="text-gray-400">× {ing.amount}</span>
                  </div>
                ))}
                
                <div className="font-semibold mt-2">Product:</div>
                <div className="flex items-center gap-1 ml-2">
                  <Icon item={props.recipe.product} className="h-4 w-4 overflow-hidden" />
                  <span>{formatName(props.recipe.product)}</span>
                  <span className="text-gray-400">× {props.recipe.amount}</span>
                </div>
                
                <div className="mt-2">
                  <span className="font-semibold">Time:</span> {props.recipe.energy_required ?? 0.5}s
                </div>
              </div>

              {productivityModules > 0 && (
                <div className="border-t pt-1 mt-2">
                  <div className="text-green-400 text-xs">
                    +{productivityModules * 10}% productivity
                  </div>
                  <div className="text-red-400 text-xs">
                    -{productivityModules * 15}% speed
                  </div>
                </div>
              )}
            </div>
          }
        >
          <Icon item={currentMachine} />
        </Tooltip>
      </div>
      {showRecipeCompressions && <RecipeCompression recipe={props.recipe} />}
      {editMode && (
        <div className="flex">
          <NodeSettings
            recipe={props.recipe}
            machineTier={props.machineTier}
            productivityModules={props.productivityModules}
            onUpdateSettings={props.onUpdateSettings}
          />
          <Tooltip tooltip="Delete recipe with all its ingredients">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
              onClick={props.onClear}
            >
              <Trash size={16} />
            </Button>
          </Tooltip>
          {props.availableRecipes.length > 1 && (
            <DropdownMenu>
              <Tooltip tooltip="Change recipe">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
                  >
                    <RotateCcw size={16} />
                  </Button>
                </DropdownMenuTrigger>
              </Tooltip>
              <DropdownMenuContent align="start">
                <div className="text-xs border-b pb-1">Change recipe to:</div>
                {props.availableRecipes
                  .filter((x) => x !== props.recipe)
                  .map((recipe) => (
                    <DropdownMenuItem
                      key={`${recipe.name}${recipe.amount}`}
                      onClick={() => props.onSelectNew(recipe.name)}
                    >
                      <Icon item={recipe.name} />
                      <div className="ml-2">{formatName(recipe.name)}</div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}
    </div>
  );
};
