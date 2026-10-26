import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  BookmarkCheck, 
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Question } from '../types';
import MathText from './MathText';
import { useExamCartStore } from '../store/examCartStore';

interface QuestionCardProps {
  question: Question;
  index: number;
  mode?: 'practice' | 'teacher';
  fontMode?: 'modern' | 'academic';
  onToast?: (msg: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  mode = 'practice',
  fontMode = 'modern',
  onToast,
}) => {
  const [showSolution, setShowSolution] = useState(false);
  const [copied, setCopied] = useState(false);

  // Student interaction states
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [tfAnswers, setTfAnswers] = useState<Record<string, boolean | null>>({
    a: null,
    b: null,
    c: null,
    d: null,
  });
  const [saInput, setSaInput] = useState('');
  const [saSubmitted, setSaSubmitted] = useState(false);

  const { addQuestion, removeQuestion, hasQuestion } = useExamCartStore();
  const inCart = hasQuestion(question.id);

  // Difficulty badge colors
  const getDifficultyPill = (level: number) => {
    switch (level) {
      case 1:
        return { label: 'Nhận biết', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' };
      case 2:
        return { label: 'Thông hiểu', cls: 'bg-sky-50 text-sky-700 border-sky-200/80' };
      case 3:
        return { label: 'Vận dụng', cls: 'bg-amber-50 text-amber-700 border-amber-200/80' };
      case 4:
        return { label: 'Vận dụng cao', cls: 'bg-rose-50 text-rose-700 border-rose-200/80' };
      default:
        return { label: 'Cơ bản', cls: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mc':
        return 'Phần I: Trắc nghiệm';
      case 'tf':
        return 'Phần II: Đúng / Sai';
      case 'sa':
        return 'Phần III: Điền số ngắn';
      default:
        return 'Câu hỏi';
    }
  };

  const diffPill = getDifficultyPill(question.level);

  // Copy LaTeX
  const handleCopyLatex = async () => {
    let latex = `% ${question.code} - ${question.chapterName}\n`;
    latex += `\\begin{ex}%[${question.code}]\n  ${question.stem}\n`;
    if (question.type === 'mc' && question.choices) {
      latex += '  \\choice\n';
      question.choices.forEach((c) => {
        latex += `  {${c}}\n`;
      });
    } else if (question.type === 'tf' && question.statements) {
      latex += '  \\begin{statements}\n';
      question.statements.forEach((s) => {
        latex += `    \\item[${s.verdict ? 'T' : 'F'}] ${s.text}\n`;
      });
      latex += '  \\end{statements}\n';
    } else if (question.type === 'sa') {
      latex += `  \\shortans{${question.saAnswer}}\n`;
    }
    latex += `  \\loigiai{\n    ${question.solution}\n  }\n\\end{ex}`;

    try {
      await navigator.clipboard.writeText(latex);
      setCopied(true);
      if (onToast) onToast('Đã sao chép mã nguồn LaTeX!');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleCart = () => {
    if (inCart) {
      removeQuestion(question.id);
      if (onToast) onToast(`Đã bỏ câu [${question.code}] khỏi giỏ đề.`);
    } else {
      addQuestion(question);
      if (onToast) onToast(`Đã thêm câu [${question.code}] vào giỏ đề!`);
    }
  };

  const isSaMatch = () => {
    if (!question.saAnswer || !saInput.trim()) return false;
    const u = parseFloat(saInput.trim().replace(',', '.'));
    const t = parseFloat(question.saAnswer.trim().replace(',', '.'));
    if (!isNaN(u) && !isNaN(t)) {
      return Math.abs(u - t) <= (question.saTolerance ?? 0.001);
    }
    return saInput.trim().toLowerCase() === question.saAnswer.trim().toLowerCase();
  };

  const hasInteracted =
    selectedChoice !== null ||
    Object.values(tfAnswers).some((v) => v !== null) ||
    saSubmitted;

  return (
    <article className="bg-white rounded-xl border border-[#E9E9E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D5D5CF] transition-all duration-150 mb-5 overflow-hidden">
      {/* 1. Header Bar */}
      <div className="px-5 py-3 border-b border-[#F1F0EC] bg-[#FCFCFA] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {/* Question Index */}
          <span className="font-bold text-slate-900 text-sm">
            Câu {index + 1}.
          </span>

          {/* Question Code */}
          <span className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F1F0EC] text-[#57564F] border border-[#E9E9E7]">
            {question.code}
          </span>

          {/* Type */}
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-50/70 text-indigo-700 border border-indigo-100">
            {getTypeLabel(question.type)}
          </span>

          {/* Difficulty */}
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${diffPill.cls}`}>
            {diffPill.label}
          </span>
        </div>

        {/* Topic breadcrumb */}
        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 truncate">
          <span>{question.chapterName}</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700">{question.topicName}</span>
        </div>
      </div>

      {/* 2. Question Stem */}
      <div className={`p-5 sm:p-6 ${fontMode === 'academic' ? 'font-academic' : 'font-modern'}`}>
        <div className={`leading-relaxed font-normal mb-5 ${fontMode === 'academic' ? 'text-[16px] text-[#111827]' : 'text-[15px] text-slate-900'}`}>
          <MathText content={question.stem} />
        </div>

        {/* 3. Answers Presentation */}

        {/* MULTIPLE CHOICE (PHẦN I) */}
        {question.type === 'mc' && question.choices && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {question.choices.map((choice, cIdx) => {
              const label = String.fromCharCode(65 + cIdx);
              const isSelected = selectedChoice === cIdx;
              const isCorrect = question.correctChoice === cIdx;
              const showResult = selectedChoice !== null;

              let cardCls = 'border-[#E9E9E7] bg-white hover:bg-[#FAFAF9] hover:border-slate-300 text-slate-800';
              let badgeCls = 'border-slate-300 text-slate-600 bg-slate-50';

              if (showResult) {
                if (isCorrect) {
                  cardCls = 'border-emerald-500 bg-emerald-50/40 text-emerald-950 font-medium';
                  badgeCls = 'border-emerald-600 bg-emerald-600 text-white';
                } else if (isSelected && !isCorrect) {
                  cardCls = 'border-rose-300 bg-rose-50/30 text-rose-900 line-through';
                  badgeCls = 'border-rose-500 bg-rose-500 text-white';
                } else {
                  cardCls = 'border-[#EBEBE8] opacity-50 text-slate-400';
                  badgeCls = 'border-slate-200 text-slate-300 bg-white';
                }
              }

              return (
                <button
                  key={cIdx}
                  onClick={() => setSelectedChoice(cIdx)}
                  className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all cursor-pointer ${cardCls}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition-colors ${badgeCls}`}
                  >
                    {label}
                  </span>
                  <div className={`leading-relaxed flex-1 pt-0.5 ${fontMode === 'academic' ? 'text-[15.5px]' : 'text-sm'}`}>
                    <MathText content={choice} />
                  </div>
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* TRUE / FALSE (PHẦN II) */}
        {question.type === 'tf' && question.statements && (
          <div className="border border-[#E9E9E7] rounded-lg overflow-hidden divide-y divide-[#E9E9E7]">
            {question.statements.map((st) => {
              const currentAns = tfAnswers[st.id];
              const isAnswered = currentAns !== null;
              const isCorrect = currentAns === st.verdict;

              return (
                <div
                  key={st.id}
                  className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    isAnswered
                      ? isCorrect
                        ? 'bg-emerald-50/20'
                        : 'bg-rose-50/20'
                      : 'hover:bg-[#FCFCFA]'
                  }`}
                >
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className={`font-bold text-slate-900 shrink-0 ${fontMode === 'academic' ? 'text-base' : 'text-sm'}`}>
                      {st.id})
                    </span>
                    <div className={`leading-relaxed text-slate-800 ${fontMode === 'academic' ? 'text-[15.5px]' : 'text-sm'}`}>
                      <MathText content={st.text} />
                      {isAnswered && st.explanation && (
                        <div className="mt-1 text-xs text-slate-500 flex items-start gap-1">
                          <span className="font-semibold text-slate-700">Giải thích:</span>
                          <MathText content={st.explanation} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Segmented True/False buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <div className="inline-flex rounded-lg border border-[#E2E2DE] p-0.5 bg-[#F7F6F3]">
                      <button
                        onClick={() =>
                          setTfAnswers((prev) => ({ ...prev, [st.id]: true }))
                        }
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          currentAns === true
                            ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Đúng
                      </button>
                      <button
                        onClick={() =>
                          setTfAnswers((prev) => ({ ...prev, [st.id]: false }))
                        }
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          currentAns === false
                            ? 'bg-white text-rose-700 shadow-xs border border-rose-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Sai
                      </button>
                    </div>

                    {isAnswered && (
                      <span className="w-5 flex items-center justify-center">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SHORT ANSWER (PHẦN III) */}
        {question.type === 'sa' && (
          <div className="pt-1">
            <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 rounded-lg border border-[#E2E2DE] bg-[#F7F6F3]">
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md border border-[#E9E9E7]">
                <span className="text-xs text-slate-500 font-medium">Đáp số:</span>
                <input
                  type="text"
                  value={saInput}
                  onChange={(e) => {
                    setSaInput(e.target.value);
                    setSaSubmitted(false);
                  }}
                  placeholder="Gõ số..."
                  className="font-mono text-sm text-slate-900 focus:outline-hidden w-28 bg-transparent"
                />
              </div>

              <button
                onClick={() => setSaSubmitted(true)}
                disabled={!saInput.trim()}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-medium rounded-md transition-all cursor-pointer"
              >
                Kiểm tra
              </button>
            </div>

            {saSubmitted && (
              <div
                className={`mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
                  isSaMatch()
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {isSaMatch() ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Chính xác! Đáp án đúng: <strong>{question.saAnswer}</strong></span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Chưa đúng. Đáp án chuẩn: <strong>{question.saAnswer}</strong></span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Interacted Reset */}
        {hasInteracted && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => {
                setSelectedChoice(null);
                setTfAnswers({ a: null, b: null, c: null, d: null });
                setSaInput('');
                setSaSubmitted(false);
              }}
              className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Làm lại câu này
            </button>
          </div>
        )}
      </div>

      {/* 4. Collapsible Solution */}
      {showSolution && (
        <div className="px-5 pb-5 pt-1 bg-[#FCFCFA] border-t border-[#F1F0EC]">
          <div className="p-4 rounded-lg bg-white border border-[#E9E9E7] shadow-xs">
            <div className="flex items-center gap-1.5 text-indigo-700 font-semibold text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Lời giải chi tiết</span>
            </div>
            <div className="text-sm leading-relaxed text-slate-700">
              <MathText content={question.solution} />
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer Actions Toolbar */}
      <div className="px-5 py-2.5 border-t border-[#F1F0EC] bg-white flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: View solution & Copy LaTeX */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-[#F1F0EC] transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            {showSolution ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Ẩn lời giải</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Xem lời giải</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyLatex}
            className="px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-[#F1F0EC] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            title="Sao chép câu hỏi dưới dạng LaTeX"
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

        {/* Right: Source & Cart */}
        <div className="flex items-center gap-3">
          {question.source && (
            <span className="text-slate-400 text-[11px] hidden sm:inline truncate max-w-xs" title={question.source}>
              {question.source}
            </span>
          )}

          <button
            onClick={handleToggleCart}
            className={`px-3 py-1 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              inCart
                ? 'bg-emerald-600 text-white'
                : 'bg-[#F1F0EC] text-slate-800 hover:bg-[#EBEBE8] border border-[#E2E2DE]'
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
    </article>
  );
};

export default QuestionCard;
