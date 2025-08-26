import { RepositoriesModule } from '@/app.repositories.module';
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';

@Module({
  imports: [RepositoriesModule],
  controllers: [WalletController],
})
export class WalletModule {}
