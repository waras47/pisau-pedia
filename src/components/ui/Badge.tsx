import { cn } from '@/lib/utils';

type BadgeVariant = 'gold' | 'dark' | 'red' | 'green';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: 'bg-[#C9A84C] text-[#0A0A0A]',
  dark: 'bg-[#1E1E1E] text-white border border-[#333]',
  red: 'bg-red-600 text-white',
  green: 'bg-emerald-600 text-white',
};

export function Badge({ children, variant = 'gold', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
