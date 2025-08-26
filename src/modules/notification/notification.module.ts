import { RepositoriesModule } from '@/app.repositories.module';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
