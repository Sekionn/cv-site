import type { en } from "./en";

export type Language = "en" | "da";
export type TranslationKey = keyof typeof en;
export type TranslationDictionary = Record<TranslationKey, string>;
