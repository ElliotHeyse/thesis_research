namespace SilentAuction.Models;

public enum OperationStatus
{
    Success,
    NotFound,
    HasItems,
    Failed,
    ValidationError,
    NoSelection
}

public class OperationResult
{
    public OperationStatus Status { get; init; }
    public string? FlashCode { get; init; }
    public bool IsSuccess => Status == OperationStatus.Success;

    public static OperationResult Ok(string flashCode) =>
        new() { Status = OperationStatus.Success, FlashCode = flashCode };

    public static OperationResult Fail(OperationStatus status, string flashCode) =>
        new() { Status = status, FlashCode = flashCode };
}
