export const producerSpeeds = new Map([
  ["assembling-machine-1", 0.5],
  ["assembling-machine-2", 0.75],
  ["assembling-machine-3", 1.25],
  ["stone-furnace", 1],
  ["steel-furnace", 2],
  ["electric-furnace", 2],
  ["other", 1],
]);

export const machinesPerCategory = new Map([
  [
    "crafting",
    ["assembling-machine-1", "assembling-machine-2", "assembling-machine-3"],
  ],
  [
    "advanced-crafting",
    ["assembling-machine-1", "assembling-machine-2", "assembling-machine-3"],
  ],
  ["smelting", ["stone-furnace", "steel-furnace", "electric-furnace"]],
  ["chemistry", ["chemical-plant"]],
  ["oil-processing", ["oil-refinery"]],
]);
