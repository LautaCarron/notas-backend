import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { AppModule } from '../src/app.module';

describe('Notas API (e2e)', () => {
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
    if (previousDataFile === undefined) {
      delete process.env.DATA_FILE;
    } else {
      process.env.DATA_FILE = previousDataFile;
    }
    await rm(directory, { recursive: true, force: true });
  });

  it('GET /api/notas devuelve una lista vacía al inicio', async () => {
    const respuesta = await fetch(`${baseUrl}/api/notas`);

    expect(respuesta.status).toBe(200);
    await expect(respuesta.json()).resolves.toEqual([]);
  });

  it('POST /api/notas crea una nota válida con status 201', async () => {
    const nuevaNota = {
      titulo: 'Aprobar Materia',
      texto: 'Estudiar sistemas distribuidos',
      color: '#22ff43',
      min: 10,
    };

    const respuesta = await fetch(`${baseUrl}/api/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaNota),
    });

    expect(respuesta.status).toBe(201);
    const data = await respuesta.json();
    expect(data).toMatchObject(nuevaNota);
    expect(data.id).toBeDefined();
  });

  it('POST /api/notas rechaza una nota inválida con status 400', async () => {
    const respuesta = await fetch(`${baseUrl}/api/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: '',
        texto: 'Texto sin título',
        color: 'no-es-hexadecimal',
        min: -5,
      }),
    });

    expect(respuesta.status).toBe(400);
  });

  it('GET /api/notas/:id obtiene la nota creada previamente', async () => {
    const crearRespuesta = await fetch(`${baseUrl}/api/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Nota para buscar',
        texto: 'Detalle de prueba',
        color: '#ffaa00',
        min: 20,
      }),
    });
    const creada = await crearRespuesta.json();

    const getRespuesta = await fetch(`${baseUrl}/api/notas/${creada.id}`);
    expect(getRespuesta.status).toBe(200);
    await expect(getRespuesta.json()).resolves.toEqual(creada);
  });

  it('DELETE /api/notas/:id elimina la nota creada', async () => {
    const crearRespuesta = await fetch(`${baseUrl}/api/notas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: 'Nota a borrar',
        texto: 'Se borrará',
        color: '#112233',
        min: 5,
      }),
    });
    const creada = await crearRespuesta.json();

    const delRespuesta = await fetch(`${baseUrl}/api/notas/${creada.id}`, {
      method: 'DELETE',
    });
    expect(delRespuesta.status).toBe(200);

    const getDespues = await fetch(`${baseUrl}/api/notas/${creada.id}`);
    expect(getDespues.status).toBe(404);
  });
});
