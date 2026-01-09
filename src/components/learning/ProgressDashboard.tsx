import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Award, Flame, Star, TrendingUp, Target, Zap } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ProgressDashboardProps {
  userXP: Record<string, number>;
  currentStreak: number;
  onBack: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge_color: string;
  xp_reward: number;
}

interface UserAchievement {
  achievement_id: string;
  earned_at: string;
}

interface LeaderboardEntry {
  user_id: string;
  total_xp: number;
  full_name: string;
}

interface Stats {
  totalXP: number;
  level: number;
  lessonsCompleted: number;
  quizzesPassed: number;
  achievementsEarned: number;
  longestStreak: number;
}

const iconMap: Record<string, any> = {
  Star,
  Zap,
  Award,
  Trophy,
  TrendingUp,
  Target,
  Flame
};

export const ProgressDashboard = ({ userXP, currentStreak, onBack }: ProgressDashboardProps) => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalXP: 0,
    level: 1,
    lessonsCompleted: 0,
    quizzesPassed: 0,
    achievementsEarned: 0,
    longestStreak: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    await Promise.all([
      loadAchievements(),
      loadUserAchievements(),
      loadLeaderboard(),
      loadStats()
    ]);

    setLoading(false);
  };

  const loadAchievements = async () => {
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .order('xp_reward');

    if (data) {
      setAchievements(data);
    }
  };

  const loadUserAchievements = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id);

    if (data) {
      setUserAchievements(data);
    }
  };

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('user_xp_totals')
      .select('user_id, total_xp')
      .order('total_xp', { ascending: false })
      .limit(10);

    if (data) {
      const enriched = await Promise.all(
        data.map(async (entry) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', entry.user_id)
            .maybeSingle();

          return {
            ...entry,
            full_name: profile?.full_name || 'Anonymous'
          };
        })
      );

      setLeaderboard(enriched);
    }
  };

  const loadStats = async () => {
    if (!user) return;

    const totalXP = Object.values(userXP).reduce((sum, xp) => sum + xp, 0);
    const level = Math.floor(totalXP / 500) + 1;

    const { count: lessonsCount } = await supabase
      .from('user_learning_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true);

    const { count: quizzesCount } = await supabase
      .from('user_quiz_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('passed', true);

    const { data: streakData } = await supabase
      .from('daily_streaks')
      .select('longest_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    setStats({
      totalXP,
      level,
      lessonsCompleted: lessonsCount || 0,
      quizzesPassed: quizzesCount || 0,
      achievementsEarned: userAchievements.length,
      longestStreak: streakData?.longest_streak || 0
    });
  };

  const hasAchievement = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const getUserRank = () => {
    if (!user) return 0;
    return leaderboard.findIndex(entry => entry.user_id === user.id) + 1;
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
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Topics
      </button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Your Progress
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Track your achievements and see how you stack up
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.level}</div>
              <div className="text-sm opacity-90">Level</div>
            </div>
          </div>
          <div className="text-sm opacity-90">{stats.totalXP.toLocaleString()} Total XP</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Flame className="w-8 h-8" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{currentStreak}</div>
              <div className="text-sm opacity-90">Current</div>
            </div>
          </div>
          <div className="text-sm opacity-90">Record: {stats.longestStreak} days</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="w-8 h-8" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.lessonsCompleted}</div>
              <div className="text-sm opacity-90">Lessons</div>
            </div>
          </div>
          <div className="text-sm opacity-90">{stats.quizzesPassed} quizzes passed</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Award className="w-8 h-8" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.achievementsEarned}</div>
              <div className="text-sm opacity-90">Achievements</div>
            </div>
          </div>
          <div className="text-sm opacity-90">of {achievements.length} total</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {achievements.map((achievement) => {
              const earned = hasAchievement(achievement.id);
              const Icon = iconMap[achievement.icon] || Award;

              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    earned
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      earned
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {achievement.title}
                        </h3>
                        {earned && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full font-semibold">
                            Earned
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        +{achievement.xp_reward} XP
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leaderboard</h2>
          </div>

          {getUserRank() > 0 && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90">Your Rank</div>
                  <div className="text-3xl font-bold">#{getUserRank()}</div>
                </div>
                <Trophy className="w-12 h-12 opacity-50" />
              </div>
            </div>
          )}

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.user_id === user?.id;
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;

              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    isCurrentUser
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 text-center font-bold text-gray-600 dark:text-gray-400">
                    {medal || `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {isCurrentUser ? 'You' : entry.full_name}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    {entry.total_xp.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
