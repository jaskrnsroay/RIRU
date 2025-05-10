import React, { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useApp } from '../../context/AppContext';
import { Message } from '../../types';
import { Clock, Lock, Trash2, RotateCcw, Globe } from 'lucide-react';

const MessageItem: React.FC<{ message: Message, isCurrentUser: boolean }> = ({ message, isCurrentUser }) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  // Add a pulse animation for self-destructing messages
  useEffect(() => {
    if (message.selfDestruct && messageContainerRef.current) {
      const pulse = () => {
        messageContainerRef.current?.classList.add('pulse');
        setTimeout(() => {
          messageContainerRef.current?.classList.remove('pulse');
        }, 1000);
      };
      
      const intervalId = setInterval(pulse, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [message.selfDestruct]);
  
  return (
    <div 
      className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      ref={messageContainerRef}
    >
      <div 
        className={`
          max-w-[80%] px-4 py-2 rounded-lg relative
          ${isCurrentUser 
            ? 'bg-indigo-600 text-white rounded-tr-none' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'}
          ${message.isDeleted ? 'opacity-60' : ''}
          ${message.selfDestruct ? 'border border-red-400 dark:border-red-600' : ''}
        `}
      >
        {message.isEncrypted && (
          <div className="absolute -top-3 left-0">
            <div className="flex items-center text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
              <Lock size={10} className="mr-1" />
              Encrypted
            </div>
          </div>
        )}
        
        {!message.isDeleted ? (
          <>
            <p>{message.content}</p>
            
            <div className={`
              flex items-center mt-1 text-xs
              ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500 dark:text-gray-400'}
            `}>
              <div className="flex items-center">
                <Clock size={10} className="mr-1" />
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              {message.isTranslated && (
                <div className="ml-2 flex items-center">
                  <Globe size={10} className="mr-1" />
                  Translated
                </div>
              )}
              
              {message.selfDestruct && (
                <div className="ml-2 flex items-center text-red-400">
                  <Trash2 size={10} className="mr-1" />
                  Self-Destruct
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center text-gray-500 dark:text-gray-400 italic">
            <RotateCcw size={12} className="mr-2" />
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};

const MessageList: React.FC = () => {
  const { messages } = useChat();
  const { currentUser } = useApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <style jsx>{`
        .pulse {
          animation: pulse-animation 1s infinite;
        }
        
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
        }
      `}</style>
      
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full">
            <MessageList size={24} />
          </div>
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Start a conversation by sending a message</p>
        </div>
      ) : (
        messages.map(message => (
          <MessageItem 
            key={message.id}
            message={message}
            isCurrentUser={currentUser?.id === message.senderId}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;