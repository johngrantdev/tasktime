import { IsUUID } from "class-validator";

export class GetOrgMemberDto {
  @IsUUID()
  memberId = "";

  @IsUUID()
  orgId = "";
}

export class RemoveOrgMemberDto {
  @IsUUID()
  userId = "";

  @IsUUID()
  memberId = "";

  @IsUUID()
  orgId = "";
}
