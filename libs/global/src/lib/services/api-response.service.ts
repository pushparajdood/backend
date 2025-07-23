import { Injectable } from '@nestjs/common';

@Injectable()
export class LibAPIResponseService {
  async ApiFailResponse(message: string, success = false, data = null) {
    return {
      success,
      message,
      data,
    };
  }
  async ApiSuccessResponse(data: any, message?: string, success = true) {
    if (!message) {
      message = 'Success';
    }
    return {
      success,
      message,
      data,
    };
  }
}
