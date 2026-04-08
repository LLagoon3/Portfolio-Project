/**
 * 모든 성공 응답의 공통 envelope.
 * ResponseInterceptor 가 컨트롤러 반환값을 이 구조로 감싼다.
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * 모든 실패 응답의 공통 envelope.
 * HttpExceptionFilter 가 예외를 이 구조로 직렬화한다.
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    statusCode: number;
    message: string;
    path: string;
    timestamp: string;
  };
}
