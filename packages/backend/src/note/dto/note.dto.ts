import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ description: '유저 ID' })
  userId: string;
  @ApiProperty({ description: '노트 제목' })
  noteName: string;
}
