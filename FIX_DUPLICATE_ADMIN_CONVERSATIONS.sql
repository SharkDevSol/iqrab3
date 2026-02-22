-- First, let's see all conversations with admin_1
SELECT 
    c.id as conversation_id,
    c.type,
    c.created_at,
    cp.user_id,
    cp.user_name,
    cp.user_type
FROM conversations c
JOIN conversation_participants cp ON c.id = cp.conversation_id
WHERE c.id IN (
    SELECT conversation_id 
    FROM conversation_participants 
    WHERE user_id = 'admin_1'
)
ORDER BY c.id, cp.user_id;

-- Option 1: Update the old "School Administration" conversation to use "Admin" name
UPDATE conversation_participants
SET user_name = 'Admin'
WHERE user_id = 'admin_1' 
  AND user_type = 'admin'
  AND user_name = 'School Administration';

-- Option 2: If you want to delete the old "School Administration" conversation entirely
-- (Uncomment the lines below to use this option instead)

-- First find the conversation IDs with "School Administration"
-- DELETE FROM messages WHERE conversation_id IN (
--     SELECT DISTINCT cp.conversation_id
--     FROM conversation_participants cp
--     WHERE cp.user_id = 'admin_1' 
--       AND cp.user_name = 'School Administration'
-- );

-- DELETE FROM conversation_participants WHERE conversation_id IN (
--     SELECT DISTINCT cp.conversation_id
--     FROM conversation_participants cp
--     WHERE cp.user_id = 'admin_1' 
--       AND cp.user_name = 'School Administration'
-- );

-- DELETE FROM conversations WHERE id IN (
--     SELECT DISTINCT cp.conversation_id
--     FROM conversation_participants cp
--     WHERE cp.user_id = 'admin_1' 
--       AND cp.user_name = 'School Administration'
-- );

-- Verify the result
SELECT 
    c.id as conversation_id,
    c.type,
    cp.user_id,
    cp.user_name,
    cp.user_type
FROM conversations c
JOIN conversation_participants cp ON c.id = cp.conversation_id
WHERE c.id IN (
    SELECT conversation_id 
    FROM conversation_participants 
    WHERE user_id = 'admin_1'
)
ORDER BY c.id;
