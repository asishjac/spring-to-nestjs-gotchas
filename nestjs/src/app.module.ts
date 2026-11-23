import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from './01-transactions/transactions.module';
import { OrderModule } from './02-modules/order.module';
import { RequestScopeModule } from './03-request-scope/request-scope.module';
import { ValidationModule } from './04-validation/validation.module';

@Module({
  imports: [
    // In-memory SQLite: every app start (and every test) begins with an empty database.
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TransactionsModule,
    OrderModule,
    RequestScopeModule,
    ValidationModule,
  ],
})
export class AppModule {}
