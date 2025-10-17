import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray, IsDateString, IsUrl } from 'class-validator';

enum AchievementType {
  INTERNSHIP = 'INTERNSHIP',
  COURSE = 'COURSE',
  HACKATHON = 'HACKATHON',
  PROJECT = 'PROJECT',
  CERTIFICATION = 'CERTIFICATION',
  COMPETITION = 'COMPETITION',
  WORKSHOP = 'WORKSHOP',
  VOLUNTEER = 'VOLUNTEER',
}

/**
 * DTO for creating an achievement
 */
export class CreateAchievementDto {
  @ApiProperty({
    enum: AchievementType,
    example: 'INTERNSHIP',
    description: 'Type of achievement',
  })
  @IsEnum(AchievementType)
  type: AchievementType;

  @ApiProperty({
    example: 'Software Engineering Intern',
    description: 'Achievement title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Developed full-stack web applications using React and Node.js',
    description: 'Detailed description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Google Inc.',
    description: 'Company, university, or platform name',
  })
  @IsString()
  organization: string;

  @ApiProperty({
    example: 'Mountain View, CA',
    description: 'Location',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Start date',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2024-06-01',
    description: 'End date (optional for ongoing)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    example: '6 months',
    description: 'Duration',
    required: false,
  })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiProperty({
    example: 'https://example.com/certificate.pdf',
    description: 'Certificate URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  certificateUrl?: string;

  @ApiProperty({
    example: 'https://verify.example.com/123',
    description: 'Verification URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  verificationUrl?: string;

  @ApiProperty({
    example: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    description: 'Skills learned or used',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({
    example: ['Built 3 production apps', 'Improved performance by 40%'],
    description: 'Key achievements or responsibilities',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  highlights?: string[];

  @ApiProperty({
    example: 'A+',
    description: 'Grade (for courses)',
    required: false,
  })
  @IsOptional()
  @IsString()
  grade?: string;

  @ApiProperty({
    example: '1st Place',
    description: 'Position (for competitions)',
    required: false,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({
    example: 'https://github.com/user/project',
    description: 'Project URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  projectUrl?: string;
}

