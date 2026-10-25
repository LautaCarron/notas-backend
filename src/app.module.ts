import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotasModule } from './notas/notas.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), NotasModule],
})
export class AppModule {}