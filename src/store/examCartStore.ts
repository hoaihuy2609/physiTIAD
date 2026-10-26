import { create } from 'zustand';
import { Question } from '../types';

interface ExamCartState {
  items: Question[];
  addQuestion: (q: Question) => void;
  removeQuestion: (id: string) => void;
  hasQuestion: (id: string) => boolean;
  clearCart: () => void;
  totalCount: () => number;
}

export const useExamCartStore = create<ExamCartState>((set, get) => ({
  items: [],
  addQuestion: (q: Question) => {
    if (!get().hasQuestion(q.id)) {
      set((state) => ({ items: [...state.items, q] }));
    }
  },
  removeQuestion: (id: string) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },
  hasQuestion: (id: string) => {
    return get().items.some((item) => item.id === id);
  },
  clearCart: () => {
    set({ items: [] });
  },
  totalCount: () => {
    return get().items.length;
  },
}));
