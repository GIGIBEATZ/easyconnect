import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Zap, Trophy, Target, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Quiz {
  id: string;
  title: string;
  passing_score: number;
  xp_reward: number;
  time_limit_seconds: number;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  points: number;
  explanation: string;
  order_index: number;
}

interface Option {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

interface QuizViewProps {
  quiz: Quiz;
  onComplete: (score: number, xpEarned: number) => void;
  onBack: () => void;
}

export const QuizView = ({ quiz, onComplete, onBack }: QuizViewProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [options, setOptions] = useState<Record<string, Option[]>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit_seconds || 300);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizData();
  }, [quiz.id]);

  useEffect(() => {
    if (!completed && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [completed, questions]);

  const loadQuizData = async () => {
    const { data: questionsData } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('order_index');

    if (questionsData) {
      setQuestions(questionsData);

      const optionsMap: Record<string, Option[]> = {};
      for (const question of questionsData) {
        const { data: optionsData } = await supabase
          .from('quiz_options')
          .select('*')
          .eq('question_id', question.id)
          .order('order_index');

        if (optionsData) {
          optionsMap[question.id] = optionsData;
        }
      }
      setOptions(optionsMap);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    if (showFeedback) return;

    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleCheckAnswer = () => {
    const currentQuestion = questions[currentIndex];
    const selectedOptionId = answers[currentQuestion.id];

    if (!selectedOptionId) return;

    const selectedOption = options[currentQuestion.id]?.find(o => o.id === selectedOptionId);
    const correct = selectedOption?.is_correct || false;

    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowFeedback(false);
      setIsCorrect(false);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(question => {
      totalPoints += question.points;
      const selectedOptionId = answers[question.id];
      if (selectedOptionId) {
        const selectedOption = options[question.id]?.find(o => o.id === selectedOptionId);
        if (selectedOption?.is_correct) {
          correctCount++;
          earnedPoints += question.points;
        }
      }
    });

    const finalScore = Math.round((earnedPoints / totalPoints) * 100);
    setScore(finalScore);
    setCompleted(true);

    const passed = finalScore >= quiz.passing_score;
    onComplete(finalScore, passed ? quiz.xp_reward : 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600"></div>
      </div>
    );
  }

  if (completed) {
    const passed = score >= quiz.passing_score;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className={`p-8 text-white ${passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}>
            <div className="text-center">
              <div className="inline-block p-4 bg-white/20 rounded-full mb-4">
                {passed ? (
                  <Trophy className="w-16 h-16" />
                ) : (
                  <Target className="w-16 h-16" />
                )}
              </div>
              <h2 className="text-4xl font-bold mb-2">
                {passed ? 'Quiz Passed!' : 'Keep Practicing!'}
              </h2>
              <p className="text-xl opacity-90">
                Your Score: {score}%
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {score}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Final Score</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {passed ? `+${quiz.xp_reward}` : '0'} XP
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">XP Earned</div>
              </div>
            </div>

            {!passed && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                <p className="text-yellow-800 dark:text-yellow-200 text-center">
                  You need {quiz.passing_score}% to pass. Review the lesson and try again!
                </p>
              </div>
            )}

            <button
              onClick={onBack}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {passed ? 'Continue Learning' : 'Back to Lesson'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentOptions = options[currentQuestion?.id] || [];
  const selectedAnswer = answers[currentQuestion?.id];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-white text-sm mt-2">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentQuestion?.question_text}
            </h2>

            <div className="space-y-3 mb-6">
              {currentOptions.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const showCorrect = showFeedback && option.is_correct;
                const showIncorrect = showFeedback && isSelected && !option.is_correct;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                    disabled={showFeedback}
                    className={`w-full p-4 rounded-xl text-left transition-all transform hover:scale-[1.02] ${
                      showCorrect
                        ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                        : showIncorrect
                        ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                        : isSelected
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showCorrect
                          ? 'bg-green-500 border-green-500'
                          : showIncorrect
                          ? 'bg-red-500 border-red-500'
                          : isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {showCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                        {showIncorrect && <XCircle className="w-4 h-4 text-white" />}
                        {!showFeedback && isSelected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                      </div>
                      <span className={`flex-1 ${
                        showCorrect || showIncorrect
                          ? 'font-semibold'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {option.option_text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {showFeedback && currentQuestion.explanation && (
              <div className={`p-4 rounded-xl mb-6 ${
                isCorrect
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
              }`}>
                <p className={`${
                  isCorrect ? 'text-green-800 dark:text-green-200' : 'text-blue-800 dark:text-blue-200'
                }`}>
                  <strong>{isCorrect ? 'Correct!' : 'Explanation:'}</strong> {currentQuestion.explanation}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {!showFeedback ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  {isCorrect && <Zap className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
