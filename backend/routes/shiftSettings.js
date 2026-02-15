/**
 * Shift Time Settings Routes
 * Manages time configurations for Shift 1 and Shift 2
 */

const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all shift settings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM shift_time_settings 
      WHERE is_active = true 
      ORDER BY shift_name
    `);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching shift settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shift settings'
    });
  }
});

// Get specific shift settings
router.get('/:shiftName', async (req, res) => {
  try {
    const { shiftName } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM shift_time_settings WHERE shift_name = $1 AND is_active = true',
      [shiftName]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Shift settings not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching shift settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch shift settings'
    });
  }
});

// Update shift settings
router.put('/:shiftName', async (req, res) => {
  try {
    const { shiftName } = req.params;
    const {
      check_in_time,
      check_out_time,
      late_threshold,
      minimum_work_hours,
      half_day_threshold,
      grace_period_minutes
    } = req.body;

    const result = await pool.query(`
      UPDATE shift_time_settings 
      SET 
        check_in_time = COALESCE($1, check_in_time),
        check_out_time = COALESCE($2, check_out_time),
        late_threshold = COALESCE($3, late_threshold),
        minimum_work_hours = COALESCE($4, minimum_work_hours),
        half_day_threshold = COALESCE($5, half_day_threshold),
        grace_period_minutes = COALESCE($6, grace_period_minutes),
        updated_at = CURRENT_TIMESTAMP
      WHERE shift_name = $7 AND is_active = true
      RETURNING *
    `, [
      check_in_time,
      check_out_time,
      late_threshold,
      minimum_work_hours,
      half_day_threshold,
      grace_period_minutes,
      shiftName
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Shift settings not found'
      });
    }

    res.json({
      success: true,
      message: `${shiftName} settings updated successfully`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating shift settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update shift settings'
    });
  }
});

// Get staff shift assignment
router.get('/staff/:staffId/shift', async (req, res) => {
  try {
    const { staffId } = req.params;
    
    // Check all staff schemas for the shift assignment
    const schemas = [
      { name: 'staff_teachers', type: 'Teachers' },
      { name: 'staff_administrative_staff', type: 'Administrative Staff' },
      { name: 'staff_supportive_staff', type: 'Supportive Staff' }
    ];
    
    let shiftAssignment = null;

    for (const schema of schemas) {
      // Get all tables in this schema
      const tablesResult = await pool.query(
        `SELECT table_name FROM information_schema.tables 
         WHERE table_schema = $1`,
        [schema.name]
      );

      // Check each table for the staff member
      for (const tableRow of tablesResult.rows) {
        const result = await pool.query(
          `SELECT shift_assignment FROM "${schema.name}"."${tableRow.table_name}" 
           WHERE global_staff_id = $1`,
          [staffId]
        );
        
        if (result.rows.length > 0) {
          shiftAssignment = result.rows[0].shift_assignment || 'shift1';
          break;
        }
      }

      if (shiftAssignment) break;
    }

    if (!shiftAssignment) {
      return res.status(404).json({
        success: false,
        error: 'Staff not found'
      });
    }

    res.json({
      success: true,
      data: { shift_assignment: shiftAssignment }
    });
  } catch (error) {
    console.error('Error fetching staff shift:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch staff shift assignment'
    });
  }
});

// Update staff shift assignment
router.put('/staff/:staffType/:className/:staffId/shift', async (req, res) => {
  try {
    const { staffType, className, staffId } = req.params;
    const { shift_assignment } = req.body;

    console.log('Updating shift for:', { staffType, className, staffId, shift_assignment });

    if (!['shift1', 'shift2', 'both'].includes(shift_assignment)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid shift assignment. Must be shift1, shift2, or both'
      });
    }

    // Determine schema name based on staff type
    let schemaName;
    if (staffType === 'Teachers') {
      schemaName = 'staff_teachers';
    } else if (staffType === 'Administrative Staff') {
      schemaName = 'staff_administrative_staff';
    } else if (staffType === 'Supportive Staff') {
      schemaName = 'staff_supportive_staff';
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid staff type'
      });
    }

    // Use schema.table format
    const result = await pool.query(
      `UPDATE "${schemaName}"."${className}" 
       SET shift_assignment = $1 
       WHERE global_staff_id = $2
       RETURNING *`,
      [shift_assignment, staffId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Staff not found'
      });
    }

    console.log('Shift updated successfully:', result.rows[0]);

    res.json({
      success: true,
      message: 'Shift assignment updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating staff shift:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update shift assignment',
      details: error.message
    });
  }
});

module.exports = router;
