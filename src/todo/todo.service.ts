import { HttpException, Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { DeleteTodoDto } from './dto/delete-todo.dto';
import { find } from 'rxjs';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<Todo>,
  ) {}

  async create(owner: Types.ObjectId, todo: CreateTodoDto) {
    const result = await this.todoModel.create({
      owner,
      title: todo.title,
      description: todo.description,
    });

    return {
      id: result._id,
    };
  }

  async getAllByUserId(owner: Types.ObjectId) {
    return this.todoModel
      .find({ owner }, { _id: 0, id: '$_id', title: 1, description: 1 })
      .lean();
  }

  async getOneById(id: string) {
    return this.todoModel.findById(id).lean();
  }

  async delete(owner: Types.ObjectId, payload: DeleteTodoDto) {
    const todoElement = await this.getOneById(payload.id);

    // как альтернативу можно использовать todoElement?.owner?.toString() и убрать проверку на количество удаленных,
    // то в таком случае если элемента нет, то будет ошибка 403

    // Проверяем, что пользователь не является владельцем туду
    if (todoElement && todoElement.owner.toString() !== owner.toString()) {
      // Если пользователь не является владельцем туду, то возвращаем ошибку
      throw new HttpException({ error_message: 'Is not an owner' }, 403);
    }

    const result = await this.todoModel
      .deleteOne({ owner, _id: payload.id }, { fields: { _id: 0, id: '$_id' } })
      .lean();

    // Если туду не найдено, то возвращаем ошибку
    if (result.deletedCount === 0) {
      throw new HttpException({ error_message: 'Todo not found' }, 404);
    }

    return {
      id: payload.id,
    };
  }
}
