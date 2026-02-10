export interface Cluster {
  id: string;
  title: string;
  factories: SavedFactory[];
}

export interface SavedFactory {
  id: string;
  productNodes: ProductNode[];
}
/**
  Just need ROOT and SUB_ROOT.
  - LEAF has no children.
  - SUB_ROOT_Pointer has a pointer
*/
export type NodeType = "ROOT" | "SUB_ROOT" | "NORMAL";

interface ProductNodeCommon {
  id: string;
  name: string;
  rate: number;
  type: NodeType;
  recipeName?: string;
  subRootPointer?: string;
  machineTier?: string; // e.g., "assembling-machine-3", "stone-furnace"
  productivityModules?: number; // 0-4 productivity modules
}
export interface ProductNode extends ProductNodeCommon {
  children: string[];
}

export interface ProductForest {
  mainTree: ProductNodeNested;
  subTrees: ProductNodeNested[];
}

export interface ProductNodeNested extends ProductNodeCommon {
  children: ProductNodeNested[];
}

export interface Recipe {
  name: string;
  product: string;
  amount: number;
  ingredients: { name: string; amount: number }[];
  energy_required?: number;
  category?: string;
}

export type Weights = Map<
  string,
  {
    recipeName: string;
    weight: number;
  }[]
>;

export interface TreeResults {
  rate: number;
  machineCount: number;
  recipe?: Recipe;
  type?: "RESOURCE" | "MULTIPLE";
}

export type MachineTier = string; // e.g., "assembling-machine-1", "stone-furnace"
