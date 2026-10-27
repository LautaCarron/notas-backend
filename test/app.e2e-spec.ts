import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AppModule } from '../src/app.module';

describe('Notas (e2e)', () => {
  let app: INestApplication;
  let directory: string;
  let baseUrl: string;
  const previousDataFile = process.env.DATA_FILE;

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'notas-e2e-'));
    process.env.DATA_FILE = join(directory, 'db.json');

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.listen(0);
    baseUrl = await app.getUrl();
  });

  afterAll(async () => {
    await app.close();
    if (previousDataFile === undefined) delete process.env.DATA_FILE;
    else process.env.DATA_FILE = previousDataFile;
    await rm(directory, { recursive: true, force: true });
  });

  it('GET /api/notas devuelve una lista vacía al inicio', async () => {
    const respuesta = await fetch(`${baseUrl}/api/notas`);

    expect(respuesta.status).toBe(200);
    await expect(respuesta.json()).resolves.toEqual([]);
  });

  it('POST /api/notas crea una nota válida', async () => {
    const respuesta = await fetch(`${baseUrl}/api/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Aprobar Materia',
        texto: 'Que me ayude la IA',
        color: '#22ff43',
        min: 10,
      }),
    });

    expect(respuesta.status).toBe(201);
    await expect(respuesta.json()).resolves.toMatchObject({
      titulo: 'Comprar pan',
      min: 15,
    });
  });

  it('POST /api/notas rechaza una nota inválida con 400', async () => {
    const respuesta = await fetch(`${baseUrl}/api/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: '',
        texto: 'prueba',
        color: 'amarillo',
        min: -5,
      }),
    });

    expect(respuesta.status).toBe(400);
  });
});