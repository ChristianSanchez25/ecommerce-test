import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOperation({ summary: 'Seed database' })
  @ApiResponse({
    status: 201,
    description: 'The database has been successfully seeded.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  async seed() {
    return await this.seedService.seed();
  }
}
