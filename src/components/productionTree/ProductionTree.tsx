import { useState } from "react";
import { ProductNode, SavedFactory } from "../../types";
import { RecursiveTree } from "./RecursiveTree";
import { buildTree } from "./treeOperations/buildTree";
import { selectRecipe } from "./treeOperations/selectRecipe";
import { clearRecipe } from "./treeOperations/clearRecipe";
import { moveToSubtree } from "./treeOperations/moveToSubtree";
import { updateTreeRates } from "./treeOperations/updateTreeRates";
import { calculateRootRate } from "./treeOperations/calculateRootRate";
import { TreeSettings } from "./TreeSettings";
import { reattachSubTree } from "./treeOperations/reattachSubTree";
import { removeDisconnectedBranches } from "./treeOperations/removeDisconnectedBranches";
import { updateNodeSettings } from "./treeOperations/updateNodeSettings";

export const ProductionTree = (props: {
  savedFactory: SavedFactory;
  setProductNodes: (updater: (prev: ProductNode[]) => ProductNode[]) => void;
}) => {
  const nodes = props.savedFactory.productNodes;
  const [containerElement, setContainerElement] = useState<HTMLElement | null>(
    null
  );

  // Use callback ref to properly track when the container is mounted/unmounted
  const containerRef = (node: HTMLDivElement | null) => {
    setContainerElement(node);
  };

  const root = nodes.find((node) => node.type === "ROOT");
  const forest = nodes.length > 0 && root?.name ? buildTree(nodes) : null;

  const onSelectRecipe = (id: string, recipe: string) =>
    props.setProductNodes((currentNodes) =>
      selectRecipe(currentNodes, id, recipe)
    );

  const onSelectNew = (id: string, producedIn: string) =>
    props.setProductNodes((currentNodes) => {
      const cleared = clearRecipe(currentNodes, id);
      return selectRecipe(cleared, id, producedIn);
    });

  const onClearRecipe = (id: string) =>
    props.setProductNodes((currentNodes) => {
      const remainingNodes = clearRecipe(currentNodes, id);
      return removeDisconnectedBranches(remainingNodes);
    });

  const onUpdateRate = (nodeId: string, newRate: number) =>
    props.setProductNodes((currentNodes) => {
      const rootRate = calculateRootRate(currentNodes, nodeId, newRate);
      return updateTreeRates(currentNodes, rootRate);
    });

  const onMoveToSubtree = (id: string) =>
    props.setProductNodes((currentNodes) => {
      const changedStructure = moveToSubtree(currentNodes, id);
      const remainingNodes = removeDisconnectedBranches(changedStructure);
      return updateTreeRates(remainingNodes);
    });

  const onReattachSubtree = (id: string) =>
    props.setProductNodes((currentNodes) => {
      const newNodes = reattachSubTree(currentNodes, id);
      const remainingNodes = removeDisconnectedBranches(newNodes);
      return updateTreeRates(remainingNodes);
    });

  const onUpdateSettings = (id: string, machineTier: string, productivityModules: number) =>
    props.setProductNodes((currentNodes) =>
      updateNodeSettings(currentNodes, id, machineTier, productivityModules)
    );

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <div className="w-full bg-gray-50">
        <TreeSettings />
        {forest && (
          <div ref={containerRef} className="relative flex flex-wrap">
            <div className="mb-10">
              <RecursiveTree
                node={forest.mainTree}
                onClearRecipe={onClearRecipe}
                onSelectRecipe={onSelectRecipe}
                onSelectNew={onSelectNew}
                onUpdateRate={onUpdateRate}
                onUpdateSettings={onUpdateSettings}
                container={containerElement}
                onMoveToSubtree={onMoveToSubtree}
                onReattachSubtree={onReattachSubtree}
              />
            </div>
            {forest.subTrees.map((subTree, i) => (
              <div key={i} className="mb-10">
                <RecursiveTree
                  node={subTree}
                  onClearRecipe={onClearRecipe}
                  onSelectRecipe={onSelectRecipe}
                  onSelectNew={onSelectNew}
                  onUpdateRate={onUpdateRate}
                  onUpdateSettings={onUpdateSettings}
                  container={containerElement}
                  onMoveToSubtree={onMoveToSubtree}
                  onReattachSubtree={onReattachSubtree}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
