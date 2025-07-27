import { ExecutionContext } from '@nestjs/common';
import { CredentialsEnum } from '@src/common/constants/auth';

export class UnitTestUtils {
  static createMockContext = (
    token: string = '',
    includeCookies = true,
    includeHeaders = true,
  ): ExecutionContext => {
    const cookies: Record<string, string> = {};
    const headers: Record<string, string> = {};
    if (token && includeCookies) {
      cookies[CredentialsEnum.tokenKey] = token;
    }
    if (token && includeHeaders) {
      headers['authorization'] = `Bearer ${token}`;
    }
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          cookies,
          headers,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  static sleepTest = async (ms: number = 0) =>
    await new Promise((resolve) => setTimeout(resolve, ms));
}
