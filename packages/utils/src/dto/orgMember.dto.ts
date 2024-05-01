import { IsUUID } from "class-validator";

export class GetOrgMemberDto {
  @IsUUID()
  memberId: string;

  @IsUUID()
  orgId: string;
}

export class RemoveOrgMemberDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  memberId: string;

  @IsUUID()
  orgId: string;
}
