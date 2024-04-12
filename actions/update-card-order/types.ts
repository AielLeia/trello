import { Card } from '@prisma/client';
import { z } from 'zod';

import { UpdateCardOrder } from '@/actions/update-card-order/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof UpdateCardOrder>;
export type ReturnType = ActionState<InputType, Card[]>;
