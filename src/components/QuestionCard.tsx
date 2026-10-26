import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Plus, 
  BookmarkCheck, 
  HelpCircle,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Question } from '../types';
import MathText from './MathText';
import { useExamCartStore } from '../store/examCartStore';

interface QuestionCardProps {
  question: Question;
  index?: number;
  initialMode?: 'practice' | 'teacher';
  onToast?: (message: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  initialMode = 'practice',
  onToast,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Interactive student state
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({
    a: null,
    b: null,
    c: null,
    d: null,
  });
  const [saInput, setSaInput] = useState('');
  const [saSubmitted, setSaSubmitted] = useState(false);

  // Cart store
  const { addQuestion, removeQuestion, hasQuestion } = useExamCartStore();
  const inCart = hasQuestion(question.id);

  // Difficulty badge styling
  const getDifficultyBadge = (lvl: number) => {
    switch (lvl) {
      case 1:
        return { label: 'Nhận biết', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 2:
        return { label: 'Thông hiểu', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 3:
        return { label: 'Vận dụng', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 4:
        return { label: 'Vận dụng cao', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Cơ bản', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  // Question type badge styling
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'mc':
        return { label: 'Phần I: Trắc nghiệm 4 lựa chọn', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'tf':
        return { label: 'Phần II: Đúng / Sai 4 ý', color: 'bg-violet-50 text-violet-700 border-violet-200' };
      case 'sa':
        return { label: 'Phần III: Trả lời ngắn', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      default:
        return { label: 'Trắc nghiệm', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const diffBadge = getDifficultyBadge(question.level);
  const typeBadge = getTypeBadge(question.type);

  // Copy LaTeX code to clipboard
  const handleCopyLatex = async () => {
    let latexContent = `% [${question.code}] - ${question.chapterName} - ${diffBadge.label}\n`;
    latexContent += `\\textbf{Câu ${index !== undefined ? index + 1 : ''}:} ${question.stem}\n\n`;

    if (question.type === 'mc' && question.choices) {
      const labels = ['A', 'B', 'C', 'D'];
      latexContent += '\\begin{tasks}(2)\n';
      question.choices.forEach((choice, idx) => {
        latexContent += `  \\task ${choice}\n`;
      });
      latexContent += '\\end{tasks}\n';
    } else if (question.type === 'tf' && question.statements) {
      latexContent += '\\begin{enumerate}[label=\\alph*)]\n';
      question.statements.forEach((st) => {
        latexContent += `  \\item ${st.text}\n`;
      });
      latexContent += '\\end{enumerate}\n';
    } else if (question.type === 'sa') {
      latexContent += `\\textbf{Đáp án:} ${question.saAnswer}\n`;
    }

    latexContent += `\n% Lời giải:\n${question.solution}`;

    try {
      await navigator.clipboard.writeText(latexContent);
      setCopied(true);
      if (onToast) onToast('Đã sao chép mã nguồn LaTeX!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Cart
  const handleToggleCart = () => {
    if (inCart) {
      removeQuestion(question.id);
      if (onToast) onToast(`Đã xóa câu [${question.code}] khỏi giỏ đề.`);
    } else {
      addQuestion(question);
      if (onToast) onToast(`Đã thêm câu [${question.code}] vào giỏ đề!`);
    }
  };

  // Reset interactive answers
  const handleReset = () => {
    setSelectedChoice(null);
    setTfAnswers({ a: null, b: null, c: null, d: null });
    setSaInput('');
    setSaSubmitted(false);
  };

  // Check SA numeric match (allowing both ',' and '.')
  const isSaCorrect = () => {
    if (!question.saAnswer || !saInput.trim()) return false;
    const cleanUser = saInput.trim().replace(',', '.');
    const cleanTarget = question.saAnswer.trim().replace(',', '.');
    const uNum = parseFloat(cleanUser);
    const tNum = parseFloat(cleanTarget);
    if (!isNaN(uNum) && !isNaN(tNum)) {
      const tol = question.saTolerance ?? 0.001;
      return Math.abs(uNum - tNum) <= tol;
    }
    return cleanUser.toLowerCase() === cleanTarget.toLowerCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden mb-6">
      {/* 1. Header Bar */}
      <div className="bg-slate-50/70 px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Question Index Badge */}
          {index !== undefined && (
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {index + 1}
            </span>
          )}

          {/* Question Code */}
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 tracking-wide">
            {question.code}
          </span>

          {/* Grade */}
          <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
            Lớp {question.grade}
          </span>

          {/* Type Badge */}
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${typeBadge.color}`}>
            {typeBadge.label}
          </span>

          {/* Difficulty Badge */}
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${diffBadge.bg}`}>
            {diffBadge.label}
          </span>
        </div>

        {/* Chapter & Topic hint */}
        <div className="text-xs text-slate-500 font-medium hidden sm:flex items-center gap-1.5 truncate max-w-xs">
          <span className="text-slate-400">#</span>
          <span className="truncate">{question.chapterName}</span>
          <span>•</span>
          <span className="truncate text-slate-600">{question.topicName}</span>
        </div>
      </div>

      {/* 2. Question Stem */}
      <div className="p-5 sm:p-6 text-slate-900">
        <div className="text-[15px] sm:text-base leading-relaxed mb-5">
          <MathText content={question.stem} />
        </div>

        {/* 3. Answer Section based on Question Type */}
        
        {/* TYPE 1: MULTIPLE CHOICE (PHẦN I) */}
        {question.type === 'mc' && question.choices && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {question.choices.map((choice, cIdx) => {
              const label = String.fromCharCode(65 + cIdx); // A, B, C, D
              const isSelected = selectedChoice === cIdx;
              const isCorrect = question.correctChoice === cIdx;

              let btnStyle = 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-slate-800';
              let badgeStyle = 'bg-slate-100 text-slate-700 group-hover:bg-indigo-600 group-hover:text-white';

              if (selectedChoice !== null) {
                if (isCorrect) {
                  btnStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-500';
                  badgeStyle = 'bg-emerald-600 text-white';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-400 bg-rose-50/70 text-rose-950 line-through ring-1 ring-rose-400';
                  badgeStyle = 'bg-rose-500 text-white';
                } else {
                  btnStyle = 'border-slate-200 opacity-60 text-slate-500';
                  badgeStyle = 'bg-slate-100 text-slate-400';
                }
              }

              return (
                <button
                  key={cIdx}
                  onClick={() => setSelectedChoice(cIdx)}
                  className={`group flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${btnStyle}`}
                >
                  <span
                    className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors duration-150 ${badgeStyle}`}
                  >
                    {label}
                  </span>
                  <div className="flex-1 pt-0.5 text-sm sm:text-[15px]">
                    <MathText content={choice} />
                  </div>
                  {selectedChoice !== null && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {selectedChoice !== null && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* TYPE 2: TRUE / FALSE (PHẦN II) */}
        {question.type === 'tf' && question.statements && (
          <div className="space-y-3 pt-2">
            {question.statements.map((st) => {
              const currentAns = tfAnswers[st.id];
              const isRevealed = currentAns !== null;
              const isStatementCorrect = currentAns === st.verdict;

              return (
                <div
                  key={st.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isRevealed
                      ? isStatementCorrect
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-rose-200 bg-rose-50/30'
                      : 'border-slate-200/90 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="shrink-0 w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center mt-0.5 border border-indigo-100">
                        {st.id})
                      </span>
                      <div className="text-sm sm:text-[15px] leading-relaxed text-slate-800">
                        <MathText content={st.text} />
                      </div>
                    </div>

                    {/* True / False Toggle Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() =>
                          setTfAnswers((prev) => ({ ...prev, [st.id]: true }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          currentAns === true
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Đúng
                      </button>
                      <button
                        onClick={() =>
                          setTfAnswers((prev) => ({ ...prev, [st.id]: false }))
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          currentAns === false
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Sai
                      </button>

                      {/* Verdict icon */}
                      {isRevealed && (
                        <span className="ml-1">
                          {isStatementCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Per-statement explanation if revealed */}
                  {isRevealed && st.explanation && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="font-semibold text-slate-700 shrink-0">Giải thích {st.id}):</span>
                      <MathText content={st.explanation} className="text-xs text-slate-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TYPE 3: SHORT ANSWER (PHẦN III) */}
        {question.type === 'sa' && (
          <div className="pt-2">
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 max-w-lg">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Nhập đáp án số (Ví dụ: 0,2 hoặc 15):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={saInput}
                  onChange={(e) => {
                    setSaInput(e.target.value);
                    setSaSubmitted(false);
                  }}
                  placeholder="Gõ kết quả..."
                  className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-sm sm:text-base bg-white"
                />
                <button
                  onClick={() => setSaSubmitted(true)}
                  disabled={!saInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs"
                >
                  Kiểm tra
                </button>
              </div>

              {saSubmitted && (
                <div
                  className={`mt-3 p-3 rounded-lg flex items-center justify-between text-xs sm:text-sm ${
                    isSaCorrect()
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isSaCorrect() ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Chính xác tuyệt đối! Đáp số chuẩn là: <strong>{question.saAnswer}</strong></span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Chưa chính xác. Đáp án đúng: <strong>{question.saAnswer}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reset answers button if user interacted */}
        {(selectedChoice !== null || Object.values(tfAnswers).some((v) => v !== null) || saSubmitted) && (
          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Làm lại câu này
            </button>
          </div>
        )}
      </div>

      {/* 4. Collapsible Solution Section */}
      {showSolution && (
        <div className="px-5 sm:px-6 pb-6 pt-2 bg-slate-50/50 border-t border-slate-100">
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-indigo-100/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3 text-indigo-700 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Hướng dẫn giải chi tiết</span>
            </div>
            <div className="text-sm leading-relaxed text-slate-700">
              <MathText content={question.solution} />
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer Actions */}
      <div className="bg-slate-50/90 px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: View solution & Copy LaTeX */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className={`px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
              showSolution
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {showSolution ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ẩn lời giải</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Xem lời giải</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLatex}
            className="px-3 py-1.5 rounded-lg font-medium bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Sao chép toàn bộ câu hỏi dạng LaTeX"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy LaTeX</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Cart and Source */}
        <div className="flex items-center gap-3">
          {question.source && (
            <span className="text-slate-400 italic hidden md:inline truncate max-w-xs" title={question.source}>
              {question.source}
            </span>
          )}

          <button
            onClick={handleToggleCart}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              inCart
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
            }`}
          >
            {inCart ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Đã thêm</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm vào đề</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
