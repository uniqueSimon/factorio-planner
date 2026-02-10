import { ProductNode } from "@/types";
import allRecipes from "../../../gameData/recipes.json";
import { productivityModuleBonus } from "@/gameData/misc";

export const updateTreeRates = (
  nodes: ProductNode[],
  rate?: number
): ProductNode[] => {
  const updatedNodes: ProductNode[] = [];

  // Lists the sub roots with the number of pointers to them.
  const subRootConnections = new Map<string, number>();

  for (const node of nodes) {
    if (node.subRootPointer) {
      const existing = subRootConnections.get(node.subRootPointer);
      subRootConnections.set(node.subRootPointer, (existing ?? 0) + 1);
    }
  }

  const updateNodeRate = (rate: number, node: ProductNode) => {
    updatedNodes.push({ ...node, rate });

    if (node.subRootPointer) {
      const numberOfConnections = subRootConnections.get(node.subRootPointer)!;

      // Only process the subRoot if every pointer to it has been processed.
      // That way, the subRoot rate is known.
      if (numberOfConnections === 1) {
        const subRootRate = updatedNodes
          .filter((n) => n.subRootPointer === node.subRootPointer)
          .reduce((prev, cur) => prev + cur.rate, 0);
        const subRoot = nodes.find((n) => n.id === node.subRootPointer)!;
        updateNodeRate(subRootRate, subRoot);
        return;
      }
      subRootConnections.set(node.subRootPointer, numberOfConnections - 1);
      return;
    }

    if (node.children.length === 0) return;

    const recipe = allRecipes.find(
      (r) => r.product === node.name && r.name === node.recipeName
    )!;

    // Calculate productivity bonus for this node
    const productivityModules = node.productivityModules ?? 0;
    const productivityBonus = 1 + (productivityModules * productivityModuleBonus);

    for (const childId of node.children) {
      const childNode = nodes.find((n) => n.id === childId)!;

      //x.amount * childNode.rate > 0 for dintinguishing ingredient and byproduct
      const ingredient = recipe.ingredients.find(
        (x) => x.name === childNode.name && x.amount * childNode.rate > 0
      )!;

      // With productivity, we need less input to achieve the same output rate
      const ingredientRate = (ingredient.amount / (recipe.amount * productivityBonus)) * rate;
      updateNodeRate(ingredientRate, childNode);
    }
  };

  const rootNode = nodes.find((n) => n.type === "ROOT")!;
  updateNodeRate(rate ?? rootNode.rate, rootNode);

  return updatedNodes;
};
