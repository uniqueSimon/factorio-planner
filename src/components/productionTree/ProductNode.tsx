import { useState } from "react";
import { ProductNodeNested, Recipe } from "@/types";
import { RecipeSelected, RecipeToAdd } from "./RecipeSelector";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Tooltip } from "../ui/tooltip";
import recipesJson from "../../gameData/recipes.json";
import { useTreeSettings } from "@/context/TreeSettingsContext";

export const ProductNode = (props: {
  node: ProductNodeNested;
  onSelectRecipe: (id: string, recipe: string) => void;
  onSelectNew: (id: string, producedIn: string) => void;
  onClearRecipe: (id: string) => void;
  onMoveToSubtree: (id: string) => void;
  onReattachSubtree: (id: string) => void;
  onUpdateSettings: (id: string, machineTier: string, productivityModules: number) => void;
  onUpdateRate: (id: string, newRate: number) => void;
}) => {
  const { editMode } = useTreeSettings();
  const { id, name, rate, type, subRootPointer, recipeName, machineTier, productivityModules } = props.node;
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [editValue, setEditValue] = useState("");
  
  const availableRecipes: Recipe[] = recipesJson.filter(
    (x) => x.product === name
  );
  const selectedRecipe = availableRecipes.find((x) => x.name === recipeName);
  const label = `${rate.toFixed(1)} /s`;

  const handleRateLabelClick = () => {
    setEditValue(String(rate));
    setIsEditingRate(true);
  };

  const handleRateSubmit = () => {
    const numValue = parseFloat(editValue) || 0;
    props.onUpdateRate(id, numValue);
    setIsEditingRate(false);
  };

  const handleRateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRateSubmit();
    } else if (e.key === "Escape") {
      setIsEditingRate(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center bg-white shadow-lg rounded-xl px-2 border border-gray-200 text-center",
        subRootPointer && "bg-gray-300"
      )}
    >
      {(type === "SUB_ROOT" || type === "ROOT") && (
        isEditingRate ? (
          <input
            type="number"
            step="0.1"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleRateSubmit}
            onKeyDown={handleRateKeyDown}
            autoFocus
            className="text-xs w-16 px-1 py-0.5 mt-1 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary text-center"
          />
        ) : (
          <Tooltip tooltip={`${parseFloat(rate.toFixed(4))} /s`} delay={500}>
            <div
              className="text-xs pt-1 cursor-pointer hover:text-primary"
              onClick={handleRateLabelClick}
            >
              {label}
            </div>
          </Tooltip>
        )
      )}
      <IconWithTooltip item={name} />
      <>
        {type === "SUB_ROOT" && editMode ? (
          <Tooltip tooltip="Reattach subtree">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
              onClick={() => props.onReattachSubtree(id)}
            >
              <ArrowLeft size={16} />
            </Button>
          </Tooltip>
        ) : type !== "ROOT" && !subRootPointer && editMode ? (
          <Tooltip tooltip="Move to or create subtree">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 p-0 text-gray-500 hover:text-gray-800"
              onClick={() => props.onMoveToSubtree(id)}
            >
              <ArrowRight size={16} />
            </Button>
          </Tooltip>
        ) : null}
      </>
      {props.node.children.length > 0 ? (
        <RecipeSelected
          availableRecipes={availableRecipes}
          recipe={selectedRecipe!}
          rate={props.node.rate}
          machineTier={machineTier}
          productivityModules={productivityModules}
          onClear={() => props.onClearRecipe(id)}
          onSelectNew={(producedIn) => props.onSelectNew(id, producedIn)}
          onUpdateSettings={(machineTier, productivityModules) =>
            props.onUpdateSettings(id, machineTier, productivityModules)
          }
          onRateChange={(newRate) => props.onUpdateRate(id, newRate)}
        />
      ) : subRootPointer ||
        availableRecipes.length === 0 ||
        !editMode ? null : (
        <RecipeToAdd
          availableRecipes={availableRecipes.map((x) => x.name)}
          onSelectRecipe={(recipe) => props.onSelectRecipe(id, recipe)}
        />
      )}
    </div>
  );
};
