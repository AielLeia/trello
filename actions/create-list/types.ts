import { List } from '@prisma/client';
import { z } from 'zod';

import { CreateList } from '@/actions/create-list/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof CreateList>;
export type ReturnType = ActionState<InputType, List>;
