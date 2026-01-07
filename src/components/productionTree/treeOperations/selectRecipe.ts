import { v4 as uuidv4 } from "uuid";
import { ProductNode } from "@/types";
import allRecipes from "../../../gameData/recipes.json";

// Always called from leaf
export const selectRecipe = (
  productNodes: ProductNode[],
  id: string,
  recipeName: string
) => {
  const node = productNodes.find((x) => x.id === id)!;
  const recipe = allRecipes.find(
    (x) => x.name === recipeName && x.product === node.name
  )!;
  const newChildren = recipe.ingredients.map((ingredient) => {
    const rate = (ingredient.amount / recipe.amount) * node.rate;
    return createChild(ingredient.name, rate);
  });

  const updatedNode: ProductNode = {
    ...node,
    recipeName,
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
