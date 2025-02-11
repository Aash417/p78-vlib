import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
   onClick: ButtonProps['onClick'];
   disabled: boolean;
   isSubscribed: boolean;
   className?: string;
   size?: ButtonProps['size'];
};

export default function SubscriptionButton({
   onClick,
   disabled,
   isSubscribed,
   className,
   size,
}: Props) {
   return (
      <Button
         size={size}
         variant={isSubscribed ? 'secondary' : 'default'}
         className={cn('rounded-full', className)}
         onClick={onClick}
         disabled={disabled}
      >
         {isSubscribed ? 'Unsubscribed' : 'Subscribed'}
      </Button>
   );
}
