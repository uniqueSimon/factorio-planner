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
  ["crafting-with-fluid", ["assembling-machine-2", "assembling-machine-3"]],
  ["rocket-building", ["rocket-silo"]],
  ["smelting", ["stone-furnace", "steel-furnace", "electric-furnace"]],
  ["chemistry", ["chemical-plant"]],
  ["oil-processing", ["oil-refinery"]],
  ["centrifuging", ["centrifuge"]],
]);

// Number of module slots per machine
export const moduleSlots = new Map([
  ["assembling-machine-1", 0],
  ["assembling-machine-2", 2],
  ["assembling-machine-3", 4],
  ["stone-furnace", 0],
  ["steel-furnace", 0],
  ["electric-furnace", 2],
  ["chemical-plant", 3],
  ["oil-refinery", 3],
  ["centrifuge", 2],
]);

// Productivity bonus per productivity module (10% each)
export const productivityModuleBonus = 0.1;

// Speed penalty per productivity module (15% slower each)
export const productivityModuleSpeedPenalty = 0.15;
