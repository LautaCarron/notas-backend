import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { NotasController } from './notas.controller';
import { NotasRepository } from './notas.repository';
import { NotasService } from './notas.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NotasController],
  providers: [NotasService, NotasRepository],
  exports: [NotasService, NotasRepository],
})
export class NotasModule {}
