import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTaskStore = create(
  persist(
    (set, get) => ({
      color: "#b33b3f",
      setColor: (newColor) => set(() => ({ color: newColor })),

      tasks: [],
      setTasks: (newTasks) => set(() => ({ tasks: newTasks })),
      activeId: null,
      setActiveId: (id) => set(() => ({ activeId: id })),
      selectedTaskId: null,
      setSelectedTaskId: (id) => set(() => ({ selectedTaskId: id })),
      modalOpen: false,
      setModalOpen: (isOpen) => set(() => ({ modalOpen: isOpen })),
      isDetailOpen: false,
      setIsDetailOpen: (isOpen) => set(() => ({ isDetailOpen: isOpen })),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
      updateTask: (taskId, updatedData) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedData } : task
          ),
        })),
      filter: "all",
      setFilter: (filter) => set(() => ({ filter })),
      taskSelectModalOpen: false,
      setTaskSelectModalOpen: (isOpen) =>
        set(() => ({ taskSelectModalOpen: isOpen })),
    }),
    {
      name: "task-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useTaskStore;
