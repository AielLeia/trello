import { Card } from '@prisma/client';
import { z } from 'zod';

import { UpdateCard } from '@/actions/update-card/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof UpdateCard>;
export type ReturnType = ActionState<InputType, Card>;
