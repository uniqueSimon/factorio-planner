import { ProductNode, SavedFactory } from "./types";
import { ProductionTree } from "./components/productionTree/ProductionTree";
import { Button } from "@/components/ui/button";
import { Copy, Save, Trash, X } from "lucide-react";
import { Icon } from "./reusableComp/Icon";
import { useDirtyState } from "./DirtyStateContext";

export const Drawer = (props: {
  loadedFactory: SavedFactory;
  setLoadedFactory: (factory: SavedFactory | null) => void;
  onClickedDrawerButton: (type: "SAVE" | "DELETE" | "COPY" | "CLOSE") => void;
}) => {
  const { isDirty } = useDirtyState();
  const nodes = props.loadedFactory.productNodes;
  const root = nodes.find((node) => node.type === "ROOT");

  const notReadyForSaving = !root || !root.name || !root.rate;

  const setNewProduct = (node: ProductNode) => {
    props.setLoadedFactory({
      id: props.loadedFactory.id,
      productNodes: [node],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 py-1 border-2 bg-gray-200 text-xl font-semibold">
        {root?.name ? (
          <div className="flex gap-2 items-center">
            <Icon item={root.name} />
            {root.name}
          </div>
        ) : (
          <div>New factory!</div>
        )}
        <div>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("SAVE")}
            disabled={notReadyForSaving || !isDirty}
          >
            <Save />
          </Button>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("DELETE")}
            disabled={notReadyForSaving}
          >
            <Trash />
          </Button>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("COPY")}
            disabled={notReadyForSaving}
          >
            <Copy />
          </Button>
          <Button
            variant="outline"
            onClick={() => props.onClickedDrawerButton("CLOSE")}
          >
            <X />
          </Button>
        </div>
      </div>
      <ProductionTree
        savedFactory={props.loadedFactory}
        setProductNodes={(updater) => {
          const newNodes = updater(props.loadedFactory.productNodes);
          props.setLoadedFactory({
            id: props.loadedFactory.id,
            productNodes: newNodes,
          });
        }}
        setNewProduct={setNewProduct}
      />
    </div>
  );
};
