import { Tooltip } from "@/components/ui/tooltip";
import stackSizes from "@/gameData/stackSizes.json";
import { Recipe } from "@/types";

export const RecipeCompression = (props: { recipe: Recipe }) => {
  const FLUID_STACK_EQUIVALENT = 625;
  const getStackSize = (item: string) =>
    stackSizes[item as keyof typeof stackSizes] ?? FLUID_STACK_EQUIVALENT;

  const outputStackSize = getStackSize(props.recipe.product);
  const craftsPerOutputStack =
    props.recipe.amount > 0 ? outputStackSize / props.recipe.amount : 0;

  const ingredientStacksPerOutputStack = props.recipe.ingredients.reduce(
    (sumStacks, ingredient) => {
      const ingredientStackSize = getStackSize(ingredient.name);
      const ingredientItemsNeeded = ingredient.amount * craftsPerOutputStack;
      return sumStacks + ingredientItemsNeeded / ingredientStackSize;
    },
    0
  );

  return (
    <Tooltip
      tooltip={
        <div className="text-left">
          <div>
            {ingredientStacksPerOutputStack.toFixed(2)} ingredient stacks get
            compressed into 1 output stack
          </div>
          <div className="text-xs opacity-90">
            Total ingredient stacks: {ingredientStacksPerOutputStack.toFixed(2)}
          </div>
          <div className="mt-1 text-xs opacity-90">
            <div>
              Output: {props.recipe.product} (stack {outputStackSize})
            </div>
            {props.recipe.ingredients.map((ing) => {
              const stackSize = getStackSize(ing.name);
              const itemsNeeded = ing.amount * craftsPerOutputStack;
              const stacksNeeded = stackSize > 0 ? itemsNeeded / stackSize : 0;
              return (
                <div key={`${ing.name}${ing.amount}`}>
                  In: {ing.name} (stack {stackSize}) → {stacksNeeded.toFixed(2)}
                </div>
              );
            })}
          </div>
        </div>
      }
    >
      <div className="text-[10px] text-gray-600 leading-tight mt-1 underline decoration-dotted cursor-help">
        {ingredientStacksPerOutputStack.toFixed(2) + " comp."}
      </div>
    </Tooltip>
  );
};
