export type LeadKind = "tourist" | "host" | "fleet" | "partner";

export type HostCarsCount = "1" | "2" | "3+";
export type FleetSize = "5-10" | "10-25" | "25+";
export type PartnerKind =
  | "insurance"
  | "tour"
  | "hotel"
  | "marketplace"
  | "transfer"
  | "other";

type UtmFields = {
  utmCampaign?: string;
  utmContent?: string;
  utmMedium?: string;
  utmSource?: string;
  utmTerm?: string;
};

export type TouristLeadInput = UtmFields & {
  email?: string;
  leadKind: "tourist";
  phoneE164?: string;
};

export type HostLeadInput = UtmFields & {
  carsCount: HostCarsCount;
  city: string;
  leadKind: "host";
  name: string;
  phoneE164: string;
};

export type FleetLeadInput = UtmFields & {
  company: string;
  fleetSize: FleetSize;
  leadKind: "fleet";
  name: string;
  phoneE164: string;
};

export type PartnerLeadInput = UtmFields & {
  company: string;
  leadKind: "partner";
  name: string;
  partnerKind: PartnerKind;
  phoneE164: string;
};

export type LeadInput =
  | TouristLeadInput
  | HostLeadInput
  | FleetLeadInput
  | PartnerLeadInput;

export type LeadCreatedResponse = {
  leadId: string;
  publicCode: string;
};
