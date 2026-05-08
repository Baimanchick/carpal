const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type UtmFields = {
  utmCampaign?: string;
  utmContent?: string;
  utmMedium?: string;
  utmSource?: string;
  utmTerm?: string;
};

const UTM_FIELD_BY_PARAM: Record<UtmKey, keyof UtmFields> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
};

export function readUtmFromSearch(search: string): UtmFields {
  const params = new URLSearchParams(search);
  const result: UtmFields = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);

    if (value) {
      result[UTM_FIELD_BY_PARAM[key]] = value;
    }
  }

  return result;
}
