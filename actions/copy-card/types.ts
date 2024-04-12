import { Card } from '@prisma/client';
import { z } from 'zod';

import { CopyCard } from '@/actions/copy-card/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof CopyCard>;
export type ReturnType = ActionState<InputType, Card>;
