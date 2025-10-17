import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';

/**
 * Integrations Service
 * Handles webhooks from external platforms and syncs achievements
 */
@Injectable()
export class IntegrationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Process incoming webhook from external platform
   * Automatically creates achievement and updates resume
   */
  async processWebhook(webhookPayload: WebhookPayloadDto) {
    // Log webhook
    const log = await this.prisma.webhookLog.create({
      data: {
        platform: webhookPayload.platform,
        eventType: webhookPayload.eventType,
        payload: webhookPayload as any,
        status: 'pending',
      },
    });

    try {
      // Find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: webhookPayload.userEmail },
      });

      if (!user) {
        await this.updateWebhookLog(log.id, 'failed', 'User not found');
        throw new NotFoundException('User not found');
      }

      // Process based on event type
      let achievement;
      switch (webhookPayload.eventType) {
        case 'course_completed':
          achievement = await this.handleCourseCompleted(user.id, webhookPayload);
          break;

        case 'internship_completed':
          achievement = await this.handleInternshipCompleted(user.id, webhookPayload);
          break;

        case 'hackathon_participated':
          achievement = await this.handleHackathonParticipation(user.id, webhookPayload);
          break;

        case 'project_published':
          achievement = await this.handleProjectPublished(user.id, webhookPayload);
          break;

        case 'certification_earned':
          achievement = await this.handleCertificationEarned(user.id, webhookPayload);
          break;

        default:
          await this.updateWebhookLog(log.id, 'failed', 'Unknown event type');
          throw new BadRequestException('Unknown event type');
      }

      // Update webhook log to success
      await this.updateWebhookLog(log.id, 'success');

      return {
        success: true,
        message: 'Webhook processed successfully',
        achievement,
        resumeUpdated: true,
      };
    } catch (error) {
      await this.updateWebhookLog(log.id, 'failed', error.message);
      throw error;
    }
  }

  /**
   * Handle course completion
   */
  private async handleCourseCompleted(userId: string, payload: WebhookPayloadDto) {
    const { data } = payload;

    return this.prisma.achievement.create({
      data: {
        userId,
        type: 'COURSE',
        title: data.courseName || 'Course Completion',
        description: data.description || 'Successfully completed course',
        organization: data.platform || payload.platform,
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        endDate: data.endDate ? new Date(data.endDate) : new Date(),
        duration: data.duration || 'N/A',
        certificateUrl: data.certificateUrl,
        verificationUrl: data.verificationUrl,
        isVerified: true,
        verifiedBy: payload.platform,
        verifiedAt: new Date(),
        skills: data.skills || [],
        highlights: data.highlights || [],
        grade: data.grade,
      },
    });
  }

  /**
   * Handle internship completion
   */
  private async handleInternshipCompleted(userId: string, payload: WebhookPayloadDto) {
    const { data } = payload;

    return this.prisma.achievement.create({
      data: {
        userId,
        type: 'INTERNSHIP',
        title: data.title || 'Internship',
        description: data.description || 'Completed internship',
        organization: data.company || 'Company',
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        duration: data.duration,
        isVerified: true,
        verifiedBy: payload.platform,
        verifiedAt: new Date(),
        skills: data.skills || [],
        highlights: data.responsibilities || [],
      },
    });
  }

  /**
   * Handle hackathon participation
   */
  private async handleHackathonParticipation(userId: string, payload: WebhookPayloadDto) {
    const { data } = payload;

    return this.prisma.achievement.create({
      data: {
        userId,
        type: 'HACKATHON',
        title: data.hackathonName || 'Hackathon Participation',
        description: data.description || 'Participated in hackathon',
        organization: data.organizer || payload.platform,
        location: data.location,
        startDate: new Date(data.date || data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        duration: data.duration || '48 hours',
        isVerified: true,
        verifiedBy: payload.platform,
        verifiedAt: new Date(),
        position: data.position || data.rank,
        projectUrl: data.projectUrl,
        skills: data.skills || [],
        highlights: data.achievements || [],
      },
    });
  }

  /**
   * Handle project publication
   */
  private async handleProjectPublished(userId: string, payload: WebhookPayloadDto) {
    const { data } = payload;

    return this.prisma.achievement.create({
      data: {
        userId,
        type: 'PROJECT',
        title: data.projectName || 'Project',
        description: data.description || 'Published project',
        organization: data.platform || payload.platform,
        startDate: new Date(data.startDate || new Date()),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isVerified: true,
        verifiedBy: payload.platform,
        verifiedAt: new Date(),
        projectUrl: data.projectUrl || data.githubUrl,
        skills: data.technologies || data.skills || [],
        highlights: data.features || [],
      },
    });
  }

  /**
   * Handle certification earned
   */
  private async handleCertificationEarned(userId: string, payload: WebhookPayloadDto) {
    const { data } = payload;

    return this.prisma.achievement.create({
      data: {
        userId,
        type: 'CERTIFICATION',
        title: data.certificationName || 'Certification',
        description: data.description || 'Earned certification',
        organization: data.issuer || payload.platform,
        startDate: data.issueDate ? new Date(data.issueDate) : new Date(),
        endDate: data.expiryDate ? new Date(data.expiryDate) : null,
        certificateUrl: data.certificateUrl,
        verificationUrl: data.verificationUrl,
        isVerified: true,
        verifiedBy: payload.platform,
        verifiedAt: new Date(),
        skills: data.skills || [],
      },
    });
  }

  /**
   * Update webhook log status
   */
  private async updateWebhookLog(logId: string, status: string, errorMsg?: string) {
    return this.prisma.webhookLog.update({
      where: { id: logId },
      data: {
        status,
        errorMsg,
        processedAt: new Date(),
      },
    });
  }

  /**
   * Get webhook logs
   */
  async getWebhookLogs(platform?: string, limit = 50) {
    return this.prisma.webhookLog.findMany({
      where: platform ? { platform } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get integration statistics
   */
  async getStats() {
    const totalWebhooks = await this.prisma.webhookLog.count();
    const successfulWebhooks = await this.prisma.webhookLog.count({
      where: { status: 'success' },
    });
    const failedWebhooks = await this.prisma.webhookLog.count({
      where: { status: 'failed' },
    });

    const byPlatform = await this.prisma.webhookLog.groupBy({
      by: ['platform'],
      _count: true,
    });

    return {
      total: totalWebhooks,
      successful: successfulWebhooks,
      failed: failedWebhooks,
      successRate: totalWebhooks > 0 ? (successfulWebhooks / totalWebhooks) * 100 : 0,
      byPlatform,
    };
  }
}

