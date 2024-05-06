import { Injectable } from '@nestjs/common';
import { ListPositionsDTO } from './dto/list-positions.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  async findAll(query: ListPositionsDTO): Promise<Position[]> {
    console.log('PositionsService.findAll()', query);

    return [];
  }
}
