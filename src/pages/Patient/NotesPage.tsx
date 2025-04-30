import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Input } from '@/Components/ui/input';
import { useNavigate } from 'react-router-dom';
import userAtom from '../../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog';

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function Component() {
  const [title, setTitle] = useState<string>('');
  const [notesText, setNotesText] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const patientId = user._id;
  
  // Add loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // Add delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Fetch notes from the server
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/patient/notes/getallnotes/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [patientId]);

  // Handle saving a note (create or edit)
  const saveNote = async () => {
    setIsSaving(true);
    if (selectedNote) {
      // Edit existing note
      try {
        const updatedNote = {
          noteId: selectedNote._id,
          title: selectedNote.title,
          content: selectedNote.content,
        };
        
        const response = await fetch('http://localhost:8000/api/patient/notes/editNotes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedNote),
        });
        if (response.ok) {
          console.log('Note updated');
          await fetchNotes(); // Re-fetch notes to sync with server changes
          resetForm();
        }
      } catch (error) {
        console.error('Error editing note:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Create new note
      try {
        const newNote = { patientId, title, content: notesText };
        const response = await fetch('http://localhost:8000/api/patient/notes/addNotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNote),
        });
        if (response.ok) {
          console.log('Note created');
          await fetchNotes(); // Re-fetch notes to sync with server changes
          resetForm();
        }
      } catch (error) {
        console.error('Error creating note:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Show delete confirmation dialog
  const confirmDelete = (id: string) => {
    setNoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deleteNote = async (id: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/patient/notes/deleteNotes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, noteId: id }),
      });

      if (response.ok) {
        console.log('Note deleted');
        await fetchNotes(); // Refresh notes after deletion
        if (selectedNote?._id === id) {
          resetForm();
        }
      } else {
        const errorData = await response.json();
        console.error('Error deleting note:', errorData.message);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedNote(null);
    setTitle('');
    setNotesText('');
  };

  return (
    <div className="min-h-screen bg-[#D3EDEB] mx-10">
      <div className="min-h-screen bg-[#fff] rounded-2xl mt-24">
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between px-4 py-3 border-b">
            <button
              className="text-[#02968A] text-lg font-bold sm:mb-4 lg:mb-0 flex items-center space-x-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Notes</span>
            </button>
            <div className="flex gap-2">
              {selectedNote ? (
                <>
                  <Button variant="ghost" size="icon" onClick={resetForm}>
                    <Plus className="h-5 w-5 text-primary" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={saveNote} 
                    disabled={isSaving}
                  >
                    <Save className="h-5 w-5 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => selectedNote && confirmDelete(selectedNote._id)}
                    disabled={isSaving}
                  >
                    <Trash2 className="h-5 w-5 text-primary" />
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={saveNote}
                  disabled={isSaving}
                >
                  <Save className="h-5 w-5 text-primary" />
                </Button>
              )}
            </div>
          </header>
          <div className="flex flex-1 flex-col md:flex-row">
            <main className="flex-1 p-4">
              {selectedNote ? (
                <div className="space-y-4 bg-[#F5F5F5] rounded-xl p-4">
                  <Input
                    placeholder="Enter Title..."
                    value={selectedNote.title}
                    onChange={(e) =>
                      setSelectedNote({ ...selectedNote, title: e.target.value })
                    }
                    className="text-xl font-medium bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
                    disabled={isSaving}
                  />
                  <Textarea
                    placeholder="Write your text here..."
                    value={selectedNote.content}
                    onChange={(e) =>
                      setSelectedNote({ ...selectedNote, content: e.target.value })
                    }
                    className="min-h-[400px] text-xl bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
                    disabled={isSaving}
                  />
                </div>
              ) : (
                <div className="space-y-4 bg-[#F5F5F5] rounded-xl p-4">
                  <Input
                    placeholder="Enter Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-medium bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
                    disabled={isSaving}
                  />
                  <Textarea
                    placeholder="Write your text here..."
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    className="min-h-[400px] text-xl bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
                    disabled={isSaving}
                  />
                </div>
              )}
            </main>
            <div className="order-2 md:order-1 md:w-1/3 lg:w-1/4 flex flex-col border-t md:border-t-0 md:border-r">
              <ScrollArea
                className="flex-1 p-4 overflow-y-auto"
                style={{ maxHeight: '90vh' }}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <p>Loading notes...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {notes.map((note) => (
                      <div
                        key={note._id}
                        onClick={() => setSelectedNote(note)}
                        className={`p-4 rounded-lg border bg-[#F5F5F5] cursor-pointer hover:bg-accent ${
                          selectedNote?._id === note._id ? 'border-[#02968A] border-2' : ''
                        }`}
                      >
                        <h3 className="font-medium">{note.title}</h3>
                        <p className="text-sm line-clamp-3">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (noteToDelete) {
                  deleteNote(noteToDelete);
                  setDeleteDialogOpen(false);
                  setNoteToDelete(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Global loading overlay for saving operations */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p>Saving changes...</p>
          </div>
        </div>
      )}
    </div>
  );
}