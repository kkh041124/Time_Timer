import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTaskStore = create(
  persist(
    (set, get) => ({
      // ----- 기존 상태들 -----
      color: "#b33b3f",
      setColor: (newColor) => set(() => ({ color: newColor })),

      tasks: [],
      setTasks: (newTasks) => set(() => ({ tasks: newTasks })),

      activeId: null,
      setActiveId: (id) => set(() => ({ activeId: id })),

      // 선택된 작업의 id를 저장합니다.
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

      // 작업 선택 모달의 열림/닫힘 상태
      taskSelectModalOpen: false,
      setTaskSelectModalOpen: (isOpen) =>
        set(() => ({ taskSelectModalOpen: isOpen })),

      /** 집중 시간 기록 관련 상태 */
      focusTime: 0,
      todayFocusTime: 0,
      focusRecords: [], // 예: [{ date: "2025-02-12", time: 40 }]

      addFocusTime: (time) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => {
          const updatedRecords = [...state.focusRecords];
          const todayIndex = updatedRecords.findIndex((r) => r.date === today);
          if (todayIndex >= 0) {
            updatedRecords[todayIndex].time += time;
          } else {
            updatedRecords.push({ date: today, time });
          }
          return {
            focusTime: state.focusTime + time,
            todayFocusTime: state.todayFocusTime + time,
            focusRecords: updatedRecords,
          };
        });
      },

      // ----- ★ 집중(시계) 관련 상태 (추가) -----
      clock: {
        isRunning: false, // 집중(타이머) 실행 중 여부
        hasStarted: false, // 한 번이라도 시작했는지 여부
        angle: 0, // 초기 각도 (사용자가 마우스 이동으로 조정)
        pausedElapsed: 0, // 중단 시까지 누적 경과 시간(초)
        startTimestamp: null, // 집중 시작 시각 (ms)
        isAngleAdjustable: true, // 집중 시작 전, 각도 조정 가능 여부
      },
      setClockAngle: (newAngle) =>
        set((state) => ({
          clock: {
            ...state.clock,
            angle: newAngle,
          },
        })),
      lockClockAngle: () =>
        set((state) => ({
          clock: {
            ...state.clock,
            isAngleAdjustable: false,
          },
        })),
      unlockClockAngle: () =>
        set((state) => ({
          clock: {
            ...state.clock,
            isAngleAdjustable: true,
          },
        })),
      startClock: () =>
        set((state) => ({
          clock: {
            ...state.clock,
            isRunning: true,
            hasStarted: true,
            startTimestamp: Date.now(),
          },
        })),
      pauseClock: () =>
        set((state) => {
          const currentElapsed = state.clock.startTimestamp
            ? (Date.now() - state.clock.startTimestamp) / 1000
            : 0;
          return {
            clock: {
              ...state.clock,
              isRunning: false,
              pausedElapsed: state.clock.pausedElapsed + currentElapsed,
              startTimestamp: null,
            },
          };
        }),
      resetClock: (initialAngle = 0) =>
        set(() => ({
          clock: {
            isRunning: false,
            hasStarted: false,
            angle: initialAngle,
            pausedElapsed: 0,
            startTimestamp: null,
            isAngleAdjustable: true,
          },
        })),
    }),
    {
      name: "task-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useTaskStore;
