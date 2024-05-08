import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { ResolverRegistryService } from './resolver-registry/resolver-registry.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, ResolverRegistryService],
})
export class PositionsModule {}
