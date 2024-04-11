import { List } from '@prisma/client';
import { z } from 'zod';

import { DeleteList } from '@/actions/delete-list/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;
