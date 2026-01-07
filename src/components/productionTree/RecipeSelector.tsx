import { Plus, RotateCcw, Trash } from "lucide-react";
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
import { machinesPerCategory, producerSpeeds } from "@/gameData/misc";
import { useTreeSettings } from "@/context/TreeSettingsContext";

export const RecipeToAdd = (props: {
  availableRecipes: string[];
  onSelectRecipe: (recipe: string) => void;
}) => (
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
          <div>{recipe}</div>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export const RecipeSelected = (props: {
  availableRecipes: Recipe[];
  recipe: Recipe;
  rate: number;
  onClear: () => void;
  onSelectNew: (producedIn: string) => void;
}) => {
  const { assemblerTier: assembler, furnaceTier: furnace } = useTreeSettings();
  const machines = machinesPerCategory.get(
    props.recipe.category ?? "crafting"
  )!;
  const currentMachine =
    machines.find((x) => x === assembler || x === furnace) ?? machines[0];
  const speed = producerSpeeds.get(currentMachine ?? "other") ?? 1;
  const ratePerMachine =
    (props.recipe.amount / (props.recipe.energy_required ?? 0.5)) * speed;
  const machineCount = props.rate / ratePerMachine;
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-0.5 mb-1 bg-gray-400" />
      <div className="text-xs pt-1">{machineCount.toFixed(1)}</div>
      <div className="relative">
        <Tooltip
          tooltip={
            <div>
              <div className="font-bold">{currentMachine}</div>
              {props.recipe.name}
            </div>
          }
        >
          <Icon item={currentMachine} />
        </Tooltip>
      </div>
      <div className="flex">
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
                    key={recipe.name}
                    onClick={() => props.onSelectNew(recipe.name)}
                  >
                    <Icon item={recipe.name} />
                    <div className="ml-2">{recipe.name}</div>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
