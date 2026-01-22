import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import { ArrowLeft, ArrowRight, User, Phone, FileText, Loader2 } from 'lucide-react';

const AddCustomer = () => {
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const Arrow = isArabic ? ArrowLeft : ArrowRight;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t('الإسم مطلوب', 'Le nom est requis'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const localId = nanoid();
      const now = new Date().toISOString();

      // 1. Save to local DB
      await db.customers.add({
        id: localId,
        name: name.trim(),
        phone: phone.trim() || undefined,
        notes: notes.trim() || undefined,
        synced: false,
        createdAt: now,
        updatedAt: now,
      });

      // 2. Add to sync queue
      await db.syncQueue.add({
        action: 'create',
        table: 'customers',
        localId,
        data: {
          name: name.trim(),
          phone: phone.trim() || null,
          notes: notes.trim() || null,
        },
        timestamp: now,
      });

      // 3. Navigate to customer detail (or back to list)
      navigate(`/app/customers/${localId}`, { replace: true });
    } catch (err) {
      setError(t('حدث خطأ', 'Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Arrow className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-bold">{t('زبون جديد', 'Nouveau client')}</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('الإسم', 'Nom')} *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder={t('إسم الزبون', 'Nom du client')}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('رقم الهاتف', 'Téléphone')} ({t('اختياري', 'optionnel')})
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="06 XX XX XX XX"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              dir="ltr"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('ملاحظات', 'Notes')} ({t('اختياري', 'optionnel')})
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('ملاحظات إضافية...', 'Notes supplémentaires...')}
              rows={3}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-destructive text-sm">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="btn-primary w-full text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {t('حفظ', 'Enregistrer')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;
