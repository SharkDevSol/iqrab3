# Chat System Backend - Phase 1 Complete ✅

## What Was Built

### 1. Database Tables Created
- ✅ `conversations` - Stores chat conversations
- ✅ `conversation_participants` - Links users to conversations
- ✅ `messages` - Stores all messages
- ✅ `message_attachments` - Stores file attachments
- ✅ All indexes for performance

### 2. API Endpoints Created

#### Conversations:
- `GET /api/chat/conversations?userId=xxx` - Get all conversations for user
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations/:id` - Get conversation details

#### Messages:
- `GET /api/chat/conversations/:id/messages` - Get messages (with pagination)
- `POST /api/chat/conversations/:id/messages` - Send message (with file upload)
- `PUT /api/chat/messages/read` - Mark messages as read

#### Contacts:
- `GET /api/chat/contacts/guardians` - Get all guardians
- `GET /api/chat/contacts/teachers` - Get all teachers

#### Attachments:
- `GET /api/chat/attachments/:id` - Download attachment

### 3. Socket.IO Events Added

#### Client → Server:
- `join_conversation` - Join a conversation room
- `leave_conversation` - Leave a conversation room
- `send_message` - Send a message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `mark_read` - Mark messages as read

#### Server → Client:
- `new_message` - New message received
- `user_typing` - Someone is typing
- `user_stopped_typing` - Someone stopped typing
- `messages_read` - Messages were read

### 4. File Upload Support
- ✅ Supports: images, PDFs, documents, spreadsheets
- ✅ Max file size: 10MB
- ✅ Multiple files per message (up to 5)
- ✅ Files stored in `backend/uploads/chat-attachments/`

---

## How to Test the Backend

### 1. Restart Backend Server
```bash
cd backend
node server.js
```

You should see:
```
✅ Chat tables initialized successfully
Server running on port 5000
```

### 2. Test API Endpoints

#### Get Guardians:
```bash
curl http://localhost:5000/api/chat/contacts/guardians
```

#### Get Teachers:
```bash
curl http://localhost:5000/api/chat/contacts/teachers
```

#### Create Conversation (Admin → Guardian):
```bash
curl -X POST http://localhost:5000/api/chat/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "type": "admin_guardian",
    "participants": [
      {
        "user_id": "admin_1",
        "user_type": "admin",
        "user_name": "Admin"
      },
      {
        "user_id": "guardian_123",
        "user_type": "guardian",
        "user_name": "Parent Name"
      }
    ]
  }'
```

#### Send Message:
```bash
curl -X POST http://localhost:5000/api/chat/conversations/1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": "admin_1",
    "senderType": "admin",
    "senderName": "Admin",
    "messageText": "Hello! How can I help you?"
  }'
```

#### Get Messages:
```bash
curl http://localhost:5000/api/chat/conversations/1/messages
```

#### Get User's Conversations:
```bash
curl "http://localhost:5000/api/chat/conversations?userId=admin_1"
```

---

## Database Schema

### conversations
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| type | VARCHAR(50) | 'admin_guardian' or 'teacher_guardian' |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | Last updated |
| last_message_at | TIMESTAMP | Last message time |

### conversation_participants
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| conversation_id | INTEGER | FK to conversations |
| user_id | VARCHAR(255) | User identifier |
| user_type | VARCHAR(50) | 'admin', 'teacher', 'guardian' |
| user_name | VARCHAR(255) | Display name |
| joined_at | TIMESTAMP | When joined |
| last_read_at | TIMESTAMP | Last read time |

### messages
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| conversation_id | INTEGER | FK to conversations |
| sender_id | VARCHAR(255) | Who sent it |
| sender_type | VARCHAR(50) | Sender type |
| sender_name | VARCHAR(255) | Sender name |
| message_text | TEXT | Message content |
| created_at | TIMESTAMP | When sent |
| read_at | TIMESTAMP | When read |
| is_deleted | BOOLEAN | Soft delete |

### message_attachments
| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| message_id | INTEGER | FK to messages |
| filename | VARCHAR(255) | Stored filename |
| original_name | VARCHAR(255) | Original filename |
| file_type | VARCHAR(100) | MIME type |
| file_size | INTEGER | Size in bytes |
| created_at | TIMESTAMP | When uploaded |

---

## User ID Format

### Admin:
- Format: `admin_1` or `staff_{global_staff_id}`
- Example: `admin_1`, `staff_123`

### Teacher:
- Format: `teacher_{global_staff_id}`
- Example: `teacher_456`

### Guardian:
- Format: `guardian_{global_guardian_id}`
- Example: `guardian_789`

---

## Next Steps

### Phase 2: Admin Chat UI (Next)
1. Create `AdminChat.jsx` component
2. Show list of guardians
3. Show conversation list
4. Show chat window
5. Send/receive messages in real-time

### Phase 3: Teacher Chat UI
1. Create `TeacherChat.jsx` component
2. Filter guardians by teacher's students
3. Implement chat interface

### Phase 4: Guardian Chat UI
1. Create `GuardianChat.jsx` component
2. Show teachers and admin
3. Implement chat interface

---

## Features Included

✅ Real-time messaging via Socket.IO
✅ Conversation threads
✅ Message history with pagination
✅ File attachments (images, PDFs, docs)
✅ Read receipts (last_read_at tracking)
✅ Typing indicators (Socket.IO events)
✅ Unread message count
✅ Soft delete for messages
✅ Automatic conversation creation
✅ Duplicate conversation prevention

---

## Ready for Frontend!

The backend is complete and ready. Now we can build the frontend chat interfaces for:
1. Admin (to chat with guardians)
2. Teachers (to chat with guardians)
3. Guardians (to chat with teachers and admin)

Would you like me to start building the Admin Chat UI next?
