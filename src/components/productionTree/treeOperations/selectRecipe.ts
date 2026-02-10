import { v4 as uuidv4 } from "uuid";
import { ProductNode } from "@/types";
import allRecipes from "../../../gameData/recipes.json";
import { machinesPerCategory, productivityModuleBonus } from "@/gameData/misc";

// Always called from leaf
export const selectRecipe = (
  productNodes: ProductNode[],
  id: string,
  recipeName: string,
  machineTier?: string
) => {
  const node = productNodes.find((x) => x.id === id)!;
  const recipe = allRecipes.find(
    (x) => x.name === recipeName && x.product === node.name
  )!;
  
  // If no machine tier provided, use the highest tier (last in array) for this recipe category
  let selectedMachine = machineTier;
  if (!selectedMachine) {
    const availableMachines = machinesPerCategory.get(recipe.category ?? "crafting");
    selectedMachine = availableMachines ? availableMachines[availableMachines.length - 1] : undefined;
  }
  
  // Calculate productivity bonus - more output means less input needed for same output rate
  const productivityModules = 0; // Default to 0 modules on creation
  const productivityBonus = 1 + (productivityModules * productivityModuleBonus);
  
  const newChildren = recipe.ingredients.map((ingredient) => {
    // With productivity, we need less input to achieve the same output rate
    const rate = (ingredient.amount / (recipe.amount * productivityBonus)) * node.rate;
    return createChild(ingredient.name, rate);
  });

  const updatedNode: ProductNode = {
    ...node,
    recipeName,
    machineTier: selectedMachine,
    productivityModules: 0, // Default to 0 modules
    children: newChildren.map((c) => c.id),
  };
  return [
    ...productNodes.map((x) => (x.id === id ? updatedNode : x)),
    ...newChildren,
  ];
};

const createChild = (name: string, rate: number): ProductNode => {
  const children = [] as string[];
  const id = uuidv4();
  const type = "NORMAL";
  return { id, name, rate, type, children };
};
