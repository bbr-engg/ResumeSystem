import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';
import { WebhookPayloadDto } from './dto/webhook-payload.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

/**
 * Integrations Controller
 * Handles webhooks from external platforms
 */
@ApiTags('Integrations & Webhooks')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Public()
  @Post('webhook')
  @ApiOperation({
    summary: 'Receive webhook from external platforms',
    description: 'Processes webhook and automatically creates achievement + updates resume',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  async processWebhook(@Body() webhookPayload: WebhookPayloadDto) {
    return this.integrationsService.processWebhook(webhookPayload);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('webhook-logs')
  @ApiOperation({ summary: 'Get webhook logs (Admin/Debug)' })
  @ApiQuery({
    name: 'platform',
    required: false,
    description: 'Filter by platform',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Limit number of results',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook logs retrieved successfully',
  })
  async getWebhookLogs(
    @Query('platform') platform?: string,
    @Query('limit') limit?: number,
  ) {
    return this.integrationsService.getWebhookLogs(platform, limit);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  @ApiOperation({ summary: 'Get integration statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStats() {
    return this.integrationsService.getStats();
  }
}

