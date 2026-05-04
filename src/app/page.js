import Sidebar from '@/components/Sidebar/Sidebar';
import MetricCard from '@/components/MetricCard/MetricCard';
import Timeline from '@/components/Timeline/Timeline';
import WeeklyHabits from '@/components/WeeklyHabits/WeeklyHabits';
import CategoryProgress from '@/components/CategoryProgress/CategoryProgress';
import ScoreBreakdown from '@/components/ScoreBreakdown/ScoreBreakdown';
import styles from './page.module.css';

export default function Home() {
  // Mock Data
  const timelineEvents = [
    { time: '6:00', title: 'Wake up', tag: 'routine', color: 'var(--accent-routine)' },
    { time: '7:00', title: 'Morning walk · 30 min', tag: 'exercise', color: 'var(--accent-exercise)' },
    { time: '9:00', title: 'Deep Work Session · 2h', tag: 'work', color: 'var(--accent-work)' },
    { time: '2:00', title: 'Code Review & Planning · 2.5h', tag: 'work', color: 'var(--accent-work)' },
    { time: '7:00', title: 'Evening review logged', tag: 'review', color: 'var(--accent-review)' },
  ];

  const habits = [
    { name: 'Wake before 6:30', days: [true, true, true, false, true, true, true] },
    { name: 'Exercise', days: [true, false, true, true, true, false, true] },
    { name: '6h+ work', days: [false, true, true, false, true, true, false] },
    { name: '8 glasses water', days: [true, true, false, true, true, true, true] },
    { name: 'Evening review', days: [true, true, true, true, true, false, false] },
    { name: 'Sleep by 11pm', days: [true, false, true, true, false, true, true] },
  ];

  const workCategories = [
    { name: 'Project Implementation', hours: '12h', color: '#818cf8' }, // Indigo
    { name: 'Code Review', hours: '9h', color: '#3b82f6' }, // Blue
    { name: 'Architecture / Planning', hours: '4h', color: '#f97316' }, // Orange
    { name: 'Team Sync', hours: '3h', color: '#10b981' }, // Green
  ];

  const scoreTags = [
    { label: 'routine ✓', color: 'var(--accent-work)' },
    { label: 'exercise ✓', color: 'var(--accent-exercise)' },
    { label: 'diet partial', color: 'var(--accent-diet)' },
    { label: 'mood good', color: 'var(--accent-review)' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.sidebarWrapper}>
        <Sidebar />
      </div>
      
      <main className={styles.mainContent}>
        {/* Top Metrics Row */}
        <div className={styles.metricsGrid}>
          <MetricCard 
            title="Day score" 
            value="78" 
            unit="/100" 
            subtitle="Good day" 
          />
          <MetricCard 
            title="Work logged" 
            value="4.5" 
            unit="h" 
            subtitle="Goal: 6h" 
          />
          <MetricCard 
            title="Water" 
            value="6" 
            unit="/8" 
            subtitle="glasses" 
          />
          <MetricCard 
            title="Habits done" 
            value="7" 
            unit="/9" 
            subtitle="77% complete" 
          />
        </div>

        {/* 2-Column Main Layout */}
        <div className={styles.contentGrid}>
          {/* Left Column */}
          <div className={styles.column}>
            <div className={styles.cardWrapperLarge}>
              <Timeline events={timelineEvents} />
            </div>
            <div className={styles.cardWrapperSmall}>
              <CategoryProgress categories={workCategories} />
            </div>
          </div>
          
          {/* Right Column */}
          <div className={styles.column}>
            <div className={styles.cardWrapperLarge}>
              <WeeklyHabits habits={habits} />
            </div>
            <div className={styles.cardWrapperSmall}>
              <ScoreBreakdown 
                score={78} 
                label="Good" 
                date="Mon, 4 May 2026" 
                tags={scoreTags} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
