import styles from './Timeline.module.css';

export default function Timeline({ events }) {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>TODAY'S TIMELINE</h2>
      
      <div className={styles.timelineList}>
        {events.map((event, index) => (
          <div key={index} className={styles.eventRow}>
            <div className={styles.time}>{event.time}</div>
            
            <div className={styles.nodeContainer}>
              <div 
                className={styles.node} 
                style={{ backgroundColor: event.color }}
              ></div>
              {index < events.length - 1 && <div className={styles.line}></div>}
            </div>
            
            <div className={styles.content}>
              <h4 className={styles.title}>{event.title}</h4>
              {event.tag && (
                <span 
                  className={styles.tag}
                  style={{ 
                    color: event.color, 
                    backgroundColor: `${event.color}15` // 15 is hex for ~8% opacity
                  }}
                >
                  {event.tag}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
