// extends the request object with the decoded JWT payload that is added by the jwt validation
import { IsEmail, IsNumber } from 'class-validator';

class UserData {
  @IsNumber()
  id: string;

  @IsEmail()
  email: string;
}

export class UserRequestDto {
  user: UserData;
}
