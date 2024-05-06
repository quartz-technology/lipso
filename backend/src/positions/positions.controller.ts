import { Controller, Get, Query } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { ListPositionsDTO } from './dto/list-positions.dto';
import { Position } from './entities/position.entity';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll(@Query() query: ListPositionsDTO): Promise<Position[]> {
    return this.positionsService.findAll(query);
  }
}
