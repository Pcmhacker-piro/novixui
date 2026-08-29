import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";
import { cn } from "../utils";

export const Menubar = forwardRef<
  ElementRef<typeof MenubarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root ref={ref}
    className={cn("flex h-10 items-center gap-1 rounded-lg border border-border bg-card p-1 shadow-sm", className)}
    {...props} />
));
Menubar.displayName = "Menubar";

export const MenubarMenu: React.FC<MenubarPrimitive.MenubarMenuProps> = MenubarPrimitive.Menu;
export const MenubarGroup: typeof MenubarPrimitive.Group = MenubarPrimitive.Group;
export const MenubarPortal: typeof MenubarPrimitive.Portal = MenubarPrimitive.Portal;
export const MenubarSub: typeof MenubarPrimitive.Sub = MenubarPrimitive.Sub;
export const MenubarRadioGroup: typeof MenubarPrimitive.RadioGroup = MenubarPrimitive.RadioGroup;

const itemBase =
  "relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-subtle";

export const MenubarTrigger = forwardRef<
  ElementRef<typeof MenubarPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger ref={ref}
    className={cn("flex cursor-default select-none items-center rounded-md px-3 py-1.5 text-sm font-medium outline-none focus:bg-subtle data-[state=open]:bg-subtle", className)}
    {...props} />
));
MenubarTrigger.displayName = "MenubarTrigger";

export const MenubarSubTrigger = forwardRef<
  ElementRef<typeof MenubarPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger ref={ref} className={cn(itemBase, className)} {...props}>
    {children}
    <ChevronRight className="ml-auto size-4" />
  </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = "MenubarSubTrigger";

export const MenubarSubContent = forwardRef<
  ElementRef<typeof MenubarPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent ref={ref}
    className={cn("z-50 min-w-40 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg", className)}
    {...props} />
));
MenubarSubContent.displayName = "MenubarSubContent";

export const MenubarContent = forwardRef<
  ElementRef<typeof MenubarPrimitive.Content>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <MenubarPrimitive.Portal>
    <MenubarPrimitive.Content ref={ref} align={align} sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-48 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95",
        className,
      )}
      {...props} />
  </MenubarPrimitive.Portal>
));
MenubarContent.displayName = "MenubarContent";

export const MenubarItem = forwardRef<
  ElementRef<typeof MenubarPrimitive.Item>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item ref={ref} className={cn(itemBase, inset && "pl-8", className)} {...props} />
));
MenubarItem.displayName = "MenubarItem";

export const MenubarCheckboxItem = forwardRef<
  ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem ref={ref} checked={checked} className={cn(itemBase, "pl-8", className)} {...props}>
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <MenubarPrimitive.ItemIndicator><Check className="size-4" /></MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

export const MenubarRadioItem = forwardRef<
  ElementRef<typeof MenubarPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem ref={ref} className={cn(itemBase, "pl-8", className)} {...props}>
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <MenubarPrimitive.ItemIndicator><Circle className="size-2 fill-current" /></MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = "MenubarRadioItem";

export const MenubarSeparator = forwardRef<
  ElementRef<typeof MenubarPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />
));
MenubarSeparator.displayName = "MenubarSeparator";
