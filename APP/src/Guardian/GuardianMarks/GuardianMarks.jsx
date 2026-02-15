import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiTrendingUp, FiAward, FiUser } from 'react-icons/fi';
import styles from './GuardianMarks.module.css';

const GuardianMarks = () => {
  const [selectedWard, setSelectedWard] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState('1');

  // Sample data - replace with actual API call
  const wards = [
    { id: 1, name: 'Ibrahim Ahmed', class: 'Grade 10-A' },
    { id: 2, name: 'Fatima Ahmed', class: 'Grade 8-B' }
  ];

  const marksData = [
    { ward: 'Ibrahim Ahmed', subject: 'Mathematics', score: 85, grade: 'A', term: '1' },
    { ward: 'Ibrahim Ahmed', subject: 'English', score: 78, grade: 'B+', term: '1' },
    { ward: 'Ibrahim Ahmed', subject: 'Physics', score: 92, grade: 'A+', term: '1' },
    { ward: 'Ibrahim Ahmed', subject: 'Chemistry', score: 88, grade: 'A', term: '1' },
    { ward: 'Fatima Ahmed', subject: 'Mathematics', score: 90, grade: 'A+', term: '1' },
    { ward: 'Fatima Ahmed', subject: 'English', score: 85, grade: 'A', term: '1' },
  ];

  const calculateAverage = (wardName) => {
    const wardMarks = marksData.filter(m => m.ward === wardName && m.term === selectedTerm);
    if (wardMarks.length === 0) return 0;
    const sum = wardMarks.reduce((acc, m) => acc + m.score, 0);
    return (sum / wardMarks.length).toFixed(1);
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return '#28a745';
    if (grade.startsWith('B')) return '#007bff';
    if (grade.startsWith('C')) return '#ffc107';
    return '#ef4444';
  };

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.header}>
          <h1>Academic Performance</h1>
          <p>View your wards' marks and grades</p>
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
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className={styles.select}
          >
            <option value="1">Term 1</option>
            <option value="2">Term 2</option>
            <option value="3">Term 3</option>
          </select>
        </div>

        {/* Ward Performance Cards */}
        <div className={styles.performanceGrid}>
          {wards.map((ward, index) => (
            <motion.div
              key={ward.id}
              className={styles.performanceCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  <FiUser size={24} />
                </div>
                <div>
                  <h3>{ward.name}</h3>
                  <p>{ward.class}</p>
                </div>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <FiTrendingUp className={styles.statIcon} />
                  <div>
                    <div className={styles.statValue}>{calculateAverage(ward.name)}%</div>
                    <div className={styles.statLabel}>Average</div>
                  </div>
                </div>
                <div className={styles.stat}>
                  <FiAward className={styles.statIcon} />
                  <div>
                    <div className={styles.statValue}>
                      {marksData.filter(m => m.ward === ward.name && m.term === selectedTerm).length}
                    </div>
                    <div className={styles.statLabel}>Subjects</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marks Table */}
        <div className={styles.marksSection}>
          <h2>Subject Marks</h2>
          {marksData.filter(m => 
            (selectedWard === 'all' || m.ward === selectedWard) && 
            m.term === selectedTerm
          ).length === 0 ? (
            <div className={styles.empty}>
              <FiBook size={48} />
              <p>No marks available for this selection</p>
            </div>
          ) : (
            <div className={styles.marksGrid}>
              {marksData
                .filter(m => 
                  (selectedWard === 'all' || m.ward === selectedWard) && 
                  m.term === selectedTerm
                )
                .map((mark, index) => (
                  <motion.div
                    key={index}
                    className={styles.markCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className={styles.markSubject}>
                      <FiBook className={styles.subjectIcon} />
                      <div>
                        <h4>{mark.subject}</h4>
                        <p>{mark.ward}</p>
                      </div>
                    </div>
                    <div className={styles.markScore}>
                      <div className={styles.score}>{mark.score}%</div>
                      <div 
                        className={styles.grade}
                        style={{ color: getGradeColor(mark.grade) }}
                      >
                        {mark.grade}
                      </div>
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

export default GuardianMarks;
