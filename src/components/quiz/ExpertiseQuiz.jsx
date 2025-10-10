import { useState } from 'react';
import { CheckCircle, XCircle, Award, Brain } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export default function ExpertiseQuiz({ quiz, onComplete, onSkip }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    const isCorrect = answerIndex === quiz.questions[currentQuestion].correctAnswer;
    setAnswers([...answers, isCorrect]);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResults(true);
    }
  };

  const calculatePersona = (score) => {
    const percentage = (score / quiz.questions.length) * 100;
    if (percentage >= 80) return 'Expert';
    if (percentage >= 50) return 'Engineer';
    return 'Student';
  };

  if (showResults) {
    const score = answers.filter(Boolean).length;
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const persona = calculatePersona(score);

    return (
      <div className="max-w-2xl mx-auto">
        <Card glass className="p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-prism-600 to-accent-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Award className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold gradient-text mb-4">Assessment Complete!</h2>
          
          <div className="mb-8">
            <div className="text-6xl font-bold text-prism-700 mb-2">{percentage}%</div>
            <p className="text-xl text-slate-600">
              You answered {score} out of {quiz.questions.length} questions correctly
            </p>
          </div>

          <div className="p-6 bg-gradient-to-r from-prism-50 to-purple-50 rounded-2xl mb-8">
            <p className="text-lg text-slate-700 mb-2">
              Your expertise level has been set to:
            </p>
            <p className="text-3xl font-bold gradient-text">{persona}</p>
          </div>

          <p className="text-slate-600 mb-8">
            The analysis will be tailored to your {persona.toLowerCase()}-level understanding
          </p>

          <Button onClick={() => onComplete(score, persona)} size="lg" className="w-full">
            <Brain className="w-5 h-5 mr-2" />
            Continue to Analysis
          </Button>
        </Card>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto">
      <Card glass className="p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-prism-600">
              {answers.filter(Boolean).length} correct
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-prism-600 to-accent-purple transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === question.correctAnswer;
              const showResult = showExplanation;
              
              let buttonClass = 'p-4 text-left border-2 rounded-xl transition-all hover:shadow-lg ';
              
              if (showResult) {
                if (isSelected && isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'border-red-500 bg-red-50';
                } else if (isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50';
                } else {
                  buttonClass += 'border-slate-300 bg-white opacity-60';
                }
              } else {
                buttonClass += isSelected 
                  ? 'border-prism-500 bg-prism-50' 
                  : 'border-slate-300 bg-white hover:border-prism-400';
              }

              return (
                <button
                  key={i}
                  onClick={() => !showExplanation && handleAnswer(i)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="flex-1 font-medium text-slate-800">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6 fade-in-up">
            <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
            <p className="text-sm text-slate-700">{question.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onSkip} className="flex-1">
            Skip Quiz
          </Button>
          {showExplanation && (
            <Button onClick={handleNext} className="flex-1">
              {currentQuestion < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
