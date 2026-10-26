import React, { useState } from 'react';
import { 
  Atom, 
  Layers, 
  Search, 
  BookmarkCheck, 
  FileDown, 
  Trash2, 
  CheckCircle, 
  BookOpen, 
  SlidersHorizontal,
  ChevronRight,
  GraduationCap,
  Sparkles,
  FileText,
  Clock,
  Printer,
  Compass,
  Menu,
  X
} from 'lucide-react';
import { SAMPLE_QUESTIONS } from './data/sampleQuestions';
import { QuestionCard } from './components/QuestionCard';
import { useExamCartStore } from './store/examCartStore';
import { QuestionType, DifficultyLevel } from './types';

export const App: React.FC = () => {
  // Navigation & Filter State
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>(12);
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<DifficultyLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fontMode, setFontMode] = useState<'modern' | 'academic'>('academic');
  
  // UI states
  const [showMatrixDrawer, setShowMatrixDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { items: cartItems, removeQuestion, clearCart } = useExamCartStore();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filter logic
  const filteredQuestions = SAMPLE_QUESTIONS.filter((q) => {
    if (selectedGrade !== 'all' && q.grade !== selectedGrade) return false;
    if (selectedType !== 'all' && q.type !== selectedType) return false;
    if (selectedLevel !== 'all' && q.level !== selectedLevel) return false;
    if (searchQuery.trim()) {
      const qText = `${q.code} ${q.stem} ${q.chapterName} ${q.topicName}`.toLowerCase();
      if (!qText.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  // Calculate cart counts by part
  const cartMC = cartItems.filter((q) => q.type === 'mc').length;
  const cartTF = cartItems.filter((q) => q.type === 'tf').length;
  const cartSA = cartItems.filter((q) => q.type === 'sa').length;
  const totalCartScore = (cartMC * 0.25 + cartTF * 1.0 + cartSA * 0.25).toFixed(2);

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#191919] flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-[#E9E9E7] sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 rounded-md hover:bg-[#F1F0EC] text-slate-600"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
              <Atom className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900">
                Physi<span className="text-indigo-600">TIAD</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F1F0EC] text-[#57564F] border border-[#E2E2DE]">
                2025
              </span>
            </div>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200 mx-1" />

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <span>Ngân hàng câu hỏi</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-medium">Vật Lý {selectedGrade === 'all' ? '10-11-12' : selectedGrade}</span>
          </nav>
        </div>

        {/* Right Top Actions */}
        <div className="flex items-center gap-2.5">
          {/* Font Mode Switcher */}
          <div className="hidden sm:inline-flex items-center rounded-lg border border-[#E9E9E7] p-0.5 bg-[#F7F6F3]">
            <button
              onClick={() => setFontMode('academic')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                fontMode === 'academic'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#E2E2DE] font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Phông chữ Học thuật / Đề thi chuẩn (STIX Two / Times New Roman)"
            >
              Phông Đề thi (Times)
            </button>
            <button
              onClick={() => setFontMode('modern')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                fontMode === 'modern'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#E2E2DE] font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Phông chữ Hiện đại (Be Vietnam Pro)"
            >
              Phông Hiện đại
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative hidden md:block w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm công thức, mã câu..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E9E9E7] bg-[#F7F6F3] text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Cart Matrix Button */}
          <button
            onClick={() => setShowMatrixDrawer(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>Ma trận đề ({cartItems.length}/28)</span>
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <aside
          className={`fixed md:sticky top-14 left-0 z-30 h-[calc(100vh-3.5rem)] w-64 bg-white border-r border-[#E9E9E7] p-4 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'
          }`}
        >
          {/* Mobile close */}
          <div className="md:hidden flex justify-between items-center pb-3 border-b border-[#E9E9E7] mb-3">
            <span className="font-semibold text-xs text-slate-700">Bộ lọc & Phân loại</span>
            <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 text-xs pr-1">
            {/* 1. KHỐI LỚP */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Khối Lớp (GDPT 2018)
              </div>
              <div className="space-y-1">
                {[
                  { id: 12, label: 'Vật Lý 12', count: 3 },
                  { id: 11, label: 'Vật Lý 11', count: 0 },
                  { id: 10, label: 'Vật Lý 10', count: 0 },
                  { id: 'all', label: 'Tất cả các lớp', count: 3 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedGrade(item.id as number | 'all');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                      selectedGrade === item.id
                        ? 'bg-[#F1F0EC] text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-[#F7F6F3] hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. DẠNG THỨC ĐỀ THI 2025 */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Dạng Thức BGD 2025
              </div>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Tất cả định dạng', count: 3 },
                  { id: 'mc', label: 'Phần I: Trắc nghiệm 4 PA', count: 1 },
                  { id: 'tf', label: 'Phần II: Đúng / Sai 4 ý', count: 1 },
                  { id: 'sa', label: 'Phần III: Điền số ngắn', count: 1 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedType(item.id as QuestionType | 'all');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                      selectedType === item.id
                        ? 'bg-[#F1F0EC] text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-[#F7F6F3] hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-[11px] text-slate-400 font-mono shrink-0 ml-1">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. MỨC ĐỘ NHẬN THỨC */}
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Mức Độ Nhận Thức
              </div>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Tất cả mức độ', dot: 'bg-slate-400' },
                  { id: 1, label: 'Mức 1: Nhận biết', dot: 'bg-emerald-500' },
                  { id: 2, label: 'Mức 2: Thông hiểu', dot: 'bg-sky-500' },
                  { id: 3, label: 'Mức 3: Vận dụng', dot: 'bg-amber-500' },
                  { id: 4, label: 'Mức 4: Vận dụng cao', dot: 'bg-rose-500' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedLevel(item.id as DifficultyLevel | 'all');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${
                      selectedLevel === item.id
                        ? 'bg-[#F1F0EC] text-slate-900 font-semibold'
                        : 'text-slate-600 hover:bg-[#F7F6F3] hover:text-slate-900'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${item.dot} shrink-0`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. TIỆN ÍCH SOẠN ĐỀ */}
            <div className="pt-2 border-t border-[#E9E9E7]">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Tiện Ích MathTIAD
              </div>
              <div className="space-y-1 text-slate-600">
                <button
                  onClick={() => setShowMatrixDrawer(true)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#F7F6F3] hover:text-slate-900 cursor-pointer text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Cấu trúc đề THPTQG</span>
                </button>
                <button
                  onClick={() => showToast('Tính năng xuất Word (.docx) đang chuẩn bị tích hợp!')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-[#F7F6F3] hover:text-slate-900 cursor-pointer text-left"
                >
                  <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xuất file Word (.docx)</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="pt-3 border-t border-[#E9E9E7] flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2 truncate">
              <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                HH
              </div>
              <span className="truncate font-medium text-slate-700">hoaihuy2609</span>
            </div>
            <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded">
              PRO
            </span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E9E9E7]">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Ngân hàng câu hỏi Vật Lý 12</span>
                <span className="text-xs font-normal text-slate-500">
                  ({filteredQuestions.length} câu)
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Chương trình GDPT 2018 • Định dạng đề thi tốt nghiệp THPT năm 2025
              </p>
            </div>

            {/* Active Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {(selectedType !== 'all' || selectedLevel !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedType('all');
                    setSelectedLevel('all');
                    setSearchQuery('');
                  }}
                  className="text-xs text-indigo-600 hover:underline px-2 py-1 cursor-pointer font-medium"
                >
                  Đặt lại bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Question List Feed */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E9E9E7] p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium text-slate-700">Không tìm thấy câu hỏi phù hợp</p>
              <p className="text-xs mt-1">Hãy thử xóa bộ lọc hoặc tìm từ khóa khác</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question, idx) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={idx}
                  fontMode={fontMode}
                  onToast={showToast}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Right Drawer: Ma Trận Đề Thi 2025 */}
      {showMatrixDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E9E9E7]">
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Ma Trận Đề Thi THPTQG 2025
                </h3>
              </div>
              <button
                onClick={() => setShowMatrixDrawer(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Matrix Stats */}
            <div className="py-4 border-b border-[#E9E9E7] space-y-3">
              <div className="bg-[#F7F6F3] p-3.5 rounded-lg border border-[#E9E9E7]">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span>Tiến độ xây dựng đề</span>
                  <span className="font-mono text-indigo-600">{cartItems.length} / 28 câu</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                  <div
                    style={{ width: `${(cartMC / 18) * 60}%` }}
                    className="bg-indigo-600 h-full"
                    title={`Phần I: ${cartMC}/18`}
                  />
                  <div
                    style={{ width: `${(cartTF / 4) * 20}%` }}
                    className="bg-violet-500 h-full"
                    title={`Phần II: ${cartTF}/4`}
                  />
                  <div
                    style={{ width: `${(cartSA / 6) * 20}%` }}
                    className="bg-cyan-500 h-full"
                    title={`Phần III: ${cartSA}/6`}
                  />
                </div>
              </div>

              {/* 3 Parts Detail */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
                  <div className="text-[10px] text-indigo-600 font-semibold uppercase">Phần I (TN)</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{cartMC}/18</div>
                  <div className="text-[10px] text-slate-500">{(cartMC * 0.25).toFixed(2)} đ</div>
                </div>
                <div className="p-2.5 rounded-lg bg-violet-50/50 border border-violet-100">
                  <div className="text-[10px] text-violet-600 font-semibold uppercase">Phần II (Đ/S)</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{cartTF}/4</div>
                  <div className="text-[10px] text-slate-500">{(cartTF * 1.0).toFixed(2)} đ</div>
                </div>
                <div className="p-2.5 rounded-lg bg-cyan-50/50 border border-cyan-100">
                  <div className="text-[10px] text-cyan-600 font-semibold uppercase">Phần III (TLN)</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{cartSA}/6</div>
                  <div className="text-[10px] text-slate-500">{(cartSA * 0.25).toFixed(2)} đ</div>
                </div>
              </div>
            </div>

            {/* Selected Questions List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2 text-xs">
              <div className="text-slate-500 font-medium pb-1 flex items-center justify-between">
                <span>Danh sách câu đã chọn ({cartItems.length}):</span>
                {cartItems.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Xóa hết
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <BookmarkCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="font-medium text-slate-600">Chưa có câu nào trong giỏ</p>
                  <p className="text-[11px] mt-1 text-slate-400">
                    Bấm nút <strong>"+ Thêm vào đề"</strong> ở mỗi câu để lập ma trận
                  </p>
                </div>
              ) : (
                cartItems.map((q) => (
                  <div
                    key={q.id}
                    className="p-3 rounded-lg border border-[#E9E9E7] bg-[#FCFCFA] flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          {q.code}
                        </span>
                        <span className="text-[10px] text-slate-500">Lớp {q.grade}</span>
                      </div>
                      <p className="text-[11px] text-slate-700 line-clamp-2">
                        {q.stem.replace(/[$#\\]/g, '')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeQuestion(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Actions */}
            {cartItems.length > 0 && (
              <div className="pt-3 border-t border-[#E9E9E7] space-y-2">
                <button
                  onClick={() => showToast('Đang tạo đề thi hoàn chỉnh dạng LaTeX...')}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Xuất Ma Trận & Soạn Đề Thi</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-3.5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
