import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { FiMessageCircle, FiSearch, FiUser } from 'react-icons/fi';
import ChatWindow from '../../COMPONENTS/Chat/ChatWindow';
import ConversationList from '../../COMPONENTS/Chat/ConversationList';
import styles from './AdminChat.module.css';

const AdminChat = () => {
  const [guardians, setGuardians] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const socketRef = useRef(null);

  const currentUserId = 'admin_1'; // Get from localStorage in production
  const currentUserName = 'Admin';
  const currentUserType = 'admin';

  useEffect(() => {
    // Initialize Socket.IO
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', currentUserId);

    // Listen for new messages
    socketRef.current.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      // Update conversation list
      fetchConversations();
    });

    fetchGuardians();
    fetchConversations();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const fetchGuardians = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chats/contacts/guardians');
      setGuardians(res.data);
    } catch (error) {
      console.error('Error fetching guardians:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/chats/conversations?userId=${currentUserId}`);
      setConversations(res.data.map(c => ({ ...c, currentUserId })));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    setMessagesLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/chats/conversations/${conversationId}/messages`);
      setMessages(res.data);
      
      // Mark as read
      await axios.put('http://localhost:5000/api/chats/messages/read', {
        conversationId,
        userId: currentUserId
      });
      
      fetchConversations(); // Refresh to update unread count
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSelectGuardian = async (guardian) => {
    try {
      // Create or get conversation
      const res = await axios.post('http://localhost:5000/api/chats/conversations', {
        type: 'admin_guardian',
        participants: [
          { user_id: currentUserId, user_type: 'admin', user_name: currentUserName },
          { user_id: guardian.id, user_type: 'guardian', user_name: guardian.name }
        ]
      });

      const convId = res.data.id;
      
      // Fetch full conversation details
      const convRes = await axios.get(`http://localhost:5000/api/chats/conversations/${convId}`);
      setActiveConversation(convRes.data);
      
      // Fetch messages
      await fetchMessages(convId);
      
      // Refresh conversations list
      fetchConversations();
    } catch (error) {
      console.error('Error selecting guardian:', error);
    }
  };

  const handleSelectConversation = async (conversation) => {
    setActiveConversation(conversation);
    await fetchMessages(conversation.id);
  };

  const handleSendMessage = async (formData) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/chats/conversations/${activeConversation.id}/messages`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const newMessage = res.data;
      setMessages(prev => [...prev, newMessage]);

      // Broadcast via Socket.IO
      if (socketRef.current) {
        socketRef.current.emit('send_message', {
          conversationId: activeConversation.id,
          message: newMessage
        });
      }

      fetchConversations(); // Refresh list
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const filteredGuardians = guardians.filter(g =>
    g.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <FiMessageCircle />
        <h1>Guardian Communications</h1>
      </div>

      <div className={styles.content}>
        {/* Guardians List */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h3>Guardians</h3>
          </div>
          <div className={styles.search}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search guardians..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className={styles.guardianList}>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : filteredGuardians.length === 0 ? (
              <div className={styles.empty}>No guardians found</div>
            ) : (
              filteredGuardians.map(guardian => (
                <div
                  key={guardian.id}
                  className={styles.guardianItem}
                  onClick={() => handleSelectGuardian(guardian)}
                >
                  <div className={styles.avatar}><FiUser /></div>
                  <div className={styles.info}>
                    <div className={styles.name}>{guardian.name}</div>
                    {guardian.phone && <div className={styles.phone}>{guardian.phone}</div>}
                    {guardian.students && guardian.students.length > 0 && (
                      <div className={styles.students}>
                        Guardian of: {guardian.students.map((s, i) => 
                          `${s.name} (${s.class})`
                        ).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className={styles.conversations}>
          <div className={styles.conversationsHeader}>
            <h3>Messages</h3>
          </div>
          <ConversationList
            conversations={conversations}
            activeId={activeConversation?.id}
            onSelect={handleSelectConversation}
            loading={false}
          />
        </div>

        {/* Chat Window */}
        <div className={styles.chat}>
          {activeConversation ? (
            <>
              <div className={styles.chatHeader}>
                <div className={styles.avatar}><FiUser /></div>
                <div>
                  <h3>
                    {activeConversation.participants?.find(p => p.user_id !== currentUserId)?.user_name}
                  </h3>
                  <span>Guardian</span>
                </div>
              </div>
              <ChatWindow
                conversation={activeConversation}
                messages={messages}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                currentUserType={currentUserType}
                onSendMessage={handleSendMessage}
                isLoading={messagesLoading}
                socket={socketRef.current}
              />
            </>
          ) : (
            <div className={styles.noChat}>
              <FiMessageCircle />
              <h3>Select a guardian to start chatting</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
