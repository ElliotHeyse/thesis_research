export class DbError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "DbError";
    if (cause) {
      this.cause = cause;
    }
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fieldErrors: Record<string, string>,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class BusinessRuleError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "BusinessRuleError";
  }
}
