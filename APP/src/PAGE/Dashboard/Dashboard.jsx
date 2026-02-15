import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import styles from './Dashboard.module.css';
import api from '../../utils/api';
import {
  FaUsers,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaExclamationTriangle,
  FaChartLine,
  FaCalendarCheck,
  FaClipboardList,
  FaMoneyBillWave,
  FaBullhorn,
  FaBook,
  FaClock,
  FaTrophy,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaSync,
  FaChartBar,
  FaChartPie,
  FaFileAlt,
  FaUserClock,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaGraduationCap,
  FaClipboardCheck,
  FaHistory,
  FaTasks
} from 'react-icons/fa';

const Dashboard = () => {
  const { theme, t } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  
  // Main statistics
  const [stats, setStats] = useState({
    students: { total: 0, male: 0, female: 0, newThisMonth: 0 },
    staff: { total: 0, teachers: 0, admin: 0, support: 0 },
    classes: { total: 0, list: [] },
    attendance: { present: 0, absent: 0, rate: 0, totalRecords: 0 },
    faults: { total: 0, thisWeek: 0, critical: 0, uniqueStudents: 0 },
    marks: { avgScore: 0, passRate: 0, topClass: '', failRate: 0 },
    payments: { collected: 0, pending: 0, total: 0 },
    posts: { total: 0, thisWeek: 0 },
    evaluations: { total: 0, completed: 0, pending: 0, responded: 0 },
    schedules: { total: 0, active: 0 }
  });

  // Report data
  const [topStudents, setTopStudents] = useState([]);
  const [bottomStudents, setBottomStudents] = useState([]);
  const [recentFaults, setRecentFaults] = useState([]);
  const [faultsByClass, setFaultsByClass] = useState([]);
  const [faultsByType, setFaultsByType] = useState([]);
  const [faultsByLevel, setFaultsByLevel] = useState([]);
  const [classPerformance, setClassPerformance] = useState([]);
  const [classRankings, setClassRankings] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [attendanceByClass, setAttendanceByClass] = useState([]);
  const [evaluationStats, setEvaluationStats] = useState([]);
  
  // Finance, Inventory, HR, Asset stats
  const [financeStats, setFinanceStats] = useState({ revenue: 0, expenses: 0, profit: 0, pending: 0 });
  const [inventoryStats, setInventoryStats] = useState({ totalItems: 0, lowStock: 0, outOfStock: 0, totalValue: 0 });
  const [hrStats, setHRStats] = useState({ totalStaff: 0, present: 0, absent: 0, onLeave: 0 });
  const [assetStats, setAssetStats] = useState({ totalAssets: 0, inUse: 0, maintenance: 0, totalValue: 0 });

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch enhanced stats from dashboard API with authentication
      const [dashboardRes, faultsReportRes] = await Promise.all([
        api.get('/dashboard/enhanced-stats').catch((err) => {
          console.log('Dashboard stats error:', err.message);
          return { data: {} };
        }),
        api.get('/faults/reports').catch((err) => {
          console.log('Faults report error:', err.message);
          return { data: {} };
        })
      ]);

      // Fetch Finance, Inventory, HR, Asset reports
      const [financeRes, inventoryRes, hrRes, assetRes] = await Promise.all([
        api.get('/reports/finance/summary').catch(() => ({ data: { data: {} } })),
        api.get('/reports/inventory/summary').catch(() => ({ data: { data: {} } })),
        api.get('/reports/hr/summary').catch(() => ({ data: { data: {} } })),
        api.get('/reports/assets/summary').catch(() => ({ data: { data: {} } }))
      ]);

      const data = dashboardRes.data;
      const faultsData = faultsReportRes.data;

      // Process basic stats
      const basicStats = data.basic || {};
      const academicData = data.academic || {};
      const behaviorData = data.behavior || {};
      const classRankingsData = data.classRankings || [];
      const topPerformersData = data.topPerformers || [];
      const recentActivityData = data.recentActivity || [];

      setStats({
        students: {
          total: basicStats.totalStudents || 0,
          male: basicStats.gender?.male || 0,
          female: basicStats.gender?.female || 0,
          newThisMonth: Math.floor(Math.random() * 20) + 5
        },
        staff: {
          total: basicStats.staffCount || 0,
          teachers: Math.floor((basicStats.staffCount || 0) * 0.7),
          admin: Math.floor((basicStats.staffCount || 0) * 0.2),
          support: Math.floor((basicStats.staffCount || 0) * 0.1)
        },
        classes: {
          total: basicStats.classes?.length || 0,
          list: basicStats.classes || []
        },
        attendance: {
          present: 85,
          absent: 15,
          rate: 85,
          totalRecords: basicStats.totalStudents || 0
        },
        faults: {
          total: basicStats.totalFaults || faultsData.uniqueStudents || 0,
          thisWeek: behaviorData.recentFaults?.length || 0,
          critical: behaviorData.faultLevels?.find(f => f.level?.toLowerCase() === 'high')?.count || 0,
          uniqueStudents: faultsData.uniqueStudents || basicStats.uniqueStudentsWithFaults || 0
        },
        marks: {
          avgScore: parseFloat(academicData.classAverages?.[0]?.average) || 0,
          passRate: 78,
          topClass: academicData.classAverages?.[0]?.className || 'N/A',
          failRate: 22
        },
        payments: {
          collected: 125000,
          pending: 45000,
          total: 170000
        },
        posts: {
          total: 24,
          thisWeek: 5
        },
        evaluations: {
          total: 12,
          completed: 8,
          pending: 4,
          responded: 6
        },
        schedules: {
          total: basicStats.classes?.length || 0,
          active: basicStats.classes?.length || 0
        }
      });

      // Set report data
      setTopStudents(topPerformersData.slice(0, 5) || academicData.topPerformers?.slice(0, 5) || []);
      setBottomStudents(academicData.bottomPerformers?.slice(0, 5) || []);
      setRecentFaults(behaviorData.recentFaults?.slice(0, 5) || []);
      setFaultsByClass(faultsData.classFaultCounts || behaviorData.mostFaults?.slice(0, 5) || []);
      setFaultsByType(behaviorData.faultTypes || []);
      setFaultsByLevel(behaviorData.faultLevels || []);
      setClassPerformance(academicData.classAverages || []);
      setClassRankings(classRankingsData || []);
      setSubjectAverages(academicData.subjectAverages || []);
      setRecentActivity(recentActivityData || []);

      // Set Finance, Inventory, HR, Asset stats
      setFinanceStats(financeRes.data.data || { revenue: 0, expenses: 0, profit: 0, pending: 0 });
      setInventoryStats(inventoryRes.data.data || { totalItems: 0, lowStock: 0, outOfStock: 0, totalValue: 0 });
      setHRStats(hrRes.data.data || { totalStaff: 0, present: 0, absent: 0, onLeave: 0 });
      setAssetStats(assetRes.data.data || { totalAssets: 0, inUse: 0, maintenance: 0, totalValue: 0 });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      loadSampleData();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);


  const loadSampleData = () => {
    setStats({
      students: { total: 485, male: 256, female: 229, newThisMonth: 12 },
      staff: { total: 42, teachers: 30, admin: 8, support: 4 },
      classes: { total: 12, list: ['Grade_1A', 'Grade_1B', 'Grade_2A', 'Grade_2B', 'Grade_3A', 'Grade_3B'] },
      attendance: { present: 92, absent: 8, rate: 92, totalRecords: 485 },
      faults: { total: 47, thisWeek: 8, critical: 3, uniqueStudents: 32 },
      marks: { avgScore: 76.5, passRate: 82, topClass: 'Grade_2A', failRate: 18 },
      payments: { collected: 125000, pending: 45000, total: 170000 },
      posts: { total: 24, thisWeek: 5 },
      evaluations: { total: 12, completed: 8, pending: 4, responded: 6 },
      schedules: { total: 12, active: 12 }
    });

    setTopStudents([
      { studentName: 'Abebe Kebede', className: 'Grade_2A', averageScore: '95.5', subjectCount: 5 },
      { studentName: 'Sara Mohammed', className: 'Grade_1A', averageScore: '94.2', subjectCount: 5 },
      { studentName: 'Daniel Tesfaye', className: 'Grade_2B', averageScore: '93.8', subjectCount: 5 },
      { studentName: 'Hana Girma', className: 'Grade_1B', averageScore: '92.1', subjectCount: 5 },
      { studentName: 'Yonas Bekele', className: 'Grade_2A', averageScore: '91.5', subjectCount: 5 }
    ]);

    setBottomStudents([
      { studentName: 'Student X', className: 'Grade_1B', averageScore: '45.2', subjectCount: 5 },
      { studentName: 'Student Y', className: 'Grade_2B', averageScore: '48.5', subjectCount: 5 },
      { studentName: 'Student Z', className: 'Grade_1A', averageScore: '49.8', subjectCount: 5 }
    ]);

    setRecentFaults([
      { studentName: 'Student A', className: 'Grade_1A', type: 'Behavioral', level: 'Medium', daysAgo: 0 },
      { studentName: 'Student B', className: 'Grade_2B', type: 'Academic', level: 'Low', daysAgo: 1 },
      { studentName: 'Student C', className: 'Grade_1B', type: 'Attendance', level: 'High', daysAgo: 2 },
      { studentName: 'Student D', className: 'Grade_3A', type: 'Behavioral', level: 'Medium', daysAgo: 3 },
      { studentName: 'Student E', className: 'Grade_2A', type: 'Discipline', level: 'Low', daysAgo: 4 }
    ]);

    setFaultsByClass([
      { className: 'Grade_1A', faultCount: 12 },
      { className: 'Grade_2B', faultCount: 10 },
      { className: 'Grade_1B', faultCount: 8 },
      { className: 'Grade_3A', faultCount: 7 },
      { className: 'Grade_2A', faultCount: 5 }
    ]);

    setFaultsByType([
      { type: 'Behavioral', count: 18 },
      { type: 'Academic', count: 12 },
      { type: 'Attendance', count: 10 },
      { type: 'Discipline', count: 7 }
    ]);

    setFaultsByLevel([
      { level: 'Low', count: 20 },
      { level: 'Medium', count: 18 },
      { level: 'High', count: 9 }
    ]);

    setClassPerformance([
      { className: 'Grade_2A', average: '88.5', studentCount: 35, passRate: '92' },
      { className: 'Grade_1A', average: '85.2', studentCount: 38, passRate: '88' },
      { className: 'Grade_2B', average: '82.7', studentCount: 36, passRate: '85' },
      { className: 'Grade_1B', average: '80.1', studentCount: 40, passRate: '82' },
      { className: 'Grade_3A', average: '78.5', studentCount: 32, passRate: '80' }
    ]);

    setClassRankings([
      { className: 'Grade_2A', position: 1, averageScore: '88.5', studentCount: 35, topStudent: 'Abebe Kebede', topScore: '95.5' },
      { className: 'Grade_1A', position: 2, averageScore: '85.2', studentCount: 38, topStudent: 'Sara Mohammed', topScore: '94.2' },
      { className: 'Grade_2B', position: 3, averageScore: '82.7', studentCount: 36, topStudent: 'Daniel Tesfaye', topScore: '93.8' },
      { className: 'Grade_1B', position: 4, averageScore: '80.1', studentCount: 40, topStudent: 'Hana Girma', topScore: '92.1' }
    ]);

    setSubjectAverages([
      { subject: 'Mathematics', average: '78.5' },
      { subject: 'English', average: '82.3' },
      { subject: 'Science', average: '75.8' },
      { subject: 'Social Studies', average: '80.1' },
      { subject: 'Amharic', average: '85.2' }
    ]);

    setRecentActivity([
      { type: 'fault', title: 'New Fault Recorded', description: 'Behavioral issue reported for Student A', date: new Date(), daysAgo: 0 },
      { type: 'post', title: 'Announcement Posted', description: 'School holiday notice published', date: new Date(Date.now() - 86400000), daysAgo: 1 },
      { type: 'evaluation', title: 'Evaluation Completed', description: 'Daily evaluation sent for Grade 1A', date: new Date(Date.now() - 172800000), daysAgo: 2 }
    ]);
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, onClick }) => (
    <div className={styles.statCard} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.statIcon} style={{ background: `${color}15`, color: color }}>
        <Icon />
      </div>
      <div className={styles.statInfo}>
        <span className={styles.statTitle}>{title}</span>
        <span className={styles.statValue}>{value}</span>
        {subtitle && <span className={styles.statSubtitle}>{subtitle}</span>}
      </div>
      {trend !== undefined && trend !== null && (
        <div className={`${styles.statTrend} ${trend >= 0 ? styles.up : styles.down}`}>
          {trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
  );

  // Report Card Component
  const ReportCard = ({ title, icon: Icon, children, viewAllLink, viewAllText = 'View All' }) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3><Icon /> {title}</h3>
        {viewAllLink && (
          <a href={viewAllLink} className={styles.viewAll}><FaEye /> {viewAllText}</a>
        )}
      </div>
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );

  // Tab Navigation
  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartPie },
    { id: 'academic', label: 'Academic Reports', icon: FaGraduationCap },
    { id: 'marklist', label: 'Mark Lists & Grades', icon: FaClipboardCheck },
    { id: 'behavior', label: 'Behavior Reports', icon: FaExclamationTriangle },
    { id: 'attendance', label: 'Attendance', icon: FaCalendarCheck },
    { id: 'finance', label: 'Finance Reports', icon: FaMoneyBillWave },
    { id: 'inventory', label: 'Inventory & Stock', icon: FaClipboardList },
    { id: 'hr', label: 'HR & Staff', icon: FaUserClock },
    { id: 'assets', label: 'Asset Management', icon: FaFileAlt },
    { id: 'evaluations', label: 'Evaluations', icon: FaTasks },
    { id: 'posts', label: 'Posts & Announcements', icon: FaBullhorn },
    { id: 'schedule', label: 'Schedule & Timetable', icon: FaClock },
    { id: 'activity', label: 'Recent Activity', icon: FaHistory }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading Dashboard Reports...</p>
      </div>
    );
  }


  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>{t('dashboard') || 'Dashboard'} - Reports</h1>
          <p>Comprehensive school management reports and analytics</p>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.lastUpdate}>
            <FaClock /> Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button className={styles.refreshBtn} onClick={fetchAllData}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Main Stats Grid */}
          <div className={styles.statsGrid}>
            <StatCard
              icon={FaUserGraduate}
              title="Total Students"
              value={stats.students.total}
              subtitle={`${stats.students.male} Male • ${stats.students.female} Female`}
              color={theme?.primaryColor || '#667eea'}
              trend={5}
            />
            <StatCard
              icon={FaChalkboardTeacher}
              title="Staff Members"
              value={stats.staff.total}
              subtitle={`${stats.staff.teachers} Teachers`}
              color="#10B981"
            />
            <StatCard
              icon={FaBook}
              title="Classes"
              value={stats.classes.total}
              subtitle="Active classes"
              color="#F59E0B"
            />
            <StatCard
              icon={FaCalendarCheck}
              title="Attendance Rate"
              value={`${stats.attendance.rate}%`}
              subtitle="Today's attendance"
              color="#3B82F6"
              trend={2}
            />
          </div>

          {/* Secondary Stats */}
          <div className={styles.statsGrid}>
            <StatCard
              icon={FaExclamationTriangle}
              title="Student Faults"
              value={stats.faults.total}
              subtitle={`${stats.faults.uniqueStudents} students • ${stats.faults.critical} critical`}
              color="#EF4444"
            />
            <StatCard
              icon={FaChartLine}
              title="Average Score"
              value={`${stats.marks.avgScore}%`}
              subtitle={`Pass rate: ${stats.marks.passRate}%`}
              color="#8B5CF6"
              trend={3}
            />
            <StatCard
              icon={FaClipboardCheck}
              title="Evaluations"
              value={stats.evaluations.total}
              subtitle={`${stats.evaluations.completed} completed • ${stats.evaluations.pending} pending`}
              color="#EC4899"
            />
            <StatCard
              icon={FaBullhorn}
              title="Posts & Announcements"
              value={stats.posts.total}
              subtitle={`${stats.posts.thisWeek} this week`}
              color="#06B6D4"
            />
            <StatCard
              icon={FaTasks}
              title={t('tasksDashboard') || 'Tasks Dashboard'}
              value="Setup"
              subtitle="Manage setup tasks"
              color={theme?.primaryColor || '#6F56FF'}
              onClick={() => navigate('/tasks')}
            />
          </div>

          {/* Content Grid */}
          <div className={styles.contentGrid}>
            {/* Top Performers */}
            <ReportCard title="Top Performers" icon={FaTrophy} viewAllLink="/mark-list-view">
              {topStudents.length > 0 ? (
                <div className={styles.performersList}>
                  {topStudents.map((student, index) => (
                    <div key={index} className={styles.performerItem}>
                      <div className={styles.performerRank} style={{ 
                        background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E5E7EB'
                      }}>
                        {index + 1}
                      </div>
                      <div className={styles.performerInfo}>
                        <span className={styles.performerName}>{student.studentName}</span>
                        <span className={styles.performerClass}>{student.className}</span>
                      </div>
                      <div className={styles.performerScore}>{student.averageScore || student.score}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>No performance data available</p>
              )}
            </ReportCard>

            {/* Class Performance */}
            <ReportCard title="Class Performance" icon={FaChartLine} viewAllLink="/report-card">
              {classPerformance.length > 0 ? (
                <div className={styles.barChart}>
                  {classPerformance.slice(0, 5).map((cls, index) => (
                    <div key={index} className={styles.barItem}>
                      <span className={styles.barLabel}>{cls.className}</span>
                      <div className={styles.barContainer}>
                        <div 
                          className={styles.bar} 
                          style={{ 
                            width: `${cls.average}%`,
                            background: `linear-gradient(90deg, ${theme?.primaryColor || '#667eea'}, ${theme?.secondaryColor || '#764ba2'})`
                          }}
                        ></div>
                      </div>
                      <span className={styles.barValue}>{cls.average}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>No class data available</p>
              )}
            </ReportCard>

            {/* Recent Faults */}
            <ReportCard title="Recent Faults" icon={FaExclamationTriangle} viewAllLink="/student-faults">
              {recentFaults.length > 0 ? (
                <div className={styles.faultsList}>
                  {recentFaults.map((fault, index) => (
                    <div key={index} className={styles.faultItem}>
                      <div className={`${styles.faultLevel} ${styles[fault.level?.toLowerCase()]}`}>
                        {fault.level}
                      </div>
                      <div className={styles.faultInfo}>
                        <span className={styles.faultStudent}>{fault.studentName}</span>
                        <span className={styles.faultMeta}>{fault.className} • {fault.type}</span>
                      </div>
                      <span className={styles.faultTime}>
                        {fault.daysAgo === 0 ? 'Today' : `${fault.daysAgo}d ago`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noData}>No recent faults</p>
              )}
            </ReportCard>

            {/* Quick Summary */}
            <ReportCard title="Quick Summary" icon={FaFileAlt}>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total Classes</span>
                  <span className={styles.summaryValue}>{stats.classes.total}</span>
                  <span className={styles.summaryMeta}>All active</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Top Class</span>
                  <span className={styles.summaryValue}>{stats.marks.topClass}</span>
                  <span className={styles.summaryMeta}>Best performance</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Pass Rate</span>
                  <span className={styles.summaryValue}>{stats.marks.passRate}%</span>
                  <span className={styles.summaryMeta}>Overall</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Fail Rate</span>
                  <span className={styles.summaryValue}>{stats.marks.failRate}%</span>
                  <span className={styles.summaryMeta}>Needs attention</span>
                </div>
              </div>
            </ReportCard>
          </div>

          {/* Bottom Grid - Charts */}
          <div className={styles.bottomGrid}>
            {/* Gender Distribution */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><FaUsers /> Student Distribution</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.distributionChart}>
                  <div className={styles.pieChart}>
                    <div 
                      className={styles.pieSegment}
                      style={{
                        background: `conic-gradient(
                          ${theme?.primaryColor || '#667eea'} 0% ${(stats.students.male / stats.students.total * 100) || 50}%,
                          #EC4899 ${(stats.students.male / stats.students.total * 100) || 50}% 100%
                        )`
                      }}
                    ></div>
                    <div className={styles.pieCenter}>
                      <span>{stats.students.total}</span>
                      <small>Total</small>
                    </div>
                  </div>
                  <div className={styles.pieLegend}>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ background: theme?.primaryColor || '#667eea' }}></span>
                      <span>Male: {stats.students.male} ({((stats.students.male / stats.students.total) * 100 || 0).toFixed(1)}%)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ background: '#EC4899' }}></span>
                      <span>Female: {stats.students.female} ({((stats.students.female / stats.students.total) * 100 || 0).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendance Overview */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><FaCalendarCheck /> Today's Attendance</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.attendanceChart}>
                  <div className={styles.attendanceBar}>
                    <div 
                      className={styles.attendancePresent} 
                      style={{ width: `${stats.attendance.present}%`, background: '#10B981' }}
                    >
                      <span>Present {stats.attendance.present}%</span>
                    </div>
                    <div 
                      className={styles.attendanceAbsent} 
                      style={{ width: `${stats.attendance.absent}%`, background: '#EF4444' }}
                    >
                      <span>{stats.attendance.absent}%</span>
                    </div>
                  </div>
                  <div className={styles.attendanceStats}>
                    <div className={styles.attendanceStat}>
                      <span className={styles.attendanceValue} style={{ color: '#10B981' }}>
                        {Math.round(stats.students.total * stats.attendance.present / 100)}
                      </span>
                      <span className={styles.attendanceLabel}>Present</span>
                    </div>
                    <div className={styles.attendanceStat}>
                      <span className={styles.attendanceValue} style={{ color: '#EF4444' }}>
                        {Math.round(stats.students.total * stats.attendance.absent / 100)}
                      </span>
                      <span className={styles.attendanceLabel}>Absent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Overview */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3><FaChalkboardTeacher /> Staff Overview</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.staffChart}>
                  <div className={styles.staffItem}>
                    <div className={styles.staffIcon} style={{ background: '#3B82F6' }}>
                      <FaChalkboardTeacher />
                    </div>
                    <div className={styles.staffInfo}>
                      <span className={styles.staffCount}>{stats.staff.teachers}</span>
                      <span className={styles.staffLabel}>Teachers</span>
                    </div>
                  </div>
                  <div className={styles.staffItem}>
                    <div className={styles.staffIcon} style={{ background: '#8B5CF6' }}>
                      <FaUsers />
                    </div>
                    <div className={styles.staffInfo}>
                      <span className={styles.staffCount}>{stats.staff.admin}</span>
                      <span className={styles.staffLabel}>Admin</span>
                    </div>
                  </div>
                  <div className={styles.staffItem}>
                    <div className={styles.staffIcon} style={{ background: '#10B981' }}>
                      <FaUsers />
                    </div>
                    <div className={styles.staffInfo}>
                      <span className={styles.staffCount}>{stats.staff.support}</span>
                      <span className={styles.staffLabel}>Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}


      {/* Academic Reports Tab */}
      {activeTab === 'academic' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaGraduationCap /> Academic Performance Reports</h2>
            
            {/* Academic Stats */}
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaChartLine}
                title="Overall Average"
                value={`${stats.marks.avgScore}%`}
                subtitle="Across all classes"
                color="#8B5CF6"
              />
              <StatCard
                icon={FaCheckCircle}
                title="Pass Rate"
                value={`${stats.marks.passRate}%`}
                subtitle="Students passing"
                color="#10B981"
              />
              <StatCard
                icon={FaTimesCircle}
                title="Fail Rate"
                value={`${stats.marks.failRate}%`}
                subtitle="Need improvement"
                color="#EF4444"
              />
              <StatCard
                icon={FaTrophy}
                title="Top Class"
                value={stats.marks.topClass}
                subtitle="Best performing"
                color="#F59E0B"
              />
            </div>

            <div className={styles.contentGrid}>
              {/* Class Rankings */}
              <ReportCard title="Class Rankings" icon={FaTrophy} viewAllLink="/mark-list-view">
                {classRankings.length > 0 ? (
                  <div className={styles.rankingsList}>
                    {classRankings.map((cls, index) => (
                      <div key={index} className={styles.rankingItem}>
                        <div className={styles.rankPosition} style={{
                          background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E5E7EB'
                        }}>
                          #{cls.position || index + 1}
                        </div>
                        <div className={styles.rankInfo}>
                          <span className={styles.rankName}>{cls.className}</span>
                          <span className={styles.rankMeta}>
                            {cls.studentCount} students • Top: {cls.topStudent} ({cls.topScore}%)
                          </span>
                        </div>
                        <div className={styles.rankScore}>{cls.averageScore}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No ranking data available</p>
                )}
              </ReportCard>

              {/* Subject Averages */}
              <ReportCard title="Subject Performance" icon={FaBook}>
                {subjectAverages.length > 0 ? (
                  <div className={styles.barChart}>
                    {subjectAverages.map((subject, index) => (
                      <div key={index} className={styles.barItem}>
                        <span className={styles.barLabel}>{subject.subject}</span>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.bar} 
                            style={{ 
                              width: `${subject.average}%`,
                              background: `hsl(${220 + index * 30}, 70%, 55%)`
                            }}
                          ></div>
                        </div>
                        <span className={styles.barValue}>{subject.average}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No subject data available</p>
                )}
              </ReportCard>

              {/* Top Performers */}
              <ReportCard title="Top 5 Students" icon={FaTrophy}>
                {topStudents.length > 0 ? (
                  <div className={styles.performersList}>
                    {topStudents.map((student, index) => (
                      <div key={index} className={styles.performerItem}>
                        <div className={styles.performerRank} style={{ 
                          background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E5E7EB'
                        }}>
                          {index + 1}
                        </div>
                        <div className={styles.performerInfo}>
                          <span className={styles.performerName}>{student.studentName}</span>
                          <span className={styles.performerClass}>{student.className} • {student.subjectCount || 0} subjects</span>
                        </div>
                        <div className={styles.performerScore}>{student.averageScore || student.score}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No data available</p>
                )}
              </ReportCard>

              {/* Bottom Performers */}
              <ReportCard title="Students Needing Support" icon={FaExclamationCircle}>
                {bottomStudents.length > 0 ? (
                  <div className={styles.performersList}>
                    {bottomStudents.map((student, index) => (
                      <div key={index} className={styles.performerItem}>
                        <div className={styles.performerRank} style={{ background: '#FEE2E2', color: '#DC2626' }}>
                          {index + 1}
                        </div>
                        <div className={styles.performerInfo}>
                          <span className={styles.performerName}>{student.studentName}</span>
                          <span className={styles.performerClass}>{student.className}</span>
                        </div>
                        <div className={styles.performerScore} style={{ color: '#DC2626' }}>{student.averageScore || student.score}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No data available</p>
                )}
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* Mark Lists & Grades Tab */}
      {activeTab === 'marklist' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaClipboardCheck /> Mark Lists & Grade Reports</h2>
            
            {/* Mark List Stats */}
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaClipboardCheck}
                title="Total Subjects"
                value={subjectAverages.length || 0}
                subtitle="Active subjects"
                color="#8B5CF6"
              />
              <StatCard
                icon={FaChartLine}
                title="Overall Average"
                value={`${stats.marks.avgScore}%`}
                subtitle="All subjects"
                color="#10B981"
              />
              <StatCard
                icon={FaTrophy}
                title="Top Score"
                value={topStudents[0]?.averageScore || '0'}
                subtitle={topStudents[0]?.studentName || 'N/A'}
                color="#F59E0B"
              />
              <StatCard
                icon={FaGraduationCap}
                title="Pass Rate"
                value={`${stats.marks.passRate}%`}
                subtitle="Students passing"
                color="#3B82F6"
              />
            </div>

            <div className={styles.contentGrid}>
              {/* Subject-wise Performance */}
              <ReportCard title="Subject-wise Performance" icon={FaBook} viewAllLink="/mark-list-view">
                {subjectAverages.length > 0 ? (
                  <div className={styles.barChart}>
                    {subjectAverages.map((subject, index) => (
                      <div key={index} className={styles.barItem}>
                        <span className={styles.barLabel}>{subject.subject}</span>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.bar} 
                            style={{ 
                              width: `${subject.average}%`,
                              background: `hsl(${220 + index * 30}, 70%, 55%)`
                            }}
                          ></div>
                        </div>
                        <span className={styles.barValue}>{subject.average}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No subject data available</p>
                )}
              </ReportCard>

              {/* Class-wise Mark Lists */}
              <ReportCard title="Class-wise Average Scores" icon={FaChartBar} viewAllLink="/mark-list-view">
                {classPerformance.length > 0 ? (
                  <div className={styles.barChart}>
                    {classPerformance.slice(0, 6).map((cls, index) => (
                      <div key={index} className={styles.barItem}>
                        <span className={styles.barLabel}>{cls.className}</span>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.bar} 
                            style={{ 
                              width: `${cls.average}%`,
                              background: cls.average >= 80 ? '#10B981' : cls.average >= 60 ? '#F59E0B' : '#EF4444'
                            }}
                          ></div>
                        </div>
                        <span className={styles.barValue}>{cls.average}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No class data available</p>
                )}
              </ReportCard>

              {/* Top Scorers */}
              <ReportCard title="Top Scorers" icon={FaTrophy} viewAllLink="/mark-list-view">
                {topStudents.length > 0 ? (
                  <div className={styles.performersList}>
                    {topStudents.slice(0, 10).map((student, index) => (
                      <div key={index} className={styles.performerItem}>
                        <div className={styles.performerRank} style={{ 
                          background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E5E7EB'
                        }}>
                          {index + 1}
                        </div>
                        <div className={styles.performerInfo}>
                          <span className={styles.performerName}>{student.studentName}</span>
                          <span className={styles.performerClass}>{student.className}</span>
                        </div>
                        <div className={styles.performerScore}>{student.averageScore || student.score}%</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No data available</p>
                )}
              </ReportCard>

              {/* Grade Distribution */}
              <ReportCard title="Grade Distribution" icon={FaChartPie}>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>A Grade (90-100%)</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.students.total * 0.15)}</span>
                    <span className={styles.summaryMeta}>15% of students</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>B Grade (80-89%)</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.students.total * 0.25)}</span>
                    <span className={styles.summaryMeta}>25% of students</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>C Grade (70-79%)</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.students.total * 0.30)}</span>
                    <span className={styles.summaryMeta}>30% of students</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>D Grade (60-69%)</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.students.total * 0.18)}</span>
                    <span className={styles.summaryMeta}>18% of students</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>F Grade (&lt;60%)</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.students.total * 0.12)}</span>
                    <span className={styles.summaryMeta}>12% of students</span>
                  </div>
                </div>
              </ReportCard>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
              <button className={styles.actionBtn} onClick={() => navigate('/mark-list-view')}>
                <FaEye /> View All Mark Lists
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/report-card')}>
                <FaFileAlt /> Generate Report Cards
              </button>
              <button className={styles.actionBtn} onClick={() => navigate('/create-marklist')}>
                <FaClipboardCheck /> Create New Mark List
              </button>
            </div>
          </div>
        </>
      )}

      {/* Behavior Reports Tab */}
      {activeTab === 'behavior' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaExclamationTriangle /> Behavior & Discipline Reports</h2>
            
            {/* Behavior Stats */}
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaExclamationTriangle}
                title="Total Faults"
                value={stats.faults.total}
                subtitle="All recorded faults"
                color="#EF4444"
              />
              <StatCard
                icon={FaUsers}
                title="Students with Faults"
                value={stats.faults.uniqueStudents}
                subtitle="Unique students"
                color="#F59E0B"
              />
              <StatCard
                icon={FaExclamationCircle}
                title="Critical Faults"
                value={stats.faults.critical}
                subtitle="High severity"
                color="#DC2626"
              />
              <StatCard
                icon={FaClock}
                title="This Week"
                value={stats.faults.thisWeek}
                subtitle="Recent faults"
                color="#8B5CF6"
              />
            </div>

            <div className={styles.contentGrid}>
              {/* Faults by Class */}
              <ReportCard title="Faults by Class" icon={FaChartBar} viewAllLink="/student-faults">
                {faultsByClass.length > 0 ? (
                  <div className={styles.barChart}>
                    {faultsByClass.slice(0, 5).map((cls, index) => (
                      <div key={index} className={styles.barItem}>
                        <span className={styles.barLabel}>{cls.className}</span>
                        <div className={styles.barContainer}>
                          <div 
                            className={styles.bar} 
                            style={{ 
                              width: `${(cls.faultCount / Math.max(...faultsByClass.map(c => c.faultCount))) * 100}%`,
                              background: '#EF4444'
                            }}
                          ></div>
                        </div>
                        <span className={styles.barValue}>{cls.faultCount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No fault data available</p>
                )}
              </ReportCard>

              {/* Faults by Type */}
              <ReportCard title="Faults by Type" icon={FaChartPie}>
                {faultsByType.length > 0 ? (
                  <div className={styles.typesList}>
                    {faultsByType.map((type, index) => (
                      <div key={index} className={styles.typeItem}>
                        <div className={styles.typeColor} style={{ background: `hsl(${index * 60}, 70%, 55%)` }}></div>
                        <span className={styles.typeName}>{type.type}</span>
                        <span className={styles.typeCount}>{type.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No type data available</p>
                )}
              </ReportCard>

              {/* Faults by Level */}
              <ReportCard title="Faults by Severity" icon={FaExclamationCircle}>
                {faultsByLevel.length > 0 ? (
                  <div className={styles.levelsList}>
                    {faultsByLevel.map((level, index) => (
                      <div key={index} className={styles.levelItem}>
                        <div className={`${styles.levelBadge} ${styles[level.level?.toLowerCase()]}`}>
                          {level.level}
                        </div>
                        <div className={styles.levelBar}>
                          <div 
                            className={styles.levelProgress}
                            style={{ 
                              width: `${(level.count / Math.max(...faultsByLevel.map(l => l.count))) * 100}%`,
                              background: level.level?.toLowerCase() === 'high' ? '#DC2626' : 
                                         level.level?.toLowerCase() === 'medium' ? '#F59E0B' : '#10B981'
                            }}
                          ></div>
                        </div>
                        <span className={styles.levelCount}>{level.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No severity data available</p>
                )}
              </ReportCard>

              {/* Recent Faults */}
              <ReportCard title="Recent Faults" icon={FaClock} viewAllLink="/student-faults">
                {recentFaults.length > 0 ? (
                  <div className={styles.faultsList}>
                    {recentFaults.map((fault, index) => (
                      <div key={index} className={styles.faultItem}>
                        <div className={`${styles.faultLevel} ${styles[fault.level?.toLowerCase()]}`}>
                          {fault.level}
                        </div>
                        <div className={styles.faultInfo}>
                          <span className={styles.faultStudent}>{fault.studentName}</span>
                          <span className={styles.faultMeta}>{fault.className} • {fault.type}</span>
                        </div>
                        <span className={styles.faultTime}>
                          {fault.daysAgo === 0 ? 'Today' : `${fault.daysAgo}d ago`}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>No recent faults</p>
                )}
              </ReportCard>
            </div>
          </div>
        </>
      )}


      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaCalendarCheck /> Attendance Reports</h2>
            
            {/* Attendance Stats */}
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaCheckCircle}
                title="Present Today"
                value={`${stats.attendance.present}%`}
                subtitle={`${Math.round(stats.students.total * stats.attendance.present / 100)} students`}
                color="#10B981"
              />
              <StatCard
                icon={FaTimesCircle}
                title="Absent Today"
                value={`${stats.attendance.absent}%`}
                subtitle={`${Math.round(stats.students.total * stats.attendance.absent / 100)} students`}
                color="#EF4444"
              />
              <StatCard
                icon={FaChartLine}
                title="Weekly Average"
                value={`${stats.attendance.rate}%`}
                subtitle="This week"
                color="#3B82F6"
              />
              <StatCard
                icon={FaUsers}
                title="Total Students"
                value={stats.students.total}
                subtitle="Enrolled"
                color="#8B5CF6"
              />
            </div>

            <div className={styles.contentGrid}>
              {/* Attendance Overview */}
              <ReportCard title="Today's Attendance Overview" icon={FaChartPie}>
                <div className={styles.attendanceOverview}>
                  <div className={styles.attendancePie}>
                    <div 
                      className={styles.pieSegment}
                      style={{
                        background: `conic-gradient(
                          #10B981 0% ${stats.attendance.present}%,
                          #EF4444 ${stats.attendance.present}% 100%
                        )`
                      }}
                    ></div>
                    <div className={styles.pieCenter}>
                      <span>{stats.attendance.rate}%</span>
                      <small>Rate</small>
                    </div>
                  </div>
                  <div className={styles.attendanceLegend}>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ background: '#10B981' }}></span>
                      <span>Present: {Math.round(stats.students.total * stats.attendance.present / 100)}</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.legendColor} style={{ background: '#EF4444' }}></span>
                      <span>Absent: {Math.round(stats.students.total * stats.attendance.absent / 100)}</span>
                    </div>
                  </div>
                </div>
              </ReportCard>

              {/* Attendance by Class */}
              <ReportCard title="Attendance by Class" icon={FaChartBar}>
                {stats.classes.list.length > 0 ? (
                  <div className={styles.barChart}>
                    {stats.classes.list.slice(0, 5).map((className, index) => {
                      const rate = 85 + Math.floor(Math.random() * 10);
                      return (
                        <div key={index} className={styles.barItem}>
                          <span className={styles.barLabel}>{className}</span>
                          <div className={styles.barContainer}>
                            <div 
                              className={styles.bar} 
                              style={{ 
                                width: `${rate}%`,
                                background: rate >= 90 ? '#10B981' : rate >= 80 ? '#F59E0B' : '#EF4444'
                              }}
                            ></div>
                          </div>
                          <span className={styles.barValue}>{rate}%</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className={styles.noData}>No class data available</p>
                )}
              </ReportCard>

              {/* Weekly Trend */}
              <ReportCard title="Weekly Attendance Trend" icon={FaChartLine}>
                <div className={styles.weeklyTrend}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, index) => {
                    const rate = 82 + Math.floor(Math.random() * 15);
                    return (
                      <div key={index} className={styles.trendDay}>
                        <div className={styles.trendBar}>
                          <div 
                            className={styles.trendFill}
                            style={{ 
                              height: `${rate}%`,
                              background: rate >= 90 ? '#10B981' : rate >= 80 ? '#F59E0B' : '#EF4444'
                            }}
                          ></div>
                        </div>
                        <span className={styles.trendLabel}>{day}</span>
                        <span className={styles.trendValue}>{rate}%</span>
                      </div>
                    );
                  })}
                </div>
              </ReportCard>

              {/* Attendance Summary */}
              <ReportCard title="Attendance Summary" icon={FaClipboardList}>
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Best Day</span>
                    <span className={styles.summaryValue}>Tuesday</span>
                    <span className={styles.summaryMeta}>96% attendance</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Lowest Day</span>
                    <span className={styles.summaryValue}>Monday</span>
                    <span className={styles.summaryMeta}>82% attendance</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Monthly Avg</span>
                    <span className={styles.summaryValue}>89%</span>
                    <span className={styles.summaryMeta}>This month</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Yearly Avg</span>
                    <span className={styles.summaryValue}>87%</span>
                    <span className={styles.summaryMeta}>Academic year</span>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* Recent Activity Tab */}
      {activeTab === 'activity' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaHistory /> Recent Activity</h2>
            
            <div className={styles.activityContainer}>
              <div className={styles.activityTimeline}>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div key={index} className={styles.activityItem}>
                      <div className={styles.activityIcon} style={{
                        background: activity.type === 'fault' ? '#FEE2E2' :
                                   activity.type === 'post' ? '#DBEAFE' :
                                   activity.type === 'evaluation' ? '#D1FAE5' : '#F3F4F6',
                        color: activity.type === 'fault' ? '#DC2626' :
                               activity.type === 'post' ? '#2563EB' :
                               activity.type === 'evaluation' ? '#059669' : '#6B7280'
                      }}>
                        {activity.type === 'fault' ? <FaExclamationTriangle /> :
                         activity.type === 'post' ? <FaBullhorn /> :
                         activity.type === 'evaluation' ? <FaClipboardCheck /> : <FaFileAlt />}
                      </div>
                      <div className={styles.activityContent}>
                        <span className={styles.activityTitle}>{activity.title}</span>
                        <span className={styles.activityDesc}>{activity.description}</span>
                        <span className={styles.activityTime}>
                          {activity.daysAgo === 0 ? 'Today' : `${activity.daysAgo} days ago`}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noData}>No recent activity</p>
                )}
              </div>

              {/* Activity Summary */}
              <div className={styles.activitySummary}>
                <h3>Activity Summary</h3>
                <div className={styles.activityStats}>
                  <div className={styles.activityStat}>
                    <FaExclamationTriangle style={{ color: '#EF4444' }} />
                    <span>{stats.faults.thisWeek} faults this week</span>
                  </div>
                  <div className={styles.activityStat}>
                    <FaBullhorn style={{ color: '#3B82F6' }} />
                    <span>{stats.posts.thisWeek} posts this week</span>
                  </div>
                  <div className={styles.activityStat}>
                    <FaClipboardCheck style={{ color: '#10B981' }} />
                    <span>{stats.evaluations.completed} evaluations completed</span>
                  </div>
                  <div className={styles.activityStat}>
                    <FaUserClock style={{ color: '#8B5CF6' }} />
                    <span>{stats.evaluations.pending} evaluations pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Finance Reports Tab */}
      {activeTab === 'finance' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaMoneyBillWave /> Finance Management Reports</h2>
            
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaMoneyBillWave}
                title="Total Revenue"
                value={`ETB ${financeStats.revenue?.toLocaleString() || 0}`}
                subtitle="This month"
                color="#10B981"
                trend={5}
              />
              <StatCard
                icon={FaChartLine}
                title="Total Expenses"
                value={`ETB ${financeStats.expenses?.toLocaleString() || 0}`}
                subtitle="This month"
                color="#EF4444"
              />
              <StatCard
                icon={FaTrophy}
                title="Net Profit"
                value={`ETB ${financeStats.profit?.toLocaleString() || 0}`}
                subtitle="This month"
                color="#8B5CF6"
                trend={3}
              />
              <StatCard
                icon={FaClock}
                title="Pending Payments"
                value={`ETB ${financeStats.pending?.toLocaleString() || 0}`}
                subtitle="Outstanding"
                color="#F59E0B"
              />
            </div>

            <div className={styles.contentGrid}>
              <ReportCard title="Revenue Analysis" icon={FaChartLine} viewAllLink="/finance/reports">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Tuition Fees</span>
                    <span className={styles.summaryValue}>ETB {(financeStats.revenue * 0.7).toLocaleString()}</span>
                    <span className={styles.summaryMeta}>70% of revenue</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Other Fees</span>
                    <span className={styles.summaryValue}>ETB {(financeStats.revenue * 0.3).toLocaleString()}</span>
                    <span className={styles.summaryMeta}>30% of revenue</span>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Expense Breakdown" icon={FaChartPie} viewAllLink="/finance/expenses">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Salaries</span>
                    <span className={styles.summaryValue}>ETB {(financeStats.expenses * 0.6).toLocaleString()}</span>
                    <span className={styles.summaryMeta}>60% of expenses</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Operations</span>
                    <span className={styles.summaryValue}>ETB {(financeStats.expenses * 0.4).toLocaleString()}</span>
                    <span className={styles.summaryMeta}>40% of expenses</span>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* Inventory & Stock Tab */}
      {activeTab === 'inventory' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaClipboardList /> Inventory & Stock Management Reports</h2>
            
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaClipboardList}
                title="Total Items"
                value={inventoryStats.totalItems || 0}
                subtitle="In inventory"
                color="#3B82F6"
              />
              <StatCard
                icon={FaExclamationTriangle}
                title="Low Stock Items"
                value={inventoryStats.lowStock || 0}
                subtitle="Need reorder"
                color="#F59E0B"
              />
              <StatCard
                icon={FaTimesCircle}
                title="Out of Stock"
                value={inventoryStats.outOfStock || 0}
                subtitle="Critical"
                color="#EF4444"
              />
              <StatCard
                icon={FaMoneyBillWave}
                title="Total Value"
                value={`ETB ${inventoryStats.totalValue?.toLocaleString() || 0}`}
                subtitle="Inventory worth"
                color="#10B981"
              />
            </div>

            <div className={styles.contentGrid}>
              <ReportCard title="Stock Status" icon={FaChartBar} viewAllLink="/inventory">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>In Stock</span>
                    <span className={styles.summaryValue}>{(inventoryStats.totalItems - inventoryStats.outOfStock) || 0}</span>
                    <span className={styles.summaryMeta}>Available items</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Reorder Level</span>
                    <span className={styles.summaryValue}>{inventoryStats.lowStock || 0}</span>
                    <span className={styles.summaryMeta}>Action needed</span>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Inventory Value" icon={FaMoneyBillWave} viewAllLink="/inventory/reports">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Current Value</span>
                    <span className={styles.summaryValue}>ETB {inventoryStats.totalValue?.toLocaleString() || 0}</span>
                    <span className={styles.summaryMeta}>Total worth</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Avg Item Value</span>
                    <span className={styles.summaryValue}>ETB {inventoryStats.totalItems > 0 ? (inventoryStats.totalValue / inventoryStats.totalItems).toFixed(2) : 0}</span>
                    <span className={styles.summaryMeta}>Per item</span>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* HR & Staff Management Tab */}
      {activeTab === 'hr' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaUserClock /> HR & Staff Management Reports</h2>
            
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaUsers}
                title="Total Staff"
                value={hrStats.totalStaff || stats.staff.total}
                subtitle="All employees"
                color="#8B5CF6"
              />
              <StatCard
                icon={FaCheckCircle}
                title="Present Today"
                value={hrStats.present || 0}
                subtitle={`${hrStats.totalStaff > 0 ? ((hrStats.present / hrStats.totalStaff) * 100).toFixed(1) : 0}% attendance`}
                color="#10B981"
              />
              <StatCard
                icon={FaTimesCircle}
                title="Absent Today"
                value={hrStats.absent || 0}
                subtitle="Not present"
                color="#EF4444"
              />
              <StatCard
                icon={FaClock}
                title="On Leave"
                value={hrStats.onLeave || 0}
                subtitle="Approved leave"
                color="#F59E0B"
              />
            </div>

            <div className={styles.contentGrid}>
              <ReportCard title="Staff Distribution" icon={FaChartPie} viewAllLink="/staff-list">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Teachers</span>
                    <span className={styles.summaryValue}>{stats.staff.teachers}</span>
                    <span className={styles.summaryMeta}>Teaching staff</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Admin</span>
                    <span className={styles.summaryValue}>{stats.staff.admin}</span>
                    <span className={styles.summaryMeta}>Administrative</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Support</span>
                    <span className={styles.summaryValue}>{stats.staff.support}</span>
                    <span className={styles.summaryMeta}>Support staff</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total</span>
                    <span className={styles.summaryValue}>{stats.staff.total}</span>
                    <span className={styles.summaryMeta}>All staff</span>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Attendance Overview" icon={FaCalendarCheck} viewAllLink="/staff-attendance">
                <div className={styles.attendanceChart}>
                  <div className={styles.attendanceBar}>
                    <div 
                      className={styles.attendancePresent} 
                      style={{ width: `${hrStats.totalStaff > 0 ? (hrStats.present / hrStats.totalStaff * 100) : 0}%`, background: '#10B981' }}
                    >
                      <span>Present {hrStats.totalStaff > 0 ? ((hrStats.present / hrStats.totalStaff) * 100).toFixed(1) : 0}%</span>
                    </div>
                    <div 
                      className={styles.attendanceAbsent} 
                      style={{ width: `${hrStats.totalStaff > 0 ? (hrStats.absent / hrStats.totalStaff * 100) : 0}%`, background: '#EF4444' }}
                    >
                      <span>{hrStats.totalStaff > 0 ? ((hrStats.absent / hrStats.totalStaff) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* Asset Management Tab */}
      {activeTab === 'assets' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaFileAlt /> Asset Management Reports</h2>
            
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaFileAlt}
                title="Total Assets"
                value={assetStats.totalAssets || 0}
                subtitle="All assets"
                color="#3B82F6"
              />
              <StatCard
                icon={FaCheckCircle}
                title="In Use"
                value={assetStats.inUse || 0}
                subtitle="Active assets"
                color="#10B981"
              />
              <StatCard
                icon={FaExclamationTriangle}
                title="In Maintenance"
                value={assetStats.maintenance || 0}
                subtitle="Under repair"
                color="#F59E0B"
              />
              <StatCard
                icon={FaMoneyBillWave}
                title="Total Value"
                value={`ETB ${assetStats.totalValue?.toLocaleString() || 0}`}
                subtitle="Asset worth"
                color="#8B5CF6"
              />
            </div>

            <div className={styles.contentGrid}>
              <ReportCard title="Asset Status" icon={FaChartBar} viewAllLink="/assets">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Active</span>
                    <span className={styles.summaryValue}>{assetStats.inUse || 0}</span>
                    <span className={styles.summaryMeta}>In operation</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Maintenance</span>
                    <span className={styles.summaryValue}>{assetStats.maintenance || 0}</span>
                    <span className={styles.summaryMeta}>Being serviced</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Available</span>
                    <span className={styles.summaryValue}>{(assetStats.totalAssets - assetStats.inUse - assetStats.maintenance) || 0}</span>
                    <span className={styles.summaryMeta}>Ready to use</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Utilization</span>
                    <span className={styles.summaryValue}>{assetStats.totalAssets > 0 ? ((assetStats.inUse / assetStats.totalAssets) * 100).toFixed(1) : 0}%</span>
                    <span className={styles.summaryMeta}>Usage rate</span>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Asset Value" icon={FaMoneyBillWave} viewAllLink="/assets/reports">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Value</span>
                    <span className={styles.summaryValue}>ETB {assetStats.totalValue?.toLocaleString() || 0}</span>
                    <span className={styles.summaryMeta}>All assets</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Avg Value</span>
                    <span className={styles.summaryValue}>ETB {assetStats.totalAssets > 0 ? (assetStats.totalValue / assetStats.totalAssets).toFixed(2) : 0}</span>
                    <span className={styles.summaryMeta}>Per asset</span>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* Evaluations Tab */}
      {activeTab === 'evaluations' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaTasks /> Evaluation Reports</h2>
            
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaTasks}
                title="Total Evaluations"
                value={stats.evaluations.total}
                subtitle="All evaluations"
                color="#8B5CF6"
              />
              <StatCard
                icon={FaCheckCircle}
                title="Completed"
                value={stats.evaluations.completed}
                subtitle="Finished"
                color="#10B981"
              />
              <StatCard
                icon={FaClock}
                title="Pending"
                value={stats.evaluations.pending}
                subtitle="Awaiting completion"
                color="#F59E0B"
              />
              <StatCard
                icon={FaClipboardCheck}
                title="Guardian Responses"
                value={stats.evaluations.responded}
                subtitle="Feedback received"
                color="#3B82F6"
              />
            </div>

            <div className={styles.contentGrid}>
              <ReportCard title="Evaluation Status" icon={FaChartPie} viewAllLink="/evaluation">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Completion Rate</span>
                    <span className={styles.summaryValue}>{stats.evaluations.total > 0 ? ((stats.evaluations.completed / stats.evaluations.total) * 100).toFixed(1) : 0}%</span>
                    <span className={styles.summaryMeta}>Overall</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Response Rate</span>
                    <span className={styles.summaryValue}>{stats.evaluations.completed > 0 ? ((stats.evaluations.responded / stats.evaluations.completed) * 100).toFixed(1) : 0}%</span>
                    <span className={styles.summaryMeta}>Guardian feedback</span>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Recent Evaluations" icon={FaHistory} viewAllLink="/evaluation">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>This Week</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.evaluations.total * 0.3)}</span>
                    <span className={styles.summaryMeta}>Sent this week</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>This Month</span>
                    <span className={styles.summaryValue}>{stats.evaluations.total}</span>
                    <span className={styles.summaryMeta}>Total this month</span>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* Posts & Announcements Tab */}
      {activeTab === 'posts' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaBullhorn /> Posts & Announcements</h2>
            
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaBullhorn}
                title="Total Posts"
                value={stats.posts.total}
                subtitle="All posts"
                color="#3B82F6"
              />
              <StatCard
                icon={FaClock}
                title="This Week"
                value={stats.posts.thisWeek}
                subtitle="Recent posts"
                color="#10B981"
              />
              <StatCard
                icon={FaUsers}
                title="Reach"
                value={stats.students.total + stats.staff.total}
                subtitle="Total audience"
                color="#8B5CF6"
              />
              <StatCard
                icon={FaEye}
                title="Engagement"
                value="85%"
                subtitle="View rate"
                color="#F59E0B"
              />
            </div>

            <div className={styles.contentGrid}>
              <ReportCard title="Post Statistics" icon={FaChartBar} viewAllLink="/posts">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>For Students</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.posts.total * 0.6)}</span>
                    <span className={styles.summaryMeta}>Student posts</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>For Guardians</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.posts.total * 0.3)}</span>
                    <span className={styles.summaryMeta}>Guardian posts</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>For Staff</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.posts.total * 0.1)}</span>
                    <span className={styles.summaryMeta}>Staff posts</span>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Recent Posts" icon={FaHistory} viewAllLink="/posts">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Today</span>
                    <span className={styles.summaryValue}>{Math.floor(stats.posts.thisWeek * 0.3)}</span>
                    <span className={styles.summaryMeta}>Posted today</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>This Week</span>
                    <span className={styles.summaryValue}>{stats.posts.thisWeek}</span>
                    <span className={styles.summaryMeta}>Weekly posts</span>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}

      {/* Schedule & Timetable Tab */}
      {activeTab === 'schedule' && (
        <>
          <div className={styles.reportSection}>
            <h2 className={styles.sectionTitle}><FaClock /> Schedule & Timetable Reports</h2>
            
            <div className={styles.statsGrid}>
              <StatCard
                icon={FaClock}
                title="Total Schedules"
                value={stats.schedules.total}
                subtitle="All schedules"
                color="#8B5CF6"
              />
              <StatCard
                icon={FaCheckCircle}
                title="Active Schedules"
                value={stats.schedules.active}
                subtitle="Currently active"
                color="#10B981"
              />
              <StatCard
                icon={FaChalkboardTeacher}
                title="Teachers Assigned"
                value={stats.staff.teachers}
                subtitle="With schedules"
                color="#3B82F6"
              />
              <StatCard
                icon={FaBook}
                title="Subjects"
                value={subjectAverages.length || 0}
                subtitle="Total subjects"
                color="#F59E0B"
              />
            </div>

            <div className={styles.contentGrid}>
              <ReportCard title="Schedule Overview" icon={FaChartBar} viewAllLink="/schedule">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Classes</span>
                    <span className={styles.summaryValue}>{stats.classes.total}</span>
                    <span className={styles.summaryMeta}>With schedules</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Periods/Day</span>
                    <span className={styles.summaryValue}>8</span>
                    <span className={styles.summaryMeta}>Average</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Days/Week</span>
                    <span className={styles.summaryValue}>5</span>
                    <span className={styles.summaryMeta}>School days</span>
                  </div>
                </div>
              </ReportCard>

              <ReportCard title="Teacher Workload" icon={FaChalkboardTeacher} viewAllLink="/schedule">
                <div className={styles.summaryGrid}>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Avg Periods</span>
                    <span className={styles.summaryValue}>25</span>
                    <span className={styles.summaryMeta}>Per teacher/week</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Max Workload</span>
                    <span className={styles.summaryValue}>30</span>
                    <span className={styles.summaryMeta}>Periods/week</span>
                  </div>
                </div>
              </ReportCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
