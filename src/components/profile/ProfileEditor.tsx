import React, { useState } from 'react';
import { User, Avatar } from '../../types';
import { Upload, X, Plus, Camera, Edit2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface ProfileEditorProps {
  user: User;
  onSave: (updatedUser: User) => void;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave }) => {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      const newAvatars: Avatar[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        isPrimary: false
      }));
      
      setEditedUser(prev => ({
        ...prev,
        avatars: [...prev.avatars, ...newAvatars]
      }));
    }
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setEditedUser(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        social: {
          ...prev.contactInfo.social,
          [platform]: value
        }
      }
    }));
  };

  const handleDeleteAvatar = (avatarId: string) => {
    setEditedUser(prev => ({
      ...prev,
      avatars: prev.avatars.filter(avatar => avatar.id !== avatarId)
    }));
  };

  const handleSetPrimaryAvatar = (avatarId: string) => {
    setEditedUser(prev => ({
      ...prev,
      avatars: prev.avatars.map(avatar => ({
        ...avatar,
        isPrimary: avatar.id === avatarId
      }))
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Avatar Carousel */}
      <div className="relative">
        <div className="flex items-center justify-center mb-4">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setActiveAvatarIndex(prev => 
              prev === 0 ? editedUser.avatars.length - 1 : prev - 1
            )}
            disabled={editedUser.avatars.length <= 1}
          >
            ←
          </button>
          
          <div className="relative mx-4">
            {editedUser.avatars[activeAvatarIndex] ? (
              <img
                src={editedUser.avatars[activeAvatarIndex].url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Camera size={32} className="text-gray-400" />
              </div>
            )}
            
            <div className="absolute bottom-0 right-0 flex space-x-2">
              <button
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleSetPrimaryAvatar(editedUser.avatars[activeAvatarIndex].id)}
              >
                <Star size={16} className={editedUser.avatars[activeAvatarIndex]?.isPrimary ? 'text-yellow-400' : 'text-gray-400'} />
              </button>
              
              <button
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleDeleteAvatar(editedUser.avatars[activeAvatarIndex].id)}
              >
                <X size={16} className="text-red-500" />
              </button>
            </div>
          </div>
          
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setActiveAvatarIndex(prev => 
              prev === editedUser.avatars.length - 1 ? 0 : prev + 1
            )}
            disabled={editedUser.avatars.length <= 1}
          >
            →
          </button>
        </div>
        
        {/* Avatar Upload */}
        <div
          {...getRootProps()}
          className={`
            mt-4 p-4 border-2 border-dashed rounded-lg text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive
              ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
            }
          `}
        >
          <input {...getInputProps()} />
          <Upload size={24} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragActive
              ? 'Drop your images here'
              : 'Drag & drop images or click to select'
          }
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            name="displayName"
            value={editedUser.displayName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500">@</span>
            <input
              type="text"
              name="username"
              value={editedUser.username}
              onChange={handleInputChange}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={editedUser.bio}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="contactInfo.email"
            value={editedUser.contactInfo.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            name="contactInfo.phone"
            value={editedUser.contactInfo.phone || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Website (optional)
          </label>
          <input
            type="url"
            name="contactInfo.website"
            value={editedUser.contactInfo.website || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Social Media</h3>
        
        {Object.entries(editedUser.contactInfo.social).map(([platform, value]) => (
          <div key={platform}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
              {platform}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">@</span>
              <input
                type="text"
                value={value || ''}
                onChange={(e) => handleSocialChange(platform, e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => onSave(editedUser)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                   transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileEditor;