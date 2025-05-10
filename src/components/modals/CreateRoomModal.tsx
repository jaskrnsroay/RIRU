import React, { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import Button from '../ui/Button';
import { Users, Hash, Lock, X, Tag, Check } from 'lucide-react';
import { ChatRoomType } from '../../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { createChatRoom, isLoading } = useChat();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChatRoomType>(ChatRoomType.Group);
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  if (!isOpen) return null;
  
  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    try {
      await createChatRoom(name, type, tags);
      onClose();
      setName('');
      setDescription('');
      setType(ChatRoomType.Group);
      setTags([]);
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in" 
           onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Chat Room</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-500 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="room-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="room-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this room about?"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-500 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200 resize-none"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType(ChatRoomType.Group)}
                    className={`flex items-center px-4 py-3 rounded-lg border ${
                      type === ChatRoomType.Group
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Users className="mr-3" size={20} />
                    <div className="text-left">
                      <div className="font-medium">Group</div>
                      <div className="text-xs opacity-70">For teams & friends</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setType(ChatRoomType.Topic)}
                    className={`flex items-center px-4 py-3 rounded-lg border ${
                      type === ChatRoomType.Topic
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Hash className="mr-3" size={20} />
                    <div className="text-left">
                      <div className="font-medium">Topic</div>
                      <div className="text-xs opacity-70">Interest-based</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setType(ChatRoomType.Anonymous)}
                    className={`flex items-center px-4 py-3 rounded-lg border ${
                      type === ChatRoomType.Anonymous
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Lock className="mr-3" size={20} />
                    <div className="text-left">
                      <div className="font-medium">Anonymous</div>
                      <div className="text-xs opacity-70">Private & secure</div>
                    </div>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex items-center mb-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Tag size={16} />
                    </div>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add tags (press Enter)"
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:border-indigo-500 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none transition-colors duration-200"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddTag}
                    leftIcon={<Check size={16} />}
                    className="ml-2"
                  >
                    Add
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(t => (
                      <div 
                        key={t} 
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(t)}
                          className="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!name.trim()}
              >
                Create Room
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;