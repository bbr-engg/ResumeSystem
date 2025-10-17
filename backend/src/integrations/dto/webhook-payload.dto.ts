import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsEnum, IsOptional } from 'class-validator';

enum Platform {
  LINKEDIN = 'linkedin',
  GITHUB = 'github',
  COURSERA = 'coursera',
  UDEMY = 'udemy',
  HACKERRANK = 'hackerrank',
  LEETCODE = 'leetcode',
  OTHER = 'other',
}

/**
 * DTO for webhook payload from external platforms
 */
export class WebhookPayloadDto {
  @ApiProperty({
    enum: Platform,
    example: 'coursera',
    description: 'Platform sending the webhook',
  })
  @IsEnum(Platform)
  platform: Platform;

  @ApiProperty({
    example: 'course_completed',
    description: 'Event type',
  })
  @IsString()
  eventType: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email to identify the user',
  })
  @IsString()
  userEmail: string;

  @ApiProperty({
    example: { courseId: '123', courseName: 'Advanced TypeScript' },
    description: 'Event data',
  })
  @IsObject()
  data: any;

  @ApiProperty({
    example: 'abc123verifytoken',
    description: 'Verification token for security',
    required: false,
  })
  @IsOptional()
  @IsString()
  verificationToken?: string;
}

