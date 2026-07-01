export class BackendApiError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code = "BACKEND_ERROR", status?: number) {
    super(message);
    this.name = "BackendApiError";
    this.code = code;
    this.status = status;
  }
}

export function getReadableApiError(error: unknown) {
  if (error instanceof BackendApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
