import { ApiProperty } from '@nestjs/swagger';

export class CreateSubSpaceDto {
  @ApiProperty({ description: '유저 ID' })
  userId: string;
  @ApiProperty({ description: '스페이스 이름' })
  subSpaceName: string;
  @ApiProperty({ description: '스페이스 이름' })
  parentContextNodeId: string;
}
