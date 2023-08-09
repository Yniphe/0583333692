import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { RequestAndUser } from '../types/Request';
import { Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as RequestAndUser;
    const authorization = request?.headers['authorization'];

    /**
     * Если нет заголовка authorization, то возвращаем ошибку
     */
    if (!authorization) {
      throw new HttpException({ error_message: 'No authorization token' }, 401);
    }

    /**
     * Проверяем токен
     */
    const {
      data: { id },
    } = await firstValueFrom(
      // Отправляем запрос на валидацию токена
      this.httpService.get('/user', { headers: { authorization } }).pipe(
        // Если токен не валидный, то возвращаем ошибку
        catchError(() =>
          Promise.reject(
            new HttpException({ error_message: 'Bad token' }, 403),
          ),
        ),
      ),
    );

    // Сохраняем id пользователя в объекте запроса
    request.user = new Types.ObjectId(id);

    return true;
  }
}
