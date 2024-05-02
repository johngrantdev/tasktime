import { TokenPayloadDto } from 'tasktime-utils';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: TokenPayloadDto;
}
