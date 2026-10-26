import { Question } from '../types';

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    code: 'VL12.C01.D02.NB',
    type: 'mc',
    grade: 12,
    chapterId: '12-1',
    chapterName: 'Chương 1: Vật lý nhiệt',
    topicId: '12-1-2',
    topicName: 'Định luật I Nhiệt động lực học',
    level: 1, // Nhận biết
    stem: 'Theo định luật I nhiệt động lực học, độ biến thiên nội năng $\\Delta U$ của một hệ kín liên hệ với nhiệt lượng $Q$ và công $A$ theo hệ thức $\\Delta U = A + Q$. Khi một khối khí nhận nhiệt lượng $60\\text{ J}$ và thực hiện công $25\\text{ J}$ lên môi trường xung quanh, độ biến thiên nội năng của khối khí bằng bao nhiêu?',
    choices: [
      '$+85\\text{ J}$',
      '$+35\\text{ J}$',
      '$-35\\text{ J}$',
      '$-85\\text{ J}$',
    ],
    correctChoice: 1, // B
    solution: `**Phương pháp giải:**

Áp dụng nguyên lí I nhiệt động lực học:
$$\\Delta U = A + Q$$

Quy ước về dấu của nhiệt lượng $Q$ và công $A$:
- Khối khí nhận nhiệt lượng:  
  $$Q > 0 \\implies Q = +60\\text{ J}$$
- Khối khí sinh công (thực hiện công lên môi trường):  
  $$A < 0 \\implies A = -25\\text{ J}$$

**Các bước tính toán:**

Độ biến thiên nội năng của khối khí là:
$$\\Delta U = A + Q = -25 + 60 = +35\\text{ J}$$

Vì $\\Delta U > 0$ nên nội năng của khối khí tăng $35\\text{ J}$.

$\\implies$ **Chọn đáp án B.**`,
    source: 'Đề minh họa THPTQG 2025 - Bộ GD&ĐT',
    tags: ['Nhiệt học', 'Định luật 1', 'Nội năng'],
  },
  {
    id: 'q-102',
    code: 'VL12.C02.D03.VD',
    type: 'tf',
    grade: 12,
    chapterId: '12-2',
    chapterName: 'Chương 2: Khí lý tưởng',
    topicId: '12-2-3',
    topicName: 'Phương trình trạng thái & Chu trình nhiệt',
    level: 3, // Vận dụng
    stem: 'Một lượng khí lí tưởng đơn nguyên tử chứa trong một xilanh kín có pít-tông di động không ma sát. Khối khí thực hiện một chu trình biến đổi trạng thái khép kín $(1) \\to (2) \\to (3) \\to (1)$ được mô tả như sau:  \n- Trạng thái $(1): p_1 = 3 \\cdot 10^5\\text{ Pa},\\; V_1 = 2\\text{ lít},\\; T_1 = 300\\text{ K}$.  \n- Quá trình $(1) \\to (2)$: Dãn nở đẳng áp đến thể tích $V_2 = 6\\text{ lít}$.  \n- Quá trình $(2) \\to (3)$: Làm nguội đẳng tích đến áp suất $p_3 = 10^5\\text{ Pa}$.  \n- Quá trình $(3) \\to (1)$: Nén đẳng nhiệt trở về trạng thái ban đầu $(1)$.  \n\nXét tính đúng/sai của các phát biểu sau:',
    statements: [
      {
        id: 'a',
        text: 'Nhiệt độ của chất khí tại trạng thái $(2)$ là $T_2 = 900\\text{ K}$.',
        verdict: true,
        explanation: 'Quá trình $(1) \\to (2)$ đẳng áp: $\\frac{V_1}{T_1} = \\frac{V_2}{T_2} \\implies T_2 = 300 \\cdot \\frac{6}{2} = 900\\text{ K}$.',
      },
      {
        id: 'b',
        text: 'Công mà chất khí thực hiện trong quá trình dãn nở đẳng áp $(1) \\to (2)$ là $A_{12}\' = 1200\\text{ J}$.',
        verdict: true,
        explanation: '$A_{12}\' = p_1 \\cdot (V_2 - V_1) = 3 \\cdot 10^5 \\cdot (6 - 2) \\cdot 10^{-3} = 1200\\text{ J}$.',
      },
      {
        id: 'c',
        text: 'Trong quá trình làm nguội đẳng tích $(2) \\to (3)$, nội năng của chất khí không thay đổi.',
        verdict: false,
        explanation: 'Quá trình đẳng tích $(2) \\to (3)$ có áp suất giảm từ $3 \\cdot 10^5\\text{ Pa}$ xuống $10^5\\text{ Pa}$ nên nhiệt độ giảm từ $900\\text{ K}$ về $300\\text{ K}$. Nội năng của khí phụ thuộc vào nhiệt độ nên giảm chứ không đổi.',
      },
      {
        id: 'd',
        text: 'Độ biến thiên nội năng của khối khí trong toàn bộ chu trình là $\\Delta U_{\\text{chu trình}} > 0$.',
        verdict: false,
        explanation: 'Vì chu trình là khép kín trở về đúng trạng thái ban đầu $(1)$ nên $\\Delta U_{\\text{chu trình}} = U_1 - U_1 = 0$.',
      },
    ],
    solution: `**Phân tích & Hướng dẫn giải chi tiết:**

- **Ý a) ĐÚNG:**  
  Quá trình $(1) \\to (2)$ là quá trình biến đổi đẳng áp ($p_1 = p_2 = 3 \\cdot 10^5\\text{ Pa}$).  
  Áp dụng định luật Gay-Lussac:  
  $$\\frac{V_1}{T_1} = \\frac{V_2}{T_2} \\implies T_2 = T_1 \\cdot \\frac{V_2}{V_1} = 300 \\cdot \\frac{6}{2} = 900\\text{ K}$$

- **Ý b) ĐÚNG:**  
  Công chất khí sinh ra trong quá trình dãn nở đẳng áp:  
  $$A_{12}' = p_1 \\cdot \\Delta V = 3 \\cdot 10^5 \\cdot (6 - 2) \\cdot 10^{-3} = 1200\\text{ J}$$

- **Ý c) SAI:**  
  Quá trình $(2) \\to (3)$ là quá trình đẳng tích ($V = 6\\text{ lít}$), áp suất giảm.  
  Nhiệt độ tại trạng thái $(3)$:  
  $$\\frac{p_2}{T_2} = \\frac{p_3}{T_3} \\implies T_3 = 900 \\cdot \\frac{10^5}{3 \\cdot 10^5} = 300\\text{ K}$$  
  Nhiệt độ giảm từ $900\\text{ K}$ xuống $300\\text{ K}$ nên nội năng của khối khí giảm: $\\Delta U_{23} < 0$.

- **Ý d) SAI:**  
  Nội năng là hàm trạng thái, chỉ phụ thuộc vào trạng thái nhiệt động của hệ.  
  Sau một chu trình khép kín, hệ trở về đúng trạng thái ban đầu $(1)$ nên:  
  $$\\Delta U_{\\text{chu trình}} = U_1 - U_1 = 0$$`,
    source: 'Đề thi thử THPT Chuyên KHTN Hà Nội 2025',
    tags: ['Khí lý tưởng', 'Chu trình nhiệt', 'Công chất khí', 'P-V'],
  },
  {
    id: 'q-103',
    code: 'VL12.C03.D01.VDC',
    type: 'sa',
    grade: 12,
    chapterId: '12-3',
    chapterName: 'Chương 3: Từ trường',
    topicId: '12-3-1',
    topicName: 'Hiện tượng cảm ứng điện từ',
    level: 4, // Vận dụng cao
    stem: 'Một khung dây dẫn phẳng kín hình vuông gồm $N = 200$ vòng dây quấn sát nhau, mỗi vòng có cạnh $a = 10\\text{ cm}$. Điện trở tổng cộng của toàn bộ khung dây là $R = 4{,}0\\,\\Omega$. Khung dây được đặt cố định trong một từ trường đều sao cho vectơ cảm ứng từ $\\vec{B}$ vuông góc với mặt phẳng khung dây. Cho độ lớn cảm ứng từ giảm đều từ $B_1 = 0{,}8\\text{ T}$ xuống $B_2 = 0{,}2\\text{ T}$ trong khoảng thời gian $\\Delta t = 0{,}15\\text{ s}$. Cường độ dòng điện cảm ứng xuất hiện trong khung dây bằng bao nhiêu Ampe? *(Nhập kết quả dưới dạng số thập phân, ví dụ: 0.2 hoặc 0,2)*',
    saAnswer: '0,2',
    saTolerance: 0.01,
    solution: `**Phương pháp giải:**

1. Diện tích một mặt phẳng giới hạn bởi vòng dây:
   $$S = a^2$$

2. Từ thông qua toàn bộ khung dây gồm $N$ vòng dây:
   $$\\Phi = N \\cdot B \\cdot S \\cdot \\cos 0^\\circ = N \\cdot B \\cdot S$$

3. Độ biến thiên từ thông theo thời gian:
   $$\\Delta \\Phi = N \\cdot S \\cdot \\Delta B$$

4. Độ lớn suất điện động cảm ứng (Định luật Faraday):
   $$|e_c| = \\left| \\frac{\\Delta \\Phi}{\\Delta t} \\right| = N \\cdot S \\cdot \\frac{|B_2 - B_1|}{\\Delta t}$$

5. Cường độ dòng điện cảm ứng trong khung dây (Định luật Ohm cho mạch kín):
   $$I_c = \\frac{|e_c|}{R}$$

---

**Các bước tính toán chi tiết:**

- Diện tích của một vòng dây:
  $$S = (0{,}10\\text{ m})^2 = 0{,}01\\text{ m}^2 = 10^{-2}\\text{ m}^2$$

- Độ lớn suất điện động cảm ứng xuất hiện trong khung dây:
  $$|e_c| = 200 \\cdot 0{,}01 \\cdot \\frac{|0{,}2 - 0{,}8|}{0{,}15} = 2 \\cdot \\frac{0{,}6}{0{,}15} = 2 \\cdot 4 = 0{,}8\\text{ V}$$

- Cường độ dòng điện cảm ứng chạy qua khung dây:
  $$I_c = \\frac{|e_c|}{R} = \\frac{0{,}8}{4{,}0} = 0{,}2\\text{ A}$$

$\\implies$ **Đáp số:** **0,2**`,
    source: 'Đề khảo sát chất lượng Sở GD&ĐT Nam Định 2025',
    tags: ['Từ trường', 'Cảm ứng điện từ', 'Suất điện động Faraday'],
  },
];
