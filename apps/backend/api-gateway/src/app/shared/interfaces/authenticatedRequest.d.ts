import { TokenPayloadDto } from 'tasktime-utils';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: TokenPayloadDto;
}
