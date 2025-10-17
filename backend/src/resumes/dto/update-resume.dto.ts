import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';

/**
 * DTO for updating a resume
 */
export class UpdateResumeDto {
  @ApiProperty({
    example: 'Software Engineer Resume',
    description: 'Resume title',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Experienced software engineer...',
    description: 'Resume summary',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({
    example: 'Seeking a challenging role...',
    description: 'Career objective',
    required: false,
  })
  @IsOptional()
  @IsString()
  objective?: string;

  @ApiProperty({
    example: { positions: [] },
    description: 'Work experience data',
    required: false,
  })
  @IsOptional()
  @IsObject()
  experience?: any;

  @ApiProperty({
    example: { degrees: [] },
    description: 'Education data',
    required: false,
  })
  @IsOptional()
  @IsObject()
  education?: any;

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

