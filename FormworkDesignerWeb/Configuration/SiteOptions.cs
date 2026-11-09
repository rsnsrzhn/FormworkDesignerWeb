namespace FormworkDesignerWeb.Configuration;

public sealed class SiteOptions
{
    public string PublicOrigin { get; set; } = "";
    public bool AcceptInquiries { get; set; }
    public bool LegalReviewed { get; set; }
    public string OperatorName { get; set; } = "";
    public string OperatorAddress { get; set; } = "";
    public string PrivacyEmail { get; set; } = "";
    public string PolicyVersion { get; set; } = "2026-11-03";
    public int RetentionMonths { get; set; } = 12;
    public string DataDirectory { get; set; } = "../data";

    public bool IsReady(bool development) => AcceptInquiries && (development ||
        (LegalReviewed && Uri.TryCreate(PublicOrigin, UriKind.Absolute, out var uri) &&
         uri.Scheme == "https" && !string.IsNullOrWhiteSpace(OperatorName) &&
         !string.IsNullOrWhiteSpace(OperatorAddress) &&
         new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(PrivacyEmail)));
}
