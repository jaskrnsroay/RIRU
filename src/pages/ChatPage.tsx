import React, { useState } from 'react';
import ChatList from '../components/chat/ChatList';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import CreateRoomModal from '../components/modals/CreateRoomModal';
import SettingsModal from '../components/modals/SettingsModal';
import { useChat } from '../context/ChatContext';
import { ArrowLeft } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { activeChatRoom } = useChat();
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showChatList, setShowChatList] = useState(true);
  
  // Handle mobile view switching
  const isMobileView = window.innerWidth < 768;
  const shouldShowChatList = !isMobileView || (isMobileView && showChatList);
  const shouldShowChat = !isMobileView || (isMobileView && !showChatList);
  
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Chat List */}
      <div 
        className={`${shouldShowChatList ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 border-r border-gray-200 dark:border-gray-800`}
      >
        <ChatList />
      </div>
      
      {/* Chat Area */}
      <div 
        className={`${shouldShowChat ? 'flex' : 'hidden'} md:flex flex-col flex-1`}
      >
        {activeChatRoom ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
              {isMobileView && (
                <button
                  onClick={() => setShowChatList(true)}
                  className="mr-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              )}
              
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    {activeChatRoom.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {activeChatRoom.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activeChatRoom.participants.length} participants
                  </p>
                </div>
              </div>
            </div>
            
            <MessageList />
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                Welcome to Nexus
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Select a chat to start messaging or create a new chat room
              </p>
              <button
                onClick={() => setShowCreateRoomModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Create New Chat Room
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showCreateRoomModal && (
        <CreateRoomModal 
          isOpen={showCreateRoomModal} 
          onClose={() => setShowCreateRoomModal(false)} 
        />
      )}
      
      {showSettingsModal && (
        <SettingsModal 
          isOpen={showSettingsModal} 
          onClose={() => setShowSettingsModal(false)} 
        />
      )}
    </div>
  );
};

export default ChatPage;