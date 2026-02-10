---
applyTo: '**'
---

# Factorio Factory Planner - Project Instructions

## Project Overview

This is a React application for planning factories in the game Factorio. The app:
- Calculates production ratios based on recipes and desired output rates
- Displays an interactive production tree showing all required inputs
- Stores multiple factory plans in browser local storage
- Provides a visual interface for managing complex production chains

## Architecture

### Main React App (`/src`)

**Core Technologies:**
- React with TypeScript
- Vite as build tool
- Tailwind CSS + shadcn/ui components
- Local storage for data persistence

**Key Components:**
- `ProductionTree/`: Interactive tree visualization of production chains
- `FactoryPlanner/`: Detailed view with production rates and calculations
- `localStorage/`: Import/export functionality for saving/loading plans
- `reusableComp/`: Shared components like Icon, ProductCombobox, etc.

**Important Contexts:**
- `TreeSettingsContext`: Manages settings like module effects, beacons, productivity bonuses
- `DirtyStateContext`: Tracks unsaved changes

### Game Data Parser (`/parseGameData`)

A separate Node.js project that processes Factorio game data exports:
- **Input**: `items.json` and `recipes.json` (direct game exports from Factorio)
- **Output**: Formatted data files for the React app (`src/gameData/`)
- **Purpose**: Convert raw game data into optimized structures for the app

## Coding Guidelines

### General Principles

1. **Type Safety**: Use TypeScript strictly. Define clear interfaces in `types.ts`
2. **Immutability**: Prefer immutable data patterns, especially for tree structures
3. **Component Composition**: Build small, focused, reusable components
4. **Performance**: Memoize expensive calculations (production rates, tree traversals)

### Factorio-Specific Concepts

**Recipes:**
- Each recipe has inputs, outputs, crafting time, and machine type
- May have multiple outputs (e.g., oil refining produces multiple fluids)
- Some recipes can't be used (alt recipes, disabled technologies)

**Production Rates:**
- Calculated in items/second or items/minute
- Affected by: machine speed, modules, beacons, productivity bonuses
- Tree nodes accumulate rates from all child dependencies

**Compression:**
- Option to compress intermediate products (e.g., iron plates → gears)
- Helps simplify complex production chains

### File Naming

- React components: PascalCase (e.g., `ProductionTree.tsx`)
- Utilities/operations: camelCase (e.g., `buildTree.ts`, `calculateRootRate.ts`)
- Context files: PascalCase with "Context" suffix (e.g., `TreeSettingsContext.tsx`)

### State Management

- Use React hooks (`useState`, `useReducer`) for component state
- Context API for shared state (tree settings, dirty state)
- Local storage hooks in `reusableComp/useLocalStorage.ts`
- Avoid prop drilling - use contexts for deeply nested data

### Tree Operations

All tree manipulation functions are in `src/components/productionTree/treeOperations/`:
- `buildTree.ts`: Create initial tree structure
- `selectRecipe.ts`: Choose recipe for a node
- `updateTreeRates.ts`: Recalculate production rates
- `removeDisconnectedBranches.ts`: Clean up orphaned nodes
- Always maintain tree integrity (no orphans, consistent rates)

### Icons and Game Assets

- Icons stored in `public/icons/` by category
- Use `<Icon />` component with item/recipe ID
- Format: `<Icon id="iron-plate" type="item" />`

### Data Structure Conventions

**TreeNode structure:**
```typescript
{
  id: string;          // Unique node identifier
  product: string;     // Item/fluid being produced
  recipe?: string;     // Recipe used (if selected)
  rate: number;        // Target production rate
  children: TreeNode[]; // Dependencies
  // ... other properties
}
```

**Settings:**
- Module effects (speed, productivity)
- Beacon configurations
- Machine tier preferences
- Recipe compression options

### Adding New Features

When adding new features:
1. Check if game data needs updates (parseGameData project)
2. Update TypeScript types first
3. Implement tree operations as pure functions
4. Add UI components using shadcn/ui patterns
5. Update local storage schema version if data structure changes
6. Test with complex production chains (circuits, oil processing)

### Game Data Updates

When Factorio updates:
1. Export new `items.json` and `recipes.json` from game
2. Place in `parseGameData/src/`
3. Run parser: `cd parseGameData && npm run parse`
4. Copy output to `src/gameData/`
5. Test app with new data

### Common Patterns

**Loading Icons:**
```typescript
import { Icon } from '@/reusableComp/Icon';
<Icon id="iron-plate" type="item" />
```

**Using Contexts:**
```typescript
const { treeSettings, updateSettings } = useTreeSettings();
```

**Local Storage:**
```typescript
const [trees, setTrees] = useLocalStorage('factoryTrees', []);
```

**Number Formatting:**
- Use consistent decimal places for rates
- Support both items/second and items/minute
- Format large numbers with appropriate units

### Testing Considerations

- Test with simple chains (iron → gears → science)
- Test with complex chains (circuits, oil processing)
- Test edge cases (cyclic dependencies, multiple outputs)
- Verify rate calculations at each tree level
- Check local storage persistence

## File Organization

- Keep tree operations separate from UI components
- Group related UI components in subdirectories
- Place shared utilities in `lib/`
- Keep game data separate from code

## Performance Considerations

- Memoize expensive tree calculations
- Use React.memo for pure components
- Lazy load icons/assets when possible
- Debounce user inputs that trigger recalculations
- Keep local storage updates efficient

## Notes

- This is a single-user, client-side only application
- All data persistence uses browser local storage
- Game balance and recipes follow Factorio vanilla (may support mods later)
- Focus on usability for complex factory planning scenarios