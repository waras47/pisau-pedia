import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start',
        className
      )}
    >
      {eyebrow && (
        <span className="text-[#C9A84C] text-xs font-bold uppercase tracking-[0.2em]">
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          'text-3xl md:text-4xl font-light tracking-tight',
          light ? 'text-white' : 'text-white'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn('max-w-xl text-sm leading-relaxed', light ? 'text-[#999]' : 'text-[#888]')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
