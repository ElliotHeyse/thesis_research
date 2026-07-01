using System.ComponentModel.DataAnnotations;
using SilentAuction.Models;

namespace SilentAuction.Validation;

public static class DonorValidator
{
    public static Dictionary<string, string> Validate(DonorFormModel model)
    {
        var errors = new Dictionary<string, string>();

        if ((model.BusinessName?.Length ?? 0) > 75)
            errors[nameof(model.BusinessName)] = "Business Name cannot exceed 75 characters.";

        if (string.IsNullOrWhiteSpace(model.ContactName))
            errors[nameof(model.ContactName)] = "Contact Name is required.";
        else if (model.ContactName.Length > 75)
            errors[nameof(model.ContactName)] = "Contact Name cannot exceed 75 characters.";

        if ((model.ContactTitle?.Length ?? 0) > 75)
            errors[nameof(model.ContactTitle)] = "Contact Title cannot exceed 75 characters.";

        if ((model.Address?.Length ?? 0) > 75)
            errors[nameof(model.Address)] = "Address cannot exceed 75 characters.";

        if ((model.City?.Length ?? 0) > 30)
            errors[nameof(model.City)] = "City cannot exceed 30 characters.";

        if ((model.State?.Length ?? 0) > 2)
            errors[nameof(model.State)] = "State cannot exceed 2 characters.";

        if ((model.ZipCode?.Length ?? 0) > 5)
            errors[nameof(model.ZipCode)] = "Zip Code cannot exceed 5 characters.";

        if (!string.IsNullOrWhiteSpace(model.ContactEmail))
        {
            if (model.ContactEmail.Length > 200)
                errors[nameof(model.ContactEmail)] = "Email cannot exceed 200 characters.";
            else if (!new EmailAddressAttribute().IsValid(model.ContactEmail))
                errors[nameof(model.ContactEmail)] = "Invalid email format.";
        }

        if (!string.IsNullOrWhiteSpace(model.ZipCode) && !model.ZipCode.All(char.IsDigit))
            errors[nameof(model.ZipCode)] = "Zip Code must be numeric.";

        return errors;
    }
}

public static class ItemValidator
{
    public static Dictionary<string, string> Validate(ItemFormModel model)
    {
        var errors = new Dictionary<string, string>();

        if (string.IsNullOrWhiteSpace(model.Description))
            errors[nameof(model.Description)] = "Description is required.";
        else if (model.Description.Length > 75)
            errors[nameof(model.Description)] = "Description cannot exceed 75 characters.";

        if (model.DonorID <= 0)
            errors[nameof(model.DonorID)] = "Donor is required.";

        return errors;
    }
}

public static class LotValidator
{
    public static Dictionary<string, string> Validate(LotFormModel model)
    {
        var errors = new Dictionary<string, string>();

        if (string.IsNullOrWhiteSpace(model.Description))
            errors[nameof(model.Description)] = "Description is required.";
        else if (model.Description.Length > 75)
            errors[nameof(model.Description)] = "Description cannot exceed 75 characters.";

        if (!string.IsNullOrWhiteSpace(model.Image) &&
            !model.Image.StartsWith("http://", StringComparison.OrdinalIgnoreCase) &&
            !model.Image.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
        {
            errors[nameof(model.Image)] = "Image URL must start with http:// or https://.";
        }

        return errors;
    }
}

public static class CategoryValidator
{
    public static Dictionary<string, string> Validate(CategoryFormModel model)
    {
        var errors = new Dictionary<string, string>();

        if (string.IsNullOrWhiteSpace(model.Description))
            errors[nameof(model.Description)] = "Description is required.";
        else if (model.Description.Length > 75)
            errors[nameof(model.Description)] = "Description cannot exceed 75 characters.";

        return errors;
    }
}
