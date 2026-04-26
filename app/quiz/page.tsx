"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { questions as allQuestions, QuestionOption } from "@/data/questions";
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

// Apple-style easing curves
const appleEaseSmooth: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
const appleEaseOut: [number, number, number, number] = [0.43, 0.13, 0.23, 0.96];

// Stagger animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};
const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { type: "tween" as const, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function QuizPage() {
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [moviePosters, setMoviePosters] = useState<Record<string, string | null>>({});
  const [direction, setDirection] = useState(1); // 1=forward, -1=backward
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Refs for latest state in event handlers
  const stateRef = useRef({ isTransitioning, currentQuestion, answers, selectedOptions });
  useEffect(() => {
    stateRef.current = { isTransitioning, currentQuestion, answers, selectedOptions };
  }, [isTransitioning, currentQuestion, answers, selectedOptions]);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        return allQuestions.map((_, i) => i + 1);
      }
    }
    return allQuestions.map((_, i) => i + 1);
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

  // Check if current question has been answered
  const currentAnswered = useMemo(() => {
    if (!question) return false;
    const fullIdx = allQuestions.findIndex(q => q.id === question.id);
    return answers.some(a => a.questionIndex === fullIdx);
  }, [question, answers]);

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
      if (isTransitioning) return;

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
      handleNext([optIdx]);
    },
    [isTransitioning, isMultiSelect, question]
  );

  const handleNext = useCallback(
    (opts: number[]) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setDirection(1);

      // Use the full array index so calculator.ts maps to the correct question
      const currentQ = questions[currentQuestion];
      const fullArrayIndex = allQuestions.findIndex(q => q.id === currentQ.id);
      const newAnswers = answers.filter(
        (a) => a.questionIndex !== fullArrayIndex
      );
      newAnswers.push({ questionIndex: fullArrayIndex, optionIndices: opts });
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOptions([]);
      } else {
        const result = calculateResult(newAnswers);
        sessionStorage.setItem("fbti_result", JSON.stringify(result));
        sessionStorage.removeItem("fbti_answers");
        sessionStorage.removeItem("fbti_question_ids");
        router.push("/result");
      }
    },
    [isTransitioning, answers, currentQuestion, router, questions]
  );

  const handleBack = useCallback(() => {
    if (isTransitioning) return;
    if (currentQuestion > 0) {
      setIsTransitioning(true);
      setDirection(-1);
      const prevIdx = currentQuestion - 1;
      const prevQ = questions[prevIdx];
      const prevFullIdx = allQuestions.findIndex(q => q.id === prevQ.id);
      const prevAnswer = answers.find(
        (a) => a.questionIndex === prevFullIdx
      );
      setCurrentQuestion(prevIdx);
      setSelectedOptions(prevAnswer?.optionIndices ?? []);
    }
  }, [isTransitioning, currentQuestion, answers, questions]);

  // Scroll/gesture next: only advance if current question already answered
  const handleScrollNext = useCallback(() => {
    const { isTransitioning: trans, currentQuestion: cq, answers: ans, selectedOptions: sel } = stateRef.current;
    if (trans) return;
    const currentQ = questions[cq];
    if (!currentQ) return;

    // 多选题且有选中选项 → 走 handleNext 保存答案
    if (currentQ.questionType === "multiSelect" && sel.length > 0) {
      handleNext(sel);
      return;
    }

    const fullIdx = allQuestions.findIndex(q => q.id === currentQ.id);
    const answered = ans.some(a => a.questionIndex === fullIdx);
    if (!answered) return;

    // Already answered, advance with existing answer
    if (cq < questions.length - 1) {
      setIsTransitioning(true);
      setDirection(1);
      setCurrentQuestion(cq + 1);
    } else {
      // Last question: go to result
      const result = calculateResult(ans);
      sessionStorage.setItem("fbti_result", JSON.stringify(result));
      sessionStorage.removeItem("fbti_answers");
      sessionStorage.removeItem("fbti_question_ids");
      router.push("/result");
    }
  }, [questions, router, handleNext]);

  const handleScrollBack = useCallback(() => {
    const { isTransitioning: trans, currentQuestion: cq, answers: ans } = stateRef.current;
    if (trans) return;
    if (cq > 0) {
      setIsTransitioning(true);
      setDirection(-1);
      const prevIdx = cq - 1;
      const prevQ = questions[prevIdx];
      const prevFullIdx = allQuestions.findIndex(q => q.id === prevQ.id);
      const prevAnswer = ans.find((a) => a.questionIndex === prevFullIdx);
      setCurrentQuestion(prevIdx);
      setSelectedOptions(prevAnswer?.optionIndices ?? []);
    }
  }, [questions]);

  // Refs for scroll handlers (used by wheel event with empty deps)
  const handleScrollNextRef = useRef(handleScrollNext);
  const handleScrollBackRef = useRef(handleScrollBack);
  useEffect(() => {
    handleScrollNextRef.current = handleScrollNext;
    handleScrollBackRef.current = handleScrollBack;
  }, [handleScrollNext, handleScrollBack]);

  const handleHomeClick = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirmHome = useCallback(() => {
    sessionStorage.removeItem("fbti_answers");
    sessionStorage.removeItem("fbti_question_ids");
    sessionStorage.removeItem("fbti_quiz_version");
    router.push("/");
  }, [router]);

  const handleCancelHome = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  // --- Gesture / Scroll / Keyboard handlers ---

  // Mouse wheel / trackpad — with trackpad inertia protection
  useEffect(() => {
    let lastScrollTime = 0;
    let accumulatedDelta = 0;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    const COOLDOWN = 1200; // covers full animation cycle (enter 0.7s + exit 0.5s)
    const DELTA_THRESHOLD = 30; // accumulated delta threshold to filter micro-scrolls

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Hard lock: completely ignore during animation
      if (stateRef.current.isTransitioning) {
        accumulatedDelta = 0;
        return;
      }

      // Cooldown check
      const now = Date.now();
      if (now - lastScrollTime < COOLDOWN) return;

      // Filter tiny delta values from trackpad inertia tail
      if (Math.abs(e.deltaY) < 5) return;

      // Accumulate delta; reset after gesture ends (150ms idle)
      accumulatedDelta += e.deltaY;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);

      // Only trigger when accumulated amount exceeds threshold
      if (Math.abs(accumulatedDelta) < DELTA_THRESHOLD) return;

      // Trigger page turn
      lastScrollTime = now;
      const dir = accumulatedDelta > 0 ? 1 : -1;
      accumulatedDelta = 0;

      if (dir > 0) {
        handleScrollNextRef.current();
      } else {
        handleScrollBackRef.current();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []); // empty deps — access latest state via refs

  // Mobile touch swipe — with distance + velocity thresholds to avoid accidental page turns
  useEffect(() => {
    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (stateRef.current.isTransitioning) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      const deltaTime = Date.now() - touchStartTime;
      const velocity = Math.abs(deltaY) / deltaTime; // px/ms

      // Must satisfy BOTH: distance > 120px AND velocity > 0.3 px/ms (fast swipe)
      const DISTANCE_THRESHOLD = 120;
      const VELOCITY_THRESHOLD = 0.3;

      if (Math.abs(deltaY) > DISTANCE_THRESHOLD && velocity > VELOCITY_THRESHOLD) {
        if (deltaY > 0) {
          // Swipe up = next question
          handleScrollNextRef.current();
        } else {
          // Swipe down = previous question
          handleScrollBackRef.current();
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []); // empty deps — access latest handlers via refs

  // Keyboard arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // ignore long-press repeats
      if (stateRef.current.isTransitioning) return;
      if (e.key === "ArrowDown") handleScrollNextRef.current();
      if (e.key === "ArrowUp") handleScrollBackRef.current();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // empty deps — access latest handlers via refs

  // Handle "Next" button click from navbar
  const handleNavNext = useCallback(() => {
    if (isTransitioning || !canAdvance) return;
    handleNext(selectedOptions);
  }, [isTransitioning, canAdvance, selectedOptions, handleNext]);

  if (!question) return null;

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <>

      <main className="min-h-screen h-screen flex flex-col overflow-hidden">
      {/* Progress bar with integrated progress text */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-800 relative">
          <div
            className="h-full bg-amber-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header: [← 上一题]  [🏠 返回首页]  [下一题 →] */}
      <div className="px-4 md:px-6 pt-5 pb-3 flex items-center justify-between">
        {/* Left: Back */}
        <Tooltip text="返回上一道题目" position="bottom">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className={`text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1
              ${currentQuestion === 0 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <span>←</span>
            <span>上一题</span>
          </button>
        </Tooltip>

        {/* Center: Home */}
        <Tooltip text="返回主页，进度不会保存" position="bottom">
          <button
            onClick={handleHomeClick}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xs flex items-center gap-1"
          >
            <span>返回首页</span>
          </button>
        </Tooltip>

        {/* Right: Next / View Result */}
        <Tooltip text={isLastQuestion ? "查看测试结果" : "前往下一道题目"} position="bottom">
          <button
            onClick={handleNavNext}
            disabled={!canAdvance || isTransitioning}
            className={`text-sm flex items-center gap-1 transition-colors
              ${canAdvance && !isTransitioning
                ? "text-amber-400 hover:text-amber-300"
                : "text-gray-600 cursor-not-allowed opacity-40"
              }`}
          >
            <span>{isLastQuestion ? "查看结果" : "下一题"}</span>
            <span>→</span>
          </button>
        </Tooltip>
      </div>

      {/* Progress info */}
      <div className="text-center pb-2">
        <span className="text-gray-500 text-xs">{currentQuestion + 1} / {questions.length}</span>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <ConfirmModal
          isOpen={showConfirmModal}
          onConfirm={handleConfirmHome}
          onCancel={handleCancelHome}
        />
      )}

      {/* Question content with Apple-style page transition */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-hidden">
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => setIsTransitioning(false)}>
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: direction > 0 ? 100 : -100, scale: 0.97 }}
            animate={{
              opacity: 1, y: 0, scale: 1,
              transition: { duration: 0.7, ease: appleEaseSmooth },
            }}
            exit={{
              opacity: 0, y: direction > 0 ? -100 : 100, scale: 0.97,
              transition: { duration: 0.5, ease: appleEaseOut },
            }}
            style={{ willChange: "transform, opacity" }}
            className="translate-gpu w-full flex flex-col items-center pt-2 px-6 pb-4"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full flex flex-col items-center"
            >
              {/* Question text */}
              <motion.h2
                variants={itemVariants}
                className="text-xl md:text-2xl font-medium text-center mb-6 leading-relaxed max-w-lg"
              >
                {question.text}
              </motion.h2>

              {/* Multi-select hint */}
              {isMultiSelect && (
                <motion.p variants={itemVariants} className="text-xs text-gray-500 mb-4">
                  可选择 1-{question.maxSelect} 个最符合的选项
                </motion.p>
              )}

              {/* Image placeholder */}
              {question.image && (
                <motion.div variants={itemVariants}>
                  <ImagePlaceholder image={question.image} posters={moviePosters} />
                </motion.div>
              )}

              {/* Options */}
              <div className="w-full max-w-md space-y-3 mt-4">
                {question.options.map((option: QuestionOption, index: number) => {
                  const isSkip = option.type === "skip";
                  const isSelected = selectedOptions.includes(index);

                  if (isSkip && isBinaryWithSkip) {
                    return (
                      <motion.button
                        key={index}
                        variants={itemVariants}
                        onClick={() => handleOptionClick(index)}
                        className="w-full py-3 text-center text-sm text-gray-500
                                   hover:text-gray-300 transition-colors"
                      >
                        {option.label}
                      </motion.button>
                    );
                  }

                  return (
                    <motion.button
                      key={index}
                      variants={itemVariants}
                      onClick={() => handleOptionClick(index)}
                      className={`w-full p-4 text-left rounded-xl border text-sm md:text-base leading-relaxed transition-colors duration-200
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
                    </motion.button>
                  );
                })}
              </div>

              {/* Next button for multiSelect */}
              {isMultiSelect && (
                <motion.div variants={itemVariants} className="mt-6 w-full max-w-md">
                  <button
                    onClick={() => handleNext(selectedOptions)}
                    disabled={!canAdvance}
                    className="w-full py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg
                               hover:bg-amber-400 disabled:opacity-30 disabled:cursor-not-allowed
                               transition-all duration-200"
                  >
                    {isLastQuestion ? "查看结果" : "下一题 →"}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
    </>
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
