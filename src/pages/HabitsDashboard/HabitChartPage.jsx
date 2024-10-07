import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import styles from "./HabitChartPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletionHabit } from "../../redux/action/completion";

const HabitChartPage = () => {
  const { content, loading, success, error } = useSelector((state) => state.completion);
  const navigate = useNavigate();
  const [period, setPeriod] = useState("week");
  const [chartData, setChartData] = useState([]);
  const dispatch = useDispatch();

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(fetchCompletionHabit());
  }, [dispatch]);

  useEffect(() => {
    if (success && content.content && content.content.length > 0) {
      const today = new Date();
      const startDate = period === "week" ? subDays(today, 6) : subDays(today, 29);
      const dates = eachDayOfInterval({ start: startDate, end: today });

      const totalHabits = content.content.length; // Ensure this points to the correct structure

      const data = dates.map((date) => {
        const dateString = format(date, "yyyy-MM-dd");
        let dailyCompleted = 0;

        content.content.forEach((habit) => {
          const habitUpdatedDate = new Date(habit.completedAt);
          const isCompleted = habit.habit.completed && isSameDay(habitUpdatedDate, date);
          if (isCompleted) {
            dailyCompleted += 1;
          }
        });

        const completionRate = totalHabits > 0 ? (dailyCompleted / totalHabits) * 100 : 0;

        return {
          date: dateString,
          completionRate,
        };
      });

      setChartData(data);
    }
  }, [content.content, period, success]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>; // Loading state
  }

  if (error) {
    return (
      <div className={styles.habitChartPage}>
        <button className={styles.goBackButton} onClick={handleGoBack}>
          Back
        </button>
        <p className={styles.errorMessage}>{error}</p> {/* Display error message */}
      </div>
    );
  }

  if (!content.content || content.content.length === 0) {
    return (
      <div className={styles.habitChartPage}>
        <button className={styles.goBackButton} onClick={handleGoBack}>
          Back
        </button>
        <p className={styles.noData}>No habit data available</p>
      </div>
    );
  }

  return (
    <div className={styles.habitChartPage}>
      <div className="container py-4 py-md-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <button className={styles.goBackButton} onClick={handleGoBack}>
              Back
            </button>
            <h1 className={styles.pageTitle}>Habit Progress</h1>
            <div className={styles.date}>Today: {format(new Date(), "MMMM d, yyyy")}</div>

            <h2 className={styles.sectionTitle}>Your Habits:</h2>
            <ul className={styles.habitList}>
              {content.content.map((habit, index) => (
                <li key={index} className={styles.habitItem}>
                  <span className={styles.habitName}>{habit.habit.name}</span>
                  <span className={styles.habitFrequency}>Frequency: {habit.habit.frequency || "N/A"}</span>
                  <span className={styles.habitFrequency}>Category: {habit.habit.category.name}</span>
                </li>
              ))}
            </ul>

            <div className={styles.buttonContainer}>
              <button className={`${styles.periodButton} ${period === "week" ? styles.activePeriod : ""}`} onClick={() => setPeriod("week")}>
                Week
              </button>
              <button className={`${styles.periodButton} ${period === "month" ? styles.activePeriod : ""}`} onClick={() => setPeriod("month")}>
                Month
              </button>
            </div>

            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tickFormatter={(tick) => format(new Date(tick), "MMM d")} stroke="#ffffff" padding={{ left: 2, right: 30 }} />
                  <YAxis allowDecimals={false} domain={[0, 100]} stroke="#ffffff" tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.8)",
                      color: "#333",
                    }}
                    formatter={(value) => `${value.toFixed(2)}%`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completionRate"
                    name="Completion Rate"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitChartPage;
