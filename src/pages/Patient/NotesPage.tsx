import { useState } from 'react'
import { ArrowLeft, Plus, Save, Trash2} from 'lucide-react'
import { ScrollArea } from '@/Components/ui/scroll-area'
import { Button } from '@/Components/ui/button'
import { Textarea } from '@/Components/ui/textarea'
import { Input } from '@/Components/ui/input'
import { useNavigate } from 'react-router-dom'


interface Note {
  id: number
  title: string
  content: string
}

export default function Component() {

  const [title, setTitle] = useState<string>('');
  const [notesText, setNotesText] = useState<string>('');  
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Breathing Notes added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    {
      id: 2,
      title: 'Breathing Notes 1 added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    {
      id: 3,
      title: 'Breathing Notes 2 added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    {
      id: 4,
      title: 'Breathing Notes added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    {
      id: 5,
      title: 'Breathing Notes added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    {
      id: 6,
      title: 'Breathing Notes added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    {
      id: 5,
      title: 'Breathing Notes added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    {
      id: 6,
      title: 'Breathing Notes added to note',
      content: 'This is a sample text which I want to add here just to test. Then I came to next line and if I am still writing some which is not able to see in'
    },
    
  ])

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#D3EDEB]">


      {/* Main Content */}
<div className="min-h-screen bg-[#fff] rounded-2xl mt-24">
  <div className="flex flex-col h-full">
    <header className="flex items-center justify-between px-4 py-3 border-b">
    <button
  className="text-[#02968A] text-lg font-bold sm:mb-4 lg:mb-0 flex items-center space-x-2"
  onClick={() => navigate(-1)}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
  <span>Notes</span>
</button>

      <div className="flex gap-2 "> {/* it include 3 button only plus copy and delete */}
        {
          selectedNote ? (
            <div> 
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedNote(null);
                    setTitle('');
                    setNotesText('');
                  }}
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Save className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-5 w-5" />
                </Button>
            </div>
          ) : (
              <div>
                <Button variant="ghost" size="icon">
                  <Save className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
          )
        }
        
      </div>
    </header>
    <div className="flex flex-1 flex-col md:flex-row ">
      <main className="flex-1 p-4">
        {selectedNote ? (
          <div className="space-y-4  bg-[#F5F5F5] rounded-xl p-4">
            <Input
              placeholder="Enter Title..."
              value={selectedNote.title}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, title: e.target.value })
              }
              className="text-xl font-medium bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
            />
            <Textarea
              placeholder="Write your text here..."
              value={selectedNote.content}
              onChange={(e) =>
                setSelectedNote({ ...selectedNote, content: e.target.value })
              }
              className="min-h-[400px] text-xl  bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
            />
          </div>
        ) : (
          <div className="space-y-4  bg-[#F5F5F5] rounded-xl p-4 ">
            <Input
              placeholder="Enter Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-medium bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
            />
            <Textarea
              placeholder="Write your text here..."
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              className="min-h-[400px] text-xl  bg-[#F5F5F5] w-full border-0 focus-visible:ring-0"
            />
          </div>
        )}
      </main>
      <div className="order-2 md:order-1 md:w-1/3 lg:w-1/4 flex flex-col border-t md:border-t-0 md:border-r">
        <ScrollArea
          className="flex-1 p-4 overflow-y-auto"
          style={{ maxHeight: '90vh' }}
        >
          <div className="grid grid-cols-2 gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 rounded-lg border bg-[#F5F5F5] rounded-xl cursor-pointer hover:bg-accent ${
                  selectedNote?.id === note.id ? 'bg-accent' : ''
                }`}
              >
                <h3 className="font-medium">{note.title}</h3>
                <p className="text-sm line-clamp-3">{note.content}</p>
              </div>
            ))}
            <Button
              className="grid grid-cols-1 place-items-center h-full p-4 bg-white"
              onClick={() => {
                setSelectedNote(null);
                setTitle('');
                setNotesText('');
              }}
            >
              <span className="text-[60px] font-semibold text-[#02968A] leading-none">
                +
              </span>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  </div>
</div>

    </div>
  );
}