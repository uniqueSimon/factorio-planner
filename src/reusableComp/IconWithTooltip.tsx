import { Tooltip } from "@/components/ui/tooltip";
import { formatName } from "@/lib/utils";

const fluids = [
  "crude-oil",
  "heavy-oil",
  "light-oil",
  "lubricant",
  "petroleum-gas",
  "steam",
  "sulfuric-acid",
  "water",
  "advanced-oil-processing",
  "basic-oil-processing",
  "coal-liquefaction",
  "heavy-oil-cracking",
  "light-oil-cracking",
];
const iconSrc = (item: string) => `icons/${item}.png`;
const fluidIconSrc = (item: string) => `icons/fluid/${item}.png`;

export const IconWithTooltip = (props: {
  item: string;
  height?: number;
  customText?: string;
}) => {
  const size = props.height ?? 40;
  const isFluid = fluids.includes(props.item);

  return (
    <Tooltip tooltip={props.customText ?? formatName(props.item)}>
      <div className="w-auto ml-0.5">
        <div className="overflow-hidden" style={{ height: size, width: size }}>
          <img
            className="h-full w-auto max-w-none"
            draggable={false}
            src={isFluid ? fluidIconSrc(props.item) : iconSrc(props.item)}
          />
        </div>
      </div>
    </Tooltip>
  );
};
