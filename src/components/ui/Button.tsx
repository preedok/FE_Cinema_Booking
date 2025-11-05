import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] relative overflow-hidden group',
    {
        variants: {
            variant: {
                default: 'gradient-primary text-white shadow-glow hover:shadow-glow-lg before:absolute before:inset-0 before:bg-white/20 before:translate-y-full before:transition-transform before:duration-300 hover:before:translate-y-0',
                destructive: 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
                outline: 'border-2 border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 backdrop-blur-sm',
                secondary: 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-900 dark:text-slate-100 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600',
                ghost: 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
                link: 'text-primary underline-offset-4 hover:underline',
                glass: 'glass backdrop-blur-xl hover:bg-white/80 dark:hover:bg-slate-900/80 shadow-xl',
            },
            size: {
                default: 'h-12 px-6 py-3',
                sm: 'h-10 rounded-xl px-4 text-xs',
                lg: 'h-14 rounded-2xl px-10 text-base',
                xl: 'h-16 rounded-3xl px-12 text-lg',
                icon: 'h-12 w-12',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };