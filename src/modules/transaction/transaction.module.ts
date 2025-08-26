import { RepositoriesModule } from '@/app.repositories.module';
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [TransactionController],
})
export class TransactionModule {}
