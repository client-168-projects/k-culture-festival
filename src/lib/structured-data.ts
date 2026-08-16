import {
  FESTIVAL_START_DATE,
  ORGANIZER_NAME,
  ORGANIZER_URL,
  SITE_ALTERNATE_NAMES,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_URL,
  VENUE_ADDRESS,
  VENUE_LAT,
  VENUE_LNG,
  VENUE_NAME,
} from "@/constants/site";

export type JsonLdObject = Record<string, unknown>;

export function buildWebSiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: SITE_URL,
  };
}

export function buildOrganizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZER_NAME,
    url: ORGANIZER_URL,
  };
}

export function buildFestivalEventJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Festival",
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    description: SITE_DESCRIPTION,
    startDate: FESTIVAL_START_DATE,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [new URL(SITE_OG_IMAGE.url, SITE_URL).toString()],
    location: {
      "@type": "Place",
      name: VENUE_NAME,
      address: VENUE_ADDRESS,
      geo: {
        "@type": "GeoCoordinates",
        latitude: VENUE_LAT,
        longitude: VENUE_LNG,
      },
    },
    organizer: {
      "@type": "Organization",
      name: ORGANIZER_NAME,
      url: ORGANIZER_URL,
    },
  };
}
