import { Card } from '@prisma/client';
import { z } from 'zod';

import { CreateCard } from '@/actions/create-card/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof CreateCard>;
export type ReturnType = ActionState<InputType, Card>;
