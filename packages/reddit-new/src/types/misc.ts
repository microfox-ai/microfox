import { z } from 'zod';
import * as schemas from '../schemas/misc';

export type GetScopes = z.infer<typeof schemas.getScopesSchema>; 