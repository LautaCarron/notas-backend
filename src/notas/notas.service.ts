import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JsonDb } from '../database/json-db';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Nota } from './entities/nota.entity';

@Injectable()
export class NotasService {
  constructor(private readonly db: JsonDb) {}

  create(dto: CreateNotaDto): Promise<Nota> {
    return this.db.update((data) => {
      const nota: Nota = {
        id: randomUUID(),
        titulo: dto.titulo,
        texto: dto.texto,
        color: dto.color,
        min: dto.min,
      };
      data.notas.push(nota);
      return nota;
    });
  }

  async findAll(): Promise<Nota[]> {
    const data = await this.db.read();
    return [...data.notas];
  }

  async findOne(id: string): Promise<Nota> {
    const data = await this.db.read();
    const nota = data.notas.find((item) => item.id === id);
    if (!nota) throw new NotFoundException('Nota no encontrada');
    return nota;
  }

  update(id: string, dto: UpdateNotaDto): Promise<Nota> {
    return this.db.update((data) => {
      const nota = data.notas.find((item) => item.id === id);
      if (!nota) throw new NotFoundException('Nota no encontrada');

      if (dto.titulo !== undefined) nota.titulo = dto.titulo;
      if (dto.texto !== undefined) nota.texto = dto.texto;
      if (dto.color !== undefined) nota.color = dto.color;
      if (dto.min !== undefined) nota.min = dto.min;
      return nota;
    });
  }

  remove(id: string): Promise<{ mensaje: string; id: string }> {
    return this.db.update((data) => {
      const index = data.notas.findIndex((item) => item.id === id);
      if (index === -1) throw new NotFoundException('Nota no encontrada');
      data.notas.splice(index, 1);
      return { mensaje: 'Nota eliminada', id };
    });
  }
}
