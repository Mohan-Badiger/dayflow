import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Today', dotColor: 'var(--accent-exercise)' },
  { label: 'Routine', dotColor: 'var(--accent-routine)' },
  { label: 'Work sessions', dotColor: 'var(--accent-work)' },
  { label: 'Diet & water', dotColor: 'var(--accent-diet)' },
  { label: 'Exercise', dotColor: '#10b981' }, // Specific green
  { label: 'Mood & energy', dotColor: 'var(--accent-review)' },
  { label: 'Analytics', dotColor: '#f59e0b' },
  { label: 'Settings', dotColor: '#6b7280' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>DayFlow</h1>
        <p className={styles.subtitle}>personal tracker</p>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item, index) => (
            <li key={index} className={`${styles.navItem} ${index === 0 ? styles.active : ''}`}>
              <span 
                className={styles.dot} 
                style={{ backgroundColor: item.dotColor }}
              ></span>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.streakBox}>
        <h2 className={styles.streakNumber}>14</h2>
        <p className={styles.streakLabel}>day streak</p>
      </div>
    </aside>
  );
}
