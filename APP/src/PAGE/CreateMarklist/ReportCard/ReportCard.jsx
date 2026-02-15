// ReportCard.jsx - Iqra Academy Report Card Design
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from './ReportCard.module.css';
import { 
  FaPrint, FaUserGraduate, FaSchool, 
  FaSpinner, FaAward,
  FaDownload, FaUsers
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useApp } from '../../../context/AppContext';
import { getFileUrl } from '../../List/utils/fileUtils';

const API_BASE_URL = 'http://localhost:5000/api';

const ReportCard = () => {
  const { theme } = useApp();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printAllStudents, setPrintAllStudents] = useState(false);
  const [allStudentsData, setAllStudentsData] = useState([]);

  const [schoolInfo, setSchoolInfo] = useState({
    name: 'IQRA ACADEMY',
    address: '',
    phone: '+251775669 : 0911775841 : 0915710209',
    email: 'adilh5254@gmail.com',
    academicYear: '',
    logo: null
  });

  const printContainerRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classesRes, brandingRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/mark-list/classes`),
          axios.get(`${API_BASE_URL}/admin/branding`)
        ]);
        
        setClasses(classesRes.data || []);
        if (classesRes.data?.length > 0) setSelectedClass(classesRes.data[0]);
        
        const branding = brandingRes.data;
        setSchoolInfo(prev => ({
          ...prev,
          name: branding.website_name || 'IQRA ACADEMY',
          address: branding.school_address || '',
          phone: branding.school_phone || '+251775669 : 0911775841 : 0915710209',
          email: branding.school_email || 'adilh5254@gmail.com',
          academicYear: branding.academic_year || '',
          logo: branding.school_logo ? `http://localhost:5000/uploads/branding/${branding.school_logo}` : null
        }));
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mark-list/comprehensive-ranking/${selectedClass}/1`);
        const studentList = response.data.rankings || [];
        setStudents(studentList);
        if (studentList.length > 0) setSelectedStudent(studentList[0].studentName);
        else setSelectedStudent('');
      } catch (error) {
        console.error('Error fetching students:', error);
        setStudents([]);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedClass || !selectedStudent) return;
    fetchReportData();
  }, [selectedClass, selectedStudent]);

  const fetchReportData = async () => {
    setLoadingReport(true);
    try {
      const [term1Res, term2Res] = await Promise.all([
        axios.get(`${API_BASE_URL}/mark-list/comprehensive-ranking/${selectedClass}/1`),
        axios.get(`${API_BASE_URL}/mark-list/comprehensive-ranking/${selectedClass}/2`)
      ]);

      const term1Rankings = term1Res.data.rankings || [];
      const term2Rankings = term2Res.data.rankings || [];

      const student1 = term1Rankings.find(s => s.studentName === selectedStudent);
      const student2 = term2Rankings.find(s => s.studentName === selectedStudent);

      if (student1 || student2) {
        // Try to get gender, age, and photo from student list API
        let studentGender = '';
        let studentAge = '';
        let studentPhoto = '';
        try {
          const studentListRes = await axios.get(`${API_BASE_URL}/student-list/students/${selectedClass}`);
          const studentInfo = studentListRes.data.find(s => s.student_name === selectedStudent);
          
          console.log('Student Info:', studentInfo); // Debug log
          
          studentGender = studentInfo?.gender || studentInfo?.sex || '';
          studentAge = studentInfo?.age || '';
          
          // Get photo URL using the same utility function as ListStudent
          if (studentInfo?.image_student) {
            studentPhoto = getFileUrl(studentInfo.image_student, 'student');
            console.log('Photo URL:', studentPhoto); // Debug log
          } else {
            console.log('No image_student found'); // Debug log
          }
          
          console.log('Gender:', studentGender, 'Age:', studentAge); // Debug log
        } catch (error) {
          console.log('Could not fetch student info:', error.message);
        }

        const combinedData = {
          studentName: selectedStudent,
          className: selectedClass,
          totalStudents: term1Rankings.length,
          term1: student1 || null,
          term2: student2 || null,
          subjectsData: combineSubjects(student1, student2),
          rank: {
            term1: student1?.rank || '-',
            term2: student2?.rank || '-',
            combined: student1?.rank || student2?.rank || '-'
          },
          gender: studentGender,
          age: studentAge,
          photo: studentPhoto
        };
        
        console.log('Combined Data:', combinedData); // Debug log
        setReportData(combinedData);
      } else {
        setReportData(null);
      }

      // Fetch all students for print all - fetch gender once for all students
      let studentListData = [];
      try {
        const studentListRes = await axios.get(`${API_BASE_URL}/student-list/students/${selectedClass}`);
        studentListData = studentListRes.data || [];
      } catch (error) {
        console.log('Could not fetch student list:', error.message);
      }

      const allStudentsWithData = term1Rankings.map(student => {
        const student2Data = term2Rankings.find(s => s.studentName === student.studentName);
        
        // Get gender, age, and photo from the fetched student list
        const studentInfo = studentListData.find(s => s.student_name === student.studentName);
        const studentGender = studentInfo?.gender || studentInfo?.sex || '';
        const studentAge = studentInfo?.age || '';
        
        // Get photo URL using the same utility function as ListStudent
        const studentPhoto = studentInfo?.image_student ? getFileUrl(studentInfo.image_student, 'student') : '';

        return {
          studentName: student.studentName,
          className: selectedClass,
          totalStudents: term1Rankings.length,
          term1: student,
          term2: student2Data || null,
          subjectsData: combineSubjects(student, student2Data),
          rank: {
            term1: student?.rank || '-',
            term2: student2Data?.rank || '-',
            combined: student?.rank || '-'
          },
          gender: studentGender,
          age: studentAge,
          photo: studentPhoto
        };
      });
      setAllStudentsData(allStudentsWithData);
    } catch (error) {
      console.error('Error fetching report:', error);
      setReportData(null);
    } finally {
      setLoadingReport(false);
    }
  };

  const combineSubjects = (term1Data, term2Data) => {
    const combined = {};
    
    // Get all unique subjects from both terms
    const allSubjects = new Set();
    
    if (term1Data?.subjects) {
      Object.keys(term1Data.subjects).forEach(subject => allSubjects.add(subject));
    }
    
    if (term2Data?.subjects) {
      Object.keys(term2Data.subjects).forEach(subject => allSubjects.add(subject));
    }
    
    // Calculate totals for each term
    let term1Total = 0;
    let term2Total = 0;
    let term1Count = 0;
    let term2Count = 0;
    
    // Combine data for each subject
    allSubjects.forEach(subject => {
      const term1Mark = term1Data?.subjects?.[subject]?.total || '';
      const term2Mark = term2Data?.subjects?.[subject]?.total || '';
      
      // Add to totals if marks exist
      if (term1Mark) {
        term1Total += parseFloat(term1Mark);
        term1Count++;
      }
      if (term2Mark) {
        term2Total += parseFloat(term2Mark);
        term2Count++;
      }
      
      const average = (term1Mark && term2Mark) 
        ? ((parseFloat(term1Mark) + parseFloat(term2Mark)) / 2).toFixed(1)
        : term1Mark || term2Mark || '';
      
      combined[subject] = {
        term1: term1Mark,
        term2: term2Mark,
        average: average
      };
    });

    // Calculate averages
    const term1Average = term1Count > 0 ? (term1Total / term1Count).toFixed(1) : '';
    const term2Average = term2Count > 0 ? (term2Total / term2Count).toFixed(1) : '';
    const combinedTotal = term1Total + term2Total;
    const combinedCount = Math.max(term1Count, term2Count);
    const combinedAverage = combinedCount > 0 ? (combinedTotal / (term1Count + term2Count)).toFixed(1) : '';

    return {
      subjects: combined,
      totals: {
        term1: term1Total > 0 ? term1Total.toFixed(0) : '',
        term2: term2Total > 0 ? term2Total.toFixed(0) : '',
        combined: combinedTotal > 0 ? combinedTotal.toFixed(0) : ''
      },
      averages: {
        term1: term1Average,
        term2: term2Average,
        combined: combinedAverage
      }
    };
  };

  const handlePrint = (printAll = false) => {
    setPrintAllStudents(printAll);
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 500);
    }, 100);
  };

  const handleDownloadPDF = async () => {
    if (!reportData) return;
    
    try {
      setIsPrinting(true);
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const cardsToProcess = printAllStudents && allStudentsData.length > 0 
        ? allStudentsData 
        : [reportData];
      
      // A5 dimensions in mm (portrait)
      const pdfWidth = 148; // A5 width in mm
      const pdfHeight = 210; // A5 height in mm
      
      let pdf = null;
      
      for (let i = 0; i < cardsToProcess.length; i++) {
        const studentData = cardsToProcess[i];
        
        // Find the report card element for this student
        const reportCards = printContainerRef.current?.querySelectorAll(`.${styles.reportCard}`) || 
                           document.querySelectorAll(`.${styles.reportCard}`);
        const reportCard = reportCards[i];
        
        if (!reportCard) continue;
        
        // Get front and back pages
        const frontPage = reportCard.querySelector(`.${styles.frontPage}`);
        const backPage = reportCard.querySelector(`.${styles.backPage}`);
        
        if (frontPage) {
          // Capture front page
          const frontCanvas = await html2canvas(frontPage, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: frontPage.scrollWidth,
            windowHeight: frontPage.scrollHeight
          });
          
          const frontImgData = frontCanvas.toDataURL('image/jpeg', 0.95);
          
          // Calculate dimensions to fit A5 page
          const canvasRatio = frontCanvas.height / frontCanvas.width;
          const imgWidth = pdfWidth;
          const imgHeight = pdfWidth * canvasRatio;
          
          // Create PDF with custom height if needed
          if (!pdf) {
            pdf = new jsPDF('p', 'mm', [pdfWidth, Math.max(pdfHeight, imgHeight)]);
          } else {
            pdf.addPage([pdfWidth, Math.max(pdfHeight, imgHeight)]);
          }
          
          // Add front page - fit to page width
          pdf.addImage(frontImgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
        
        if (backPage) {
          // Capture back page
          const backCanvas = await html2canvas(backPage, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            windowWidth: backPage.scrollWidth,
            windowHeight: backPage.scrollHeight
          });
          
          const backImgData = backCanvas.toDataURL('image/jpeg', 0.95);
          
          // Calculate dimensions to fit A5 page
          const canvasRatio = backCanvas.height / backCanvas.width;
          const imgWidth = pdfWidth;
          const imgHeight = pdfWidth * canvasRatio;
          
          // Add back page with custom height if needed
          pdf.addPage([pdfWidth, Math.max(pdfHeight, imgHeight)]);
          pdf.addImage(backImgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
      }
      
      if (!pdf) {
        alert('No pages to generate');
        return;
      }
      
      // Save PDF
      const fileName = printAllStudents 
        ? `IqraReportCards_${selectedClass}_All.pdf`
        : `IqraReportCard_${selectedClass}_${selectedStudent}.pdf`;
      
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  // Single Report Card Component
  const SingleIqraCard = ({ data }) => {
    if (!data) return null;

    // Get subjects dynamically from the data
    const subjects = Object.keys(data.subjectsData?.subjects || {}).sort();

    return (
      <div className={styles.reportCard}>
        {/* FRONT PAGE */}
        <div className={styles.frontPage}>
          <div className={styles.decorativeCorner}></div>
          
          <div className={styles.headerSection}>
            <div className={styles.photoBox}>
              {data.photo ? (
                <img src={data.photo} alt="Student" className={styles.studentPhoto} />
              ) : (
                <span>Photo</span>
              )}
            </div>
            
            <div className={styles.logoSection}>
              {schoolInfo.logo ? (
                <img src={schoolInfo.logo} alt="School Logo" className={styles.schoolLogo} />
              ) : (
                <div className={styles.logoCircle}>
                  <div className={styles.logoInner}>
                    <span className={styles.logoArabic}>iqra</span>
                    <span className={styles.logoSubtext}>ACADEMY</span>
                    <span className={styles.logoTagline}>Bar Ama Baro</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.schoolNames}>
            <h1 className={styles.schoolNameMain}>DUGSIGA HOOSE DHEXE & SARE EE IQRA</h1>
            <p className={styles.schoolNameAmharic}>ኢቅራ ሕፃናት ዝቅተኛ፣መካከለኛና ከፍተኛ ደረጃ ት/ቤት</p>
            <p className={styles.schoolNameEn}>IQRA KINDERGARTEN, PRIMERY, INTERMEDIATE & SECONDARY SCHOOL</p>
            <p className={styles.schoolNameAr}>اقرأ روضة الاطفال ومدرسة الإبتدائية والمتوسطة والثانوية</p>
          </div>

          <div className={styles.reportTitle}>
            <h2>Student's Report Card</h2>
          </div>

          <div className={styles.studentInfo}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Branch:</span>
              <span className={styles.value}>_______________________________</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Academic Year:</span>
              <span className={styles.value}>{schoolInfo.academicYear || '_______________________________'}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Issue Date:</span>
              <span className={styles.value}>_______________________________</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Student's Full Name:</span>
              <span className={styles.value}>{data.studentName}</span>
            </div>
            <div className={styles.infoRowSplit}>
              <div className={styles.infoHalf}>
                <span className={styles.label}>Gender:</span>
                <span className={styles.value}>{data.gender || '____'}</span>
              </div>
              <div className={styles.infoHalf}>
                <span className={styles.label}>Age:</span>
                <span className={styles.value}>{data.age || '____'}</span>
              </div>
            </div>
            <div className={styles.infoRowSplit}>
              <div className={styles.infoHalf}>
                <span className={styles.label}>Grade:</span>
                <span className={styles.value}>{data.className}</span>
              </div>
              <div className={styles.infoHalf}>
                <span className={styles.label}>Address:</span>
                <span className={styles.value}>____</span>
              </div>
            </div>
          </div>

          <div className={styles.promotionText}>
            <p>Based on the student's score as per the method of marking the student is</p>
            <div className={styles.promotionLine}>
              <span className={styles.underline}>_______________________________</span>
              <span>to grade</span>
              <span className={styles.underline}>________</span>
            </div>
          </div>

          <div className={styles.signatures}>
            <div className={styles.signatureRow}>
              <div className={styles.signatureField}>
                <span className={styles.label}>Home Room Teacher's Signature:</span>
                <span className={styles.underline}>____________</span>
              </div>
              <div className={styles.signatureField}>
                <span className={styles.label}>Date:</span>
                <span className={styles.underline}>________</span>
              </div>
            </div>
            <div className={styles.signatureRow}>
              <div className={styles.signatureField}>
                <span className={styles.label}>Principal's Signature:</span>
                <span className={styles.underline}>____________</span>
              </div>
              <div className={styles.signatureField}>
                <span className={styles.label}>Date:</span>
                <span className={styles.underline}>________</span>
              </div>
            </div>
          </div>

          <div className={styles.gradingScale}>
            <h3>METHOD OF MARKING</h3>
            <div className={styles.gradeList}>
              <div className={styles.gradeItem}>
                <span>90-100%</span>
                <span className={styles.gradeLetter}>A</span>
                <span>Excellent</span>
              </div>
              <div className={styles.gradeItem}>
                <span>80-89%</span>
                <span className={styles.gradeLetter}>B</span>
                <span>Very Good</span>
              </div>
              <div className={styles.gradeItem}>
                <span>60-79%</span>
                <span className={styles.gradeLetter}>C</span>
                <span>Good</span>
              </div>
              <div className={styles.gradeItem}>
                <span>50-59%</span>
                <span className={styles.gradeLetter}>D</span>
                <span>Satisfactory</span>
              </div>
              <div className={styles.gradeItem}>
                <span>Below 50%</span>
                <span className={styles.gradeLetter}>F</span>
                <span>Poor</span>
              </div>
            </div>
          </div>

          <div className={styles.parentSection}>
            <div className={styles.parentSignature}>
              <div className={styles.signatureField}>
                <span className={styles.label}>Parent's/Guardian's Signature:</span>
                <span className={styles.underline}>____________</span>
              </div>
              <div className={styles.signatureField}>
                <span className={styles.label}>Date:</span>
                <span className={styles.underline}>________</span>
              </div>
            </div>
            <div className={styles.parentMessage}>
              <h4>Dear Parents/Guardians,</h4>
              <p>
                Strong communication between school and parents is vital for improving student 
                performance. The school welcomes questions regarding the teaching-learning process 
                and your children's schoolwork.
              </p>
              <p>Please examine this report card carefully, sign it, and return it promptly.</p>
            </div>
          </div>
        </div>

        {/* BACK PAGE */}
        <div className={styles.backPage}>
          <div className={styles.backHeader}>
            <div className={styles.backLogo}>
              {schoolInfo.logo ? (
                <img src={schoolInfo.logo} alt="Logo" className={styles.backLogoImg} />
              ) : (
                <div className={styles.backLogoCircle}>
                  <span className={styles.backLogoText}>iqra</span>
                </div>
              )}
            </div>
          </div>

          <table className={styles.marksTable}>
            <thead>
              <tr>
                <th rowSpan="2" className={styles.subjectCol}>Subject</th>
                <th colSpan="2">Term</th>
                <th rowSpan="2">Average</th>
              </tr>
              <tr>
                <th>1st Term</th>
                <th>2nd Term</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, idx) => {
                const subjectData = data.subjectsData.subjects[subject] || {};
                return (
                  <tr key={idx}>
                    <td className={styles.subjectName}>{subject}</td>
                    <td>{subjectData.term1 || ''}</td>
                    <td>{subjectData.term2 || ''}</td>
                    <td>{subjectData.average || ''}</td>
                  </tr>
                );
              })}
              <tr>
                <td className={styles.subjectName}>Absent</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr className={styles.totalRow}>
                <td className={styles.subjectName}>Total</td>
                <td>{data.subjectsData.totals?.term1 || ''}</td>
                <td>{data.subjectsData.totals?.term2 || ''}</td>
                <td>{data.subjectsData.totals?.combined || ''}</td>
              </tr>
              <tr className={styles.totalRow}>
                <td className={styles.subjectName}>Average</td>
                <td>{data.subjectsData.averages?.term1 || ''}</td>
                <td>{data.subjectsData.averages?.term2 || ''}</td>
                <td>{data.subjectsData.averages?.combined || ''}</td>
              </tr>
              <tr className={styles.totalRow}>
                <td className={styles.subjectName}>Rank</td>
                <td>{data.rank?.term1 || ''}</td>
                <td>{data.rank?.term2 || ''}</td>
                <td>{data.rank?.combined || ''}</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.activitySection}>
            <h3>Student's School Activity</h3>
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th rowSpan="2" className={styles.characterCol}>Student Character</th>
                  <th colSpan="2">Term</th>
                  <th rowSpan="2" className={styles.legendCol}></th>
                </tr>
                <tr>
                  <th>1st</th>
                  <th>2nd</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Personal Hygiene</td>
                  <td></td>
                  <td></td>
                  <td className={styles.legendCell}>XC- Excellent</td>
                </tr>
                <tr>
                  <td>Taking Care of learning materials</td>
                  <td></td>
                  <td></td>
                  <td className={styles.legendCell}>G-Good</td>
                </tr>
                <tr>
                  <td>Time management</td>
                  <td></td>
                  <td></td>
                  <td className={styles.legendCell}>SI - Improved</td>
                </tr>
                <tr>
                  <td>Work Independently</td>
                  <td></td>
                  <td></td>
                  <td className={styles.legendCell}>NI - Needs Improvement</td>
                </tr>
                <tr>
                  <td>Obeys rule</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Overall responsibility</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Social Relation</td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <FaSpinner className={styles.spinner} />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isPrinting ? styles.printMode : ''}`}>
      {!isPrinting && (
        <div className={styles.screenOnly}>
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <FaAward className={styles.headerIcon} />
              <div>
                <h1>Iqra Report Card</h1>
                <p>Iqra Academy Report Card Design (A5 Portrait)</p>
              </div>
            </div>
          </div>

          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label><FaSchool /> Class</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                {classes.length === 0 ? (
                  <option value="">No classes</option>
                ) : (
                  classes.map(cls => <option key={cls} value={cls}>{cls}</option>)
                )}
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label><FaUserGraduate /> Student</label>
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} disabled={students.length === 0}>
                {students.length === 0 ? (
                  <option value="">No students</option>
                ) : (
                  students.map(s => (
                    <option key={s.studentName} value={s.studentName}>
                      {s.studentName} (#{s.rank})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className={styles.actionButtons}>
              <motion.button 
                className={styles.printBtn} 
                onClick={() => handlePrint(false)} 
                whileHover={{ scale: 1.05 }}
                disabled={!reportData}
              >
                <FaPrint /> Print Single
              </motion.button>
              <motion.button 
                className={styles.printAllBtn} 
                onClick={() => handlePrint(true)} 
                whileHover={{ scale: 1.05 }}
                disabled={allStudentsData.length === 0}
              >
                <FaUsers /> Print All ({allStudentsData.length})
              </motion.button>
              <motion.button 
                className={styles.pdfBtn} 
                onClick={handleDownloadPDF} 
                whileHover={{ scale: 1.05 }}
                disabled={!reportData}
              >
                <FaDownload /> PDF
              </motion.button>
            </div>
          </div>

          {loadingReport ? (
            <div className={styles.loadingReport}>
              <FaSpinner className={styles.spinner} />
              <p>Loading report...</p>
            </div>
          ) : !reportData ? (
            <div className={styles.noData}>
              <FaUserGraduate className={styles.noDataIcon} />
              <h3>No data available</h3>
              <p>Select a class and student with marks entered.</p>
            </div>
          ) : (
            <div className={styles.previewSection}>
              <h3>Preview - Iqra Report Card (A5 Portrait)</h3>
              <div className={styles.previewCard}>
                <SingleIqraCard data={reportData} />
              </div>
            </div>
          )}
        </div>
      )}

      {isPrinting && (
        <div className={styles.printContainer} ref={printContainerRef}>
          {printAllStudents && allStudentsData.length > 0 ? (
            allStudentsData.map((studentData, index) => (
              <div key={index} className={styles.printCard}>
                <SingleIqraCard data={studentData} />
              </div>
            ))
          ) : reportData ? (
            <div className={styles.printCard}>
              <SingleIqraCard data={reportData} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ReportCard;
