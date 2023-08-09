import { type Request } from '@nestjs/common';
import { Types } from 'mongoose';

export type RequestAndUser = Request & { user: Types.ObjectId };
