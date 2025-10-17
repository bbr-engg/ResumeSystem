import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Database Module
 * Global module that provides Prisma service to entire application
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}

