import React from 'react';
import { useChat } from '../../context/ChatContext';
import { useApp } from '../../context/AppContext';
import { Home, Users, Hash, Search, Settings, LogOut, Plus, MessageSquare, Globe, Lock, User } from 'lucide-react';
import Button from '../ui/Button';
import { ChatRoomType } from '../../types';

interface SidebarProps {
  onCreateRoom: () => void;
  onOpenSettings: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCreateRoom, onOpenSettings }) => {
  const { chatRooms, activeChatRoom, selectChatRoom } = useChat();
  const { logout, currentUser, theme } = useApp();
  
  const getChatRoomIcon = (type: ChatRoomType) => {
    switch (type) {
      case ChatRoomType.Direct:
        return <User size={18} />;
      case ChatRoomType.Group:
        return <Users size={18} />;
      case ChatRoomType.Anonymous:
        return <Lock size={18} />;
      case ChatRoomType.Topic:
        return <Hash size={18} />;
      default:
        return <MessageSquare size={18} />;
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 w-64 transition-all duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Nexus</h1>
          </div>
          <div className="relative">
            <button 
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              onClick={onOpenSettings}
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full py-2 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-500 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Chat Rooms</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateRoom}
              leftIcon={<Plus size={14} />}
              className="!p-1"
            >
              New
            </Button>
          </div>
          
          <div className="space-y-1">
            {chatRooms.map(room => (
              <button
                key={room.id}
                onClick={() => selectChatRoom(room.id)}
                className={`
                  w-full flex items-center px-3 py-2 rounded-lg transition-colors duration-200
                  ${activeChatRoom?.id === room.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-300'}
                `}
              >
                <div className={`
                  p-2 rounded-lg mr-3 
                  ${activeChatRoom?.id === room.id
                    ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                `}>
                  {getChatRoomIcon(room.type)}
                </div>
                <div className="flex-1 truncate text-left">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-xs opacity-70 truncate">{room.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {currentUser && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.username}
                  className="w-10 h-10 rounded-full bg-gray-200"
                />
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                  currentUser.status === 'available' ? 'bg-green-500' :
                  currentUser.status === 'away' ? 'bg-yellow-500' :
                  currentUser.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                }`}></div>
              </div>
              <div className="truncate">
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {currentUser.username}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.status}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 !p-1"
            >
              <LogOut size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;