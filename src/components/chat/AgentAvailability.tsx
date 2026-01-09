import { useState, useEffect } from 'react';
import { Circle, Clock, Coffee, Power } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

type AvailabilityStatus = 'online' | 'busy' | 'away' | 'offline';

interface StatusOption {
  value: AvailabilityStatus;
  label: string;
  color: string;
  icon: React.ElementType;
  description: string;
}

const statusOptions: StatusOption[] = [
  {
    value: 'online',
    label: 'Online',
    color: 'text-green-500',
    icon: Circle,
    description: 'Available to help'
  },
  {
    value: 'busy',
    label: 'Busy',
    color: 'text-red-500',
    icon: Circle,
    description: 'In a session'
  },
  {
    value: 'away',
    label: 'Away',
    color: 'text-yellow-500',
    icon: Clock,
    description: 'Be back soon'
  },
  {
    value: 'offline',
    label: 'Offline',
    color: 'text-gray-500',
    icon: Power,
    description: 'Not available'
  }
];

export const AgentAvailability = () => {
  const { user, profile } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<AvailabilityStatus>('offline');
  const [statusMessage, setStatusMessage] = useState('');
  const [maxRooms, setMaxRooms] = useState(5);
  const [currentRooms, setCurrentRooms] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.is_agent) {
      loadAvailability();
      loadCurrentRooms();
    }
  }, [user, profile]);

  const loadAvailability = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('agent_availability')
      .select('*')
      .eq('agent_id', user.id)
      .maybeSingle();

    if (data) {
      setCurrentStatus(data.status as AvailabilityStatus);
      setStatusMessage(data.status_message || '');
      setMaxRooms(data.max_concurrent_rooms || 5);
      setCurrentRooms(data.current_room_count || 0);
    } else {
      await supabase
        .from('agent_availability')
        .insert({
          agent_id: user.id,
          status: 'offline',
          max_concurrent_rooms: 5,
          current_room_count: 0
        });
    }

    setLoading(false);
  };

  const loadCurrentRooms = async () => {
    if (!user) return;

    const { count } = await supabase
      .from('room_participants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_active', true);

    setCurrentRooms(count || 0);
  };

  const updateStatus = async (newStatus: AvailabilityStatus) => {
    if (!user) return;

    const { error } = await supabase
      .from('agent_availability')
      .upsert({
        agent_id: user.id,
        status: newStatus,
        status_message: statusMessage,
        max_concurrent_rooms: maxRooms,
        current_room_count: currentRooms,
        updated_at: new Date().toISOString()
      });

    if (!error) {
      setCurrentStatus(newStatus);
      setShowDropdown(false);
    }
  };

  const updateStatusMessage = async (message: string) => {
    if (!user) return;

    await supabase
      .from('agent_availability')
      .update({
        status_message: message,
        updated_at: new Date().toISOString()
      })
      .eq('agent_id', user.id);

    setStatusMessage(message);
  };

  if (!profile?.is_agent || loading) {
    return null;
  }

  const currentOption = statusOptions.find(opt => opt.value === currentStatus) || statusOptions[3];
  const Icon = currentOption.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Icon className={`w-4 h-4 ${currentOption.color} ${currentStatus === 'online' || currentStatus === 'busy' ? 'fill-current' : ''}`} />
        <span className="font-medium text-gray-900 dark:text-white">
          {currentOption.label}
        </span>
        {currentRooms > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
            {currentRooms}/{maxRooms}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Set Your Status
            </h3>
            <div className="space-y-2">
              {statusOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => updateStatus(option.value)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      currentStatus === option.value
                        ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <OptionIcon
                      className={`w-5 h-5 ${option.color} ${
                        (option.value === 'online' || option.value === 'busy') ? 'fill-current' : ''
                      }`}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                    {currentStatus === option.value && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Message
            </label>
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              onBlur={(e) => updateStatusMessage(e.target.value)}
              placeholder="What are you working on?"
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              maxLength={100}
            />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Sessions
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentRooms} / {maxRooms}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  currentRooms >= maxRooms
                    ? 'bg-red-500'
                    : currentRooms / maxRooms > 0.7
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${(currentRooms / maxRooms) * 100}%` }}
              ></div>
            </div>
            {currentRooms >= maxRooms && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                You've reached your maximum concurrent sessions
              </p>
            )}
          </div>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </div>
  );
};
