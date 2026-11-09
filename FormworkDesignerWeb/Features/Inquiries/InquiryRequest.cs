using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace FormworkDesignerWeb.Features.Inquiries;

public sealed record InquiryRequest(Guid RequestId, string? FullName, string? Email, string? Phone,
    bool Consent, string? PolicyVersion, string? Website);

public static partial class InquiryValidation
{
    public static string NormalizePhone(string? value)
    {
        var digits = DigitsOnly().Replace(value ?? "", "");
        if (digits.Length == 11 && digits.StartsWith('8')) digits = "7" + digits[1..];
        return "+" + digits;
    }

    public static Dictionary<string, string[]> Validate(InquiryRequest request, string policyVersion)
    {
        var errors = new Dictionary<string, string[]>();
        if (request.RequestId == Guid.Empty) errors["requestId"] = ["Обновите страницу и попробуйте снова."];
        var name = request.FullName?.Trim() ?? "";
        if (name.Length is < 2 or > 200 || name.Any(char.IsControl))
            errors["fullName"] = ["Укажите имя и фамилию, от 2 до 200 символов."];
        var email = request.Email?.Trim() ?? "";
        if (email.Length > 254 || !new EmailAddressAttribute().IsValid(email) || !EmailPattern().IsMatch(email) || email.Any(char.IsControl))
            errors["email"] = ["Укажите корректный email."];
        if (request.Phone is null || request.Phone.Length > 40 || !PhoneCharacters().IsMatch(request.Phone) || !RegionPhone().IsMatch(NormalizePhone(request.Phone)))
            errors["phone"] = ["Укажите номер России (+7) или Беларуси (+375)."]; 
        if (!request.Consent) errors["consent"] = ["Необходимо согласие на обработку персональных данных."];
        if (request.PolicyVersion != policyVersion) errors["policyVersion"] = ["Условия обновились. Обновите страницу перед отправкой."];
        return errors;
    }

    [GeneratedRegex(@"\D")] private static partial Regex DigitsOnly();
    [GeneratedRegex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$")] private static partial Regex EmailPattern();
    [GeneratedRegex(@"^[+\d\s()\-]+$")] private static partial Regex PhoneCharacters();
    [GeneratedRegex(@"^(\+7[3489]\d{9}|\+375(?:1[5-7]|2[1-5]|29|33|44)\d{7})$")]
    private static partial Regex RegionPhone();
}
