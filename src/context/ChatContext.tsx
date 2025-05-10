import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatRoom, Message, ChatRoomType } from '../types';
import { useApp } from './AppContext';

interface ChatContextType {
  chatRooms: ChatRoom[];
  activeChatRoom: ChatRoom | null;
  messages: Message[];
  isLoading: boolean;
  createChatRoom: (name: string, type: ChatRoomType, tags?: string[]) => Promise<ChatRoom>;
  sendMessage: (content: string, roomId: string, selfDestruct?: boolean, selfDestructTime?: number) => Promise<void>;
  joinChatRoom: (roomId: string) => Promise<void>;
  leaveChatRoom: (roomId: string) => Promise<void>;
  selectChatRoom: (roomId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock fetch chat rooms when user is authenticated
  useEffect(() => {
    if (currentUser) {
      fetchChatRooms();
    } else {
      setChatRooms([]);
      setActiveChatRoom(null);
      setMessages([]);
    }
  }, [currentUser]);

  // Mock fetch messages when active chat room changes
  useEffect(() => {
    if (activeChatRoom) {
      fetchMessages(activeChatRoom.id);
    } else {
      setMessages([]);
    }
  }, [activeChatRoom]);

  const fetchChatRooms = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock chat rooms data
      const mockChatRooms: ChatRoom[] = [
        {
          id: '1',
          name: 'General Chat',
          description: 'Public chat room for everyone',
          type: ChatRoomType.Group,
          participants: ['1', '2', '3'],
          tags: ['general', 'public'],
          createdAt: new Date(),
          isModerated: true,
          messages: []
        },
        {
          id: '2',
          name: 'Tech Enthusiasts',
          description: 'Chat about tech, programming, and gadgets',
          type: ChatRoomType.Topic,
          participants: ['1', '4', '5'],
          tags: ['tech', 'programming', 'gadgets'],
          createdAt: new Date(),
          isModerated: true,
          messages: []
        },
        {
          id: '3',
          name: 'Anonymous Room #1042',
          description: 'Anonymous discussion room',
          type: ChatRoomType.Anonymous,
          participants: [],
          tags: ['anonymous', 'private'],
          createdAt: new Date(),
          isModerated: false,
          messages: []
        }
      ];
      
      setChatRooms(mockChatRooms);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: '101',
          senderId: '2',
          content: 'Hello everyone! Welcome to the chat!',
          timestamp: new Date(Date.now() - 3600000 * 2),
          isEncrypted: true,
          selfDestruct: false,
          isTranslated: false,
          isDeleted: false
        },
        {
          id: '102',
          senderId: '3',
          content: 'Thanks for having us, excited to be here!',
          timestamp: new Date(Date.now() - 3600000),
          isEncrypted: true,
          selfDestruct: false,
          isTranslated: false,
          isDeleted: false
        },
        {
          id: '103',
          senderId: '1',
          content: 'Let me know if you have any questions about the platform',
          timestamp: new Date(Date.now() - 1800000),
          isEncrypted: true,
          selfDestruct: false,
          isTranslated: false,
          isDeleted: false
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createChatRoom = async (name: string, type: ChatRoomType, tags: string[] = []): Promise<ChatRoom> => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRoom: ChatRoom = {
        id: `room-${Date.now()}`,
        name,
        description: '',
        type,
        participants: currentUser ? [currentUser.id] : [],
        tags,
        createdAt: new Date(),
        isModerated: type !== ChatRoomType.Anonymous,
        messages: []
      };
      
      setChatRooms(prevRooms => [...prevRooms, newRoom]);
      return newRoom;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw new Error('Failed to create chat room');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, roomId: string, selfDestruct = false, selfDestructTime = 60) => {
    if (!currentUser) return;
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        content,
        timestamp: new Date(),
        isEncrypted: true,
        selfDestruct,
        selfDestructTime: selfDestruct ? selfDestructTime : undefined,
        isTranslated: false,
        isDeleted: false
      };
      
      setMessages(prevMessages => [...prevMessages, newMessage]);
      
      // If self-destruct is enabled, schedule message removal
      if (selfDestruct && selfDestructTime) {
        setTimeout(() => {
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === newMessage.id ? { ...msg, isDeleted: true, content: 'This message has self-destructed' } : msg
            )
          );
        }, selfDestructTime * 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const joinChatRoom = async (roomId: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update chat room participants
      setChatRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId && currentUser && !room.participants.includes(currentUser.id)
            ? { ...room, participants: [...room.participants, currentUser.id] }
            : room
        )
      );
    } catch (error) {
      console.error('Error joining chat room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveChatRoom = async (roomId: string) => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update chat room participants
      setChatRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId && currentUser
            ? { ...room, participants: room.participants.filter(id => id !== currentUser.id) }
            : room
        )
      );
      
      // If active chat room is the one being left, clear it
      if (activeChatRoom?.id === roomId) {
        setActiveChatRoom(null);
      }
    } catch (error) {
      console.error('Error leaving chat room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectChatRoom = (roomId: string) => {
    const room = chatRooms.find(r => r.id === roomId) || null;
    setActiveChatRoom(room);
  };

  return (
    <ChatContext.Provider
      value={{
        chatRooms,
        activeChatRoom,
        messages,
        isLoading,
        createChatRoom,
        sendMessage,
        joinChatRoom,
        leaveChatRoom,
        selectChatRoom
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};