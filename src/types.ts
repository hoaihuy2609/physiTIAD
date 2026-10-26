export type QuestionType = 'mc' | 'tf' | 'sa'; 
// mc = Multiple Choice (Phần I - 4 phương án A, B, C, D)
// tf = True / False (Phần II - Đúng / Sai 4 ý a, b, c, d)
// sa = Short Answer (Phần III - Trả lời ngắn / điền số)

export type DifficultyLevel = 1 | 2 | 3 | 4; 
// 1 = Nhận biết, 2 = Thông hiểu, 3 = Vận dụng, 4 = Vận dụng cao

export interface Statement {
  id: 'a' | 'b' | 'c' | 'd';
  text: string;
  verdict: boolean; // true = Đúng, false = Sai
  explanation?: string;
}

export interface Question {
  id: string;
  code: string;            // Ví dụ: "VL12.C01.D02.NB"
  type: QuestionType;
  grade: 10 | 11 | 12;
  chapterId: string;
  chapterName: string;
  topicId: string;
  topicName: string;
  level: DifficultyLevel;
  stem: string;            // Đề bài (hỗ trợ LaTeX & Markdown)
  imageUrl?: string;
  // Cho câu hỏi trắc nghiệm Phần I (mc)
  choices?: string[];      // 4 phương án A, B, C, D
  correctChoice?: number;  // 0=A, 1=B, 2=C, 3=D
  // Cho câu hỏi Đúng/Sai Phần II (tf)
  statements?: Statement[];// 4 phát biểu a, b, c, d
  // Cho câu hỏi Trả lời ngắn Phần III (sa)
  saAnswer?: string;       // Đáp án chuẩn (ví dụ "0,1" hoặc "25")
  saTolerance?: number;    // Sai số cho phép (nếu có)
  solution: string;        // Lời giải chi tiết từng bước (LaTeX)
  author?: string;
  source?: string;         // Nguồn đề (ví dụ "Đề tham khảo BGD 2025")
  tags?: string[];
}

export interface UserExamResponse {
  questionId: string;
  choiceSelected?: number;
  tfResponses?: Record<'a' | 'b' | 'c' | 'd', boolean | null>;
  saResponse?: string;
}
