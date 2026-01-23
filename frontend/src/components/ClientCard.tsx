import React from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  id: string;
  name: string;
  phone?: string | null;
  totalDebt: number;
  className?: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  id,
  name,
  phone,
  totalDebt,
  className,
}) => {
  return (
    <Link to={`/clients/${id}`}>
      <Card
        className={cn(
          'card-hover cursor-pointer border-border/50 bg-card',
          className
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{name}</h3>
                {phone && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3" />
                    <span dir="ltr">{phone}</span>
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-left">
                <p className="text-xs text-muted-foreground">الرصيد المستحق</p>
                <p
                  className={cn(
                    'font-bold currency text-lg',
                    totalDebt > 0 ? 'text-destructive' : 'text-success'
                  )}
                >
                  {formatCurrency(totalDebt)}
                </p>
              </div>
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
