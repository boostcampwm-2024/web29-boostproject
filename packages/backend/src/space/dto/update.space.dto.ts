import { ApiProperty } from '@nestjs/swagger';

export class UpdateSpaceDto {
  @ApiProperty({ description: '유저 ID' })
  userId: string;
  @ApiProperty({ description: '스페이스 이름' })
  spaceName: string;
  @ApiProperty({ description: 'Parent Space Id' })
  parentContextNodeId: string | null;
}
