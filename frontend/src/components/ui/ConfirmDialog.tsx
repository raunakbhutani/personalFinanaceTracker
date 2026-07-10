import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  confirmLabel?: string;
  cancelLabel?: string;
}

// Reusable confirm dialog used across the app instead of `window.confirm`.
// Keeps the UI consistent and accessible, and provides a nicer UX.
export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  onConfirm,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-8 gap-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          {description && <DialogDescription className="text-base">{description}</DialogDescription>}
        </DialogHeader>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="px-6 py-2 text-base">
            {cancelLabel}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} className="px-6 py-2 text-base">
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
