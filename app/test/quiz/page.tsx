"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { questions as allQuestions, QuestionOption } from "@/data/questions-test";
import { calculateResult, Result } from "@/utils/calculator";
import { getPosterUrl, initMoviePosters } from "@/utils/tmdb";
import Tooltip from "@/components/Tooltip";

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface AnswerEntry {
  questionIndex: number;
  optionIndices: number[];
}

export default function TestQuizPage() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);
  const [moviePosters, setMoviePosters] = useState<Record<string, string | null>>({});

  // Load movie posters on mount
  useEffect(() => {
    initMoviePosters().then(posters => {
      setMoviePosters(posters);
    });
  }, []);

  // Get question IDs from session storage
  const questionIds = useMemo(() => {
    if (typeof window === "undefined") return [];
    const stored = sessionStorage.getItem("fbti_question_ids");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return allQuestions.map((q) => q.id);
      }
    }
    return allQuestions.map((q) => q.id);
  }, []);

  // Filter questions based on questionIds
  const questions = useMemo(() => {
    return questionIds
      .map((id: number) => allQuestions.find((q) => q.id === id))
      .filter(Boolean);
  }, [questionIds]);

  // Initialize from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem("fbti_answers");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAnswers(parsed);
        }
      } catch {}
    }
    setInitialized(true);
  }, []);

  // Save answers to sessionStorage
  useEffect(() => {
    if (initialized && answers.length > 0) {
      sessionStorage.setItem("fbti_answers", JSON.stringify(answers));
    }
  }, [answers, initialized]);

  const question = questions[currentQuestion];
  const isMultiSelect = question?.questionType === "multiSelect";
  const isBinaryWithSkip = question?.questionType === "binary_with_skip";
  const isBinary = question?.questionType === "binary";
  const isMulti = question?.questionType === "multi";
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const canAdvance = selectedOptions.length > 0;

  // Sync selectedOptions when currentQuestion changes
  useEffect(() => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return;
    const fullIdx = allQuestions.findIndex(q => q.id === currentQ.id);
    const answer = answers.find(a => a.questionIndex === fullIdx);
    setSelectedOptions(answer?.optionIndices ?? []);
  }, [currentQuestion, answers, questions]);

  const handleOptionClick = useCallback(
    (optIdx: number) => {
      if (animating) return;

      if (isMultiSelect) {
        setSelectedOptions((prev) => {
          if (prev.includes(optIdx)) {
            return prev.filter((i) => i !== optIdx);
          }
          if (question.maxSelect && prev.length >= question.maxSelect) {
            return prev;
          }
          return [...prev, optIdx];
        });
        return;
      }

      // For binary/multi: skip items navigate without recording
      if (question.options[optIdx]?.type === "skip") {
        handleNext([optIdx]);
        return;
      }

      // Single select: auto-advance
      setAnimating(true);
      handleNext([optIdx]);
    },
    [animating, isMultiSelect, question]
  );

  const handleNext = useCallback(
    (opts: number[]) => {
      if (animating) return;
      setAnimating(true);

      // Use the full array index so calculator.ts maps to the correct question
      const currentQ = questions[currentQuestion];
      const fullArrayIndex = allQuestions.findIndex(q => q.id === currentQ.id);
      const newAnswers = answers.filter(
        (a) => a.questionIndex !== fullArrayIndex
      );
      newAnswers.push({ questionIndex: fullArrayIndex, optionIndices: opts });
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setTimeout(() => {
          setCurrentQuestion((prev) => prev + 1);
          setSelectedOptions([]);
          setAnimating(false);
        }, 400);
      } else {
        const result = calculateResult(newAnswers);
        sessionStorage.setItem("fbti_result", JSON.stringify(result));
        // Clean up temporary quiz data
        sessionStorage.removeItem("fbti_answers");
        sessionStorage.removeItem("fbti_question_ids");
        setTimeout(() => {
          router.push("/result");
        }, 400);
      }
    },
    [animating, answers, currentQuestion, router, questions]
  );

  const handleBack = useCallback(() => {
    if (currentQuestion > 0) {
      const prevIdx = currentQuestion - 1;
      const prevQ = questions[prevIdx];
      const prevFullIdx = allQuestions.findIndex(q => q.id === prevQ.id);
      const prevAnswer = answers.find(
        (a) => a.questionIndex === prevFullIdx
      );
      setCurrentQuestion(prevIdx);
      setSelectedOptions(prevAnswer?.optionIndices ?? []);
    }
  }, [currentQuestion, answers, questions]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleHomeClick = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirmHome = useCallback(() => {
    sessionStorage.removeItem("fbti_answers");
    sessionStorage.removeItem("fbti_question_ids");
    sessionStorage.removeItem("fbti_quiz_version");
    sessionStorage.removeItem("fbti_test_mode");
    router.push("/test");
  }, [router]);

  const handleCancelHome = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  if (!question) return null;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Test Mode Banner */}
      <div className="fixed top-1 left-0 right-0 z-40 flex justify-center">
        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30">
          测试版
        </span>
      </div>

      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between">
        <Tooltip text="返回上一道题目" position="bottom">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-1"
          >
            <span>←</span>
            <span>上一题</span>
          </button>
        </Tooltip>
        
        <span className="text-gray-400 text-sm">
          {currentQuestion + 1} / {questions.length}
        </span>
        
        <Tooltip text="返回测试主页，进度不会保存" position="bottom">
          <button
            onClick={handleHomeClick}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xs"
          >
            返回主页
          </button>
        </Tooltip>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onConfirm={handleConfirmHome}
          onCancel={handleCancelHome}
        />
      )}

      {/* Question content */}
      <div
        className={`flex-1 flex flex-col items-center justify-start pt-2 px-6 pb-4 transition-all duration-300 ${
          animating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
        }`}
      >
        <h2 className="text-xl md:text-2xl font-medium text-center mb-6 leading-relaxed max-w-lg">
          {question.text}
        </h2>

        {/* Multi-select hint */}
        {isMultiSelect && (
          <p className="text-xs text-gray-500 mb-4">
            可选择 1-{question.maxSelect} 个最符合的选项
          </p>
        )}

        {/* Image placeholder */}
        {question.image && (
          <ImagePlaceholder image={question.image} posters={moviePosters} />
        )}

        {/* Options */}
        <div className="w-full max-w-md space-y-3 mt-4">
          {question.options.map((option: QuestionOption, index: number) => {
            const isSkip = option.type === "skip";
            const isSelected = selectedOptions.includes(index);

            // Skip item in binary_with_skip: render as subtle link at bottom
            if (isSkip && isBinaryWithSkip) {
              return (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className="w-full py-3 text-center text-sm text-gray-500
                             hover:text-gray-300 transition-colors"
                >
                  {option.label}
                </button>
              );
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`w-full p-4 text-left rounded-xl border transition-all duration-200 text-sm md:text-base leading-relaxed
                  ${
                    isSkip
                      ? "border-dashed border-gray-700 bg-transparent text-gray-500 hover:text-gray-300 hover:border-gray-500"
                      : isSelected
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-gray-700 bg-[#1a1f35] hover:border-amber-500/50 hover:bg-[#222845]"
                  }
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50`}
              >
                <div className="flex items-start gap-3">
                  {/* Radio/Checkbox indicator */}
                  <span
                    className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center
                      ${
                        isSkip
                          ? "border-gray-600"
                          : isSelected
                            ? "border-amber-500 bg-amber-500"
                            : "border-gray-500"
                      }`}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-gray-900" />
                    )}
                  </span>
                  <span>{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Next button for multiSelect */}
        {isMultiSelect && (
          <div className="mt-6 w-full max-w-md">
            <button
              onClick={() => handleNext(selectedOptions)}
              disabled={!canAdvance}
              className="w-full py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg
                         hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              下一题 →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

function ConfirmModal({ isOpen, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-[#1a1f35] rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
        <h3 className="text-lg font-medium text-white mb-3">确认返回主页？</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          答题进度将不会保存，确定要返回主页吗？
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-600 text-gray-300 text-sm
                       hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#d4a853] text-gray-900 text-sm font-medium
                       hover:bg-[#e0b86a] transition-all duration-200"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

function ImagePlaceholder({
  image,
  posters,
}: {
  image: {
    type: string;
    layout: string;
    tmdb?: { title_zh: string; title_en: string; year: number; hover: string }[];
    aiPrompts?: { position: string; prompt: string }[];
  };
  posters: Record<string, string | null>;
}) {
  const gradients: Record<string, string> = {
    single: "from-amber-900/40 to-gray-900/40",
    split: "from-blue-900/30 to-amber-900/30",
    grid3: "from-indigo-900/30 to-purple-900/30",
    grid4: "from-slate-800/40 to-gray-900/40",
  };

  if (image.layout === "single") {
    const film = image.tmdb?.[0];
    const poster = film ? posters[film.title_zh] : null;
    return (
      <div className="w-full max-w-[140px] md:max-w-[180px] mx-auto mb-3">
        {poster ? (
          <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-gray-700/50 shadow-lg">
            <img
              src={poster}
              alt={film?.title_zh}
              className="w-full h-full object-cover"
            />
            {/* 电影标题浮层 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <p className="text-white text-xs font-medium">{film?.title_zh}</p>
              {film?.title_en && film.title_en !== film.title_zh && (
                <p className="text-gray-300 text-[10px] mt-0.5">{film.title_en}</p>
              )}
            </div>
          </div>
        ) : (
          <div
            className={`w-full aspect-[2/3] rounded-lg overflow-hidden border border-gray-700/50 bg-gradient-to-br ${gradients.single} flex items-center justify-center`}
          >
            <span className="text-gray-600 text-xs">{film?.title_zh ?? "配图占位"}</span>
          </div>
        )}
      </div>
    );
  }

  if (image.layout === "split") {
    return (
      <div className="w-full max-w-[280px] md:max-w-[360px] mx-auto flex gap-2 mb-3">
        {image.tmdb?.map((film, i) => {
          const poster = posters[film.title_zh];
          return (
            <div key={i} className="flex-1">
              {poster ? (
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-gray-700/50 shadow-md">
                  <img
                    src={poster}
                    alt={film.title_zh}
                    className="w-full h-full object-cover"
                  />
                  {/* 电影标题浮层 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                    <p className="text-white text-[10px] font-medium">{film.title_zh}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[2/3] rounded-lg bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-600 text-[10px] text-center px-1 leading-tight">
                    {film.title_zh}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {image.aiPrompts && (
          <>
            <div className="flex-1 aspect-[2/3] rounded-lg bg-gradient-to-br from-blue-900/20 to-gray-900/20 border border-gray-700/50 flex items-center justify-center">
              <span className="text-gray-600 text-[10px]">AI 配图 (左)</span>
            </div>
            <div className="flex-1 aspect-[2/3] rounded-lg bg-gradient-to-br from-amber-900/20 to-gray-900/20 border border-gray-700/50 flex items-center justify-center">
              <span className="text-gray-600 text-[10px]">AI 配图 (右)</span>
            </div>
          </>
        )}
      </div>
    );
  }

  if (image.layout === "grid3") {
    return (
      <div className="w-full max-w-[280px] md:max-w-[360px] mx-auto grid grid-cols-3 gap-2 mb-3">
        {image.tmdb?.map((film, i) => {
          const poster = posters[film.title_zh];
          return (
            <div key={i}>
              {poster ? (
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-gray-700/50 shadow-sm">
                  <img
                    src={poster}
                    alt={film.title_zh}
                    className="w-full h-full object-cover"
                  />
                  {/* 电影标题浮层 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <p className="text-white text-[9px] font-medium leading-tight">{film.title_zh}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[2/3] rounded-lg bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-600 text-[9px] text-center px-1 leading-tight">
                    {film.title_zh}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (image.layout === "grid4") {
    return (
      <div className="w-full max-w-[240px] md:max-w-[320px] mx-auto grid grid-cols-2 gap-2 mb-3">
        {image.tmdb?.map((film, i) => {
          const poster = posters[film.title_zh];
          return (
            <div key={i}>
              {poster ? (
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border border-gray-700/50 shadow-sm">
                  <img
                    src={poster}
                    alt={film.title_zh}
                    className="w-full h-full object-cover"
                  />
                  {/* 电影标题浮层 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                    <p className="text-white text-[9px] font-medium leading-tight">{film.title_zh}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[2/3] rounded-lg bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 flex items-center justify-center">
                  <span className="text-gray-600 text-[9px] text-center px-1 leading-tight">
                    {film.title_zh}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback for ai_placeholder with split layout
  if (image.layout === "split" && image.aiPrompts) {
    return (
      <div className="w-full max-w-[280px] md:max-w-[360px] mx-auto flex gap-2 mb-3">
        <div className="flex-1 h-24 md:h-32 rounded-lg bg-gradient-to-br from-blue-900/20 to-gray-900/20 border border-gray-700/50 flex items-center justify-center">
          <span className="text-gray-600 text-[10px]">AI 配图 (左)</span>
        </div>
        <div className="flex-1 h-24 md:h-32 rounded-lg bg-gradient-to-br from-amber-900/20 to-gray-900/20 border border-gray-700/50 flex items-center justify-center">
          <span className="text-gray-600 text-[10px]">AI 配图 (右)</span>
        </div>
      </div>
    );
  }

  // Single AI placeholder
  return (
    <div
      className={`w-full max-w-[140px] md:max-w-[180px] h-28 md:h-36 rounded-lg bg-gradient-to-br ${gradients.single} border border-gray-700/50 flex items-center justify-center mb-3 mx-auto`}
    >
      <span className="text-gray-600 text-xs">配图占位</span>
    </div>
  );
}
