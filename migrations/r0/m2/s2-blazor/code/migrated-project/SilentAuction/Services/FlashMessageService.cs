namespace SilentAuction.Services;

public enum FlashType
{
    Success,
    Error
}

public record FlashMessage(FlashType Type, string Key);

public class FlashMessageService
{
    private FlashMessage? _pending;

    private static readonly Dictionary<string, string> SuccessMessages = new()
    {
        ["created"] = "Record created successfully.",
        ["updated"] = "Record updated successfully.",
        ["deleted"] = "Record deleted successfully.",
        ["receipts_sent"] = "Tax receipts generated and donors marked as sent.",
        ["letters_generated"] = "Donor letters generated successfully."
    };

    private static readonly Dictionary<string, string> ErrorMessages = new()
    {
        ["has_items"] = "Cannot delete donor with associated items.",
        ["notfound"] = "Record not found.",
        ["delete_failed"] = "Failed to delete record.",
        ["invalid_id"] = "Invalid ID provided.",
        ["update_failed"] = "Failed to update record.",
        ["no_selection"] = "Please select at least one donor.",
        ["create_failed"] = "Failed to create record."
    };

    public void SetSuccess(string key) => _pending = new FlashMessage(FlashType.Success, key);

    public void SetError(string key) => _pending = new FlashMessage(FlashType.Error, key);

    public FlashMessage? Consume()
    {
        var message = _pending;
        _pending = null;
        return message;
    }

    public static string ResolveText(FlashMessage message)
    {
        return message.Type switch
        {
            FlashType.Success => SuccessMessages.GetValueOrDefault(message.Key, "Operation completed successfully."),
            FlashType.Error => ErrorMessages.GetValueOrDefault(message.Key, "An error occurred."),
            _ => "An error occurred."
        };
    }
}
