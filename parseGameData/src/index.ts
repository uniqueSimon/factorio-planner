import fs from "fs";
import path from "path";
import recipes from "./recipes.json";

interface RawRecipe {
  name: string;
  ingredients: { name: string; amount: number }[];
  results: { name: string; amount: number }[];
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
            .map((x) => ({ name: x.name, amount: -x.amount }))
        : [];
    resultRecipes.push({
      name: rawRecipe.name,
      product: result.name,
      amount: result.amount,
      ingredients: [...ingredients, ...byProducts],
      energy_required: rawRecipe.energy_required,
      category: rawRecipe?.category ?? undefined,
    });
  }
}

const outputPath = path.resolve(process.cwd(), "../src/gameData/recipes.json");
fs.writeFileSync(outputPath, JSON.stringify(resultRecipes));
