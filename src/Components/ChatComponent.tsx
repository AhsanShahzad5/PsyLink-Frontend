import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { FileText,  Send, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { useSocket } from "@/context/SocketProvider";
import { useRecoilValue } from 'recoil';
import userAtom from '@/atoms/userAtom';

interface Message {
  id: string;
  sender: string;
  senderId: string;
  senderImg?: string;
  content: string;
  timestamp: Date;
  isFile?: boolean;
  fileName?: string;
  fileUrl?: string;
  fileType?: string;
}

interface ChatProps {
  roomId: string | undefined;
}

const ChatComponent: React.FC<ChatProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();
  const user = useRecoilValue(userAtom);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;
    
    const handleIncomingMessage = (msg: Message) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    };
    
    socket.on('chat:message', handleIncomingMessage);
    
    return () => {
      socket.off('chat:message', handleIncomingMessage);
    };
  }, [socket]);

  // Send text message
  const sendMessage = () => {
    if (!messageInput.trim() && !file) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: user?.name || 'Anonymous',
      senderId: user?._id || 'unknown',
      senderImg: user?.profilePicture,
      content: messageInput,
      timestamp: new Date(),
    };
    
    // Add message to local state
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Send message through socket
    socket?.emit('chat:message', {
      message: newMessage,
      roomId
    });
    
    // Clear input
    setMessageInput('');
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Send file message
  const sendFile = () => {
    if (!file) return;
    
    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64File = reader.result as string;
      
      const fileMessage: Message = {
        id: Date.now().toString(),
        sender: user?.name || 'Anonymous',
        senderId: user?._id || 'unknown',
        senderImg: user?.profilePicture,
        content: file.name,
        timestamp: new Date(),
        isFile: true,
        fileName: file.name,
        fileUrl: base64File,
        fileType: file.type
      };
      
      // Add message to local state
      setMessages(prevMessages => [...prevMessages, fileMessage]);
      
      // Send file through socket
      socket?.emit('chat:file', {
        message: fileMessage,
        roomId
      });
      
      // Clear file input
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  };

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (file) {
        sendFile();
      } else {
        sendMessage();
      }
    }
  };

  // Function to get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to render file preview
  const renderFilePreview = (msg: Message) => {
    if (!msg.isFile || !msg.fileUrl) return null;
    
    if (msg.fileType?.startsWith('image/')) {
      return <img src={msg.fileUrl} alt={msg.fileName} className="rounded-lg mb-2 max-w-full max-h-48" />;
    } else {
      return (
        <div className="bg-gray-100 p-3 rounded-lg mb-2 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          <a 
            href={msg.fileUrl} 
            download={msg.fileName}
            className="text-blue-600 hover:underline truncate max-w-[200px]"
          >
            {msg.fileName}
          </a>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex ${msg.senderId === user?._id ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 max-w-[80%]`}>
              <Avatar className="h-8 w-8 flex-shrink-0">
                {msg.senderImg ? (
                  <AvatarImage src={msg.senderImg} alt={msg.sender} />
                ) : (
                  <AvatarFallback>{getInitials(msg.sender)}</AvatarFallback>
                )}
              </Avatar>
              
              <div className={`rounded-lg p-3 ${msg.senderId === user?._id ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                {/* <div className="text-xs text-gray-500 mb-1">{msg.sender}</div> */}
                {msg.isFile ? (
                  renderFilePreview(msg)
                ) : (
                  <p className="text-sm break-words">{msg.content}</p>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {file && (
        <div className="px-4 pb-2">
          <div className="bg-emerald-50 p-2 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-emerald-600" />
              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFile(null)}
              className="h-6 w-6 p-0"
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
          />
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Input 
            placeholder="Write here" 
            className="flex-1 bg-white text-gray-800"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <Button 
            size="icon"
            onClick={file ? sendFile : sendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;