import { RepositoriesModule } from '@/app.repositories.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [UserController],
})
export class UserModule {}
