import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Nota } from './entities/nota.entity';
import { NotasRepository } from './notas.repository';
import { NotasService } from './notas.service';

describe('NotasService (Unit Tests)', () => {
  let service: NotasService;
  let repository: jest.Mocked<NotasRepository>;

  const mockNota: Nota = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    titulo: 'Comprar pan',
    texto: 'Pasar por la panadería',
    color: '#ff5722',
    min: 15,
  };

  const createDto: CreateNotaDto = {
    titulo: 'Comprar pan',
    texto: 'Pasar por la panadería',
    color: '#ff5722',
    min: 15,
  };

  beforeEach(async () => {
    const mockRepo: Partial<jest.Mocked<NotasRepository>> = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotasService,
        {
          provide: NotasRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<NotasService>(NotasService);
    repository = module.get(NotasRepository);
  });

  describe('create', () => {
    it('debe crear una nota asignándole un ID y persistirla a través del repositorio', async () => {
      repository.create.mockImplementation(async (nota) => nota);

      const resultado = await service.create(createDto);

      expect(resultado).toBeDefined();
      expect(resultado.id).toBeDefined();
      expect(resultado.titulo).toBe(createDto.titulo);
      expect(resultado.texto).toBe(createDto.texto);
      expect(resultado.color).toBe(createDto.color);
      expect(resultado.min).toBe(createDto.min);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las notas provistas por el repositorio', async () => {
      repository.findAll.mockResolvedValue([mockNota]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([mockNota]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar una lista vacía si no hay notas', async () => {
      repository.findAll.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('debe retornar la nota si existe', async () => {
      repository.findById.mockResolvedValue(mockNota);

      const resultado = await service.findOne(mockNota.id);

      expect(resultado).toEqual(mockNota);
      expect(repository.findById).toHaveBeenCalledWith(mockNota.id);
    });

    it('debe lanzar NotFoundException si la nota no existe', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.findById).toHaveBeenCalledWith('id-inexistente');
    });
  });

  describe('update', () => {
    it('debe actualizar los campos de la nota si existe', async () => {
      const updateDto: UpdateNotaDto = { min: 30 };
      const notaActualizada: Nota = Object.assign(new Nota(), mockNota, {
        min: 30,
      });

      repository.findById.mockResolvedValue(mockNota);
      repository.update.mockResolvedValue(notaActualizada);

      const resultado = await service.update(mockNota.id, updateDto);

      expect(resultado).toEqual(notaActualizada);
      expect(repository.findById).toHaveBeenCalledWith(mockNota.id);
      expect(repository.update).toHaveBeenCalledWith(mockNota.id, updateDto);
    });

    it('debe lanzar NotFoundException si se intenta actualizar una nota inexistente', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('id-inexistente', { min: 30 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debe eliminar la nota y retornar mensaje de confirmación si existe', async () => {
      repository.findById.mockResolvedValue(mockNota);
      repository.delete.mockResolvedValue(true);

      const resultado = await service.remove(mockNota.id);

      expect(resultado).toEqual({
        mensaje: 'Nota eliminada',
        id: mockNota.id,
      });
      expect(repository.findById).toHaveBeenCalledWith(mockNota.id);
      expect(repository.delete).toHaveBeenCalledWith(mockNota.id);
    });

    it('debe lanzar NotFoundException si se intenta eliminar una nota inexistente', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
