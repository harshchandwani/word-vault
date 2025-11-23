import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { VocabularyEntry } from "@shared/schema";

interface DeleteEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: VocabularyEntry | null;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export function DeleteEntryDialog({ open, onOpenChange, entry, onConfirm, isLoading }: DeleteEntryDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
          <AlertDialogDescription className="text-base leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-foreground">"{entry?.term}"</span>? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-cancel-delete" disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-testid="button-confirm-delete"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
