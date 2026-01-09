import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { TopicSelection } from './TopicSelection';
import { LearningPath } from './LearningPath';
import { LessonView } from './LessonView';
import { QuizView } from './QuizView';
import { ProgressDashboard } from './ProgressDashboard';

type ViewType = 'topics' | 'path' | 'lesson' | 'quiz' | 'progress';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  total_xp: number;
  estimated_hours: number;
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
  content: any;
  duration_minutes: number;
  xp_reward: number;
}

interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  passing_score: number;
  xp_reward: number;
  time_limit_seconds: number;
}

export const LearningHub = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('topics');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [userXP, setUserXP] = useState<Record<string, number>>({});
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (user) {
      loadUserProgress();
      loadStreak();
    }
  }, [user]);

  const loadUserProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_xp_totals')
      .select('topic_id, total_xp')
      .eq('user_id', user.id);

    if (data) {
      const xpMap: Record<string, number> = {};
      data.forEach(item => {
        xpMap[item.topic_id] = item.total_xp;
      });
      setUserXP(xpMap);
    }
  };

  const loadStreak = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('daily_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setCurrentStreak(data.current_streak);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setCurrentView('path');
  };

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentView('lesson');
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('quiz');
  };

  const handleLessonComplete = async (xpEarned: number) => {
    if (selectedLesson && selectedTopic && user) {
      await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: user.id,
          lesson_id: selectedLesson.id,
          completed: true,
          xp_earned: xpEarned,
          completed_at: new Date().toISOString()
        });

      const currentXP = userXP[selectedTopic.id] || 0;
      const newXP = currentXP + xpEarned;

      await supabase
        .from('user_xp_totals')
        .upsert({
          user_id: user.id,
          topic_id: selectedTopic.id,
          total_xp: newXP,
          current_level: Math.floor(newXP / 500) + 1,
          updated_at: new Date().toISOString()
        });

      await updateStreak();
      await loadUserProgress();
    }
  };

  const handleQuizComplete = async (score: number, xpEarned: number) => {
    if (selectedQuiz && selectedTopic && user) {
      const passed = score >= (selectedQuiz.passing_score || 70);

      await supabase
        .from('user_quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: selectedQuiz.id,
          score,
          xp_earned: passed ? xpEarned : 0,
          passed,
          time_taken_seconds: 0,
          answers: {}
        });

      if (passed) {
        const currentXP = userXP[selectedTopic.id] || 0;
        const newXP = currentXP + xpEarned;

        await supabase
          .from('user_xp_totals')
          .upsert({
            user_id: user.id,
            topic_id: selectedTopic.id,
            total_xp: newXP,
            current_level: Math.floor(newXP / 500) + 1,
            updated_at: new Date().toISOString()
          });

        await updateStreak();
        await loadUserProgress();
      }
    }
  };

  const updateStreak = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    const { data: existingStreak } = await supabase
      .from('daily_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingStreak) {
      const lastDate = existingStreak.last_activity_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = existingStreak.current_streak;

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else if (lastDate !== today) {
        newStreak = 1;
      }

      await supabase
        .from('daily_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, existingStreak.longest_streak),
          last_activity_date: today,
          total_days_learned: existingStreak.total_days_learned + (lastDate !== today ? 1 : 0),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      setCurrentStreak(newStreak);
    } else {
      await supabase
        .from('daily_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today,
          total_days_learned: 1
        });

      setCurrentStreak(1);
    }
  };

  const handleBackToTopics = () => {
    setCurrentView('topics');
    setSelectedTopic(null);
    setSelectedModule(null);
    setSelectedLesson(null);
    setSelectedQuiz(null);
  };

  const handleBackToPath = () => {
    setCurrentView('path');
    setSelectedLesson(null);
    setSelectedQuiz(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {currentView === 'topics' && (
        <TopicSelection
          onTopicSelect={handleTopicSelect}
          userXP={userXP}
          currentStreak={currentStreak}
          onViewProgress={() => setCurrentView('progress')}
        />
      )}

      {currentView === 'path' && selectedTopic && (
        <LearningPath
          topic={selectedTopic}
          userXP={userXP[selectedTopic.id] || 0}
          onLessonSelect={handleLessonSelect}
          onBack={handleBackToTopics}
        />
      )}

      {currentView === 'lesson' && selectedLesson && (
        <LessonView
          lesson={selectedLesson}
          onComplete={handleLessonComplete}
          onStartQuiz={handleStartQuiz}
          onBack={handleBackToPath}
        />
      )}

      {currentView === 'quiz' && selectedQuiz && (
        <QuizView
          quiz={selectedQuiz}
          onComplete={handleQuizComplete}
          onBack={handleBackToPath}
        />
      )}

      {currentView === 'progress' && (
        <ProgressDashboard
          userXP={userXP}
          currentStreak={currentStreak}
          onBack={handleBackToTopics}
        />
      )}
    </div>
  );
};
