import { useState, type ReactNode } from "react";
import { ChevronRight, Folder, FileIcon } from "lucide-react";
import { cn } from "../utils";

export interface TreeNode {
  id: string;
  label: ReactNode;
  children?: TreeNode[];
  icon?: ReactNode;
}

export interface TreeProps {
  data: TreeNode[];
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  selected?: string;
  className?: string;
}

export function Tree({ data, defaultExpanded = [], onSelect, selected, className }: TreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpanded(next);
  };
  return (
    <ul role="tree" className={cn("select-none text-sm", className)}>
      {data.map((n) => (
        <TreeItem key={n.id} node={n} depth={0} expanded={expanded} toggle={toggle} onSelect={onSelect} selected={selected} />
      ))}
    </ul>
  );
}

function TreeItem({
  node, depth, expanded, toggle, onSelect, selected,
}: {
  node: TreeNode; depth: number; expanded: Set<string>; toggle: (id: string) => void;
  onSelect?: (id: string) => void; selected?: string;
}) {
  const isOpen = expanded.has(node.id);
  const hasKids = !!node.children?.length;
  const isSel = selected === node.id;
  return (
    <li role="treeitem" aria-expanded={hasKids ? isOpen : undefined} aria-selected={isSel}>
      <button type="button"
        onClick={() => { if (hasKids) toggle(node.id); onSelect?.(node.id); }}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-foreground hover:bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSel && "bg-subtle font-medium",
        )}
        style={{ paddingLeft: 6 + depth * 14 }}>
        {hasKids ? (
          <ChevronRight className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")} />
        ) : <span className="w-3.5" />}
        {node.icon ?? (hasKids ? <Folder className="size-3.5 text-muted-foreground" /> : <FileIcon className="size-3.5 text-muted-foreground" />)}
        <span className="truncate">{node.label}</span>
      </button>
      {hasKids && isOpen && (
        <ul role="group">
          {node.children!.map((c) => (
            <TreeItem key={c.id} node={c} depth={depth + 1} expanded={expanded} toggle={toggle} onSelect={onSelect} selected={selected} />
          ))}
        </ul>
      )}
    </li>
  );
}
