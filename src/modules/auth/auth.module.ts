import { RepositoriesModule } from '@/app.repositories.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [AuthController],
})
export class AuthModule {}
