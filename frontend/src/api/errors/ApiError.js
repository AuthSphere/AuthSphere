/**
 * Standardized API Error for AuthSphere Frontend.
 * Preserves HTTP status codes, application error codes, and response data
 * without breaking compatibility or stripping diagnostic information.
 */
export class ApiError extends Error {
  constructor(
    message,
    { status = 500, code = "UNKNOWN_ERROR", data = null, cause = null } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
    this.cause = cause;
  }

  /**
   * Factory method to construct an ApiError from an Axios rejection
   */
  static fromAxios(error) {
    if (!error) {
      return new ApiError("An unknown network error occurred");
    }

    if (error instanceof ApiError) {
      return error;
    }

    const response = error.response;
    const responseData = response?.data;
    const status = response?.status || 500;
    const code =
      responseData?.error_code || responseData?.code || `HTTP_${status}`;
    const message = responseData?.message || error.message || "Request failed";

    return new ApiError(message, {
      status,
      code,
      data: responseData,
      cause: error,
    });
  }
}

export default ApiError;
