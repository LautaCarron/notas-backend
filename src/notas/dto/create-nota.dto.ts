import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateNotaDto {
  @ApiProperty({
    example: 'Comprar pan',
    description: 'Título de la nota (no puede estar vacío)',
    maxLength: 80,
  })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(80, { message: 'El título no puede superar los 80 caracteres' })
  titulo: string;

  @ApiProperty({
    example: 'Pasar por la panadería a la vuelta',
    description: 'Texto o cuerpo de la nota',
    maxLength: 500,
  })
  @IsString({ message: 'El texto debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El texto es obligatorio' })
  @MaxLength(500, { message: 'El texto no puede superar los 500 caracteres' })
  texto: string;

  @ApiProperty({
    example: '#ff5722',
    description: 'Color hexadecimal de la nota',
  })
  @IsHexColor({ message: 'El color debe ser un código hexadecimal válido (ej. #ff5722)' })
  color: string;

  @ApiProperty({
    example: 15,
    minimum: 0,
    description: 'Minutos de validez de la nota (debe ser mayor o igual a 0)',
  })
  @IsInt({ message: 'Los minutos deben ser un número entero' })
  @Min(0, { message: 'Los minutos deben ser mayores o iguales a 0' })
  min: number;
}
