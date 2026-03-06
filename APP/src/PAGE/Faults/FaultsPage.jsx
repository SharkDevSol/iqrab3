import { useState, useEffect } from 'react';
import { FiAlertCircle, FiUser, FiCalendar, FiFilter, FiDownload, FiSearch, FiBarChart2, FiTrendingUp, FiUsers, FiFileText } from 'react-icons/fi';
import axios from 'axios';
import styles from './FaultsPage.module.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FaultsPage = () => {
  const [faults, setFaults] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [stats, setStats] = useState({
    totalFaults: 0,
    uniqueStudents: 0,
    mostCommonType: '',
    recentFaults: 0
  });

  const getAuthConfig = () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    fetchClasses();
    fetchAllFaults();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [faults]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faults/classes`, getAuthConfig());
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchAllFaults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/faults/classes`, getAuthConfig());
      const allClasses = response.data;
      const allFaults = [];

      for (const className of allClasses) {
        try {
          const faultsResponse = await axios.get(
            `${API_BASE_URL}/faults/faults/${className}`,
            getAuthConfig()
          );
          const classFaults = faultsResponse.data.map(fault => ({
            ...fault,
            className
          }));
          allFaults.push(...classFaults);
        } catch (error) {
          console.error(`Error fetching faults for ${className}:`, error);
        }
      }

      setFaults(allFaults);
    } catch (error) {
      console.error('Error fetching all faults:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const uniqueStudents = new Set(faults.map(f => `${f.student_name}-${f.className}`)).size;

    const typeCounts = {};
    faults.forEach(fault => {
      const type = fault.type || fault.fault_type;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const mostCommonType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b, ''
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentFaults = faults.filter(f => new Date(f.date) >= sevenDaysAgo).length;

    setStats({
      totalFaults: faults.length,
      uniqueStudents,
      mostCommonType,
      recentFaults
    });
  };

  const filterFaults = () => {
    return faults.filter(fault => {
      const matchesClass = selectedClass === 'all' || fault.className === selectedClass;
      const matchesType = selectedType === 'all' || (fault.type || fault.fault_type) === selectedType;
      const matchesSearch = searchTerm === '' || 
        fault.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fault.description.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDate = true;
      if (dateFilter !== 'all') {
        const faultDate = new Date(fault.date);
        const today = new Date();
        
        if (dateFilter === 'today') {
          matchesDate = faultDate.toDateString() === today.toDateString();
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          matchesDate = faultDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
          matchesDate = faultDate >= monthAgo;
        }
      }

      return matchesClass && matchesType && matchesSearch && matchesDate;
    });
  };

  const groupFaultsByStudent = (faultsList) => {
    const grouped = {};
    faultsList.forEach(fault => {
      const key = `${fault.student_name}-${fault.className}`;
      if (!grouped[key]) {
        grouped[key] = {
          student_name: fault.student_name,
          className: fault.className,
          faults: []
        };
      }
      grouped[key].faults.push(fault);
    });

    Object.values(grouped).forEach(group => {
      group.faults.sort((a, b) => new Date(a.date) - new Date(b.date));
    });

    return Object.values(grouped);
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
  };

  const exportToCSV = () => {
    const filtered = filterFaults();
    const headers = ['Date', 'Class', 'Student', 'Fault Type', 'Level', 'Description', 'Reported By'];
    const rows = filtered.map(f => [
      new Date(f.date).toLocaleDateString(),
      f.className,
      f.student_name,
      f.type || f.fault_type,
      f.level || 'N/A',
      f.description,
      f.reported_by
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faults-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const uniqueTypes = [...new Set(faults.map(f => f.type || f.fault_type))].filter(Boolean);
  const filteredFaults = filterFaults();
  const groupedFaults = groupFaultsByStudent(filteredFaults);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <FiAlertCircle /> Student Faults Management
          </h1>
          <p className={styles.subtitle}>Monitor and manage student discipline records</p>
        </div>
        <button className={styles.exportButton} onClick={exportToCSV}>
          <FiDownload /> Export Report
        </button>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <FiFileText />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Total Faults</p>
            <p className={styles.statValue}>{stats.totalFaults}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <FiUsers />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Students with Faults</p>
            <p className={styles.statValue}>{stats.uniqueStudents}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <FiTrendingUp />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Last 7 Days</p>
            <p className={styles.statValue}>{stats.recentFaults}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <FiBarChart2 />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Most Common</p>
            <p className={styles.statValue} style={{ fontSize: '0.875rem' }}>
              {stats.mostCommonType || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label><FiFilter /> Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label><FiAlertCircle /> Fault Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label><FiCalendar /> Date Range</label>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label><FiSearch /> Search</label>
            <input
              type="text"
              placeholder="Student name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Faults List */}
      <div className={styles.faultsCard}>
        <div className={styles.faultsHeader}>
          <h2>Fault Records ({filteredFaults.length} faults from {groupedFaults.length} students)</h2>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading faults...</p>
          </div>
        ) : groupedFaults.length === 0 ? (
          <div className={styles.emptyState}>
            <FiAlertCircle size={48} />
            <p>No faults found matching your filters</p>
          </div>
        ) : (
          <div className={styles.faultsList}>
            {groupedFaults.map((group, groupIndex) => (
              <div key={groupIndex} className={styles.studentFaultGroup}>
                {/* Student Header */}
                <div className={styles.studentGroupHeader}>
                  <div className={styles.studentInfo}>
                    <FiUser size={24} />
                    <div>
                      <h3 className={styles.studentName}>{group.student_name}</h3>
                      <span className={styles.className}>{group.className}</span>
                    </div>
                  </div>
                  <div className={styles.totalOffenses}>
                    <span className={styles.offenseCount}>{group.faults.length}</span>
                    <span className={styles.offenseLabel}>Total Offenses</span>
                  </div>
                </div>

                {/* All Faults for this Student */}
                <div className={styles.studentFaultsList}>
                  {group.faults.map((fault, faultIndex) => {
                    const offenseNumber = faultIndex + 1;
                    const offenseLabel = getOrdinalSuffix(offenseNumber);

                    return (
                      <div key={fault.id || faultIndex} className={styles.faultItem}>
                        <div className={styles.faultItemHeader}>
                          <span className={styles.offenseNumber}>{offenseLabel} Offense</span>
                          <span className={styles.faultDate}>
                            <FiCalendar />
                            {new Date(fault.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className={styles.faultType}>
                          <FiAlertCircle />
                          <span>{fault.type || fault.fault_type}</span>
                          {fault.level && (
                            <span className={`${styles.levelBadge} ${styles[`level${fault.level}`]}`}>
                              {fault.level}
                            </span>
                          )}
                        </div>

                        <p className={styles.faultDescription}>{fault.description}</p>

                        {fault.reported_by && (
                          <div className={styles.faultItemFooter}>
                            <span className={styles.reportedBy}>Reported by: {fault.reported_by}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaultsPage;
