import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import CreateRoomModal from '../components/modals/CreateRoomModal';
import SettingsModal from '../components/modals/SettingsModal';
import { useChat } from '../context/ChatContext';
import { Users, ArrowLeft } from 'lucide-react';

const ChatPage: React.FC = () => {
  const { activeChatRoom } = useChat();
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      {/* Mobile sidebar control for small screens */}
      <div className={`${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out transform fixed inset-y-0 left-0 z-30 w-64 md:relative md:translate-x-0`}>
        <Sidebar 
          onCreateRoom={() => setShowCreateRoomModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      </div>
      
      {/* Toggle sidebar button for mobile */}
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className="fixed bottom-4 left-4 z-40 p-3 rounded-full bg-indigo-600 text-white shadow-lg md:hidden"
      >
        {sidebarVisible ? <ArrowLeft size={20} /> : <Users size={20} />}
      </button>
      
      {/* Main chat area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Chat header */}
        {activeChatRoom && (
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            {/* Mobile back button */}
            <button
              className="mr-3 md:hidden"
              onClick={() => setSidebarVisible(true)}
            >
              <ArrowLeft size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg mr-3">
                {activeChatRoom.type === 'group' ? (
                  <Users size={20} className="text-gray-600 dark:text-gray-400" />
                ) : (
                  <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {activeChatRoom.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-medium text-gray-900 dark:text-white">{activeChatRoom.name}</h2>
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <span className="mr-2">{activeChatRoom.participants.length} participants</span>
                  {activeChatRoom.isModerated && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-1.5 py-0.5 rounded">
                      Moderated
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Chat content */}
        {activeChatRoom ? (
          <>
            <MessageList />
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 dark:text-gray-400">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Users size={40} className="text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No chat selected</h2>
            <p className="max-w-md mb-6">Select a chat from the sidebar or create a new chat room to start messaging</p>
            <button
              onClick={() => setShowCreateRoomModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors duration-200"
            >
              Create New Chat Room
            </button>
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