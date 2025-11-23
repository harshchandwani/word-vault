import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { EntryFormDialog } from "@/components/entry-form-dialog";
import { DeleteEntryDialog } from "@/components/delete-entry-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Edit, Trash2, BookOpen } from "lucide-react";
import type { VocabularyEntry, InsertVocabularyEntry } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<VocabularyEntry | null>(null);

  const { data: entries, isLoading } = useQuery<VocabularyEntry[]>({
    queryKey: ['/api/entries'],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertVocabularyEntry) => {
      return await apiRequest<VocabularyEntry>("POST", "/api/entries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      setAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Entry added to your collection",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add entry",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertVocabularyEntry }) => {
      return await apiRequest<VocabularyEntry>("PATCH", `/api/entries/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      setEditDialogOpen(false);
      setSelectedEntry(null);
      toast({
        title: "Success",
        description: "Entry updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update entry",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/entries/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/entries'] });
      setDeleteDialogOpen(false);
      setSelectedEntry(null);
      toast({
        title: "Success",
        description: "Entry deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete entry",
      });
    },
  });

  const handleAddEntry = async (data: InsertVocabularyEntry) => {
    await createMutation.mutateAsync(data);
  };

  const handleEditEntry = async (data: InsertVocabularyEntry) => {
    if (!selectedEntry) return;
    await updateMutation.mutateAsync({ id: selectedEntry.id, data });
  };

  const handleDeleteEntry = async () => {
    if (!selectedEntry) return;
    await deleteMutation.mutateAsync(selectedEntry.id);
  };

  const openEditDialog = (entry: VocabularyEntry) => {
    setSelectedEntry(entry);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (entry: VocabularyEntry) => {
    setSelectedEntry(entry);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onAddEntry={() => setAddDialogOpen(true)} />
      
      <main className="mt-16 max-w-4xl mx-auto py-8 px-6 lg:px-8">
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-1/3 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !entries || entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-medium text-foreground mb-3">No vocabulary entries yet</h2>
            <p className="text-base text-muted-foreground mb-6 max-w-md leading-relaxed">
              Click "Add Entry" to start building your collection
            </p>
            <Button
              data-testid="button-add-first-entry"
              onClick={() => setAddDialogOpen(true)}
            >
              Add Your First Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <Card key={entry.id} data-testid={`card-entry-${entry.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-xl font-semibold text-foreground" data-testid={`text-term-${entry.id}`}>
                      {entry.term}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        data-testid={`button-edit-${entry.id}`}
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        data-testid={`button-delete-${entry.id}`}
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(entry)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-base text-foreground leading-relaxed mb-4" data-testid={`text-definition-${entry.id}`}>
                    {entry.definition}
                  </p>
                  <p className="text-base text-muted-foreground italic leading-relaxed" data-testid={`text-example-${entry.id}`}>
                    "{entry.example}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <EntryFormDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddEntry}
        isLoading={createMutation.isPending}
      />

      <EntryFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        entry={selectedEntry || undefined}
        onSubmit={handleEditEntry}
        isLoading={updateMutation.isPending}
      />

      <DeleteEntryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        entry={selectedEntry}
        onConfirm={handleDeleteEntry}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
