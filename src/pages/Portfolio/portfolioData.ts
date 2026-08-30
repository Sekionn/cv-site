import type { TranslationKey } from "../../i18n/types";

export type DownloadType = "none" | "local" | "website" | "both";

export type PreviewObject = {
  nameKey: TranslationKey;
  descriptionKey?: TranslationKey;
  url?: string;
  img: string;
  imageStyle?: "logo";
  key: string;
  downloadKey?: string;
  downloadType: DownloadType;
};

export type CurriculumObject = {
  nameKey: TranslationKey;
  key: string;
  img: string;
};

export const portfolioImageBase = "/portfolio/images";
export const portfolioDownloadBase = "/portfolio/downloads";

export const areas: PreviewObject[] = [
  {
    nameKey: "portfolio.project.priceBot.name",
    descriptionKey: "portfolio.project.priceBot.description",
    img: "ProjectImages/price-bot.png",
    key: "price_bot",
    imageStyle: "logo",
    downloadKey:
      "https://github.com/Sekionn/Price-scanner/releases/latest/download/price-bot-win-Setup.exe",
    url: "https://github.com/Sekionn/Price-scanner",
    downloadType: "both",
  },
  {
    nameKey: "portfolio.project.egAjour.name",
    img: "ProjectImages/eg_ajour_logo.svg",
    key: "eg_ajour",
    imageStyle: "logo",
    url: "https://eg.dk/it/eg-ajour/",
    downloadType: "website",
  },
  {
    nameKey: "portfolio.project.again.name",
    descriptionKey: "portfolio.project.again.description",
    img: "ProjectImages/again.png",
    key: "again",
    downloadKey: "Again.zip",
    downloadType: "local",
  },
  {
    nameKey: "portfolio.project.bossSlayers.name",
    descriptionKey: "portfolio.project.bossSlayers.description",
    img: "ProjectImages/bossSlayers.png",
    key: "bossSlayers",
    downloadKey: "BossSlayers.zip",
    downloadType: "local",
  },
  {
    nameKey: "portfolio.project.escape.name",
    descriptionKey: "portfolio.project.escape.description",
    img: "ProjectImages/escape.png",
    key: "escape",
    downloadKey: "Escape.zip",
    downloadType: "local",
  },
  {
    nameKey: "portfolio.project.introShop.name",
    descriptionKey: "portfolio.project.introShop.description",
    img: "ProjectImages/introShop.png",
    key: "introShop",
    downloadKey: "IntrovertShopping.zip",
    downloadType: "local",
  },
  {
    nameKey: "portfolio.project.school.name",
    descriptionKey: "portfolio.project.school.description",
    img: "ProjectImages/school.png",
    key: "school",
    downloadKey: "School.zip",
    downloadType: "local",
  },
  {
    nameKey: "portfolio.project.silkRoute.name",
    descriptionKey: "portfolio.project.silkRoute.description",
    img: "ProjectImages/silkroutegame.png",
    key: "silkroutegame",
    downloadKey: "Silkroute.zip",
    downloadType: "local",
  },
];

export const curriculum: CurriculumObject = {
  nameKey: "portfolio.curriculum.name",
  key: "curriculum_vitae",
  img: "icons8-document-64.png",
};
