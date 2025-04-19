import { create } from 'zustand';

// Создаем хранилище для файла
const useFileStore = create((set) => ({
  file: null, // Изначально файла нет
  setFile: (file) => set({ file }), // Функция для сохранения файла
  clearFile: () => set({ file: null }), // Функция для очистки файла
}));

export default useFileStore;