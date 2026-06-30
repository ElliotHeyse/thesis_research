using System.ComponentModel.DataAnnotations;
using migrated_project.Models;

namespace migrated_project.Models.Forms;

public class DonorFormModel
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
    [RegularExpression(@"^\d*$", ErrorMessage = "Zip Code must be numeric.")]
    public string? ZipCode { get; set; }

    public bool TaxReceipt { get; set; }

    public static DonorFormModel FromEntity(Donor donor) => new()
    {
        DonorID = donor.DonorID,
        BusinessName = donor.BusinessName,
        ContactName = donor.ContactName,
        ContactEmail = donor.ContactEmail,
        ContactTitle = donor.ContactTitle,
        Address = donor.Address,
        City = donor.City,
        State = donor.State,
        ZipCode = donor.ZipCode,
        TaxReceipt = donor.TaxReceipt
    };

    public Donor ToEntity() => new()
    {
        DonorID = DonorID ?? 0,
        BusinessName = string.IsNullOrWhiteSpace(BusinessName) ? null : BusinessName.Trim(),
        ContactName = ContactName.Trim(),
        ContactEmail = ContactEmail?.Trim() ?? string.Empty,
        ContactTitle = string.IsNullOrWhiteSpace(ContactTitle) ? null : ContactTitle.Trim(),
        Address = Address?.Trim() ?? string.Empty,
        City = City?.Trim() ?? string.Empty,
        State = State?.Trim() ?? string.Empty,
        ZipCode = ZipCode?.Trim() ?? string.Empty,
        TaxReceipt = TaxReceipt
    };
}

public class ItemFormModel
{
    public int? ItemID { get; set; }

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(75, ErrorMessage = "Description cannot exceed 75 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Retail Value must be a number.")]
    public decimal RetailValue { get; set; }

    [Required(ErrorMessage = "Donor is required.")]
    public int DonorID { get; set; }

    public int? LotID { get; set; }

    public static ItemFormModel FromEntity(Item item) => new()
    {
        ItemID = item.ItemID,
        Description = item.Description,
        RetailValue = item.RetailValue,
        DonorID = item.DonorID,
        LotID = item.LotID
    };
}

public class LotFormModel
{
    public int? LotID { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MaxLength(255, ErrorMessage = "Description must be less than 255 characters")]
    public string Description { get; set; } = string.Empty;

    public int? CategoryID { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Highest bid must be greater than 0")]
    public decimal? HighestBid { get; set; }

    public int? BidderID { get; set; }

    public bool Delivered { get; set; }

    [CustomValidation(typeof(LotFormModel), nameof(ValidateImageUrl))]
    public string? Image { get; set; }

    public static ValidationResult? ValidateImageUrl(string? image, ValidationContext _)
    {
        if (string.IsNullOrWhiteSpace(image))
            return ValidationResult.Success;

        if (!Uri.TryCreate(image, UriKind.Absolute, out var uri) ||
            (uri.Scheme != Uri.UriSchemeHttp && uri.Scheme != Uri.UriSchemeHttps))
        {
            return new ValidationResult("Image URL must start with http:// or https://");
        }

        return ValidationResult.Success;
    }

    public static LotFormModel FromEntity(Lot lot) => new()
    {
        LotID = lot.LotID,
        Description = lot.Description,
        CategoryID = lot.CategoryID,
        HighestBid = lot.WinningBid,
        BidderID = lot.WinningBidder,
        Delivered = lot.Delivered,
        Image = lot.Image
    };
}

public class CategoryFormModel
{
    public int? CategoryID { get; set; }

    [Required(ErrorMessage = "Description is required")]
    [MaxLength(255, ErrorMessage = "Description must be less than 255 characters")]
    public string Description { get; set; } = string.Empty;

    public static CategoryFormModel FromEntity(Category category) => new()
    {
        CategoryID = category.CategoryID,
        Description = category.Description
    };
}
