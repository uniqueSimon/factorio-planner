import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils"; // for conditional classNames
import { Icon } from "@/reusableComp/Icon";

export function ProductCombobox(props: {
  product: string;
  setProduct: (p: string) => void;
  allProducts: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-48 justify-between"
        >
          {props.product ? props.product : "Select product"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-48 p-0">
        <Command>
          <CommandInput placeholder="Search product..." />
          <CommandList>
            <CommandEmpty>No product found.</CommandEmpty>
            <CommandGroup>
              {props.allProducts.map((p) => (
                <CommandItem
                  key={p}
                  onSelect={() => {
                    props.setProduct(p);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon item={p} className="h-5 w-5 overflow-hidden" />
                    {p}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        props.product === p ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
