import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { chatApi } from '@/services/api';
import { Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat = () => {
  const { t, isArabic } = useLanguage();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isArabic
        ? `مرحبا ${user?.name || ''}! أنا مساعد رصيدي. كيفاش نقدر نعاونك؟`
        : `Bonjour ${user?.name || ''}! Je suis l'assistant Rassidi. Comment puis-je vous aider?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Try to call API
      if (token) {
        const response = await chatApi.send(token, userMessage);
        setMessages((prev) => [...prev, { role: 'assistant', content: response.response }]);
      } else {
        // Fallback response
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: isArabic
              ? 'شكرا على سؤالك! للأسف ما نقدرش نجاوبك دابا. حاول مرة أخرى.'
              : 'Merci pour votre question! Malheureusement je ne peux pas répondre maintenant.',
          },
        ]);
      }
    } catch (error) {
      // Offline fallback
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: isArabic
            ? 'عذرا، ما نقدرش نتواصل مع السيرفر دابا. حاول مرة أخرى ملي تكون متصل بالإنترنت.'
            : 'Désolé, je ne peux pas me connecter au serveur. Réessayez quand vous êtes en ligne.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-bold">{t('مساعد رصيدي', 'Assistant Rassidi')}</h1>
          <p className="text-xs text-muted-foreground">
            {t('متوفر 24/7 بالدارجة والفرنسية', 'Disponible 24/7 en darija et français')}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-primary/10' : 'bg-accent/20'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-primary" />
              ) : (
                <Bot className="w-4 h-4 text-accent" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('اكتب رسالتك...', 'Écrivez votre message...')}
          className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="btn-primary px-4 disabled:opacity-50"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
