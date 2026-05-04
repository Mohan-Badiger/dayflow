import styles from './CategoryProgress.module.css';

export default function CategoryProgress({ categories }) {
  // Find max value to calculate percentage width
  const maxHours = Math.max(...categories.map(c => parseFloat(c.hours)));

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>WORK LOG &middot; THIS WEEK</h2>
      
      <div className={styles.list}>
        {categories.map((category, index) => {
          const widthPercent = (parseFloat(category.hours) / maxHours) * 100;
          return (
            <div key={index} className={styles.categoryRow}>
              <div className={styles.labelRow}>
                <span className={styles.name}>{category.name}</span>
                <span className={styles.hours}>{category.hours}</span>
              </div>
              <div className={styles.barTrack}>
                <div 
                  className={styles.barFill} 
                  style={{ 
                    width: `${widthPercent}%`,
                    backgroundColor: category.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
