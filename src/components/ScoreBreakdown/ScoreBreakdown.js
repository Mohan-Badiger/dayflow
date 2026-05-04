import styles from './ScoreBreakdown.module.css';

export default function ScoreBreakdown({ score, label, date, tags }) {
  // Simple circular progress calculation
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>DAY SCORE BREAKDOWN</h2>
      
      <div className={styles.scoreHeader}>
        <div className={styles.chartContainer}>
          <svg className={styles.chart} viewBox="0 0 80 80">
            <circle 
              className={styles.chartBg} 
              cx="40" cy="40" r={radius} 
            />
            <circle 
              className={styles.chartProgress} 
              cx="40" cy="40" r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <div className={styles.scoreText}>{score}</div>
        </div>
        
        <div className={styles.scoreInfo}>
          <h3 className={styles.scoreLabel}>{label}</h3>
          <p className={styles.scoreDate}>{date}</p>
        </div>
      </div>
      
      <div className={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <span 
            key={index} 
            className={styles.tag}
            style={{ 
              borderColor: tag.color,
              color: tag.color 
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}
