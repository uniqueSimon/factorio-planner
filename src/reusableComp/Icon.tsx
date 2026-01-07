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

export const Icon = (props: { item: string; className?: string }) => {
  const isFluid = fluids.includes(props.item);
  return (
    <div className={props.className ?? "h-10 w-10 overflow-hidden"}>
      <img
        className="h-full w-auto max-w-none"
        draggable={false}
        src={isFluid ? fluidIconSrc(props.item) : iconSrc(props.item)}
      />
    </div>
  );
};
