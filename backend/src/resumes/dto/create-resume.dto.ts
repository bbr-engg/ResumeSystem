import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO for creating a resume
 */
export class CreateResumeDto {
  @ApiProperty({
    example: 'Software Engineer Resume',
    description: 'Resume title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Experienced software engineer with 5+ years in full-stack development...',
    description: 'Resume summary/bio',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    example: 'Seeking a challenging role in a dynamic tech company...',
    description: 'Career objective',
    required: false,
  })
  @IsOptional()
  @IsString()
  objective?: string;

  @ApiProperty({
    example: 'modern',
    description: 'Resume template style',
    required: false,
  })
  @IsOptional()
  @IsString()
  templateStyle?: string;

  @ApiProperty({
    example: false,
    description: 'Make resume publicly viewable',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

