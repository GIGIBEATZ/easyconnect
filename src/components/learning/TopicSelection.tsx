import { useState, useEffect } from 'react';
import { Settings, Wrench, HardDrive, Users, Network, Shield, Flame, Trophy, TrendingUp, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  total_xp: number;
  estimated_hours: number;
}

interface TopicSelectionProps {
  onTopicSelect: (topic: Topic) => void;
  userXP: Record<string, number>;
  currentStreak: number;
  onViewProgress: () => void;
}

const iconMap: Record<string, any> = {
  Settings,
  Wrench,
  HardDrive,
  Users,
  Network,
  Shield
};

const colorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  cyan: 'from-cyan-500 to-cyan-600',
  red: 'from-red-500 to-red-600'
};

export const TopicSelection = ({ onTopicSelect, userXP, currentStreak, onViewProgress }: TopicSelectionProps) => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalXP, setTotalXP] = useState(0);

  useEffect(() => {
    loadTopics();
    calculateTotalXP();
  }, [userXP]);

  const loadTopics = async () => {
    const { data } = await supabase
      .from('learning_topics')
      .select('*')
      .order('order_index');

    if (data) {
      setTopics(data);
    }
    setLoading(false);
  };

  const calculateTotalXP = () => {
    const total = Object.values(userXP).reduce((sum, xp) => sum + xp, 0);
    setTotalXP(total);
  };

  const getLevel = (xp: number) => Math.floor(xp / 500) + 1;
  const getXPForNextLevel = (xp: number) => {
    const currentLevel = getLevel(xp);
    return currentLevel * 500;
  };
  const getXPProgress = (xp: number) => {
    const previousLevelXP = (getLevel(xp) - 1) * 500;
    const nextLevelXP = getLevel(xp) * 500;
    return ((xp - previousLevelXP) / (nextLevelXP - previousLevelXP)) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Learning Hub
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Master tech support skills through gamified learning
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Flame className="w-8 h-8" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{currentStreak}</div>
              <div className="text-sm opacity-90">Day Streak</div>
            </div>
          </div>
          <div className="text-sm opacity-90">Keep learning daily to maintain your streak!</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Star className="w-8 h-8" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{totalXP.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total XP</div>
            </div>
          </div>
          <div className="text-sm opacity-90">Level {getLevel(totalXP)} • {getXPForNextLevel(totalXP) - totalXP} XP to next level</div>
        </div>

        <button
          onClick={onViewProgress}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Trophy className="w-8 h-8" />
            </div>
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <div className="text-xl font-bold mb-1">View Progress</div>
          <div className="text-sm opacity-90">Check achievements & leaderboard</div>
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Path</h2>
        <p className="text-gray-600 dark:text-gray-300">Select a topic to start learning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const Icon = iconMap[topic.icon] || Settings;
          const gradient = colorMap[topic.color] || colorMap.blue;
          const xp = userXP[topic.id] || 0;
          const level = getLevel(xp);
          const progress = getXPProgress(xp);
          const isStarted = xp > 0;

          return (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic)}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden text-left"
            >
              <div className={`bg-gradient-to-br ${gradient} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                  <div className="w-full h-full bg-white/10 rounded-full"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {isStarted && (
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-sm font-bold">Level {level}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{topic.title}</h3>
                  {isStarted && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-white text-sm mb-2">
                        <span>{xp} XP</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-white h-full rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {topic.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 dark:text-gray-400">
                      {topic.total_xp.toLocaleString()} XP
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ~{topic.estimated_hours}h
                    </span>
                  </div>
                  <span className={`font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform inline-block`}>
                    {isStarted ? 'Continue' : 'Start'} →
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
