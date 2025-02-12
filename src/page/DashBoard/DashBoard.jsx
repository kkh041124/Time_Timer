"use client";

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ko } from "date-fns/locale";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
} from "chart.js";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutGrid,
  Settings,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import styles from "./Dashboard.module.css";

// Chart.js 컴포넌트 등록
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);

const Dashboard = () => {
  const navigate = useNavigate();

  /* ── 기본 KPI 데이터 (더미) ── */
  const totalPomodoroTime = 213; // 분
  const weeklyPomodoroTime = 150; // 분

  /* ── 기존 차트 데이터 ── */
  // 1. 뽀모도로 기록 (라인 차트)
  const pomodoroRecordData = {
    labels: [
      "09시",
      "10시",
      "11시",
      "12시",
      "13시",
      "14시",
      "15시",
      "16시",
      "17시",
    ],
    datasets: [
      {
        label: "뽀모도로 (분)",
        data: [20, 25, 15, 30, 20, 25, 10, 0, 0],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.1)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: "#4F46E5",
      },
    ],
  };

  // 2. 시간대별 집중 기록 (바 차트)
  const timeOfDayData = {
    labels: [
      "06시",
      "07시",
      "08시",
      "09시",
      "10시",
      "11시",
      "12시",
      "13시",
      "14시",
      "15시",
      "16시",
      "17시",
      "18시",
    ],
    datasets: [
      {
        label: "집중 시간 (분)",
        data: [15, 20, 30, 25, 40, 35, 50, 45, 30, 20, 15, 10, 5],
        backgroundColor: "#4F46E5",
        borderColor: "#4F46E5",
        borderWidth: 2,
      },
    ],
  };

  // 3. 요일별 평균 집중 시간 (바 차트)
  const dayOfWeekData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "평균 집중 시간 (분)",
        data: [40, 50, 30, 60, 55, 20, 35],
        backgroundColor: "#10B981",
        borderColor: "#10B981",
        borderWidth: 2,
      },
    ],
  };

  // 4. 프로젝트 시간 비율 (도넛 차트)
  const projectTimeData = {
    labels: ["개인", "업무", "운동", "기타"],
    datasets: [
      {
        data: [120, 240, 60, 30],
        backgroundColor: ["#93C5FD", "#6EE7B7", "#FCD34D", "#C4B5FD"],
        borderWidth: 0,
      },
    ],
  };

  /* ── 추가 차트 데이터 ── */
  // 1. 일일 집중 패턴 (히트맵)
  const dailyFocusPattern = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    intensity: Math.floor(Math.random() * 100),
  }));

  // 2. 집중 시간 vs 생산성 (라인 & 바 차트) – 최근 7일 데이터
  const daysLabels = ["월", "화", "수", "목", "금", "토", "일"];
  const focusTimeDataArr = [90, 120, 100, 150, 80, 200, 170]; // (분)
  const completedTasksData = [2, 3, 1, 4, 2, 5, 3];
  const focusVsProductivityData = {
    labels: daysLabels,
    datasets: [
      {
        type: "line",
        label: "집중 시간 (분)",
        data: focusTimeDataArr,
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79,70,229,0.1)",
        fill: false,
        tension: 0.3,
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "완료 작업 수",
        data: completedTasksData,
        backgroundColor: "#10B981",
        yAxisID: "y1",
      },
    ],
  };

  // 3. 연속 집중 시간 (라인 차트) – 최근 7일 최대 집중 시간 (분)
  const focusStreakData = {
    labels: daysLabels,
    datasets: [
      {
        label: "최장 연속 집중 시간 (분)",
        data: [45, 60, 50, 75, 40, 90, 80],
        borderColor: "#FACC15",
        backgroundColor: "rgba(250,204,21,0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  // 4. 집중 vs 휴식 비율 (도넛 차트) – 오늘 집중 시간과 휴식 시간
  const focusTimeToday = 120; // (분)
  const breakTimeToday = 40; // (분)
  const focusBreakData = {
    labels: ["집중", "휴식"],
    datasets: [
      {
        data: [focusTimeToday, breakTimeToday],
        backgroundColor: ["#4F46E5", "#E5E7EB"],
        borderWidth: 0,
      },
    ],
  };

  // 5. 목표 달성 진행률 (진행 바)
  const [dailyFocusGoal, setDailyFocusGoal] = React.useState(180); // (분) -> 상태 변수로 변경
  const currentFocus = 110; // (분) 더미 데이터
  const goalProgressPercent = Math.min(
    (currentFocus / dailyFocusGoal) * 100,
    100
  );

  /* ── 추가 KPI 데이터 ── */
  // 추가 KPI: 세션 평균 집중 시간 (더미 데이터: 25분)
  const avgSessionTime = 25; // 분

  /* ── 목표 설정 모달 관련 상태 ── */
  const [goalModalOpen, setGoalModalOpen] = React.useState(false);
  const [newGoal, setNewGoal] = React.useState(dailyFocusGoal);

  /* ── 작업 데이터 및 검색 ── */
  const [activeFilter, setActiveFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const tasks = [
    { id: 1, title: "디자인 리서치", status: "completed" },
    { id: 2, title: "개발 회의", status: "today" },
    { id: 3, title: "문서 작성", status: "priority" },
    { id: 4, title: "코드 리뷰", status: "completed" },
    { id: 5, title: "테스트 케이스 작성", status: "today" },
  ];
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      activeFilter === "all" ? true : task.status === activeFilter;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  /* ── 캘린더 데이터 (더미 집중 기록) ── */
  const [selectedCalDate, setSelectedCalDate] = React.useState(new Date());
  const monthStart = startOfMonth(selectedCalDate);
  const monthEnd = endOfMonth(selectedCalDate);
  const calendarStart = startOfWeek(monthStart, { locale: ko });
  const calendarEnd = endOfWeek(monthEnd, { locale: ko });
  const monthDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });
  const monthLabel = format(selectedCalDate, "MMMM yyyy", { locale: ko });
  const focusRecords = [
    { date: new Date(2023, 4, 1), time: 120 },
    { date: new Date(2023, 4, 2), time: 90 },
    { date: new Date(2023, 4, 3), time: 180 },
    { date: new Date(2023, 4, 4), time: 150 },
    { date: new Date(2023, 4, 5), time: 210 },
    { date: new Date(2023, 4, 6), time: 60 },
    { date: new Date(2023, 4, 7), time: 120 },
  ];
  const getDayProgress = (day) => {
    const record = focusRecords.find((r) => isSameDay(r.date, day));
    return record ? record.time : 0;
  };

  /* ── 모달 (날짜 상세 기록) ── */
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalDate, setModalDate] = React.useState(null);
  const openModal = (day) => {
    setModalDate(day);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalDate(null);
  };

  return (
    <div className={styles.container}>
      {/* 상단 네비게이션 */}
      <nav className={styles.topNav}>
        <Button variant="ghost" onClick={() => navigate("/")}>
          <Home className={styles.navIcon} />
          <span className={styles.navText}>홈</span>
        </Button>
        <Button variant="ghost" onClick={() => navigate("/workspace")}>
          <LayoutGrid className={styles.navIcon} />
          <span className={styles.navText}>워크스페이스</span>
        </Button>
        <Button variant="ghost" onClick={() => navigate("/settings")}>
          <Settings className={styles.navIcon} />
          <span className={styles.navText}>설정</span>
        </Button>
        <Button variant="ghost">
          <Bell className={styles.navIcon} />
          <span className={styles.navText}>알림</span>
        </Button>
      </nav>

      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.title}>대시보드</h1>
        <div className={styles.headerActions}>
          <Button variant="ghost" onClick={() => navigate("/")}>
            <X className={styles.closeIcon} />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        <motion.div
          className={styles.mainContent}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ── 목표 달성 진행률 (진행 바) ── */}
          <section className={styles.progressSection}>
            <Card className={styles.progressCard}>
              <CardHeader>
                <CardTitle className={styles.progressTitle}>
                  목표 달성 진행률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${goalProgressPercent}%` }}
                  ></div>
                </div>
                <p className={styles.progressText}>
                  오늘의 집중 목표 {goalProgressPercent.toFixed(0)}% 달성
                </p>
              </CardContent>
            </Card>
          </section>

          {/* ── KPI 섹션 (한 줄에 5개) ── */}
          <section className={styles.kpiSection}>
            {/* 총 뽀모도로 시간 */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>⏱️</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>총 뽀모도로 시간</p>
                    <p className={styles.kpiValue}>
                      {Math.floor(totalPomodoroTime / 60)}h{" "}
                      {totalPomodoroTime % 60}m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 이번 주 뽀모도로 시간 */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>🕒</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>이번 주 뽀모도로 시간</p>
                    <p className={styles.kpiValue}>
                      {Math.floor(weeklyPomodoroTime / 60)}h{" "}
                      {weeklyPomodoroTime % 60}m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 오늘 집중 시간 (캘린더 기록 기준) */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>🔥</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>오늘 집중 시간</p>
                    <p className={styles.kpiValue}>
                      {Math.floor(getDayProgress(new Date()) / 60)}h{" "}
                      {getDayProgress(new Date()) % 60}m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 완료된 작업 수 */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>✅</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>완료된 작업</p>
                    <p className={styles.kpiValue}>
                      {tasks.filter((t) => t.status === "completed").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 남은 작업 수 */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>📝</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>남은 작업</p>
                    <p className={styles.kpiValue}>
                      {tasks.length -
                        tasks.filter((t) => t.status === "completed").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 오늘의 목표 집중 시간 (목표: 3시간) */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>🎯</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>오늘의 목표 집중 시간</p>
                    <p className={styles.kpiValue}>
                      목표: {Math.floor(dailyFocusGoal / 60)}h, 진행:{" "}
                      {Math.floor(getDayProgress(new Date()) / 60)}h{" "}
                      {getDayProgress(new Date()) % 60}m
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <label style={{ fontSize: "0.75rem" }}>
                        <input
                          type="checkbox"
                          checked={getDayProgress(new Date()) >= dailyFocusGoal}
                          readOnly
                        />{" "}
                        목표 달성
                      </label>
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setGoalModalOpen(true)}
                      >
                        목표 수정
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 최고 집중 시간 시간대 */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>📈</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>최고 집중 시간 시간대</p>
                    <p className={styles.kpiValue}>
                      {
                        timeOfDayData.labels[
                          timeOfDayData.datasets[0].data.indexOf(
                            Math.max(...timeOfDayData.datasets[0].data)
                          )
                        ]
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 주간 집중 시간 비교 (더미 데이터) */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>📅</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>주간 집중 시간 비교</p>
                    <p className={styles.kpiValue}>
                      이번 주: 45분 / 지난 주: 40분
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 최고 집중 시간 랭킹 (더미 데이터) */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>🏆</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>최고 집중 시간 랭킹</p>
                    <p className={styles.kpiValue}>
                      {format(
                        focusRecords.reduce(
                          (prev, curr) => (curr.time > prev.time ? curr : prev),
                          focusRecords[0]
                        ).date,
                        "EEEE",
                        { locale: ko }
                      )}
                      :{" "}
                      {Math.floor(
                        focusRecords.reduce(
                          (prev, curr) => (curr.time > prev.time ? curr : prev),
                          focusRecords[0]
                        ).time / 60
                      )}
                      h{" "}
                      {focusRecords.reduce(
                        (prev, curr) => (curr.time > prev.time ? curr : prev),
                        focusRecords[0]
                      ).time % 60}
                      m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 추가 KPI: 세션 평균 집중 시간 */}
            <Card className={styles.kpiCard}>
              <CardContent>
                <div className={styles.kpiItem}>
                  <div className={styles.kpiIcon}>⏳</div>
                  <div className={styles.kpiInfo}>
                    <p className={styles.kpiLabel}>세션 평균 집중 시간</p>
                    <p className={styles.kpiValue}>{avgSessionTime}분</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── 기존 차트 섹션 ── */}
          <section className={styles.chartSection}>
            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  뽀모도로 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.chartContainer}>
                  <Line
                    data={pomodoroRecordData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  시간대별 집중 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.chartContainer}>
                  <Bar
                    data={timeOfDayData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 5 } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  요일별 평균 집중 시간
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.chartContainer}>
                  <Bar
                    data={dayOfWeekData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 5 } },
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  프로젝트 시간 비율
                </CardTitle>
              </CardHeader>
              <CardContent className={styles.chartContainer}>
                <div className={styles.doughnutWrapper}>
                  <Doughnut
                    data={projectTimeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "80%",
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                      plugins: { legend: { display: false } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── 추가 차트 섹션 ── */}
          <section className={styles.chartSection}>
            {/* 1. 일일 집중 패턴 (히트맵) */}
            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  일일 집중 패턴 (히트맵)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.heatmapGrid}>
                  {dailyFocusPattern.map((cell) => {
                    const intensity = cell.intensity;
                    const bgColor = `rgba(79,70,229,${intensity / 100})`;
                    return (
                      <div
                        key={cell.hour}
                        className={styles.heatmapCell}
                        style={{ backgroundColor: bgColor }}
                        title={`${cell.hour}시 - 집중도 ${cell.intensity}`}
                      >
                        {cell.hour}시
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 2. 집중 시간 vs 생산성 (라인 & 바 차트) */}
            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  집중 시간 vs 생산성
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.chartContainer}>
                  <Bar
                    data={focusVsProductivityData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      interaction: { mode: "index", intersect: false },
                      scales: {
                        y: {
                          beginAtZero: true,
                          position: "left",
                          title: { display: true, text: "집중 시간 (분)" },
                        },
                        y1: {
                          beginAtZero: true,
                          position: "right",
                          grid: { drawOnChartArea: false },
                          title: { display: true, text: "완료 작업 수" },
                        },
                      },
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 3. 연속 집중 시간 (라인 차트) */}
            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  연속 집중 시간
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.chartContainer}>
                  <Line
                    data={focusStreakData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 4. 집중 vs 휴식 비율 (도넛 차트) */}
            <Card className={styles.chartCard}>
              <CardHeader>
                <CardTitle className={styles.chartTitle}>
                  집중 vs 휴식 비율
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={styles.doughnutWrapper}>
                  <Doughnut
                    data={focusBreakData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: "70%",
                      animation: { duration: 1000, easing: "easeInOutQuart" },
                      plugins: { legend: { display: true } },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── 캘린더 섹션 ── */}
          <section className={styles.calendarSection}>
            <Card className={styles.calendarCard}>
              <CardHeader className={styles.calendarHeader}>
                <CardTitle className={styles.calendarTitle}>
                  {monthLabel}
                </CardTitle>
                <div className={styles.calendarNav}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedCalDate(subMonths(selectedCalDate, 1))
                    }
                  >
                    <ChevronLeft className={styles.navArrow} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedCalDate(addMonths(selectedCalDate, 1))
                    }
                  >
                    <ChevronRight className={styles.navArrow} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={styles.calendarGrid}>
                  {monthDays.map((day, i) => {
                    const progress = getDayProgress(day);
                    const percentage = (progress / dailyFocusGoal) * 100;
                    return (
                      <div
                        key={i}
                        className={styles.dayCell}
                        onClick={() => openModal(day)}
                      >
                        <span className={styles.dayLabel}>
                          {format(day, "d")}
                        </span>
                        <div
                          className={styles.progressCircle}
                          style={{
                            background: `conic-gradient(#4F46E5 ${percentage}%, transparent ${percentage}%)`,
                          }}
                        >
                          <span className={styles.progressLabel}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── 작업 섹션 (검색 및 필터) ── */}
          <section className={styles.taskSection}>
            <div className={styles.taskHeader}>
              <div className={styles.filterBar}>
                {[
                  { id: "all", label: "전체 작업" },
                  { id: "completed", label: "완료됨" },
                  { id: "today", label: "오늘" },
                  { id: "priority", label: "우선순위 높음" },
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant={
                      activeFilter === filter.id ? "secondary" : "outline"
                    }
                    size="sm"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="작업 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.taskList}>
              {filteredTasks.map((task) => (
                <Card key={task.id} className={styles.taskCard}>
                  <CardContent>
                    <div className={styles.taskItem}>
                      <p className={styles.taskTitle}>{task.title}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className={styles.taskButton}
                      >
                        상세보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </motion.div>
      </AnimatePresence>

      {/* ── 모달 (날짜 상세 기록) ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.modalTitle}>
                {format(modalDate, "PPP", { locale: ko })} 집중 기록
              </h2>
              <div className={styles.modalBody}>
                <p className={styles.modalText}>
                  집중 시간: {getDayProgress(modalDate)}분
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={closeModal}>
                닫기
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 목표 설정 모달 ── */}
      <AnimatePresence>
        {goalModalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setGoalModalOpen(false)}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className={styles.modalTitle}>목표 집중 시간 수정</h2>
              <div className={styles.modalBody}>
                <label
                  style={{
                    fontSize: "0.9rem",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  집중 목표 (분)
                </label>
                <input
                  type="number"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDailyFocusGoal(newGoal);
                    setGoalModalOpen(false);
                  }}
                >
                  저장
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGoalModalOpen(false)}
                >
                  취소
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
