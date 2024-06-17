import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({ example: 400, description: 'Status code' })
  statusCode: number;

  @ApiProperty({
    example: '2021-08-15T20:00:00.000Z',
    description: 'Timestamp',
  })
  timestamp: string;

  @ApiProperty({ example: '/users', description: 'Path' })
  path: string;

  @ApiProperty({ example: 'Error message', description: 'Error message' })
  message: string;

  @ApiProperty({ example: 'ERROR_CODE', description: 'Error code' })
  code_error: string;
}
