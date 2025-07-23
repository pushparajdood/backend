import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenBlacklistService {
  private readonly blackListedTokens = new Set<string>();

  addToken(token: string) {
    this.blackListedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blackListedTokens.has(token);
  }
}
