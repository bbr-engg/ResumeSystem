import { PartialType } from '@nestjs/swagger';
import { CreateAchievementDto } from './create-achievement.dto';

/**
 * DTO for updating an achievement
 */
export class UpdateAchievementDto extends PartialType(CreateAchievementDto) {}

