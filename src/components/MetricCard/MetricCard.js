import styles from './MetricCard.module.css';

export default function MetricCard({ title, value, unit, subtitle }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.valueContainer}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
