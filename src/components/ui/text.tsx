import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '../../lib/utils';

/**
 * Lets a parent (e.g. Button) push text classes down to a child <Text>
 * without the call site repeating them — the react-native-reusables pattern.
 */
export const TextClassContext = React.createContext<string | undefined>(undefined);

export interface TextProps extends React.ComponentProps<typeof RNText> {
  className?: string;
}

const Text = React.forwardRef<RNText, TextProps>(({ className, ...props }, ref) => {
  const contextClass = React.useContext(TextClassContext);
  return (
    <RNText
      ref={ref}
      className={cn('text-foreground', contextClass, className)}
      {...props}
    />
  );
});
Text.displayName = 'Text';

export { Text };
