import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Settings as SettingsIcon,
  Crown,
  LogOut,
  User,
  Mail,
  Shield,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { FREE_PLAN_LIMITS, formatCurrency } from '@/lib/constants';
import { useClients } from '@/hooks/useClients';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { clientCount } = useClients();

  const isPremium = profile?.is_premium ?? false;

  const handleLogout = async () => {
    await signOut();
    toast.success('تم تسجيل الخروج بنجاح');
  };

  const handleUpgrade = () => {
    // TODO: Implement Stripe checkout
    console.log('Upgrade to premium');
  };

  const handleExport = () => {
    if (!isPremium) {
      toast.error('هذه الميزة متاحة فقط للمشتركين في الخطة المميزة');
      return;
    }
    // TODO: Implement Excel export
    toast.info('سيتم إضافة هذه الميزة قريباً');
  };

  return (
    <div className="py-4 space-y-6" dir="rtl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-primary" />
          الإعدادات
        </h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            معلومات الحساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b border-border/50">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">الاسم</p>
              <p className="font-medium">{profile?.full_name || 'غير محدد'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
              <p className="font-medium" dir="ltr">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Card */}
      <Card className={isPremium ? 'border-accent' : ''}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className={`w-4 h-4 ${isPremium ? 'text-accent' : 'text-primary'}`} />
            الاشتراك الحالي
          </CardTitle>
          <CardDescription>
            {isPremium ? 'الخطة المميزة' : 'الخطة المجانية'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPremium ? (
            <>
              <div className="bg-accent/10 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  <span>عدد غير محدود من العملاء</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  <span>عدد غير محدود من المنتجات</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  <span>بدون إعلانات</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  <span>تصدير البيانات إلى Excel</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                شكراً لدعمك! أنت مشترك في الخطة المميزة.
              </p>
            </>
          ) : (
            <>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>العملاء المستخدمون</span>
                  <span className="font-medium">
                    {clientCount} / {FREE_PLAN_LIMITS.MAX_CLIENTS}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all"
                    style={{ width: `${(clientCount / FREE_PLAN_LIMITS.MAX_CLIENTS) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  الحد الأقصى: {FREE_PLAN_LIMITS.MAX_ITEMS_PER_CLIENT} منتج لكل زبون
                </p>
              </div>

              <div className="text-center py-2">
                <p className="text-2xl font-bold text-primary">99 د.م.</p>
                <p className="text-sm text-muted-foreground">شهرياً</p>
              </div>

              <Button onClick={handleUpgrade} className="w-full btn-gold py-6">
                <Crown className="w-5 h-5 ml-2" />
                ترقية إلى المميزة
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Export Data */}
      {isPremium && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-primary" />
              تصدير البيانات
            </CardTitle>
            <CardDescription>تصدير جميع البيانات إلى ملف Excel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} variant="outline" className="w-full">
              <FileSpreadsheet className="w-4 h-4 ml-2" />
              تصدير إلى Excel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Logout */}
      <Card className="border-destructive/20">
        <CardContent className="p-4">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </CardContent>
      </Card>

      {/* Version */}
      <p className="text-center text-xs text-muted-foreground pb-4">
        مدير الديون - الإصدار 1.0.0
      </p>
    </div>
  );
};

export default Settings;
