import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/services/api';
import { ArrowLeft, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

const VerifyOTP = () => {
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const phone = location.state?.phone || '';
  const devMode = location.state?.devMode || false;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no phone
  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every((digit) => digit) && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);

    if (pasted.length === 6) {
      handleVerify(pasted);
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      // DEV MODE: Accept "123456" as valid code
      if (devMode && code === '123456') {
        await login('dev-token-' + Date.now(), {
          id: 'dev-user-' + phone,
          phone: phone,
          name: 'Reda',
          language: 'ar',
          isPremium: true,
        });
        navigate('/app', { replace: true });
        return;
      }

      const response = await authApi.verifyOtp(phone, code);

      // Login
      await login(response.token, {
        id: response.user.id,
        phone: response.user.phone,
        name: response.user.name || '',
        language: response.user.language || 'ar',
        isPremium: response.user.is_premium || false,
      });

      // Navigate to app
      navigate('/app', { replace: true });
    } catch (err) {
      // DEV MODE: Allow login even if API fails
      if (devMode && code === '123456') {
        await login('dev-token-' + Date.now(), {
          id: 'dev-user-' + phone,
          phone: phone,
          name: 'Reda',
          language: 'ar',
          isPremium: true,
        });
        navigate('/app', { replace: true });
        return;
      }

      setError(t('الكود غير صحيح', 'Code incorrect'));
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    try {
      await authApi.requestOtp(phone);
      setResendTimer(60);
      setError('');
    } catch {
      setError(t('حدث خطأ، حاول مرة أخرى', 'Une erreur est survenue'));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => navigate('/login')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Arrow className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-3xl">💬</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          {t('دخل الكود', 'Entrez le code')}
        </h1>
        <p className="text-muted-foreground text-center mb-2">
          {t('بعتنالك رسالة WhatsApp على', 'Nous avons envoyé un message WhatsApp au')}
        </p>
        <p className="font-mono text-lg font-medium mb-8" dir="ltr">
          {phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5')}
        </p>

        {/* OTP Inputs */}
        <div className="flex gap-2 mb-4" dir="ltr">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              disabled={loading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {error && (
          <p className="text-destructive text-sm mb-4">{error}</p>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-primary mb-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t('جاري التحقق...', 'Vérification...')}</span>
          </div>
        )}

        {/* Resend */}
        <button
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          {resendTimer > 0 ? (
            <span>{t(`إعادة الإرسال بعد ${resendTimer}ث`, `Renvoyer dans ${resendTimer}s`)}</span>
          ) : (
            <span>{t('إعادة إرسال الكود', 'Renvoyer le code')}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
