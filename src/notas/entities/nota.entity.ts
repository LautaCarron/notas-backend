import { ApiProperty } from '@nestjs/swagger';

export class Nota {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Identificador único UUID de la nota',
  })
  id: string;

  @ApiProperty({
    example: 'Comprar pan',
    description: 'Título de la nota adhesiva',
  })
  titulo: string;

  @ApiProperty({
    example: 'Pasar por la panadería a la vuelta',
    description: 'Contenido o descripción de la nota',
  })
  texto: string;

  @ApiProperty({
    example: '#ff5722',
    description: 'Color de fondo en formato hexadecimal (#RRGGBB)',
  })
  color: string;

  @ApiProperty({
    example: 15,
    description: 'Minutos de validez antes de la notificación',
  })
  min: number;
}
