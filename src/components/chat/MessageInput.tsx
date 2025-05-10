import React, { useState, useRef } from 'react';
import { Smile, Paperclip, Mic, Send, Bold, Italic, Underline, Code, Image, Video, File } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import WaveSurfer from 'wavesurfer.js';

interface MessageInputProps {
  onSend: (content: string, attachments: File[]) => void;
  onStartTyping: () => void;
  onStopTyping: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onStartTyping,
  onStopTyping
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formatting, setFormatting] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    onStartTyping();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(onStopTyping, 1000);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleAttachmentClick = (type: 'image' | 'video' | 'file') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'image' 
        ? 'image/*' 
        : type === 'video'
          ? 'video/*'
          : '*/*';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Initialize WaveSurfer
      wavesurferRef.current = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#4F46E5',
        progressColor: '#818CF8',
        cursorWidth: 0,
        barWidth: 2,
        barGap: 1,
        height: 30
      });
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        // Handle the recorded audio
        setAttachments(prev => [...prev, new File([audioBlob], 'voice-message.wav')]);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    }
  };

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSend(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const toggleFormatting = (type: keyof typeof formatting) => {
    setFormatting(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
      {/* Formatting Toolbar */}
      <div className="flex items-center space-x-2 mb-2">
        <button
          onClick={() => toggleFormatting('bold')}
          className={`p-1.5 rounded-lg transition-colors duration-200 ${
            formatting.bold
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Bold size={18} />
        </button>
        
        <button
          onClick={() => toggleFormatting('italic')}
          className={`p-1.5 rounded-lg transition-colors duration-200 ${
            formatting.italic
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Italic size={18} />
        </button>
        
        <button
          onClick={() => toggleFormatting('underline')}
          className={`p-1.5 rounded-lg transition-colors duration-200 ${
            formatting.underline
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Underline size={18} />
        </button>
        
        <button
          onClick={() => toggleFormatting('code')}
          className={`p-1.5 rounded-lg transition-colors duration-200 ${
            formatting.code
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Code size={18} />
        </button>
        
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />
        
        <button
          onClick={() => handleAttachmentClick('image')}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <Image size={18} />
        </button>
        
        <button
          onClick={() => handleAttachmentClick('video')}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <Video size={18} />
        </button>
        
        <button
          onClick={() => handleAttachmentClick('file')}
          className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <File size={18} />
        </button>
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="relative group bg-gray-100 dark:bg-gray-800 rounded-lg p-2 flex items-center"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                {file.name}
              </span>
              <button
                onClick={() => handleRemoveAttachment(index)}
                className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X size={14} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Voice Recording Visualization */}
      {isRecording && (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div id="waveform" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-red-500 animate-pulse">Recording...</span>
            <button
              onClick={stopRecording}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Stop Recording
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="flex items-end space-x-2">
        <div className="relative flex-1">
          <textarea
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent 
                     focus:border-indigo-500 rounded-lg resize-none max-h-32
                     text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            style={{
              minHeight: '44px',
              fontWeight: formatting.bold ? 'bold' : 'normal',
              fontStyle: formatting.italic ? 'italic' : 'normal',
              textDecoration: formatting.underline ? 'underline' : 'none',
              fontFamily: formatting.code ? 'monospace' : 'inherit'
            }}
            rows={1}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center space-x-1">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Smile size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          {showEmojiPicker && (
            <div className="absolute bottom-full mb-2">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
              />
            </div>
          )}
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileChange}
        />
        
        {message.trim() || attachments.length > 0 ? (
          <button
            onClick={handleSend}
            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
          >
            <Send size={20} />
          </button>
        ) : (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-colors duration-200 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Mic size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageInput;