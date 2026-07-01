using System.ComponentModel.DataAnnotations;

namespace SilentAuction.Models;

public class DonorFormModel : IValidatableObject
{
    public int? DonorID { get; set; }

    [MaxLength(75, ErrorMessage = "Business Name cannot exceed 75 characters.")]
    public string? BusinessName { get; set; }

    [Required(ErrorMessage = "Contact Name is required.")]
    [MaxLength(75, ErrorMessage = "Contact Name cannot exceed 75 characters.")]
    public string ContactName { get; set; } = string.Empty;

    [MaxLength(200, ErrorMessage = "Email cannot exceed 200 characters.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    public string? ContactEmail { get; set; }

    [MaxLength(75, ErrorMessage = "Contact Title cannot exceed 75 characters.")]
    public string? ContactTitle { get; set; }

    [MaxLength(75, ErrorMessage = "Address cannot exceed 75 characters.")]
    public string? Address { get; set; }

    [MaxLength(30, ErrorMessage = "City cannot exceed 30 characters.")]
    public string? City { get; set; }

    [MaxLength(2, ErrorMessage = "State cannot exceed 2 characters.")]
    public string? State { get; set; }

    [MaxLength(5, ErrorMessage = "Zip Code cannot exceed 5 characters.")]
    public string? ZipCode { get; set; }

    public bool TaxReceipt { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!string.IsNullOrEmpty(ZipCode) && !ZipCode.All(char.IsDigit))
        {
            yield return new ValidationResult("Zip Code must be numeric.", [nameof(ZipCode)]);
        }
    }
}

public class ItemFormModel : IValidatableObject
{
    public int? ItemID { get; set; }

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(75, ErrorMessage = "Description cannot exceed 75 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Retail Value must be a number.")]
    public decimal? RetailValue { get; set; }

    [Required(ErrorMessage = "Donor is required.")]
    public int? DonorID { get; set; }

    public int? LotID { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (RetailValue is null || !decimal.TryParse(RetailValue.ToString(), out _))
        {
            yield return new ValidationResult("Retail Value must be a number.", [nameof(RetailValue)]);
        }
    }
}

public class LotFormModel : IValidatableObject
{
    public int? LotID { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MaxLength(255, ErrorMessage = "Description must be less than 255 characters")]
    public string Description { get; set; } = string.Empty;

    public int? CategoryID { get; set; }

    public decimal? HighestBid { get; set; }

    public int? BidderID { get; set; }

    public bool Delivered { get; set; }

    public string? Image { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (HighestBid is not null)
        {
            if (HighestBid < 0)
            {
                yield return new ValidationResult("Highest bid must be greater than 0", [nameof(HighestBid)]);
            }
        }

        if (!string.IsNullOrWhiteSpace(Image))
        {
            if (!Uri.TryCreate(Image, UriKind.Absolute, out var uri) ||
                (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
            {
                yield return new ValidationResult("Image URL must start with http:// or https://", [nameof(Image)]);
            }
        }
    }
}

public class CategoryFormModel
{
    public int? CategoryID { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MaxLength(255, ErrorMessage = "Description must be less than 255 characters")]
    public string Description { get; set; } = string.Empty;
}
