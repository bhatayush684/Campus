import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { apiSendMessage, apiGetChatStatus } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Trash2, Loader2, ExternalLink, Clock, Bot } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Chat() {
  const { convId } = useParams();
  const { user } = useAuthStore();
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    addConversation,
    addMessage,
    deleteConversation,
    getActiveConversation,
  } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState<{ ready: boolean; provider: string; model: string | null; models: string[] } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = getActiveConversation();

  useEffect(() => {
    if (convId && convId !== activeConversationId) {
      setActiveConversation(convId);
    }
  }, [convId, activeConversationId, setActiveConversation]);

  useEffect(() => {
    apiGetChatStatus().then(setChatStatus).catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    setIsLoading(true);

    const currentConvId = activeConversationId || `conv_${Date.now()}`;

    if (!activeConversationId) {
      const newConvo = {
        id: currentConvId,
        userId: user?.id || 'guest',
        title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      addConversation(newConvo);
      setActiveConversation(currentConvId);
    }

    const userMessage = {
      id: `msg_${Date.now()}`,
      conversationId: currentConvId,
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString(),
    };
    addMessage(currentConvId, userMessage);

    try {
      const botResponse = await apiSendMessage(user?.id || 'guest', currentConvId, message);
      addMessage(currentConvId, botResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: `msg_${Date.now()}_error`,
        conversationId: currentConvId,
        role: 'assistant' as const,
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      addMessage(currentConvId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveConversation(null);
    setInput('');
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
    if (activeConversationId === id) {
      setActiveConversation(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col"
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleNewChat}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.map((conv) => (
            <motion.div
              key={conv.id}
              whileHover={{ scale: 1.02 }}
              className={cn(
                'p-3 rounded-lg cursor-pointer transition-colors',
                activeConversationId === conv.id
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
              onClick={() => setActiveConversation(conv.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                    {conv.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {chatStatus && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className={cn('w-2 h-2 rounded-full', chatStatus.ready ? 'bg-emerald-500' : 'bg-amber-500')} />
              <span>
                {chatStatus.ready ? chatStatus.model : 'Local retrieval only'}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="popLayout">
            {!activeConversation ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  CampusMind AI Assistant
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Ask questions about courses, faculty, timetables, notices, and more. I'm here to help!
                </p>
              </motion.div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {activeConversation.messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex gap-4',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[80%] rounded-2xl p-4',
                        message.role === 'user'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      )}
                    >
                      <div className="prose dark:prose-invert text-sm">
                        {message.content}
                      </div>
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                            Sources:
                          </p>
                          <div className="space-y-1">
                            {message.sources.map((source, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2"
                              >
                                <span className="font-mono">[{idx + 1}]</span>
                                <span className="flex-1">{source.title}</span>
                                {source.url && (
                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                      <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="btn-primary px-6 flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
