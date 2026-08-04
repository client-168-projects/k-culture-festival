import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { routing, type Locale } from "./routing";

export function assertLocale(locale: string): asserts locale is Locale {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
}
