import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Video, Phone, MoreVertical, Users,
  Paperclip, Send, Smile, Check, CheckCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  message_type: string;
  created_at: string;
  is_edited: boolean;
  metadata?: any;
}

interface Participant {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  avatar_url?: string;
}

interface Room {
  id: string;
  room_name: string;
  status: string;
  priority: string;
  room_type: string;
}

interface ChatRoomProps {
  roomId: string;
  onBack: () => void;
  onStartVideoCall?: () => void;
}

export const ChatRoom = ({ roomId, onBack, onStartVideoCall }: ChatRoomProps) => {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (roomId) {
      loadRoom();
      loadMessages();
      loadParticipants();
      subscribeToMessages();
      subscribeToTyping();
      markMessagesAsRead();
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadRoom = async () => {
    const { data } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (data) {
      setRoom(data);
    }
  };

  const loadMessages = async () => {
    const { data } = await supabase
      .from('chat_messages')
      .select(`
        *,
        profiles:sender_id (full_name, avatar_url)
      `)
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (data) {
      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        sender_id: msg.sender_id,
        sender_name: msg.profiles?.full_name || 'Unknown User',
        sender_avatar: msg.profiles?.avatar_url,
        content: msg.content,
        message_type: msg.message_type,
        created_at: msg.created_at,
        is_edited: msg.is_edited,
        metadata: msg.metadata
      }));
      setMessages(formattedMessages);
    }
    setLoading(false);
  };

  const loadParticipants = async () => {
    const { data } = await supabase
      .from('room_participants')
      .select(`
        *,
        profiles:user_id (full_name, avatar_url)
      `)
      .eq('room_id', roomId);

    if (data) {
      const formattedParticipants = data.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        full_name: p.profiles?.full_name || 'Unknown User',
        role: p.role,
        is_active: p.is_active,
        avatar_url: p.profiles?.avatar_url
      }));
      setParticipants(formattedParticipants);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMsg: Message = {
            id: payload.new.id,
            sender_id: payload.new.sender_id,
            sender_name: profile?.full_name || 'Unknown User',
            sender_avatar: profile?.avatar_url,
            content: payload.new.content,
            message_type: payload.new.message_type,
            created_at: payload.new.created_at,
            is_edited: payload.new.is_edited,
            metadata: payload.new.metadata
          };

          setMessages(prev => [...prev, newMsg]);
          markMessagesAsRead();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const subscribeToTyping = () => {
    const channel = supabase
      .channel(`typing:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_activity',
          filter: `room_id=eq.${roomId}`
        },
        async (payload) => {
          if (payload.new.activity_type === 'typing' && payload.new.agent_id !== user?.id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', payload.new.agent_id)
              .single();

            if (profile) {
              setIsTyping(prev => [...new Set([...prev, profile.full_name])]);
              setTimeout(() => {
                setIsTyping(prev => prev.filter(name => name !== profile.full_name));
              }, 3000);
            }
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: user.id,
        content: newMessage.trim(),
        message_type: 'text'
      });

    if (!error) {
      setNewMessage('');
      stopTyping();
    }
  };

  const handleTyping = () => {
    if (!user) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    supabase
      .from('agent_activity')
      .insert({
        agent_id: user.id,
        room_id: roomId,
        activity_type: 'typing'
      });

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const markMessagesAsRead = async () => {
    if (!user) return;

    const unreadMessages = messages.filter(msg => msg.sender_id !== user.id);

    for (const msg of unreadMessages) {
      await supabase
        .from('message_read_status')
        .upsert({
          message_id: msg.id,
          user_id: user.id
        });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {room?.room_name}
                </h1>
                {room && (
                  <span className={`w-2 h-2 rounded-full ${getPriorityColor(room.priority)}`}></span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {participants.length} {participants.length === 1 ? 'participant' : 'participants'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onStartVideoCall && (
              <>
                <button
                  onClick={onStartVideoCall}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => {
          const isOwnMessage = message.sender_id === user?.id;
          const showDate = index === 0 ||
            formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);

          return (
            <div key={message.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    {formatDate(message.created_at)}
                  </span>
                </div>
              )}

              <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                {!isOwnMessage && (
                  <div className="flex-shrink-0">
                    {message.sender_avatar ? (
                      <img
                        src={message.sender_avatar}
                        alt={message.sender_name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {message.sender_name[0]}
                      </div>
                    )}
                  </div>
                )}

                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  {!isOwnMessage && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {message.sender_name}
                    </span>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(message.created_at)}
                    </span>
                    {isOwnMessage && (
                      <CheckCheck className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isTyping.length > 0 && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8"></div>
            <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Smile className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {showParticipants && (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 shadow-xl z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Participants ({participants.length})
              </h2>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-3">
                {participant.avatar_url ? (
                  <img
                    src={participant.avatar_url}
                    alt={participant.full_name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {participant.full_name[0]}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {participant.full_name}
                    </span>
                    {participant.is_active && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {participant.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
