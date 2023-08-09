import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Todo.name,
        schema: TodoSchema,
      },
    ]),
    ConfigModule,

    // Инициализируем подключение к Auth-серверу
    // Используем HttpModule.registerAsync, чтобы получить доступ к ConfigService
    HttpModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.getOrThrow<string>('AUTH_SERVER_URI'),
      }),
    }),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
