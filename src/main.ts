import { LazyModuleLoader, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const lazyModuleLoader = app.get(LazyModuleLoader);

  const config = new DocumentBuilder()
    .setTitle('twitter Clone Api')
    .setDescription('The Real World Api description')
    .setVersion('1.0')
    .addTag('Twitter clone')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
bootstrap();
