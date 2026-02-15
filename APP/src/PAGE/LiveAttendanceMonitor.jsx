import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './LiveAttendanceMonitor.css';

function LiveAttendanceMonitor() {
  const [logs, setLogs] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔌 Connecting to Socket.IO server...');
    
    const socket = io('http://localhost:5000', {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 20000,
      forceNew: true
    });
    
    socket.on('connect', () => {
      console.log('✅ Connected to server! Socket ID:', socket.id);
      setConnected(true);
      setError(null);
      
      // Send a ping to keep connection alive
      socket.emit('ping', { timestamp: Date.now() });
    });
    
    socket.on('connect_error', (err) => {
      console.error('❌ Connection error:', err.message);
      setError('Failed to connect to server');
      setConnected(false);
    });
    
    socket.on('new-attendance', (data) => {
      console.log('📊 NEW ATTENDANCE RECEIVED:', data);
      
      const newLog = {
        userId: data.userId,
        name: data.name || `User ${data.userId}`,
        time: data.time,
        mode: data.mode || 3,
        inout: data.inout || 0,
        timestamp: new Date(),
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // Unique ID
      };
      
      console.log('Adding log:', newLog);
      setLogs(prev => {
        const updated = [newLog, ...prev].slice(0, 50);
        console.log('Updated logs count:', updated.length);
        return updated;
      });
    });
    
    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected:', reason);
      console.log('   Reason details:', {
        reason,
        wasConnected: socket.connected,
        id: socket.id
      });
      setConnected(false);
      
      // Auto-reconnect if disconnected unexpectedly
      if (reason === 'io server disconnect') {
        console.log('🔄 Server disconnected us, reconnecting...');
        socket.connect();
      }
    });
    
    // Test connection
    setTimeout(() => {
      console.log('Socket connected?', socket.connected);
      console.log('Socket ID:', socket.id);
    }, 2000);
    
    return () => {
      console.log('🔌 Disconnecting socket...');
      socket.disconnect();
    };
  }, []);

  const getModeText = (mode) => {
    const modes = {
      0: '👆 Fingerprint',
      1: '🔢 Password',
      2: '💳 Card',
      3: '😊 Face ID',
      20: '😊 Face',
      50: '🤖 AI Face'
    };
    return modes[mode] || `Mode ${mode}`;
  };

  const getInOutText = (inout) => {
    return inout === 0 ? '📥 Check In' : '📤 Check Out';
  };

  return (
    <div className="live-monitor">
      <div className="monitor-header">
        <h1>🔴 Live Attendance Monitor</h1>
        <div className={`status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '✅ Connected' : '❌ Disconnected'}
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-value">{logs.length}</div>
          <div className="stat-label">Total Logs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {logs.filter(l => l.inout === 0).length}
          </div>
          <div className="stat-label">Check Ins</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {logs.filter(l => l.inout === 1).length}
          </div>
          <div className="stat-label">Check Outs</div>
        </div>
      </div>

      <div className="logs-container">
        {logs.length === 0 ? (
          <div className="no-logs">
            <div className="pulse-icon">👁️</div>
            <h3>Waiting for face scans...</h3>
            <p>Logs will appear here instantly when someone scans their face</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div 
              key={log.id} 
              className={`log-card ${index === 0 ? 'new-log' : ''}`}
            >
              <div className="log-icon">
                {getModeText(log.mode).split(' ')[0]}
              </div>
              <div className="log-details">
                <div className="log-header">
                  <div className="log-name">
                    {log.name || `User ${log.userId}`}
                  </div>
                  <div className="log-machine-id">
                    Machine ID: <strong>{log.userId}</strong>
                  </div>
                </div>
                <div className="log-meta">
                  <span className="log-time">
                    ⏰ {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="log-mode">
                    {getModeText(log.mode)}
                  </span>
                  <span className={`log-inout ${log.inout === 0 ? 'in' : 'out'}`}>
                    {getInOutText(log.inout)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LiveAttendanceMonitor;
