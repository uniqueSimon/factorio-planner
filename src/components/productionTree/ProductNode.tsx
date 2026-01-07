import { ProductNodeNested, Recipe } from "@/types";
import { RecipeSelected, RecipeToAdd } from "./RecipeSelector";
import { IconWithTooltip } from "@/reusableComp/IconWithTooltip";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Tooltip } from "../ui/tooltip";
import recipesJson from "../../gameData/recipes.json";

export const ProductNode = (props: {
  node: ProductNodeNested;
  onSelectRecipe: (id: string, recipe: string) => void;
  onSelectNew: (id: string, producedIn: string) => void;
  onClearRecipe: (id: string) => void;
  onMoveToSubtree: (id: string) => void;
  onReattachSubtree: (id: string) => void;
}) => {
  const { id, name, rate, type, subRootPointer, recipeName } = props.node;
  const availableRecipes: Recipe[] = recipesJson.filter(
    (x) => x.product === name
  );
  const selectedRecipe = availableRecipes.find((x) => x.name === recipeName);
  const label = `${rate.toFixed(1)} /s`;
  return (
    <div
      className={cn(
        "flex flex-col items-center bg-white shadow-lg rounded-xl px-2 border border-gray-200 text-center",
        subRootPointer && "bg-gray-300"
      )}
    >
      {(type === "SUB_ROOT" || type === "ROOT") && (
        <div className="text-xs pt-1">{label}</div>
      )}
      <IconWithTooltip item={name} />
      <>
        {type === "SUB_ROOT" ? (
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
        ) : type !== "ROOT" && !subRootPointer ? (
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
          onClear={() => props.onClearRecipe(id)}
          onSelectNew={(producedIn) => props.onSelectNew(id, producedIn)}
        />
      ) : subRootPointer || availableRecipes.length === 0 ? null : (
        <RecipeToAdd
          availableRecipes={availableRecipes.map((x) => x.name)}
          onSelectRecipe={(recipe) => props.onSelectRecipe(id, recipe)}
        />
      )}
    </div>
  );
};
