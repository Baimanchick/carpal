1 endpoint, 4 варианта через leadKind.
POST /api/leads
tourist
{  "leadKind": "tourist",
  "email?": "string",
  "phoneE164?": "string",
  "utmSource?": "...",
  "utmMedium?": "...",
  "utmCampaign?": "..."
}(обязателен email или phone)
host
{
  "leadKind": "host",
  "name": "string",
  "phoneE164": "string",
  "city": "string",
  "carsCount": "1 | 2 | 3+",
  "utm*": "..."
}fleet
{
  "leadKind": "fleet",
  "name": "string",
  "phoneE164": "string",
  "company": "string",
  "fleetSize": "5-10 | 10-25 | 25+",
  "utm*": "..."
}partner
{
  "leadKind": "partner",
  "name": "string",
  "phoneE164": "string",
  "company": "string",
  "partnerKind": "insurance | tour | hotel | marketplace | transfer | other",
  "utm*": "..."
}Response: 201 { leadId, publicCode } → фронт показывает success screen.