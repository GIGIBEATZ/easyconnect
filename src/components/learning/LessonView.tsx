import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Zap, Clock, PlayCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Lesson {
  id: string;
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
}

interface LessonViewProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
  onStartQuiz: (quiz: Quiz) => void;
  onBack: () => void;
}

export const LessonView = ({ lesson, onComplete, onStartQuiz, onBack }: LessonViewProps) => {
  const [completed, setCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    loadQuiz();
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadQuiz = async () => {
    const { data } = await supabase
      .from('learning_quizzes')
      .select('*')
      .eq('lesson_id', lesson.id)
      .maybeSingle();

    if (data) {
      setQuiz(data);
    }
  };

  const handleScroll = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const progress = Math.min(((scrollTop + windowHeight) / documentHeight) * 100, 100);
    setReadingProgress(progress);
  };

  const handleCompleteLesson = () => {
    setCompleted(true);
    setShowCelebration(true);
    onComplete(lesson.xp_reward);

    setTimeout(() => {
      setShowCelebration(false);
    }, 3000);
  };

  const sections = lesson.content?.sections || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Path
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <PlayCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                Lesson
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-3">{lesson.title}</h1>
            <p className="text-lg text-white/90 mb-6">{lesson.description}</p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{lesson.duration_minutes} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">{lesson.xp_reward} XP</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {sections.map((section: any, index: number) => (
                <div key={index} className="mb-8">
                  {section.heading && (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {section.heading}
                    </h2>
                  )}
                  {section.text && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {section.text}
                    </p>
                  )}
                  {section.list && (
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
                      {section.list.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.code && (
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                      <pre><code>{section.code}</code></pre>
                    </div>
                  )}
                </div>
              ))}

              {sections.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">
                    Lesson content is being prepared. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transform scale-110 animate-bounce">
              <div className="text-center">
                <div className="inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Lesson Complete!
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                  +{lesson.xp_reward} XP Earned
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {completed ? 'Great Job!' : 'Ready to Continue?'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {completed
                  ? quiz
                    ? 'Test your knowledge with a quiz to earn bonus XP!'
                    : 'Move on to the next lesson to continue learning.'
                  : 'Mark this lesson as complete to earn XP and continue your progress.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!completed && (
                <button
                  onClick={handleCompleteLesson}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Lesson
                </button>
              )}

              {completed && quiz && (
                <button
                  onClick={() => onStartQuiz(quiz)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Take Quiz (+{quiz.xp_reward} XP)
                </button>
              )}

              {completed && !quiz && (
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Next Lesson
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
