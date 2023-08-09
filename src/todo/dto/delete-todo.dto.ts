import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DeleteTodoDto {
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
