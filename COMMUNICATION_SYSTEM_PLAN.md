# Communication System - Complete Chat Feature

## Current State Analysis

### What Exists:
1. **Class Communication** (`classCommunicationRoutes.js`)
   - Teachers can send messages to their classes
   - Students can view messages from teachers
   - Supports attachments
   - ✅ Working

2. **Director Communication** (`DirectorCommunication.jsx`)
   - Admin can send "requests" (questions) to guardians
   - Guardians respond to requests
   - ❌ Not a real chat - uses request/response pattern
   - ❌ No real-time messaging

### What's Needed:
1. **Real-time chat** between Admin ↔ Guardians
2. **Real-time chat** between Teachers ↔ Guardians
3. **Message history** and conversation threads
4. **Read receipts** and typing indicators
5. **File attachments** in chats
6. **Push notifications** for new messages

---

## Proposed Solution

### Architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                     Chat System                              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │  Admin  │          │ Teacher │          │Guardian │
   │   App   │          │   App   │          │   App   │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Socket.IO       │
                    │   Real-time       │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   PostgreSQL      │
                    │   - conversations │
                    │   - messages      │
                    │   - participants  │
                    └───────────────────┘
```

---

## Database Schema

### 1. conversations
```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'admin_guardian', 'teacher_guardian'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP
);
```

### 2. conversation_participants
```sql
CREATE TABLE conversation_participants (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL, -- 'admin_123', 'teacher_456', 'guardian_789'
  user_type VARCHAR(50) NOT NULL, -- 'admin', 'teacher', 'guardian'
  user_name VARCHAR(255),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_read_at TIMESTAMP,
  UNIQUE(conversation_id, user_id)
);
```

### 3. messages
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id VARCHAR(255) NOT NULL,
  sender_type VARCHAR(50) NOT NULL,
  sender_name VARCHAR(255),
  message_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);
```

### 4. message_attachments
```sql
CREATE TABLE message_attachments (
  id SERIAL PRIMARY KEY,
  message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Conversations
- `GET /api/chat/conversations` - Get all conversations for current user
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations/:id` - Get conversation details
- `DELETE /api/chat/conversations/:id` - Delete conversation

### Messages
- `GET /api/chat/conversations/:id/messages` - Get messages in conversation
- `POST /api/chat/conversations/:id/messages` - Send message
- `PUT /api/chat/messages/:id/read` - Mark message as read
- `DELETE /api/chat/messages/:id` - Delete message

### Participants
- `GET /api/chat/conversations/:id/participants` - Get participants
- `POST /api/chat/conversations/:id/participants` - Add participant
- `DELETE /api/chat/conversations/:id/participants/:userId` - Remove participant

### Contacts
- `GET /api/chat/contacts/guardians` - Get all guardians (for admin/teacher)
- `GET /api/chat/contacts/teachers` - Get all teachers (for guardian)
- `GET /api/chat/contacts/admin` - Get admin contact (for guardian)

---

## Socket.IO Events

### Client → Server:
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `mark_read` - Mark messages as read

### Server → Client:
- `new_message` - New message received
- `message_read` - Message was read
- `user_typing` - Someone is typing
- `user_stopped_typing` - Someone stopped typing
- `conversation_updated` - Conversation metadata changed

---

## Frontend Components

### Admin App:
- `AdminChat.jsx` - Main chat interface for admin
- `GuardianList.jsx` - List of guardians to chat with
- `ChatWindow.jsx` - Chat conversation window
- `MessageInput.jsx` - Message input with attachments

### Teacher App:
- `TeacherChat.jsx` - Main chat interface for teachers
- `GuardianList.jsx` - List of guardians (students' parents)
- `ChatWindow.jsx` - Reusable chat window
- `MessageInput.jsx` - Reusable message input

### Guardian App:
- `GuardianChat.jsx` - Main chat interface for guardians
- `ContactList.jsx` - List of teachers and admin
- `ChatWindow.jsx` - Reusable chat window
- `MessageInput.jsx` - Reusable message input

---

## Implementation Steps

### Phase 1: Backend Setup (2-3 hours)
1. Create database tables
2. Create chat routes (`chatRoutes.js`)
3. Implement Socket.IO server
4. Add file upload handling
5. Test API endpoints

### Phase 2: Admin Chat (2-3 hours)
1. Create AdminChat component
2. Implement conversation list
3. Implement chat window
4. Add message sending
5. Add real-time updates

### Phase 3: Teacher Chat (2-3 hours)
1. Create TeacherChat component
2. Filter guardians by teacher's students
3. Implement chat interface
4. Add real-time updates

### Phase 4: Guardian Chat (2-3 hours)
1. Create GuardianChat component
2. Show teachers and admin contacts
3. Implement chat interface
4. Add real-time updates

### Phase 5: Polish & Features (2-3 hours)
1. Add read receipts
2. Add typing indicators
3. Add file attachments
4. Add message search
5. Add notifications

---

## Features Breakdown

### Must Have (MVP):
- ✅ Real-time messaging
- ✅ Conversation threads
- ✅ Message history
- ✅ User online status
- ✅ Basic file attachments

### Nice to Have:
- ⭐ Read receipts
- ⭐ Typing indicators
- ⭐ Message search
- ⭐ Push notifications
- ⭐ Message reactions (like, love, etc.)
- ⭐ Voice messages
- ⭐ Image preview
- ⭐ Message editing
- ⭐ Message deletion

---

## Estimated Time:
- **Total**: 10-15 hours
- **MVP**: 6-8 hours
- **Full Features**: 10-15 hours

---

## Next Steps:

Would you like me to:
1. **Start with Phase 1** (Backend setup) - Create database tables and API?
2. **Show you a demo** of how the chat will look?
3. **Create a simpler version** first (without real-time, just basic messaging)?
4. **Explain more** about any specific part?

Let me know how you'd like to proceed!
