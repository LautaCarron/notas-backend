import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { JsonDb } from '../database/json-db';
import { NotasService } from './notas.service';

describe('NotasService', () => {
  let directory: string;
  let service: NotasService;
  const previousDataFile = process.env.DATA_FILE;

  const notaEjemplo = {
    titulo: 'Comprar pan',
    texto: 'Pasar por la panadería',
    color: '#ff5722',
    min: 15,
  };

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'notas-'));
    process.env.DATA_FILE = join(directory, 'db.json');
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotasService, JsonDb],
    }).compile();
    service = module.get(NotasService);
  });

  afterEach(async () => {
    if (previousDataFile === undefined) delete process.env.DATA_FILE;
    else process.env.DATA_FILE = previousDataFile;
    await rm(directory, { recursive: true, force: true });
  });

  it('crea una nota con id generado', async () => {
    const nota = await service.create(notaEjemplo);

    expect(nota.id).toEqual(expect.any(String));
    expect(nota).toMatchObject(notaEjemplo);
    await expect(service.findAll()).resolves.toEqual([nota]);
  });

  it('devuelve una lista vacía si no hay notas', async () => {
    await expect(service.findAll()).resolves.toEqual([]);
  });

  it('encuentra una nota por id', async () => {
    const nota = await service.create(notaEjemplo);

    await expect(service.findOne(nota.id)).resolves.toEqual(nota);
  });

  it('no encuentra una nota inexistente', async () => {
    await expect(service.findOne('uuid-inexistente')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('modifica solo los campos enviados', async () => {
    const nota = await service.create(notaEjemplo);

    const actualizada = await service.update(nota.id, { min: 30 });

    expect(actualizada.min).toBe(30);
    expect(actualizada.titulo).toBe(notaEjemplo.titulo);
    await expect(service.findOne(nota.id)).resolves.toEqual(actualizada);
  });

  it('no modifica una nota inexistente', async () => {
    await expect(
      service.update('uuid-inexistente', { min: 30 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('elimina una nota', async () => {
    const nota = await service.create(notaEjemplo);

    await expect(service.remove(nota.id)).resolves.toEqual({
      mensaje: 'Nota eliminada',
      id: nota.id,
    });
    await expect(service.findAll()).resolves.toEqual([]);
  });

  it('no elimina una nota inexistente', async () => {
    await expect(service.remove('uuid-inexistente')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});