import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

interface MathTextProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
  inline?: boolean;
}

// Chuẩn hóa delimiters & tiền xử lý LaTeX Vật lý
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
    // Ký hiệu vectơ Vật lý chuẩn sách giáo khoa
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

export const MathText: React.FC<MathTextProps> = ({ content, className, style, inline = false }) => {
  const processedContent = useMemo(() => preprocessPhysicsLatex(content), [content]);

  if (!content) return null;

  return (
    <div
      className={`prose prose-slate max-w-none math-renderer font-normal ${className || ''}`}
      style={style}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[[rehypeKatex, katexOptions], rehypeRaw]}
        components={{
          // Nếu ở chế độ inline (như trong nút chọn A, B, C, D) thì không bọc thẻ p tách đoạn
          p: ({ children }) =>
            inline ? (
              <span className="inline leading-relaxed">{children}</span>
            ) : (
              <p className="my-2.5 leading-relaxed text-inherit">{children}</p>
            ),
          strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>,
          em: ({ children }) => <em className="italic text-inherit">{children}</em>,
          // Tăng khoảng cách giữa các mục danh sách để công thức toán không dính chùm vào nhau
          ul: ({ children }) => <ul className="list-disc pl-5 my-3 space-y-2.5 text-inherit">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 my-3 space-y-3 text-inherit">{children}</ol>,
          li: ({ children }) => <li className="my-1.5 leading-relaxed text-inherit">{children}</li>,
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MathText;
