import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

/**
 * Achievements Controller
 * Manages achievements with automatic resume updates
 */
@ApiTags('Achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new achievement',
    description: 'Creates achievement and automatically updates resume',
  })
  @ApiResponse({
    status: 201,
    description: 'Achievement created and resume updated',
  })
  async create(
    @CurrentUser() user: any,
    @Body() createAchievementDto: CreateAchievementDto,
  ) {
    return this.achievementsService.create(user.id, createAchievementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['INTERNSHIP', 'COURSE', 'HACKATHON', 'PROJECT', 'CERTIFICATION', 'COMPETITION', 'WORKSHOP', 'VOLUNTEER'],
  })
  @ApiResponse({
    status: 200,
    description: 'Achievements retrieved successfully',
  })
  async findAll(
    @CurrentUser() user: any,
    @Query('type') type?: string,
  ) {
    return this.achievementsService.findAll(user.id, type);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get achievement statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats(@CurrentUser() user: any) {
    return this.achievementsService.getStats(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single achievement' })
  @ApiParam({ name: 'id', description: 'Achievement ID' })
  @ApiResponse({
    status: 200,
    description: 'Achievement retrieved successfully',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.achievementsService.findOne(id, user.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update achievement',
    description: 'Updates achievement and automatically updates resume',
  })
  @ApiParam({ name: 'id', description: 'Achievement ID' })
  @ApiResponse({
    status: 200,
    description: 'Achievement updated and resume refreshed',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementsService.update(id, user.id, updateAchievementDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete achievement',
    description: 'Deletes achievement and automatically updates resume',
  })
  @ApiParam({ name: 'id', description: 'Achievement ID' })
  @ApiResponse({
    status: 200,
    description: 'Achievement deleted and resume updated',
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
  ) {
    return this.achievementsService.delete(id, user.id);
  }
}

