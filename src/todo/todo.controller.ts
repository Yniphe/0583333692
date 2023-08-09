import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { RequestAndUser } from '../types/Request';
import { DeleteTodoDto } from './dto/delete-todo.dto';

@UseGuards(AuthGuard)
@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post('/create')
  async create(@Req() req: RequestAndUser, @Body() payload: CreateTodoDto) {
    return this.todoService.create(req.user, payload);
  }

  @Get('/get')
  async list(@Req() req: RequestAndUser) {
    return this.todoService.getAllByUserId(req.user);
  }

  @Delete('/delete')
  async delete(@Req() req: RequestAndUser, @Body() payload: DeleteTodoDto) {
    return this.todoService.delete(req.user, payload);
  }
}
