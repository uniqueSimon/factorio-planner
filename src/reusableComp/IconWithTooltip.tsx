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
    <div className="group relative z-50 overflow-visible">
      <div className="w-auto ml-0.5">
        <div className="overflow-hidden" style={{ height: size, width: size }}>
          <img
            className="h-full w-auto max-w-none"
            draggable={false}
            src={isFluid ? fluidIconSrc(props.item) : iconSrc(props.item)}
          />
        </div>
      </div>
      <div className="absolute left-1/2 bottom-full mb-2 w-max -translate-x-1/2 scale-0 transform rounded-lg bg-gray-800 p-2 text-sm text-white opacity-0 shadow-lg transition-all group-hover:scale-100 group-hover:opacity-100 z-50">
        {props.customText ?? props.item}
      </div>
    </div>
  );
};
