import React, { useState } from 'react';
import { 
  Atom, 
  Layers, 
  Sparkles, 
  BookmarkCheck, 
  Trash2, 
  CheckCircle, 
  FileText, 
  GraduationCap, 
  BookOpen, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { SAMPLE_QUESTIONS } from './data/sampleQuestions';
import { QuestionCard } from './components/QuestionCard';
import { useExamCartStore } from './store/examCartStore';
import { QuestionType } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | QuestionType>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const { items: cartItems, removeQuestion, clearCart } = useExamCartStore();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter questions by type
  const filteredQuestions = SAMPLE_QUESTIONS.filter((q) => {
    if (activeTab === 'all') return true;
    return q.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* 1. Header Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Atom className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Physi<span className="text-indigo-600">TIAD</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  BGD 2025
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Hệ thống ngân hàng câu hỏi & Thẻ đề thi Vật Lý chuẩn định dạng mới
              </p>
            </div>
          </div>

          {/* Right actions: Cart & GitHub */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCartDrawer(!showCartDrawer)}
              className="relative px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center gap-2 border border-indigo-200/80 transition-all cursor-pointer shadow-xs"
            >
              <BookmarkCheck className="w-4 h-4 text-indigo-600" />
              <span>Giỏ đề thi</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[11px] font-bold">
                {cartItems.length}
              </span>
            </button>

            <a
              href="https://github.com/hoaihuy2609/physiTIAD"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              title="GitHub Repository"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero & Highlights */}
      <section className="bg-white border-b border-slate-200/70 py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thẻ Đề Bài Thông Minh (MathTIAD-Engine)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Ngân Hàng Câu Hỏi Vật Lý Chuẩn KaTeX
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Hỗ trợ trọn vẹn 3 dạng thức thi tốt nghiệp THPT năm 2025: <strong className="text-slate-800">Trắc nghiệm 4 lựa chọn</strong>, <strong className="text-slate-800">Đúng/Sai 4 ý</strong> và <strong className="text-slate-800">Trả lời ngắn</strong>.
              </p>
            </div>

            {/* Quick Stat Pill Cards */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-center">
                <div className="text-xs text-slate-500 font-medium">Phần I</div>
                <div className="text-lg font-bold text-indigo-600 mt-0.5">18 câu</div>
                <div className="text-[11px] text-slate-400">0.25đ / câu</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-center">
                <div className="text-xs text-slate-500 font-medium">Phần II</div>
                <div className="text-lg font-bold text-violet-600 mt-0.5">4 câu</div>
                <div className="text-[11px] text-slate-400">4 ý Đúng/Sai</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-center">
                <div className="text-xs text-slate-500 font-medium">Phần III</div>
                <div className="text-lg font-bold text-cyan-600 mt-0.5">6 câu</div>
                <div className="text-[11px] text-slate-400">Điền số ngắn</div>
              </div>
            </div>
          </div>

          {/* 3. Category / Type Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Tất cả các câu ({SAMPLE_QUESTIONS.length})
            </button>
            <button
              onClick={() => setActiveTab('mc')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'mc'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200'
              }`}
            >
              Phần I: Trắc nghiệm (4 phương án)
            </button>
            <button
              onClick={() => setActiveTab('tf')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'tf'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-violet-50 hover:text-violet-700 border border-slate-200'
              }`}
            >
              Phần II: Đúng / Sai (4 ý a,b,c,d)
            </button>
            <button
              onClick={() => setActiveTab('sa')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'sa'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-cyan-50 hover:text-cyan-700 border border-slate-200'
              }`}
            >
              Phần III: Trả lời ngắn (Điền số)
            </button>
          </div>
        </div>
      </section>

      {/* 4. Question Feed */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Hiển thị {filteredQuestions.length} câu hỏi mẫu:</span>
          </div>

          <div className="text-xs text-slate-500 italic">
            * Nhấp vào đáp án hoặc gõ số để trải nghiệm tính năng chấm tương tác
          </div>
        </div>

        {/* Question Cards List */}
        <div>
          {filteredQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              onToast={showToast}
            />
          ))}
        </div>
      </main>

      {/* 5. Exam Cart Drawer Modal */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Giỏ Đề Thi ({cartItems.length})</h3>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <BookmarkCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Giỏ đề thi hiện đang trống</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Bấm nút <strong>"+ Thêm vào đề"</strong> ở góc dưới mỗi câu để đưa vào đây!
                  </p>
                </div>
              ) : (
                cartItems.map((item, i) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-slate-500">Lớp {item.grade}</span>
                      </div>
                      <div className="text-xs text-slate-700 line-clamp-2">
                        {item.stem.replace(/[$#\\]/g, '')}
                      </div>
                    </div>
                    <button
                      onClick={() => removeQuestion(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => {
                    showToast('Đã sao chép cấu trúc đề thi!');
                  }}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Xuất Ma Trận & Soạn Đề ({cartItems.length} câu)</span>
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    showToast('Đã làm trống giỏ đề thi!');
                  }}
                  className="w-full py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Xóa toàn bộ giỏ
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 7. Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">PhysiTIAD Project</span>
            <span>—</span>
            <span>Kho câu hỏi Vật Lý THPT 2025</span>
          </div>
          <div>
            Kế thừa thuật toán từ <span className="font-semibold text-indigo-600">PhysiVault</span> & Kiến trúc <span className="font-semibold text-indigo-600">MathTIAD</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
