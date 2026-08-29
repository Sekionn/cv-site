import type { da } from "./da";

export type Language = "en" | "da";
export type TranslationKey = keyof typeof da;
export type TranslationDictionary = Record<TranslationKey, string>;
