import { v4 as uuidv4 } from "uuid";
import { CustomCard } from "@/reusableComp/CustomCard";
import { useState } from "react";
import { FactoryCluster } from "./FactoryCluster";
import { accumulateRates } from "./accumulateRates";
import { SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cluster, SavedFactory } from "@/types";

export const FactoryPlanner = (props: {
  savedFactories: Cluster[];
  setSavedFactories: (newValue: React.SetStateAction<Cluster[]>) => void;
  loadedFactory: SavedFactory | null;
  setLoadedFactory: (factory: SavedFactory) => void;
  removeLoadedFactory: () => void;
  setNewInCluster: (clusterId: string) => void;
}) => {
  const [hoveredFactoryId, setHoveredFactoryId] = useState<string | null>();

  const moveCluster = (fromIndex: number, toIndex: number) => {
    props.setSavedFactories((prev) => {
      if (toIndex < 0 || toIndex >= prev.length || fromIndex === toIndex) {
        return prev;
      }
      const next = [...prev];
      const tmp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = tmp;
      return next;
    });
  };

  const rateBalance = accumulateRates(props.savedFactories);

  const onDropIntoCluster = (sourceId: string, clusterIndex: number) => {
    props.setSavedFactories((currentFactories) => {
      const sourceFactory = currentFactories
        .flatMap((x) => x.factories)
        .find((x) => x.id === sourceId)!;
      const withoutSource = currentFactories.map((cluster) => ({
        ...cluster,
        factories: cluster.factories.filter((x) => x.id !== sourceId),
      }));
      return withoutSource.map((cluster, i) =>
        clusterIndex === i
          ? {
              ...cluster,
              factories: [...cluster.factories, sourceFactory],
            }
          : cluster
      );
    });
  };
  return (
    <div className="p-4 flex-1 overflow-auto pointer-events-auto">
      <h1 className="text-3xl font-bold mb-4">Factorio Planner</h1>
      <CustomCard>
        {props.savedFactories.map((cluster, index) => (
          <FactoryCluster
            key={cluster.id}
            setNewInCluster={props.setNewInCluster}
            cluster={cluster}
            hoveredFactoryId={hoveredFactoryId}
            updateCluster={(cluster) =>
              props.setSavedFactories((prev) =>
                prev.map((prevCluster) =>
                  prevCluster.id === cluster.id ? cluster : prevCluster
                )
              )
            }
            rateBalance={rateBalance[index]}
            setLoadedFactory={props.setLoadedFactory}
            setHoveredFactoryId={setHoveredFactoryId}
            loadedFactory={props.loadedFactory}
            onDropIntoCluster={(sourceId) => onDropIntoCluster(sourceId, index)}
            onMoveClusterUp={() => moveCluster(index, index - 1)}
            onMoveClusterDown={() => moveCluster(index, index + 1)}
            canMoveClusterUp={index > 0}
            canMoveClusterDown={index < props.savedFactories.length - 1}
            onRemoveCluster={() => {
              props.setSavedFactories((prev) =>
                prev.filter((prevCluster) => prevCluster.id !== cluster.id)
              );
              props.removeLoadedFactory();
            }}
          />
        ))}
        <Button
          onClick={() =>
            props.setSavedFactories((prev) => [
              ...prev,
              { id: uuidv4(), title: "New Cluster", factories: [] },
            ])
          }
        >
          <SquarePlus />
          Add factory cluster
        </Button>
      </CustomCard>
    </div>
  );
};
