import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './configure-app';

async function bootstrap() {
  // Nest's default is NO global validation. Opt in with VALIDATION=on (see 04-validation).
  const validation = process.env.VALIDATION === 'on';
  const app = await NestFactory.create(AppModule);
  configureApp(app, { validation });
  await app.listen(3000);
  console.log(`Listening on http://localhost:3000 (ValidationPipe ${validation ? 'ON' : 'OFF'})`);
}
bootstrap();
