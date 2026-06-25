import React from 'react';
import { Badge } from '../ui/badge';

type BadgeTone = 'green' | 'solid' | 'amber' | 'red' | 'gray' | 'blue';

interface FsBadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
}

export default function FsBadge({ children, tone = 'green' }: FsBadgeProps) {
  return <Badge variant={tone}>{children}</Badge>;
}
