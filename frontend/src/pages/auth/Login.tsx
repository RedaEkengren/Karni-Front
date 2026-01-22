import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { authApi } from '@/services/api';
import { ArrowLeft, ArrowRight, Phone, Loader2 } from 'lucide-react';

const Login = () => {
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Format as 06 XX XX XX XX
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanPhone = phone.replace(/\s/g, '');

    // Validate phone number (Moroccan or Swedish for dev)
    if (!/^0[567]\d{8}$/.test(cleanPhone) && !/^07\d{8}$/.test(cleanPhone)) {
      setError(t('رقم الهاتف غير صحيح', 'Numéro de téléphone invalide'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // DEV: Skip API for test number
      if (cleanPhone === '0707266453') {
        navigate('/verify', { state: { phone: cleanPhone, devMode: true } });
        return;
      }

      await authApi.requestOtp(cleanPhone);
      navigate('/verify', { state: { phone: cleanPhone } });
    } catch (err) {
      // DEV: Allow proceeding even if API fails
      navigate('/verify', { state: { phone: cleanPhone, devMode: true } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <button
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Arrow className="w-6 h-6 rotate-180" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* Logo */}
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-6">
          <span className="text-4xl">📓</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">
          {t('مرحبا برصيدي', 'Bienvenue sur Rassidi')}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {t('دخل رقم الهاتف ديالك باش تبدا', 'Entrez votre numéro pour commencer')}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {t('رقم الهاتف', 'Numéro de téléphone')}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="06 XX XX XX XX"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
                dir="ltr"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || phone.replace(/\s/g, '').length < 10}
            className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {t('التالي', 'Suivant')}
                <Arrow className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* WhatsApp note */}
        <p className="text-sm text-muted-foreground text-center mt-6 flex items-center gap-2">
          💬 {t('غادي توصلك رسالة WhatsApp', 'Vous recevrez un message WhatsApp')}
        </p>
      </div>
    </div>
  );
};

export default Login;
