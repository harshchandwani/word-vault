import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVocabularyEntrySchema, type InsertVocabularyEntry, type VocabularyEntry } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: VocabularyEntry;
  onSubmit: (data: InsertVocabularyEntry) => Promise<void>;
  isLoading: boolean;
}

export function EntryFormDialog({ open, onOpenChange, entry, onSubmit, isLoading }: EntryFormDialogProps) {
  const form = useForm<InsertVocabularyEntry>({
    resolver: zodResolver(insertVocabularyEntrySchema),
    defaultValues: {
      term: entry?.term || "",
      definition: entry?.definition || "",
      example: entry?.example || "",
    },
  });

  const handleSubmit = async (data: InsertVocabularyEntry) => {
    await onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            {entry ? "Edit Entry" : "Add Entry"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {entry ? "Update your vocabulary entry" : "Add a new word to your collection"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Term</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="input-term"
                      placeholder="Enter the word or phrase"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="definition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Definition</FormLabel>
                  <FormControl>
                    <Textarea
                      data-testid="input-definition"
                      placeholder="Explain what this term means"
                      rows={4}
                      className="resize-vertical"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="example"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Example Sentence</FormLabel>
                  <FormControl>
                    <Textarea
                      data-testid="input-example"
                      placeholder="Use the term in a sentence"
                      rows={3}
                      className="resize-vertical"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                data-testid="button-cancel"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="button-save"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : entry ? "Update Entry" : "Add Entry"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
