import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheck, FiX, FiClock, FiUser } from 'react-icons/fi';
import styles from './GuardianAttendance.module.css';

const GuardianAttendance = () => {
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Sample data - replace with actual API call
  const wards = [
    { id: 1, name: 'Ibrahim Ahmed', class: 'Grade 10-A' },
    { id: 2, name: 'Fatima Ahmed', class: 'Grade 8-B' }
  ];

  const attendanceData = [
    { date: '2026-02-15', status: 'present', ward: 'Ibrahim Ahmed' },
    { date: '2026-02-14', status: 'present', ward: 'Ibrahim Ahmed' },
    { date: '2026-02-13', status: 'absent', ward: 'Ibrahim Ahmed' },
    { date: '2026-02-15', status: 'present', ward: 'Fatima Ahmed' },
    { date: '2026-02-14', status: 'late', ward: 'Fatima Ahmed' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FiCheck className={styles.iconPresent} />;
      case 'absent':
        return <FiX className={styles.iconAbsent} />;
      case 'late':
        return <FiClock className={styles.iconLate} />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    return styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`];
  };

  const calculateStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(a => a.status === 'present').length;
    const absent = attendanceData.filter(a => a.status === 'absent').length;
    const late = attendanceData.filter(a => a.status === 'late').length;
    
    return {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <h1>Attendance</h1>
          <p>Track your wards' attendance records</p>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Wards</option>
            {wards.map(ward => (
              <option key={ward.id} value={ward.name}>{ward.name}</option>
            ))}
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className={styles.select}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(2026, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(40, 167, 69, 0.1)' }}>
              <FiCheck style={{ color: '#28a745' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.present}</div>
              <div className={styles.statLabel}>Present</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <FiX style={{ color: '#ef4444' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.absent}</div>
              <div className={styles.statLabel}>Absent</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(255, 193, 7, 0.1)' }}>
              <FiClock style={{ color: '#ffc107' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.late}</div>
              <div className={styles.statLabel}>Late</div>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(0, 123, 255, 0.1)' }}>
              <FiCalendar style={{ color: '#007bff' }} />
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statValue}>{stats.percentage}%</div>
              <div className={styles.statLabel}>Attendance Rate</div>
            </div>
          </div>
        </div>

        {/* Attendance List */}
        <div className={styles.attendanceList}>
          <h2>Recent Attendance</h2>
          {attendanceData.length === 0 ? (
            <div className={styles.empty}>
              <FiCalendar size={48} />
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className={styles.records}>
              {attendanceData.map((record, index) => (
                <motion.div
                  key={index}
                  className={styles.recordCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className={styles.recordDate}>
                    <FiCalendar />
                    <span>{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.recordWard}>
                    <FiUser />
                    <span>{record.ward}</span>
                  </div>
                  <div className={`${styles.recordStatus} ${getStatusClass(record.status)}`}>
                    {getStatusIcon(record.status)}
                    <span>{record.status}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default GuardianAttendance;
