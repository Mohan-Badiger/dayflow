import styles from './WeeklyHabits.module.css';

export default function WeeklyHabits({ habits }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>HABITS &middot; THIS WEEK</h2>
      
      <div className={styles.habitList}>
        {habits.map((habit, index) => (
          <div key={index} className={styles.habitRow}>
            <span className={styles.habitName}>{habit.name}</span>
            <div className={styles.daysContainer}>
              {habit.days.map((done, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`${styles.dayBox} ${done ? styles.dayDone : styles.dayEmpty}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
