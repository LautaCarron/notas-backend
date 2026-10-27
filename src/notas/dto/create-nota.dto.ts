import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsHexColor,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateNotaDto {
  @ApiProperty({ example: 'Comprar pan' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  @MaxLength(80)
  titulo: string;

  @ApiProperty({ example: 'Descansar 18 minutos' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty({ message: 'El texto es obligatorio' })
  @MaxLength(500)
  texto: string;

  @ApiProperty({ example: '#ff5722', description: 'Color hexadecimal' })
  @IsHexColor({ message: 'El color debe ser hexadecimal' })
  color: string;

  @ApiProperty({ example: 15, minimum: 0, description: 'Minutos' })
  @IsInt({ message: 'Error de sintaxis' })
  @Min(0, { message: 'Error de sintaxis' })
  min: number;
}
