import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

/**
 * Achievements Service
 * Manages achievements and automatically updates resume when changes occur
 */
@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new achievement
   * AUTOMATICALLY TRIGGERS RESUME UPDATE
   */
  async create(userId: string, createAchievementDto: CreateAchievementDto) {
    // Create achievement
    const achievement = await this.prisma.achievement.create({
      data: {
        userId,
        type: createAchievementDto.type,
        title: createAchievementDto.title,
        description: createAchievementDto.description,
        organization: createAchievementDto.organization,
        location: createAchievementDto.location,
        startDate: new Date(createAchievementDto.startDate),
        endDate: createAchievementDto.endDate ? new Date(createAchievementDto.endDate) : null,
        duration: createAchievementDto.duration,
        certificateUrl: createAchievementDto.certificateUrl,
        verificationUrl: createAchievementDto.verificationUrl,
        skills: createAchievementDto.skills || [],
        highlights: createAchievementDto.highlights || [],
        grade: createAchievementDto.grade,
        position: createAchievementDto.position,
        projectUrl: createAchievementDto.projectUrl,
      },
    });

    // Auto-add skills to user's skill list
    if (createAchievementDto.skills && createAchievementDto.skills.length > 0) {
      await this.autoAddSkills(userId, createAchievementDto.skills);
    }

    // 🔥 AUTO-UPDATE RESUME
    await this.triggerResumeUpdate(userId);

    return achievement;
  }

  /**
   * Get all achievements for a user
   */
  async findAll(userId: string, type?: string) {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    return this.prisma.achievement.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * Get single achievement
   */
  async findOne(id: string, userId: string) {
    const achievement = await this.prisma.achievement.findFirst({
      where: { id, userId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    return achievement;
  }

  /**
   * Update achievement
   * AUTOMATICALLY TRIGGERS RESUME UPDATE
   */
  async update(id: string, userId: string, updateAchievementDto: UpdateAchievementDto) {
    await this.findOne(id, userId);

    const achievement = await this.prisma.achievement.update({
      where: { id },
      data: {
        ...updateAchievementDto,
        startDate: updateAchievementDto.startDate ? new Date(updateAchievementDto.startDate) : undefined,
        endDate: updateAchievementDto.endDate ? new Date(updateAchievementDto.endDate) : undefined,
      },
    });

    // Auto-add new skills
    if (updateAchievementDto.skills && updateAchievementDto.skills.length > 0) {
      await this.autoAddSkills(userId, updateAchievementDto.skills);
    }

    // 🔥 AUTO-UPDATE RESUME
    await this.triggerResumeUpdate(userId);

    return achievement;
  }

  /**
   * Delete achievement
   * AUTOMATICALLY TRIGGERS RESUME UPDATE
   */
  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.achievement.delete({
      where: { id },
    });

    // 🔥 AUTO-UPDATE RESUME
    await this.triggerResumeUpdate(userId);

    return { message: 'Achievement deleted successfully' };
  }

  /**
   * Verify an achievement
   * This can be called by external platforms via webhook
   */
  async verify(id: string, verifiedBy: string) {
    const achievement = await this.prisma.achievement.update({
      where: { id },
      data: {
        isVerified: true,
        verifiedBy,
        verifiedAt: new Date(),
      },
    });

    // 🔥 AUTO-UPDATE RESUME
    await this.triggerResumeUpdate(achievement.userId);

    return achievement;
  }

  /**
   * Get achievement statistics
   */
  async getStats(userId: string) {
    const achievements = await this.findAll(userId);

    const stats = {
      total: achievements.length,
      verified: achievements.filter((a) => a.isVerified).length,
      byType: {} as Record<string, number>,
      totalSkills: new Set<string>(),
    };

    achievements.forEach((achievement) => {
      // Count by type
      stats.byType[achievement.type] = (stats.byType[achievement.type] || 0) + 1;

      // Collect unique skills
      achievement.skills.forEach((skill) => stats.totalSkills.add(skill));
    });

    return {
      ...stats,
      totalSkills: stats.totalSkills.size,
      skills: Array.from(stats.totalSkills),
    };
  }

  /**
   * PRIVATE: Trigger resume update
   * This is the magic that auto-updates the resume!
   */
  private async triggerResumeUpdate(userId: string) {
    try {
      // Check if user has a resume
      const resume = await this.prisma.resume.findUnique({
        where: { userId },
      });

      // Get all achievements and skills
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          achievements: {
            orderBy: { startDate: 'desc' },
          },
          skills: {
            orderBy: { proficiency: 'desc' },
          },
        },
      });

      if (!user) return;

      // Generate experience and education from achievements
      const experience = this.generateExperience(user.achievements);
      const education = this.generateEducation(user.achievements);

      if (resume) {
        // Update existing resume
        await this.prisma.resume.update({
          where: { userId },
          data: {
            experience,
            education,
            lastGeneratedAt: new Date(),
          },
        });
      } else {
        // Create resume if it doesn't exist
        const summary = this.generateSummary(user);
        await this.prisma.resume.create({
          data: {
            userId,
            experience,
            education,
            summary,
            lastGeneratedAt: new Date(),
          },
        });
      }

      console.log(`✅ Auto-updated resume for user ${userId}`);
    } catch (error) {
      console.error('Error updating resume:', error);
    }
  }

  /**
   * PRIVATE: Auto-add skills from achievements
   */
  private async autoAddSkills(userId: string, skills: string[]) {
    for (const skillName of skills) {
      try {
        await this.prisma.skill.upsert({
          where: {
            userId_name: {
              userId,
              name: skillName,
            },
          },
          update: {},
          create: {
            userId,
            name: skillName,
            category: this.categorizeSkill(skillName),
            proficiency: 'INTERMEDIATE',
          },
        });
      } catch (error) {
        // Skill might already exist, continue
      }
    }
  }

  /**
   * PRIVATE: Categorize skill
   */
  private categorizeSkill(skillName: string): any {
    const skill = skillName.toLowerCase();

    if (['javascript', 'python', 'java', 'c++', 'typescript', 'go', 'rust'].some((s) => skill.includes(s))) {
      return 'PROGRAMMING';
    }
    if (['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express'].some((s) => skill.includes(s))) {
      return 'FRAMEWORK';
    }
    if (['mysql', 'postgresql', 'mongodb', 'redis', 'sql'].some((s) => skill.includes(s))) {
      return 'DATABASE';
    }
    if (['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins'].some((s) => skill.includes(s))) {
      return 'TOOLS';
    }

    return 'OTHER';
  }

  /**
   * PRIVATE: Generate experience section
   */
  private generateExperience(achievements: any[]) {
    const internships = achievements.filter((a) => a.type === 'INTERNSHIP' || a.type === 'VOLUNTEER');

    return {
      positions: internships.map((int) => ({
        title: int.title,
        company: int.organization,
        location: int.location,
        startDate: int.startDate,
        endDate: int.endDate,
        duration: int.duration,
        responsibilities: int.highlights,
        skills: int.skills,
        verified: int.isVerified,
      })),
    };
  }

  /**
   * PRIVATE: Generate education section
   */
  private generateEducation(achievements: any[]) {
    const courses = achievements.filter((a) => a.type === 'COURSE' || a.type === 'CERTIFICATION');

    return {
      degrees: courses.map((course) => ({
        degree: course.title,
        institution: course.organization,
        startDate: course.startDate,
        endDate: course.endDate,
        grade: course.grade,
        skills: course.skills,
        certificateUrl: course.certificateUrl,
        verified: course.isVerified,
      })),
    };
  }

  /**
   * PRIVATE: Generate summary
   */
  private generateSummary(user: any): string {
    const name = `${user.firstName} ${user.lastName}`;
    const { achievements } = user;

    const internshipCount = achievements.filter((a) => a.type === 'INTERNSHIP').length;
    const projectCount = achievements.filter((a) => a.type === 'PROJECT').length;
    const hackathonCount = achievements.filter((a) => a.type === 'HACKATHON').length;

    let summary = `${name} is a motivated professional with `;

    const parts: string[] = [];
    if (internshipCount > 0) parts.push(`${internshipCount} internship${internshipCount > 1 ? 's' : ''}`);
    if (projectCount > 0) parts.push(`${projectCount} project${projectCount > 1 ? 's' : ''}`);
    if (hackathonCount > 0) parts.push(`${hackathonCount} hackathon${hackathonCount > 1 ? 's' : ''}`);

    if (parts.length > 0) {
      summary += parts.join(', ') + ' completed.';
    } else {
      summary += 'a passion for learning and growth.';
    }

    return summary;
  }
}

