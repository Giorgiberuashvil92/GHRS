import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // CORS კონფიგურაცია
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:3001', 'https://ghrs-mu.vercel.app', 'https://ghrs-backend.onrender.com', 'https://ghrsnew1.vercel.app, https://ghrs-mu.vercel.app , https://ghrrrs.vercel.app/'];
  
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? allowedOrigins
      : true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  });

  // უსაფრთხოების ჰედერები
  app.use((req, res, next) => {
    // Prevent clickjacking
    res.header('X-Frame-Options', 'DENY');
    
    // Prevent MIME type sniffing
    res.header('X-Content-Type-Options', 'nosniff');
    
    // Enable XSS protection
    res.header('X-XSS-Protection', '1; mode=block');
    
    // Restrict permissions
    res.header('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
    
    // Content Security Policy
    res.header('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.paypal.com https://www.paypalobjects.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://api-m.sandbox.paypal.com https://api.paypal.com; " +
      "frame-src 'self' https://www.paypal.com;"
    );
    
    // Referrer Policy
    res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  });

  // სტატიკური ფაილების მხარდაჭერა
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // ვალიდაციის pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // გლობალური API პრეფიქსი
  app.setGlobalPrefix('api');

  // Root endpoint for API info (before global prefix)
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req, res) => {
    res.json({
      message: 'GRS Backend API',
      version: '1.0.0',
      status: 'running',
      documentation: '/api/test',
      endpoints: {
        test: '/api/test',
        categories: '/api/categories',
        courses: '/api/courses',
        exercises: '/api/exercises',
        sets: '/api/sets',
        articles: '/api/articles',
        users: '/api/users',
      }
    });
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📚 API documentation: http://localhost:${port}/api/test`);
}
bootstrap();
