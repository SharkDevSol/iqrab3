import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Finance/PaymentManagement.module.css';
import { getCurrentEthiopianMonth, getEthiopianMonthName } from '../../utils/ethiopianCalendar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ethiopianMonths = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'
];

const AttendanceSystem = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentEthMonth = getCurrentEthiopianMonth();
  const [selectedEthMonth, setSelectedEthMonth] = useState(currentEthMonth.month); // 1-13
  const [selectedEthYear, setSelectedEthYear] = useState(currentEthMonth.year);
  const [showModal, setShowModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Get shift badge styling
  const getShiftBadge = (shiftAssignment) => {
    const badges = {
      'shift1': { icon: '🌅', label: 'Shift 1', color: '#FFB74D', bg: '#FFF3E0' },
      'shift2': { icon: '🌆', label: 'Shift 2', color: '#7E57C2', bg: '#EDE7F6' },
      'both': { icon: '🔄', label: 'Both', color: '#42A5F5', bg: '#E3F2FD' }
    };
    return badges[shiftAssignment] || badges['shift1'];
  };

  useEffect(() => {
    fetchAttendance();
    fetchStaff();
  }, [selectedEthMonth, selectedEthYear]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      console.log('📡 Fetching attendance for:', { 
        ethMonth: selectedEthMonth, 
        ethYear: selectedEthYear 
      });
      
      const response = await axios.get(
        `${API_URL}/api/hr/attendance/ethiopian-month?ethMonth=${selectedEthMonth}&ethYear=${selectedEthYear}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        console.log('✅ Fetched attendance records:', response.data.data.length, 'records');
        if (response.data.data.length > 0) {
          console.log('📄 All records:', response.data.data);
        }
        setAttendanceRecords(response.data.data);
      }
    } catch (error) {
      console.error('❌ Error fetching attendance:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const types = ['Supportive Staff', 'Administrative Staff', 'Teachers'];
      let allStaff = [];
      
      for (const staffType of types) {
        try {
          const classesResponse = await axios.get(
            `${API_URL}/api/staff/classes?staffType=${encodeURIComponent(staffType)}`
          );
          
          for (const className of classesResponse.data) {
            try {
              const dataResponse = await axios.get(
                `${API_URL}/api/staff/data/${staffType}/${className}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
              );
              
      const staffWithMeta = dataResponse.data.data.map(staff => {
                // Get Machine ID directly from database (no more hardcoded mapping!)
                const machineId = staff.machine_id || null;
                const shiftAssignment = staff.shift_assignment || 'shift1';
                
                return {
                  id: staff.global_staff_id || staff.staff_id || staff.id,
                  name: staff.full_name || staff.name || 'Unknown',
                  firstName: (staff.full_name || staff.name || '').split(' ')[0],
                  lastName: (staff.full_name || staff.name || '').split(' ').slice(1).join(' '),
                  department: staffType,
                  staffType,
                  className,
                  email: staff.email,
                  phone: staff.phone,
                  role: staff.role,
                  machineId: machineId, // Machine ID from database
                  shiftAssignment: shiftAssignment // Shift assignment from database
                };
              });
              
              allStaff = [...allStaff, ...staffWithMeta];
            } catch (err) {
              console.warn(`No data for: ${staffType}/${className}`);
            }
          }
        } catch (err) {
          console.warn(`No classes for: ${staffType}`);
        }
      }
      
      setStaff(allStaff);
      console.log('👥 Loaded staff:', allStaff.length, 'members');
      if (allStaff.length > 0) {
        console.log('📄 All staff IDs:', allStaff.map(s => ({ 
          id: s.id, 
          name: s.name,
          machineId: s.machineId
        })));
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const markAttendance = async (staffId, staffName, ethDay, checkIn, checkOut) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_URL}/api/hr/attendance/ethiopian`,
        {
          staffId,
          staffName,
          ethMonth: selectedEthMonth,
          ethYear: selectedEthYear,
          ethDay,
          checkIn,
          checkOut
        },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PRESENT': '#4CAF50',
      'ABSENT': '#F44336',
      'LATE': '#FF9800',
      'HALF_DAY': '#2196F3',
      'LEAVE': '#9C27B0',
      'LATE + HALF_DAY': '#FF5722',
      'PRESENT + without check out': '#FFC107',
      'LATE + without check out': '#FF6F00',
      'HALF_DAY + without check out': '#0288D1',
      'LATE + HALF_DAY + without check out': '#D32F2F'
    };
    return colors[status] || '#9E9E9E';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PRESENT': 'P',
      'ABSENT': 'A',
      'LATE': 'L',
      'HALF_DAY': 'H',
      'LEAVE': 'V',
      'LATE + HALF_DAY': 'L+H',
      'PRESENT + without check out': 'P+NCO',
      'LATE + without check out': 'L+NCO',
      'HALF_DAY + without check out': 'H+NCO',
      'LATE + HALF_DAY + without check out': 'L+H+NCO'
    };
    return badges[status] || '-';
  };

  // Get days in Ethiopian month (30 days for months 1-12, 5-6 for Pagume)
  const getDaysInEthiopianMonth = () => {
    if (selectedEthMonth === 13) {
      // Pagume has 5 or 6 days depending on leap year
      return Array.from({ length: 5 }, (_, i) => i + 1);
    }
    return Array.from({ length: 30 }, (_, i) => i + 1);
  };

  // Get attendance for specific staff and Ethiopian day (with optional shift type)
  const getAttendanceForDay = (staffId, ethDay, shiftType = null) => {
    // Get the staff member's machine_id or global_staff_id
    const staffMember = staff.find(s => String(s.id) === String(staffId));
    const machineId = staffMember?.machineId;
    const globalStaffId = staffMember?.id;
    const staffName = staffMember?.name;
    
    // Match by machine_id if available, otherwise by global_staff_id or staff name
    const record = attendanceRecords.find(r => {
      const recordStaffId = String(r.staff_id);
      const recordStaffName = String(r.staff_name || '').toLowerCase();
      const recordDay = parseInt(r.ethiopian_day);
      const recordMonth = parseInt(r.ethiopian_month);
      const recordYear = parseInt(r.ethiopian_year);
      const recordShiftType = r.shift_type;
      
      const dayMatch = recordDay === parseInt(ethDay);
      const monthMatch = recordMonth === parseInt(selectedEthMonth);
      const yearMatch = recordYear === parseInt(selectedEthYear);
      
      // Match by machine_id (if staff has one) OR by global_staff_id OR by staff name (for N/A staff)
      const idMatch = machineId 
        ? recordStaffId === String(machineId)
        : (recordStaffId === String(globalStaffId) || recordStaffName === String(staffName || '').toLowerCase());
      
      // If shiftType is specified, also match by shift_type
      const shiftMatch = shiftType ? recordShiftType === shiftType : true;
      
      return idMatch && dayMatch && monthMatch && yearMatch && shiftMatch;
    });
    
    return record;
  };

  // Calculate monthly statistics
  const getMonthlyStats = () => {
    const stats = {
      totalPresent: 0,
      totalAbsent: 0,
      totalLate: 0,
      totalLeave: 0,
      totalHalfDay: 0,
      totalLateHalfDay: 0,
      totalWithoutCheckout: 0
    };

    attendanceRecords.forEach(record => {
      const status = record.status;
      
      // Each record is counted ONCE in its primary category
      if (status === 'PRESENT') {
        stats.totalPresent++;
      } else if (status === 'PRESENT + without check out') {
        stats.totalPresent++;
        stats.totalWithoutCheckout++;
      } else if (status === 'ABSENT') {
        stats.totalAbsent++;
      } else if (status === 'LEAVE') {
        stats.totalLeave++;
      } else if (status === 'LATE') {
        stats.totalLate++;
      } else if (status === 'LATE + without check out') {
        stats.totalLate++;
        stats.totalWithoutCheckout++;
      } else if (status === 'HALF_DAY') {
        stats.totalHalfDay++;
      } else if (status === 'HALF_DAY + without check out') {
        stats.totalHalfDay++;
        stats.totalWithoutCheckout++;
      } else if (status === 'LATE + HALF_DAY') {
        stats.totalLateHalfDay++;
      } else if (status === 'LATE + HALF_DAY + without check out') {
        stats.totalLateHalfDay++;
        stats.totalWithoutCheckout++;
      }
    });

    return stats;
  };

  const stats = getMonthlyStats();
  const days = getDaysInEthiopianMonth();
  const selectedMonthName = getEthiopianMonthName(selectedEthMonth);

  const handleCellClick = (staffMember, day, attendance, shiftType) => {
    setSelectedCell({
      staff: staffMember,
      day,
      attendance,
      shiftType // Add shift type to the cell object
    });
    setShowTimeModal(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Monthly Attendance System (Ethiopian Calendar)</h1>
          <p>Track staff attendance using Ethiopian calendar months</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={selectedEthMonth}
            onChange={(e) => setSelectedEthMonth(parseInt(e.target.value))}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            {ethiopianMonths.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={selectedEthYear}
            onChange={(e) => setSelectedEthYear(parseInt(e.target.value))}
            min="2010"
            max="2030"
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '14px',
              width: '100px'
            }}
          />
        </div>
      </div>

      {/* Monthly Statistics */}
      <div style={{ marginBottom: '24px', padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#333' }}>
          Monthly Summary - {selectedMonthName} {selectedEthYear}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Present</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#4CAF50' }}>{stats.totalPresent}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Absent</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#F44336' }}>{stats.totalAbsent}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Late</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#FF9800' }}>{stats.totalLate}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Half Day</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#2196F3' }}>{stats.totalHalfDay}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Late + Half Day</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#FF5722' }}>{stats.totalLateHalfDay}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>Without Check-Out</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFC107' }}>{stats.totalWithoutCheckout}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#666' }}>On Leave</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#9C27B0' }}>{stats.totalLeave}</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginBottom: '16px', padding: '12px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', background: '#4CAF50', borderRadius: '4px', display: 'inline-block' }}></span>
            <span>P - Present</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', background: '#F44336', borderRadius: '4px', display: 'inline-block' }}></span>
            <span>A - Absent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', background: '#FF9800', borderRadius: '4px', display: 'inline-block' }}></span>
            <span>L - Late</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', background: '#2196F3', borderRadius: '4px', display: 'inline-block' }}></span>
            <span>H - Half Day</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', background: '#FF5722', borderRadius: '4px', display: 'inline-block' }}></span>
            <span>L+H - Late + Half Day</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', background: '#FFC107', borderRadius: '4px', display: 'inline-block' }}></span>
            <span>NCO - No Check-Out</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '20px', height: '20px', background: '#9C27B0', borderRadius: '4px', display: 'inline-block' }}></span>
            <span>V - Leave</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading attendance...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', position: 'sticky', left: 0, background: '#f5f5f5', zIndex: 10, minWidth: '150px' }}>
                  Staff Name
                </th>
                <th style={{ padding: '12px', textAlign: 'center', position: 'sticky', left: '150px', background: '#f5f5f5', zIndex: 10, minWidth: '80px' }}>
                  Machine ID
                </th>
                <th style={{ padding: '12px', textAlign: 'left', position: 'sticky', left: '230px', background: '#f5f5f5', zIndex: 10, minWidth: '120px' }}>
                  Department
                </th>
                {days.map(day => (
                  <th key={day} style={{ padding: '8px', textAlign: 'center', minWidth: '80px', fontWeight: 600 }}>
                    {day}/{selectedEthMonth}
                  </th>
                ))}
                <th style={{ padding: '12px', textAlign: 'center', minWidth: '80px', fontWeight: 600 }}>
                  Total P
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr><td colSpan={days.length + 4} className={styles.noData}>No staff found</td></tr>
              ) : (
                staff.flatMap(staffMember => {
                  // For staff with "both" shifts, create 2 rows (one for each shift)
                  const shifts = staffMember.shiftAssignment === 'both' 
                    ? ['shift1', 'shift2'] 
                    : [staffMember.shiftAssignment];

                  return shifts.map((shiftType, shiftIndex) => {
                    const presentCount = days.filter(day => {
                      const attendance = getAttendanceForDay(staffMember.id, day, shiftType);
                      return attendance?.status === 'PRESENT';
                    }).length;

                    const shiftLabel = shiftType === 'shift1' ? '🌅 S1' : '🌆 S2';
                    const showName = shiftIndex === 0; // Only show name on first row for "both" staff

                    return (
                      <tr key={`${staffMember.id}-${shiftType}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px', fontWeight: 600, position: 'sticky', left: 0, background: 'white', zIndex: 5 }}>
                          {showName ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{staffMember.name}</span>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                background: getShiftBadge(staffMember.shiftAssignment).bg,
                                color: getShiftBadge(staffMember.shiftAssignment).color,
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: 600
                              }}>
                                {getShiftBadge(staffMember.shiftAssignment).icon} {getShiftBadge(staffMember.shiftAssignment).label}
                              </span>
                            </div>
                          ) : (
                            <div style={{ paddingLeft: '20px', fontSize: '12px', color: '#666' }}>
                              {shiftLabel}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', position: 'sticky', left: '150px', background: 'white', zIndex: 5 }}>
                          {showName && (
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 12px',
                              background: staffMember.machineId ? '#e3f2fd' : '#f5f5f5',
                              border: `2px solid ${staffMember.machineId ? '#2196F3' : '#e0e0e0'}`,
                              borderRadius: '12px',
                              fontSize: '13px',
                              fontWeight: 700,
                              color: staffMember.machineId ? '#1976d2' : '#999'
                            }}>
                              {staffMember.machineId || 'N/A'}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px', color: '#666', position: 'sticky', left: '230px', background: 'white', zIndex: 5 }}>
                          {showName ? staffMember.department : ''}
                        </td>
                        {days.map(day => {
                          const attendance = getAttendanceForDay(staffMember.id, day, shiftType);
                          
                          return (
                            <td key={day} style={{ padding: '4px', textAlign: 'center' }}>
                              <div
                                onClick={() => handleCellClick(staffMember, day, attendance, shiftType)}
                                style={{
                                  minHeight: '50px',
                                  padding: '4px',
                                  borderRadius: '6px',
                                  background: attendance ? getStatusColor(attendance.status) + '20' : '#f5f5f5',
                                  border: `2px solid ${attendance ? getStatusColor(attendance.status) : '#e0e0e0'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              {attendance ? (
                                <>
                                  <div style={{ 
                                    fontSize: '16px', 
                                    fontWeight: 700, 
                                    color: getStatusColor(attendance.status),
                                    marginBottom: '2px',
                                    textAlign: 'center'
                                  }}>
                                    {getStatusBadge(attendance.status)}
                                  </div>
                                  {attendance.check_in && (
                                    <div style={{ fontSize: '9px', color: '#666' }}>
                                      {formatTime12Hour(attendance.check_in)}
                                    </div>
                                  )}
                                  {attendance.check_out && (
                                    <div style={{ fontSize: '9px', color: '#666' }}>
                                      {formatTime12Hour(attendance.check_out)}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div style={{ fontSize: '14px', color: '#999' }}>-</div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#4CAF50' }}>
                        {presentCount}
                      </td>
                    </tr>
                  );
                  });
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <BulkAttendanceModal 
          staff={staff}
          ethMonth={selectedEthMonth}
          ethYear={selectedEthYear}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchAttendance(); }}
        />
      )}

      {showTimeModal && selectedCell && (
        <TimeModal
          cell={selectedCell}
          ethMonth={selectedEthMonth}
          ethYear={selectedEthYear}
          onClose={() => { setShowTimeModal(false); setSelectedCell(null); }}
          onSuccess={() => { setShowTimeModal(false); setSelectedCell(null); fetchAttendance(); }}
        />
      )}
    </div>
  );
};

const TimeModal = ({ cell, ethMonth, ethYear, onClose, onSuccess }) => {
  const attendance = cell.attendance;
  const hasCheckedIn = attendance && attendance.check_in;
  const hasCheckedOut = attendance && attendance.check_out;
  const isLeave = attendance && attendance.status === 'LEAVE';
  
  const [checkIn, setCheckIn] = useState(attendance?.check_in || '08:00');
  const [checkOut, setCheckOut] = useState(attendance?.check_out || '17:00');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(hasCheckedIn && !hasCheckedOut ? 'checkout' : 'checkin');

  // If this is a LEAVE day, show info and prevent editing
  if (isLeave) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
          <div className={styles.modalHeader}>
            <h2>🏖️ Leave Day</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
          
          <div style={{ 
            padding: '20px', 
            background: '#f3e5f5', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #9C27B0'
          }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              <strong>Staff:</strong> {cell.staff.name}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              <strong>Department:</strong> {cell.staff.department}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
              <strong>Date:</strong> Day {cell.day}, {getEthiopianMonthName(ethMonth)} {ethYear}
            </div>
            
            <div style={{ 
              padding: '16px', 
              background: '#9C27B0', 
              color: 'white', 
              borderRadius: '8px',
              marginTop: '12px'
            }}>
              <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
                🏖️ ON LEAVE
              </div>
              <div style={{ fontSize: '13px' }}>
                {attendance.notes || 'This staff member is on approved leave'}
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '16px', 
            background: '#fff3e0', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #FF9800'
          }}>
            <div style={{ fontSize: '14px', color: '#e65100', fontWeight: 600, marginBottom: '8px' }}>
              ℹ️ About Leave Days:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#e65100' }}>
              <li>Leave days cannot be edited from attendance</li>
              <li>No check-in/check-out required for leave</li>
              <li>No salary deduction will be applied</li>
              <li>Manage leave from Leave Management page</li>
            </ul>
          </div>

          <div className={styles.modalActions}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '12px 24px',
                background: '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleCheckIn = async (e) => {
    e.preventDefault();
    
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Use machine ID if available, otherwise use staff name as ID
      const staffId = cell.staff.machineId || cell.staff.name;
      
      console.log('Marking check-in for:', {
        staffId: staffId,
        name: cell.staff.name,
        day: cell.day,
        shiftType: cell.shiftType,
        hasMachineId: !!cell.staff.machineId
      });
      
      const response = await axios.post(
        `${API_URL}/api/hr/attendance/ethiopian`,
        {
          staffId: staffId, // Use machine ID or name
          staffName: cell.staff.name,
          ethMonth: parseInt(ethMonth),
          ethYear: parseInt(ethYear),
          ethDay: parseInt(cell.day),
          checkIn,
          checkOut: null, // Only check-in, no check-out yet
          shiftType: cell.shiftType // Add shift type for proper validation
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        alert('✅ Check-in recorded successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error recording check-in:', error);
      alert(`❌ Failed to record check-in: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // IMPORTANT: For check-out, we need to use the SAME staffId that was used for check-in
      // This should match what's stored in the database
      const staffId = attendance.staff_id; // Use the staff_id from the existing attendance record
      
      console.log('🔴 Recording check-out for:', {
        staffId: staffId,
        staffName: cell.staff.name,
        day: cell.day,
        ethMonth: parseInt(ethMonth),
        ethYear: parseInt(ethYear),
        shiftType: cell.shiftType,
        existingCheckIn: attendance.check_in,
        newCheckOut: checkOut,
        fullAttendanceRecord: attendance
      });
      
      const response = await axios.post(
        `${API_URL}/api/hr/attendance/ethiopian`,
        {
          staffId: staffId, // Use the staff_id from existing record
          staffName: cell.staff.name,
          ethMonth: parseInt(ethMonth),
          ethYear: parseInt(ethYear),
          ethDay: parseInt(cell.day),
          checkIn: attendance.check_in, // Keep existing check-in
          checkOut, // Add check-out
          shiftType: cell.shiftType // Add shift type for proper validation
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('✅ Check-out response:', response.data);

      if (response.data.success) {
        alert('✅ Check-out recorded successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error recording check-out:', error);
      console.error('❌ Error details:', error.response?.data);
      alert(`❌ Failed to record check-out: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!cell.attendance) return;
    
    if (!confirm('Are you sure you want to delete this attendance record?')) return;

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await axios.delete(
        `${API_URL}/api/hr/attendance/ethiopian/${cell.attendance.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('✅ Attendance deleted successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('❌ Error deleting attendance:', error);
      alert('❌ Failed to delete attendance');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className={styles.modalHeader}>
          <h2>
            {!hasCheckedIn && '🔵 Check-In'}
            {hasCheckedIn && !hasCheckedOut && '🔴 Check-Out'}
            {hasCheckedIn && hasCheckedOut && '✏️ Edit Attendance'}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Staff:</strong> {cell.staff.name}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            <strong>Department:</strong> {cell.staff.department}
          </div>
          {cell.shiftType && (
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              <strong>Shift:</strong> {cell.shiftType === 'shift1' ? '🌅 Shift 1 (Morning)' : '🌆 Shift 2 (Afternoon)'}
            </div>
          )}
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong>Date:</strong> Day {cell.day}, {getEthiopianMonthName(ethMonth)} {ethYear}
          </div>
          
          {hasCheckedIn && (
            <div style={{ marginTop: '12px', padding: '12px', background: '#e8f5e9', borderRadius: '6px' }}>
              <div style={{ fontSize: '13px', color: '#2e7d32', fontWeight: 600 }}>
                ✅ Checked In: {attendance.check_in}
              </div>
            </div>
          )}
          
          {hasCheckedOut && (
            <div style={{ marginTop: '8px', padding: '12px', background: '#ffebee', borderRadius: '6px' }}>
              <div style={{ fontSize: '13px', color: '#c62828', fontWeight: 600 }}>
                ✅ Checked Out: {attendance.check_out}
              </div>
            </div>
          )}
        </div>

        {/* Check-In Form */}
        {(!hasCheckedIn || (hasCheckedIn && hasCheckedOut)) && (
          <form onSubmit={handleCheckIn} className={styles.form}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Check-In Time *
              </label>
              <input
                type="time"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                When did the staff member arrive?
              </div>
            </div>

            <div className={styles.modalActions}>
              {cell.attendance && (
                <button 
                  type="button" 
                  onClick={handleDelete}
                  style={{
                    padding: '10px 20px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  🗑️ Delete
                </button>
              )}
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Recording...' : (hasCheckedIn ? '🔵 Update Check-In' : '🔵 Check-In')}
              </button>
            </div>
          </form>
        )}

        {/* Check-Out Form */}
        {hasCheckedIn && !hasCheckedOut && (
          <form onSubmit={handleCheckOut} className={styles.form}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                Check-Out Time *
              </label>
              <input
                type="time"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  fontSize: '16px'
                }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                When did the staff member leave?
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                type="button" 
                onClick={handleDelete}
                style={{
                  padding: '10px 20px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                🗑️ Delete
              </button>
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Recording...' : '🔴 Check-Out'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const BulkAttendanceModal = ({ staff, ethMonth, ethYear, onClose, onSuccess }) => {
  const [selectedDay, setSelectedDay] = useState('');
  const [checkIn, setCheckIn] = useState('08:00');
  const [checkOut, setCheckOut] = useState('17:00');
  const [loading, setLoading] = useState(false);

  // Get days in the Ethiopian month
  const getDaysInEthiopianMonth = () => {
    if (ethMonth === 13) {
      return Array.from({ length: 5 }, (_, i) => i + 1);
    }
    return Array.from({ length: 30 }, (_, i) => i + 1);
  };

  const days = getDaysInEthiopianMonth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDay) {
      alert('Please select a day');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      // Build records array from all staff
      const records = staff.map(staffMember => ({
        staffId: staffMember.id,
        staffName: staffMember.name,
        ethMonth: parseInt(ethMonth),
        ethYear: parseInt(ethYear),
        ethDay: parseInt(selectedDay),
        checkIn,
        checkOut
      }));

      console.log('Sending bulk attendance:', { records });

      const response = await axios.post(
        `${API_URL}/api/hr/attendance/ethiopian/bulk`,
        { records },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        console.log('✅ Bulk attendance marked:', response.data.count, 'records');
        console.log('📄 Sample saved record:', response.data.data[0]);
        alert(`✅ Attendance marked successfully for ${response.data.count} staff members!`);
        onSuccess(); // This will close modal and refresh
      } else {
        alert('❌ Failed to mark attendance');
        setLoading(false);
      }
    } catch (error) {
      console.error('❌ Error marking attendance:', error);
      alert(`❌ Failed to mark attendance: ${error.response?.data?.error || error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className={styles.modalHeader}>
          <h2>📊 Bulk Mark Attendance - {getEthiopianMonthName(ethMonth)} {ethYear}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Select Day *
            </label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '8px', 
                border: '1px solid #e0e0e0',
                fontSize: '14px'
              }}
            >
              <option value="">Choose a day...</option>
              {days.map(day => (
                <option key={day} value={day}>
                  Day {day}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Check-In Time *
            </label>
            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '16px'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Standard check-in time for all staff
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
              Check-Out Time *
            </label>
            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                fontSize: '16px'
              }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Standard check-out time for all staff
            </div>
          </div>

          <div style={{ 
            background: '#e3f2fd', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #2196F3'
          }}>
            <div style={{ fontSize: '14px', color: '#1976d2', marginBottom: '8px', fontWeight: 600 }}>
              📋 Bulk Marking Summary
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              This will mark attendance for <strong>{staff.length} staff members</strong> on the selected day with the specified check-in and check-out times.
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
            <button type="submit" disabled={loading} className={styles.submitButton}>
              {loading ? 'Marking...' : `Mark Attendance for ${staff.length} Staff`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceSystem;
