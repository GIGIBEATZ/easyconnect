import { useState, useEffect } from 'react';
import {
  MessageSquare, Plus, Search, Clock, Users, Video,
  MoreVertical, CheckCircle, AlertCircle, Circle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ChatRoom } from './ChatRoom';

interface Room {
  id: string;
  room_name: string;
  status: string;
  priority: string;
  room_type: string;
  created_at: string;
  unread_count: number;
  last_message?: string;
  last_message_time?: string;
  participant_count: number;
}

export const RoomsList = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadRooms();
      subscribeToRooms();
    }
  }, [user]);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchQuery, filter]);

  const loadRooms = async () => {
    if (!user) return;

    const { data: userRooms } = await supabase
      .from('room_participants')
      .select('room_id')
      .eq('user_id', user.id);

    if (!userRooms) return;

    const roomIds = userRooms.map(r => r.room_id);

    const { data } = await supabase
      .from('chat_rooms')
      .select('*')
      .in('id', roomIds)
      .order('created_at', { ascending: false });

    if (data) {
      const enrichedRooms = await Promise.all(
        data.map(async (room) => {
          const { count: participantCount } = await supabase
            .from('room_participants')
            .select('*', { count: 'exact', head: true })
            .eq('room_id', room.id)
            .eq('is_active', true);

          const { data: lastMessage } = await supabase
            .from('chat_messages')
            .select('content, created_at')
            .eq('room_id', room.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          const { data: unreadMessages } = await supabase
            .from('chat_messages')
            .select('id')
            .eq('room_id', room.id)
            .neq('sender_id', user.id)
            .not('id', 'in', `(
              SELECT message_id FROM message_read_status
              WHERE user_id = '${user.id}'
            )`);

          return {
            ...room,
            participant_count: participantCount || 0,
            last_message: lastMessage?.content,
            last_message_time: lastMessage?.created_at,
            unread_count: unreadMessages?.length || 0
          };
        })
      );

      setRooms(enrichedRooms);
    }

    setLoading(false);
  };

  const subscribeToRooms = () => {
    const channel = supabase
      .channel('rooms-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_rooms'
        },
        () => {
          loadRooms();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  };

  const filterRooms = () => {
    let filtered = rooms;

    if (filter !== 'all') {
      filtered = filtered.filter(room =>
        filter === 'active' ? room.status === 'active' : room.status === 'closed'
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(room =>
        room.room_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
  };

  const handleCreateRoom = async (roomName: string, roomType: string) => {
    if (!user) return;

    const { data: newRoom, error } = await supabase
      .from('chat_rooms')
      .insert({
        room_name: roomName,
        room_type: roomType,
        created_by: user.id,
        status: 'active',
        priority: 'medium'
      })
      .select()
      .single();

    if (!error && newRoom) {
      await supabase
        .from('room_participants')
        .insert({
          room_id: newRoom.id,
          user_id: user.id,
          role: 'client'
        });

      setShowCreateModal(false);
      loadRooms();
      setSelectedRoom(newRoom.id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Circle className="w-3 h-3 text-green-500 fill-green-500" />;
      case 'paused':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="w-3 h-3 text-blue-500" />;
      case 'closed':
        return <AlertCircle className="w-3 h-3 text-gray-500" />;
      default:
        return <Circle className="w-3 h-3 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      case 'medium':
        return 'border-l-4 border-yellow-500';
      default:
        return 'border-l-4 border-green-500';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (selectedRoom) {
    return (
      <ChatRoom
        roomId={selectedRoom}
        onBack={() => setSelectedRoom(null)}
        onStartVideoCall={() => {}}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2 mt-4">
          {['all', 'active', 'closed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <MessageSquare className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start a new chat to connect with support agents
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left ${getPriorityColor(room.priority)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {room.room_name[0]}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {room.room_name}
                      </h3>
                      {room.last_message_time && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          {formatTime(room.last_message_time)}
                        </span>
                      )}
                    </div>

                    {room.last_message && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                        {room.last_message}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(room.status)}
                        <span className="capitalize">{room.status}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{room.participant_count}</span>
                      </div>
                      {room.unread_count > 0 && (
                        <span className="ml-auto bg-blue-500 text-white px-2 py-0.5 rounded-full font-semibold">
                          {room.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Start New Chat
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateRoom(
                  formData.get('roomName') as string,
                  formData.get('roomType') as string
                );
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chat Name
                  </label>
                  <input
                    type="text"
                    name="roomName"
                    required
                    placeholder="e.g., Laptop Repair Support"
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Chat Type
                  </label>
                  <select
                    name="roomType"
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="support">Technical Support</option>
                    <option value="consultation">Consultation</option>
                    <option value="training">Training Session</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
                >
                  Create Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
