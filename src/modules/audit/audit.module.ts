import { RepositoriesModule } from '@/app.repositories.module';
import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [AuditController],
})
export class AuditModule {}
