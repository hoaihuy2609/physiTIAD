import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

interface MathTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

// Chuẩn hóa delimiters: Chuyển \[ ... \] và \( ... \) sang $$ ... $$ và $ ... $
// Đồng thời xử lý các ký hiệu Vật Lý phổ biến
const preprocessPhysicsLatex = (text: string): string => {
  if (!text) return '';
  return text
    // Chuyển block math \[...\] sang $$...$$
    .replace(/\\\[([\s\S]*?)\\\]/g, '$$$$1$$')
    // Chuyển inline math \(...\) sang $...$
    .replace(/\\\(([\s\S]*?)\\\)/g, '$$$1$$');
};

const katexOptions = {
  throwOnError: false,
  errorColor: '#dc2626',
  strict: false,
  macros: {
    // Chuẩn hóa vectơ Vật lý thành mũi tên đầy đủ như MathTIAD & Sách giáo khoa
    '\\vec': '\\overrightarrow{#1}',
    '\\va': '\\overrightarrow{a}',
    '\\vv': '\\overrightarrow{v}',
    '\\vF': '\\overrightarrow{F}',
    '\\vB': '\\overrightarrow{B}',
    '\\vE': '\\overrightarrow{E}',
    '\\vn': '\\overrightarrow{n}',
    // Ký hiệu vi phân & đơn vị
    '\\d': '\\mathrm{d}',
    '\\degree': '^{\\circ}',
    '\\celsius': '^{\\circ}\\mathrm{C}',
    '\\ohm': '\\Omega',
    // Ký hiệu lượng giác tiếng Việt
    '\\tg': '\\tan',
    '\\cotg': '\\cot',
    '\\arctg': '\\operatorname{arctan}',
  },
};

export const MathText: React.FC<MathTextProps> = ({ content, className, style }) => {
  const processedContent = useMemo(() => preprocessPhysicsLatex(content), [content]);

  if (!content) return null;

  return (
    <div
      className={`prose prose-slate max-w-none math-renderer leading-relaxed font-normal ${className || ''}`}
      style={style}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, katexOptions], rehypeRaw]}
        components={{
          p: ({ children }) => <span className="inline leading-relaxed">{children}</span>,
          strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-5 my-1 space-y-0.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-1 space-y-0.5">{children}</ol>,
          li: ({ children }) => <li className="my-0.5">{children}</li>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MathText;
