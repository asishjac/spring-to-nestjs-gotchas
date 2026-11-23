import { INestApplication, ValidationPipe } from '@nestjs/common';

// Shared by main.ts and the e2e tests so both run the app the same way.
export function configureApp(app: INestApplication, opts: { validation: boolean }) {
  if (opts.validation) {
    app.useGlobalPipes(new ValidationPipe());
  }
}
