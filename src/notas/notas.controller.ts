import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Nota } from './entities/nota.entity';
import { NotasService } from './notas.service';

@ApiTags('notas')
@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva nota adhesiva' })
  @ApiResponse({ status: 201, description: 'Nota creada con éxito.', type: Nota })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  create(@Body() dto: CreateNotaDto) {
    return this.notasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las notas adhesivas' })
  @ApiResponse({ status: 200, description: 'Lista de notas obtenida con éxito.', type: [Nota] })
  findAll() {
    return this.notasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una nota por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la nota' })
  @ApiResponse({ status: 200, description: 'Nota encontrada.', type: Nota })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.notasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar parcialmente una nota existente' })
  @ApiParam({ name: 'id', description: 'UUID de la nota' })
  @ApiResponse({ status: 200, description: 'Nota actualizada.', type: Nota })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNotaDto) {
    return this.notasService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una nota' })
  @ApiParam({ name: 'id', description: 'UUID de la nota' })
  @ApiResponse({ status: 200, description: 'Nota eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Nota no encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.notasService.remove(id);
  }
}
