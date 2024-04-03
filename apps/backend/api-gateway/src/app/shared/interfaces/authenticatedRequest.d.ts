import { TokenPayloadDto } from '@tasktime/dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: TokenPayloadDto;
}
