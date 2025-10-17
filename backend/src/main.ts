import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstrap function
 * Initializes NestJS application with Swagger documentation
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // Configure appropriately for production
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Resume System API')
    .setDescription(
      'Auto-updating resume ecosystem that integrates with internships, courses, hackathons, and projects.\n\n' +
      '## Key Features\n' +
      '- 🔐 JWT Authentication\n' +
      '- 👤 User Profile Management\n' +
      '- 📄 Auto-updating Resumes\n' +
      '- 🏆 Achievement Tracking (Internships, Courses, Hackathons, Projects)\n' +
      '- 🔗 External Platform Webhooks\n' +
      '- ✅ Verification System\n\n' +
      '## How It Works\n' +
      '1. User registers and creates profile\n' +
      '2. Add achievements (internships, courses, hackathons)\n' +
      '3. Resume automatically updates in real-time\n' +
      '4. External platforms can send webhooks to auto-add achievements\n' +
      '5. Export resume in various formats',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User registration and login')
    .addTag('Users', 'User profile management')
    .addTag('Resumes', 'Resume management and auto-generation')
    .addTag('Achievements', 'Track internships, courses, hackathons, projects')
    .addTag('Integrations & Webhooks', 'External platform integrations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Resume System API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('\n========================================');
  console.log('🚀 Resume System Backend Started!');
  console.log('========================================');
  console.log(`📍 Server: http://localhost:${port}`);
  console.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  console.log(`🔗 API Base: http://localhost:${port}/api/v1`);
  console.log('========================================\n');
}

bootstrap();
