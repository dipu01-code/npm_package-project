export type SimpleStoreErrorCode =
  | "INVALID_KEY"
  | "UNSUPPORTED_VALUE"
  | "STORAGE_UNAVAILABLE"
  | "QUOTA_EXCEEDED"
  | "MALFORMED_DATA"
  | "SERIALIZATION_ERROR"
  | "UNKNOWN_ERROR";

export class SimpleStoreError extends Error {
  public readonly code: SimpleStoreErrorCode;
  public readonly original?: Error;

  constructor(
    message: string,
    code: SimpleStoreErrorCode = "UNKNOWN_ERROR",
    original?: Error
  ) {
    super(message);
    this.name = "SimpleStoreError";
    this.code = code;
    this.original = original;
    Object.setPrototypeOf(this, SimpleStoreError.prototype);
  }
}
