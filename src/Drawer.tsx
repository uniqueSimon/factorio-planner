import { v4 as uuidv4 } from "uuid";
import { SavedFactory } from "./types";
import { ProductionTree } from "./components/productionTree/ProductionTree";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, Save, Trash, X } from "lucide-react";
import { Icon } from "./reusableComp/Icon";
import { useDirtyState } from "./DirtyStateContext";
import { TreeSettingsProvider } from "./context/TreeSettingsContext";
import { ProductCombobox } from "./reusableComp/ProductCombobox";
import allRecipes from "./gameData/recipes.json";
import { formatName } from "./lib/utils";

const allProducts = [...new Set(allRecipes.map((x) => x.product))];

export const Drawer = (props: {
  loadedFactory: SavedFactory;
  setLoadedFactory: (factory: SavedFactory | null) => void;
  onClickedDrawerButton: (type: "SAVE" | "DELETE" | "COPY" | "CLOSE") => void;
}) => {
  const { isDirty } = useDirtyState();
  const nodes = props.loadedFactory.productNodes;
  const root = nodes.find((node) => node.type === "ROOT");

  const notReadyForSaving = !root || !root.name || !root.rate;

  const setProductToProduce = (product: string) => {
    const rateOneMachine = 1;
    props.setLoadedFactory({
      id: props.loadedFactory.id,
      productNodes: [{
        id: uuidv4(),
        name: product,
        rate: rateOneMachine,
        type: "ROOT",
        children: [],
      }],
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 py-1 border-2 bg-gray-200 text-xl font-semibold">
        <ProductCombobox
          product={root?.name ?? ""}
          setProduct={setProductToProduce}
          allProducts={allProducts}
        >
          <button className="flex gap-2 items-center hover:text-primary cursor-pointer">
            {root?.name ? (
              <>
                <Icon item={root.name} />
                {formatName(root.name)}
              </>
            ) : (
              "Select product to produce!"
            )}
            <ChevronDown size={16} className="text-gray-500" />
          </button>
        </ProductCombobox>
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
      <TreeSettingsProvider>
        <ProductionTree
          savedFactory={props.loadedFactory}
          setProductNodes={(updater) => {
            const newNodes = updater(props.loadedFactory.productNodes);
            props.setLoadedFactory({
              id: props.loadedFactory.id,
              productNodes: newNodes,
            });
          }}
        />
      </TreeSettingsProvider>
    </div>
  );
};
