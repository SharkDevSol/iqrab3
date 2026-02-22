-- Update admin name in conversation participants from "School Administration" to "Admin"
UPDATE conversation_participants
SET user_name = 'Admin'
WHERE user_id = 'admin_1' 
  AND user_type = 'admin'
  AND user_name = 'School Administration';

-- Verify the update
SELECT * FROM conversation_participants WHERE user_id = 'admin_1';
