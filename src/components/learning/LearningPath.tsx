import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, CheckCircle, Circle, Trophy, Zap, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Module {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  level: number;
  unlock_requirement: number;
  xp_reward: number;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  xp_reward: number;
  order_index: number;
}

interface LearningPathProps {
  topic: Topic;
  userXP: number;
  onLessonSelect: (lesson: Lesson) => void;
  onBack: () => void;
}

interface LessonProgress {
  lesson_id: string;
  completed: boolean;
}

export const LearningPath = ({ topic, userXP, onLessonSelect, onBack }: LearningPathProps) => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModulesAndLessons();
    if (user) {
      loadProgress();
    }
  }, [topic.id, user]);

  const loadModulesAndLessons = async () => {
    const { data: modulesData } = await supabase
      .from('learning_modules')
      .select('*')
      .eq('topic_id', topic.id)
      .order('order_index');

    if (modulesData) {
      setModules(modulesData);

      const lessonsMap: Record<string, Lesson[]> = {};
      for (const module of modulesData) {
        const { data: lessonsData } = await supabase
          .from('learning_lessons')
          .select('*')
          .eq('module_id', module.id)
          .order('order_index');

        if (lessonsData) {
          lessonsMap[module.id] = lessonsData;
        }
      }
      setLessons(lessonsMap);
    }
    setLoading(false);
  };

  const loadProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_learning_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id);

    if (data) {
      setProgress(data);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const getModuleProgress = (moduleId: string) => {
    const moduleLessons = lessons[moduleId] || [];
    if (moduleLessons.length === 0) return 0;
    const completed = moduleLessons.filter(l => isLessonCompleted(l.id)).length;
    return Math.round((completed / moduleLessons.length) * 100);
  };

  const isModuleUnlocked = (module: Module) => {
    return userXP >= module.unlock_requirement;
  };

  const getLevelTitle = (level: number) => {
    const titles = ['Beginner', 'Intermediate', 'Advanced', 'Pro'];
    return titles[level - 1] || 'Unknown';
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'from-green-500 to-green-600',
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-red-600'
    ];
    return colors[level - 1] || colors[0];
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
          {topic.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          {topic.description}
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="text-gray-700 dark:text-gray-300 font-semibold">
              {userXP.toLocaleString()} XP
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-500" />
            <span className="text-gray-700 dark:text-gray-300 font-semibold">
              Level {Math.floor(userXP / 500) + 1}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {modules.map((module, moduleIndex) => {
          const unlocked = isModuleUnlocked(module);
          const moduleProgress = getModuleProgress(module.id);
          const levelColor = getLevelColor(module.level);
          const moduleLessons = lessons[module.id] || [];

          return (
            <div key={module.id} className="relative">
              {moduleIndex > 0 && (
                <div className="absolute left-8 -top-8 w-1 h-8 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700"></div>
              )}

              <div className={`relative ${!unlocked ? 'opacity-60' : ''}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                  <div className={`bg-gradient-to-r ${levelColor} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                      <div className="w-full h-full bg-white/10 rounded-full"></div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-white text-sm font-bold bg-white/20 px-3 py-1 rounded-full">
                            {getLevelTitle(module.level)}
                          </div>
                          {!unlocked && (
                            <div className="flex items-center gap-1 text-white text-sm">
                              <Lock className="w-4 h-4" />
                              <span>Requires {module.unlock_requirement} XP</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{module.title}</h3>
                        <p className="text-white/90">{module.description}</p>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-white text-3xl font-bold">{moduleProgress}%</div>
                        <div className="text-white/80 text-sm">Complete</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3">
                      {moduleLessons.map((lesson, lessonIndex) => {
                        const completed = isLessonCompleted(lesson.id);
                        const previousCompleted = lessonIndex === 0 || isLessonCompleted(moduleLessons[lessonIndex - 1].id);
                        const canAccess = unlocked && (previousCompleted || completed);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => canAccess && onLessonSelect(lesson)}
                            disabled={!canAccess}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                              canAccess
                                ? 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-md transform hover:scale-[1.02]'
                                : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                            }`}
                          >
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              completed
                                ? 'bg-green-500'
                                : canAccess
                                ? 'bg-blue-500'
                                : 'bg-gray-400'
                            }`}>
                              {completed ? (
                                <CheckCircle className="w-6 h-6 text-white" />
                              ) : canAccess ? (
                                <Circle className="w-6 h-6 text-white" />
                              ) : (
                                <Lock className="w-5 h-5 text-white" />
                              )}
                            </div>

                            <div className="flex-1 text-left">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {lesson.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                {lesson.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{lesson.duration_minutes}m</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span className="font-semibold">{lesson.xp_reward}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
