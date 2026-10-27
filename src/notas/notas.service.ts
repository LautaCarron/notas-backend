import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Nota } from './entities/nota.entity';
import { NotasRepository } from './notas.repository';

@Injectable()
export class NotasService {
  constructor(private readonly repo: NotasRepository) {}

  async create(dto: CreateNotaDto): Promise<Nota> {
    const nota: Nota = {
      id: randomUUID(),
      titulo: dto.titulo,
      texto: dto.texto,
      color: dto.color,
      min: dto.min,
    };
    return this.repo.create(nota);
  }

  async findAll(): Promise<Nota[]> {
    return this.repo.findAll();
  }

  async findOne(id: string): Promise<Nota> {
    const nota = await this.repo.findById(id);
    if (!nota) {
      throw new NotFoundException(`Nota con id ${id} no encontrada`);
    }
    return nota;
  }

  async update(id: string, dto: UpdateNotaDto): Promise<Nota> {
    await this.findOne(id);
    const updated = await this.repo.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Nota con id ${id} no encontrada`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ mensaje: string; id: string }> {
    await this.findOne(id);
    await this.repo.delete(id);
    return { mensaje: 'Nota eliminada', id };
  }
}
