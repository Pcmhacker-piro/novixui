import { forwardRef, useCallback, useRef, useState, type DragEvent, type HTMLAttributes } from "react";
import { UploadCloud, X, FileIcon } from "lucide-react";
import { cn } from "../utils";
import { Button } from "./button";

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  value?: File[];
  onChange?: (files: File[]) => void;
  disabled?: boolean;
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  { accept, multiple, maxSize, value, onChange, disabled, className, ...rest }, ref,
) {
  const [internal, setInternal] = useState<File[]>([]);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const files = value ?? internal;

  const setFiles = useCallback((f: File[]) => {
    const valid = maxSize ? f.filter((file) => file.size <= maxSize) : f;
    if (value === undefined) setInternal(valid);
    onChange?.(valid);
  }, [maxSize, onChange, value]);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDrag(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(multiple ? [...files, ...dropped] : dropped.slice(0, 1));
  };

  return (
    <div ref={ref} className={cn("space-y-3", className)} {...rest}>
      <div
        role="button" tabIndex={disabled ? -1 : 0} aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && !disabled) inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={cn(
          "group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface p-8 text-center transition-colors",
          "hover:border-border-strong hover:bg-subtle",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          drag && "border-primary bg-primary/5",
          disabled && "pointer-events-none opacity-50",
        )}>
        <UploadCloud className="size-8 text-muted-foreground group-hover:text-foreground" />
        <div className="text-sm font-medium text-foreground">Drop files or click to upload</div>
        <div className="text-xs text-muted-foreground">
          {accept ? `Accepts ${accept}` : "Any file type"}{maxSize ? ` · Max ${formatBytes(maxSize)}` : ""}
        </div>
        <input ref={inputRef} type="file" accept={accept} multiple={multiple} className="sr-only"
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []);
            setFiles(multiple ? [...files, ...list] : list.slice(0, 1));
            e.currentTarget.value = "";
          }} />
      </div>
      {files.length > 0 && (
        <ul className="space-y-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm">
              <FileIcon className="size-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{f.name}</div>
                <div className="text-xs text-muted-foreground">{formatBytes(f.size)}</div>
              </div>
              <Button variant="ghost" size="icon" aria-label={`Remove ${f.name}`}
                onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
