import { ProductNode } from "@/types";
import { updateTreeRates } from "./updateTreeRates";

export const updateNodeSettings = (
  productNodes: ProductNode[],
  id: string,
  machineTier: string,
  productivityModules: number
) => {
  // Update the node settings
  const updatedNodes = productNodes.map((node) =>
    node.id === id
      ? { ...node, machineTier, productivityModules }
      : node
  );
  
  // Recalculate tree rates to account for productivity changes affecting child rates
  return updateTreeRates(updatedNodes);
};
