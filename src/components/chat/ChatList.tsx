import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Menu, Users, Radio, Newspaper, Settings, Check, CheckCheck } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { ChatRoom, ChatRoomType } from '../../types';

const ChatList: React.FC = () => {
  const { chatRooms, selectChatRoom, activeChatRoom } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'personal' | 'groups' | 'channels'>('all');
  
  const filteredRooms = chatRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
      (filter === 'personal' && room.type === ChatRoomType.Direct) ||
      (filter === 'groups' && room.type === ChatRoomType.Group) ||
      (filter === 'channels' && room.type === ChatRoomType.Topic);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Menu size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Nexus</h1>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Settings size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages, contacts, or groups"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full 
                       text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                     ${filter === 'all' 
                       ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                       : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('personal')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                     ${filter === 'personal'
                       ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                       : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            Personal
          </button>
          <button
            onClick={() => setFilter('groups')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                     ${filter === 'groups'
                       ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                       : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            Groups
          </button>
          <button
            onClick={() => setFilter('channels')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
                     ${filter === 'channels'
                       ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                       : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}
          >
            Channels
          </button>
        </div>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredRooms.map((room) => (
            <ChatListItem 
              key={room.id} 
              room={room}
              isActive={activeChatRoom?.id === room.id}
              onSelect={() => selectChatRoom(room.id)}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-around p-2">
          <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Users size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Radio size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Newspaper size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ChatListItemProps {
  room: ChatRoom;
  isActive: boolean;
  onSelect: () => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ room, isActive, onSelect }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const getMessagePreview = () => {
    const lastMessage = room.messages[room.messages.length - 1];
    if (!lastMessage) return 'No messages yet';
    return lastMessage.content.length > 50 
      ? `${lastMessage.content.substring(0, 50)}...` 
      : lastMessage.content;
  };
  
  const getMessageTime = () => {
    const lastMessage = room.messages[room.messages.length - 1];
    if (!lastMessage) return '';
    
    const date = new Date(lastMessage.timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    return isToday 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  const getStatusIcon = () => {
    const lastMessage = room.messages[room.messages.length - 1];
    if (!lastMessage) return null;
    
    if (lastMessage.isDeleted) return null;
    return lastMessage.isEncrypted ? (
      <CheckCheck size={16} className="text-green-500" />
    ) : (
      <Check size={16} className="text-gray-400" />
    );
  };
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
      className={`flex items-center p-3 cursor-pointer transition-colors duration-200
                ${isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          {room.type === ChatRoomType.Group ? (
            <Users size={20} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
              {room.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        {room.isModerated && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        )}
      </div>
      
      <div className="flex-1 min-w-0 ml-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {room.name}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
            {getMessageTime()}
          </span>
        </div>
        
        <div className="flex items-center mt-1">
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
            {getMessagePreview()}
          </p>
          <div className="flex items-center ml-2">
            {getStatusIcon()}
            {room.messages.some(m => !m.isDeleted) && (
              <span className="ml-2 px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                {room.messages.filter(m => !m.isDeleted).length}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatList;