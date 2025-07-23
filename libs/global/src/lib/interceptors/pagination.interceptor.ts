import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Assume data is an object containing items and pagination info
        const { items, totalItems, currentPage, itemsPerPage } = data;

        return {
          status_code: context.switchToHttp().getResponse().statusCode,
          message: 'Request was successful',
          pagination: {
            totalItems,
            currentPage,
            itemsPerPage,
            totalPages: Math.ceil(totalItems / itemsPerPage),
          },
          data: items, // Actual data array
        };
      })
    );
  }
}
