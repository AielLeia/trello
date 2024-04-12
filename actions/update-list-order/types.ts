import { List } from '@prisma/client';
import { z } from 'zod';

import { UpdateListOrder } from '@/actions/update-list-order/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof UpdateListOrder>;
export type ReturnType = ActionState<InputType, List[]>;
