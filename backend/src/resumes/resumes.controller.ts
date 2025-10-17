import { Controller, Get, Post, Put, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

/**
 * Resumes Controller
 * Manages resume creation, updates, and auto-generation
 */
@ApiTags('Resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ApiOperation({ summary: 'Create or initialize resume' })
  @ApiResponse({
    status: 201,
    description: 'Resume created successfully',
  })
  async create(
    @CurrentUser() user: any,
    @Body() createResumeDto: CreateResumeDto,
  ) {
    return this.resumesService.create(user.id, createResumeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user resume' })
  @ApiResponse({
    status: 200,
    description: 'Resume retrieved successfully',
  })
  async findOne(@CurrentUser() user: any) {
    return this.resumesService.findOne(user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update resume' })
  @ApiResponse({
    status: 200,
    description: 'Resume updated successfully',
  })
  async update(
    @CurrentUser() user: any,
    @Body() updateResumeDto: UpdateResumeDto,
  ) {
    return this.resumesService.update(user.id, updateResumeDto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete resume' })
  @ApiResponse({
    status: 200,
    description: 'Resume deleted successfully',
  })
  async delete(@CurrentUser() user: any) {
    return this.resumesService.delete(user.id);
  }

  @Post('regenerate')
  @ApiOperation({
    summary: 'Regenerate resume from achievements (Auto-update)',
    description: 'Automatically updates resume based on all achievements, courses, internships, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Resume regenerated successfully',
  })
  async regenerate(@CurrentUser() user: any) {
    return this.resumesService.autoUpdateResumeFromAchievements(user.id);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export resume in different formats' })
  @ApiQuery({
    name: 'format',
    required: false,
    enum: ['json', 'pdf'],
    description: 'Export format',
  })
  @ApiResponse({
    status: 200,
    description: 'Resume exported successfully',
  })
  async export(
    @CurrentUser() user: any,
    @Query('format') format: 'json' | 'pdf' = 'json',
  ) {
    return this.resumesService.exportResume(user.id, format);
  }
}

