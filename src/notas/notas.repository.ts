import { Injectable } from '@nestjs/common';
import { JsonDb } from '../database/json-db';
import { Nota } from './entities/nota.entity';

@Injectable()
export class NotasRepository {
  constructor(private readonly db: JsonDb) {}

  async findAll(): Promise<Nota[]> {
    const data = await this.db.read();
    return [...data.notas];
  }

  async findById(id: string): Promise<Nota | null> {
    const data = await this.db.read();
    const nota = data.notas.find((item) => item.id === id);
    return nota ?? null;
  }

  async create(nota: Nota): Promise<Nota> {
    return this.db.update((data) => {
      data.notas.push(nota);
      return nota;
    });
  }

  async update(id: string, partial: Partial<Nota>): Promise<Nota | null> {
    return this.db.update((data) => {
      const nota = data.notas.find((item) => item.id === id);
      if (!nota) return null;

      if (partial.titulo !== undefined) nota.titulo = partial.titulo;
      if (partial.texto !== undefined) nota.texto = partial.texto;
      if (partial.color !== undefined) nota.color = partial.color;
      if (partial.min !== undefined) nota.min = partial.min;

      return nota;
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.db.update((data) => {
      const index = data.notas.findIndex((item) => item.id === id);
      if (index === -1) return false;
      data.notas.splice(index, 1);
      return true;
    });
  }
}
