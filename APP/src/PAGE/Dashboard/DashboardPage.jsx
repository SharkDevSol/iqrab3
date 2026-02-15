import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion } from 'framer-motion';
import { 
  FiUsers, FiDollarSign, FiCheckCircle, FiAlertCircle,
  FiTrendingUp, FiBook, FiCalendar,
  FiRefreshCw, FiDownload
} from 'react-icons/fi';
import styles from './Dashboard.module.css';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // State for all dashboard data
  const [quickStats, setQuickStats] = useState(null);
  const [students, setStudents] = useState(null);
  const [staff, setStaff] = useState(null);
  const [finance, setFinance] = useState(null);
  const [academic, setAcademic] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [hr, setHr] = useState(null);

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchAllData(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async (isAutoRefresh = false) => {
    if (isAutoRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch all data in parallel
      const [
        summaryRes,
        studentsRes,
        staffRes,
        financeRes,
        academicRes,
        attendanceRes,
        behaviorRes,
        hrRes
      ] = await Promise.all([
        api.get('/reports/summary').catch(() => ({ data: null })),
        api.get('/reports/students/summary').catch(() => ({ data: null })),
        api.get('/reports/staff/summary').catch(() => ({ data: null })),
        api.get('/reports/finance/summary').catch(() => ({ data: null })),
        api.get('/reports/academic/class-performance').catch(() => ({ data: null })),
        api.get('/reports/attendance/summary').catch(() => ({ data: null })),
        api.get('/reports/faults/summary').catch(() => ({ data: null })),
        api.get('/reports/hr/summary').catch(() => ({ data: null }))
      ]);

      setQuickStats(summaryRes.data);
      setStudents(studentsRes.data?.data || studentsRes.data);
      setStaff(staffRes.data?.data || staffRes.data);
      setFinance(financeRes.data?.data || financeRes.data);
      setAcademic(academicRes.data?.data || academicRes.data);
      setAttendance(attendanceRes.data?.data || attendanceRes.data);
      setBehavior(behaviorRes.data?.data || behaviorRes.data);
      setHr(hrRes.data?.data || hrRes.data);
      
      // Log data for debugging
      console.log('=== DASHBOARD DATA LOADED ===');
      console.log('Quick Stats:', summaryRes.data);
      console.log('Students:', studentsRes.data);
      console.log('Staff:', staffRes.data);
      console.log('Finance:', financeRes.data);
      console.log('Academic:', academicRes.data);
      console.log('Attendance:', attendanceRes.data);
      console.log('Behavior:', behaviorRes.data);
      console.log('HR:', hrRes.data);
      console.log('============================');
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchAllData(true);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Dashboard Overview</h1>
          <p className={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button 
            onClick={handleRefresh} 
            className={styles.refreshBtn}
            disabled={refreshing}
          >
            <FiRefreshCw className={refreshing ? styles.spinning : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className={styles.exportBtn}>
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={styles.quickStats}>
        <StatCard
          title="Total Students"
          value={quickStats?.totalStudents || students?.total || students?.totalStudents || (students?.male || 0) + (students?.female || 0)}
          subtitle="Enrolled students across all classes"
          icon={<FiUsers />}
          color="blue"
          trend="+5%"
        />
        <StatCard
          title="Total Staff"
          value={quickStats?.totalStaff || staff?.total || staff?.totalStaff || 0}
          subtitle="Teachers, admin & support staff"
          icon={<FiUsers />}
          color="green"
          trend="+2%"
        />
        <StatCard
          title="Total Revenue"
          value={`${(quickStats?.totalRevenue || finance?.revenue || 0).toLocaleString()} Birr`}
          subtitle="Total income from all sources"
          icon={<FiDollarSign />}
          color="purple"
          trend="+12%"
        />
        <StatCard
          title="Attendance Rate"
          value={`${(Number(quickStats?.attendanceRate) || Number(attendance?.attendanceRate) || 0).toFixed(1)}%`}
          subtitle="Students present today"
          icon={<FiCheckCircle />}
          color="orange"
          trend="+3%"
        />
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Students Section */}
        <Section title="Students Overview" icon={<FiUsers />} description="Complete student enrollment statistics">
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Total Students:</span>
              <strong>{students?.total || students?.totalStudents || (students?.male || 0) + (students?.female || 0)}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Male Students:</span>
              <strong>{students?.male || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Female Students:</span>
              <strong>{students?.female || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Total Classes:</span>
              <strong>{students?.classCount || students?.totalClasses || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Average per Class:</span>
              <strong>{(students?.total || students?.totalStudents || (students?.male || 0) + (students?.female || 0)) && (students?.classCount || students?.totalClasses) ? Math.round(((students?.total || students?.totalStudents || (students?.male || 0) + (students?.female || 0))) / (students?.classCount || students?.totalClasses)) : 0}</strong>
            </div>
          </div>
        </Section>

        {/* Staff Section */}
        <Section title="Staff Management" icon={<FiUsers />} description="Staff distribution and roles">
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Total Staff Members:</span>
              <strong>{staff?.total || staff?.totalStaff || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Teaching Staff:</span>
              <strong>{staff?.teachers || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Administrative Staff:</span>
              <strong>{staff?.admin || staff?.administrative || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Support Staff:</span>
              <strong>{staff?.support || staff?.supportive || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Staff-Student Ratio:</span>
              <strong>1:{(students?.total || students?.totalStudents || (students?.male || 0) + (students?.female || 0)) && (staff?.total || staff?.totalStaff) ? Math.round(((students?.total || students?.totalStudents || (students?.male || 0) + (students?.female || 0))) / (staff?.total || staff?.totalStaff)) : 0}</strong>
            </div>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Total Staff Members:</span>
              <strong>{staff?.totalStaff || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Teaching Staff:</span>
              <strong>{staff?.teachers || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Administrative Staff:</span>
              <strong>{staff?.administrative || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Support Staff:</span>
              <strong>{staff?.supportive || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Staff-Student Ratio:</span>
              <strong>1:{students?.totalStudents && staff?.totalStaff ? Math.round(students.totalStudents / staff.totalStaff) : 0}</strong>
            </div>
          </div>
        </Section>

        {/* Finance Section */}
        <Section title="Financial Summary" icon={<FiDollarSign />} description="Income, expenses and profit overview">
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Total Revenue (Income):</span>
              <strong className={styles.success}>{(finance?.revenue || 0).toLocaleString()} Birr</strong>
            </div>
            <div className={styles.statRow}>
              <span>Total Expenses (Costs):</span>
              <strong className={styles.danger}>{(finance?.expenses || 0).toLocaleString()} Birr</strong>
            </div>
            <div className={styles.statRow}>
              <span>Net Profit (Revenue - Expenses):</span>
              <strong className={styles.success}>{(finance?.profit || 0).toLocaleString()} Birr</strong>
            </div>
            <div className={styles.statRow}>
              <span>Pending Fees (Unpaid):</span>
              <strong className={styles.warning}>{(finance?.pending || 0).toLocaleString()} Birr</strong>
            </div>
            <div className={styles.statRow}>
              <span>Collection Rate:</span>
              <strong>{finance?.revenue && finance?.pending ? (Number((finance.revenue / (finance.revenue + finance.pending)) * 100) || 0).toFixed(1) : 0}%</strong>
            </div>
          </div>
        </Section>

        {/* Academic Section */}
        <Section title="Academic Performance" icon={<FiBook />} description="Student grades and evaluation results">
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Average Score (All Students):</span>
              <strong>{academic?.averageScore || 'N/A'}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Total Evaluations Conducted:</span>
              <strong>{academic?.totalEvaluations || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Pass Rate (Above 50%):</span>
              <strong className={styles.success}>{academic?.passRate || 0}%</strong>
            </div>
            <div className={styles.statRow}>
              <span>Top Performing Class:</span>
              <strong>{academic?.topPerformer || 'N/A'}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Students Needing Support:</span>
              <strong className={styles.warning}>{academic?.needsSupport || 0}</strong>
            </div>
          </div>
        </Section>

        {/* Attendance Section */}
        <Section title="Attendance Tracking" icon={<FiCalendar />} description="Daily student attendance records">
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Today's Attendance Rate:</span>
              <strong className={styles.success}>{(Number(attendance?.attendanceRate) || 0).toFixed(1)}%</strong>
            </div>
            <div className={styles.statRow}>
              <span>Students Present Today:</span>
              <strong className={styles.success}>{attendance?.present || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Students Absent Today:</span>
              <strong className={styles.danger}>{attendance?.absent || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Students Late Today:</span>
              <strong className={styles.warning}>{attendance?.late || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Excused Absences:</span>
              <strong>{attendance?.excused || 0}</strong>
            </div>
          </div>
        </Section>

        {/* Behavior Section */}
        <Section title="Behavior & Discipline" icon={<FiAlertCircle />} description="Student conduct and fault records">
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Total Faults Recorded:</span>
              <strong className={styles.danger}>{behavior?.totalFaults || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Faults This Week:</span>
              <strong>{behavior?.weeklyFaults || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Critical/Severe Faults:</span>
              <strong className={styles.danger}>{behavior?.criticalFaults || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Students with Faults:</span>
              <strong>{behavior?.uniqueStudents || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Resolved Issues:</span>
              <strong className={styles.success}>{behavior?.resolved || 0}</strong>
            </div>
          </div>
        </Section>

        {/* HR Section */}
        <Section title="HR & Payroll" icon={<FiTrendingUp />} description="Staff attendance and leave management">
          <div className={styles.sectionContent}>
            <div className={styles.statRow}>
              <span>Staff Present Today:</span>
              <strong className={styles.success}>{hr?.present || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Staff Absent Today:</span>
              <strong className={styles.danger}>{hr?.absent || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Staff on Leave:</span>
              <strong className={styles.warning}>{hr?.onLeave || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Pending Leave Requests:</span>
              <strong>{hr?.pendingRequests || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Staff Attendance Rate:</span>
              <strong>{hr?.present && staff?.totalStaff ? (Number((hr.present / staff.totalStaff) * 100) || 0).toFixed(1) : 0}%</strong>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color, trend }) => (
  <motion.div 
    className={`${styles.statCard} ${styles[color]}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className={styles.statIcon}>{icon}</div>
    <div className={styles.statInfo}>
      <h3>{title}</h3>
      <p className={styles.statValue}>{value}</p>
      {trend && <span className={styles.trend}>{trend}</span>}
    </div>
  </motion.div>
);

// Section Component
const Section = ({ title, icon, description, children }) => (
  <motion.div 
    className={styles.section}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitle}>
        {icon}
        <div>
          <h2>{title}</h2>
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </div>
      </div>
    </div>
    {children}
  </motion.div>
);

export default DashboardPage;
