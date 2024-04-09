import { Board } from '@prisma/client';
import { z } from 'zod';

import { CreateBoard } from '@/actions/create-board/schema';

import { ActionState } from '@/lib/create-safe-action';

export type InputType = z.infer<typeof CreateBoard>;
export type ReturnType = ActionState<InputType, Board>;
