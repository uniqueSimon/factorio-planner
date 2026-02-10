import fs from "fs";
import path from "path";
import items from "./items.json";
import recipes from "./recipes.json";

interface RawItem {
  name: string;
  stack_size?: number;
}

interface RawRecipe {
  name: string;
  ingredients: { name: string; amount: number }[];
  results: { name: string; amount: number; probability?: number }[];
  energy_required?: number;
  category?: string;
}
interface Recipe {
  name: string;
  product: string;
  amount: number;
  ingredients: { name: string; amount: number }[];
  energy_required?: number;
  category?: string;
}

const resultRecipes: Recipe[] = [];

for (const recipe of Object.values(recipes)) {
  const rawRecipe = recipe as RawRecipe;
  if (!(rawRecipe.results?.length > 0)) continue;
  for (const result of rawRecipe.results) {
    const ingredients =
      rawRecipe.ingredients?.length > 0
        ? rawRecipe.ingredients.map((x) => ({
            name: x.name,
            amount: x.amount,
          }))
        : [];
    const byProducts =
      rawRecipe.results?.length > 0
        ? rawRecipe.results
            .filter((x) => x.name !== result.name)
            .map((x) => ({
              name: x.name,
              amount: -x.amount * (x.probability ?? 1),
            }))
        : [];
    resultRecipes.push({
      name: rawRecipe.name,
      product: result.name,
      amount: result.amount * (result.probability ?? 1),
      ingredients: [...ingredients, ...byProducts],
      energy_required: rawRecipe.energy_required,
      category: rawRecipe?.category ?? undefined,
    });
  }
}

const outputPath = path.resolve(process.cwd(), "../src/gameData/recipes.json");
fs.writeFileSync(outputPath, JSON.stringify(resultRecipes));

const stackSizes: Record<string, number> = {};
for (const item of items as RawItem[]) {
  if (!item?.name) continue;
  stackSizes[item.name] =
    typeof item.stack_size === "number" ? item.stack_size : 0;
}

const stackSizesPath = path.resolve(
  process.cwd(),
  "../src/gameData/stackSizes.json"
);
fs.writeFileSync(stackSizesPath, JSON.stringify(stackSizes));
