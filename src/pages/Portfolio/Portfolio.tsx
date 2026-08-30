import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../../context/LanguageContext";
import {
  areas,
  curriculum,
  portfolioDownloadBase,
  portfolioImageBase,
  type DownloadType,
  type PreviewObject,
} from "./portfolioData";
import "./Portfolio.css";

const introWasViewedKey = "IntroWasViewed";
const detailBackgroundImages = ["Show.png", "ShowSecond.png"];

export default function Portfolio() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<
    PreviewObject | undefined
  >();
  const [introShowing, setIntroShowing] = useState(
    () => !localStorage.getItem(introWasViewedKey),
  );
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const sliderGrabbed = useRef(false);
  const dragging = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  if (introShowing) {
    return (
      <Intro
        onProceed={() => {
          localStorage.setItem(introWasViewedKey, "true");
          setIntroShowing(false);
        }}
      />
    );
  }

  if (selectedProject) {
    return (
      <ProjectDetails
        selectedProject={selectedProject}
        onBack={() => {
          setSelectedProject(undefined);
        }}
      />
    );
  }

  return (
    <main className="portfolio-page">
      <div className="portfolio-scene">
        <img
          className="portfolio-background-image"
          src={`${portfolioImageBase}/Welcome.png`}
          alt=""
        />
        <div className="portfolio-slider-wrap">
          <button
            className="portfolio-cv-item"
            type="button"
            onClick={() => {
              navigate("/curriculum-vitae");
            }}
          >
            <img
              className="portfolio-project-images"
              src={`${portfolioImageBase}/${curriculum.img}`}
              alt=""
            />
            {t(curriculum.nameKey)}
          </button>

          <div
            ref={sliderRef}
            className="portfolio-slider"
            onMouseDown={() => {
              sliderGrabbed.current = true;
              dragging.current = false;
            }}
            onMouseMove={(event) => {
              event.preventDefault();
              event.stopPropagation();
              dragging.current = true;

              if (sliderGrabbed.current) {
                event.currentTarget.scrollLeft -= event.movementX;
              }
            }}
            onMouseLeave={() => {
              sliderGrabbed.current = false;
              dragging.current = false;
            }}
            onMouseUp={() => {
              sliderGrabbed.current = false;
            }}
            onScroll={updateScrollPercentage}
            onWheel={(event) => {
              event.preventDefault();
              event.currentTarget.scrollLeft += event.deltaY;
            }}
          >
            <div className="portfolio-slider-inner">
              {areas.map((area) => (
                <button
                  key={area.key}
                  className="portfolio-slide-img"
                  type="button"
                  title={t(area.nameKey)}
                  onClick={() => {
                    if (!dragging.current) {
                      setSelectedProject(area);
                    }
                  }}
                >
                  <img
                    className="portfolio-project-images"
                    src={`${portfolioImageBase}/${area.img}`}
                    alt=""
                  />
                  {t(area.nameKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="portfolio-progress-bar">
            <div
              className="portfolio-inner-bar"
              style={{ width: `${scrollPercentage}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  );

  function updateScrollPercentage() {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    const maxScroll = slider.scrollWidth - slider.clientWidth;
    setScrollPercentage(maxScroll <= 0 ? 0 : (slider.scrollLeft / maxScroll) * 100);
  }
}

function ProjectDetails({
  selectedProject,
  onBack,
}: {
  selectedProject: PreviewObject;
  onBack: () => void;
}) {
  const { t } = useLanguage();

  return (
    <main className="portfolio-page">
      <DetailBackground />
      <section className="portfolio-info-container">
        <div className="portfolio-info-title">
          {selectedProject.imageStyle === "logo" ? (
            <ProjectImage selectedProject={selectedProject} />
          ) : (
            <h1>{t(selectedProject.nameKey)}</h1>
          )}
        </div>
        {selectedProject.imageStyle ? null : (
          <ProjectImage selectedProject={selectedProject} />
        )}
        <div className="portfolio-description-container">
          {selectedProject.key !== "eg_ajour" ? (
            selectedProject.descriptionKey ? t(selectedProject.descriptionKey) : null
          ) : (
            <AjourInfoText />
          )}
        </div>
        <div className="portfolio-actions">
          <button className="portfolio-button" type="button" onClick={onBack}>
            {t("portfolio.action.back")}
          </button>
          <DownloadButton
            downloadKey={selectedProject.downloadKey}
            downloadType={selectedProject.downloadType}
            url={selectedProject.url}
          />
        </div>
      </section>
    </main>
  );
}

function Intro({ onProceed }: { onProceed: () => void }) {
  const { t } = useLanguage();

  return (
    <main className="portfolio-page">
      <div className="portfolio-scene">
        <img
          className="portfolio-background-image"
          src={`${portfolioImageBase}/Welcome.png`}
          alt=""
        />
        <section className="portfolio-intro-container">
          <div className="portfolio-intro-text-container">
            <p>
              {t("portfolio.intro.welcome")}
              <br />
              {t("portfolio.intro.description")}
            </p>
            <p className="portfolio-small-text">{t("portfolio.intro.stock")}</p>
          </div>
          <button
            className="portfolio-button portfolio-bottom-right-corner"
            type="button"
            onClick={onProceed}
          >
            {t("portfolio.action.proceed")}
          </button>
        </section>
      </div>
    </main>
  );
}

function DetailBackground() {
  const image =
    detailBackgroundImages[
      Math.floor(Math.random() * detailBackgroundImages.length)
    ];

  return (
    <img
      className="portfolio-background-image"
      src={`${portfolioImageBase}/${image}`}
      alt=""
    />
  );
}

function DownloadButton({
  downloadKey,
  downloadType,
  url,
}: {
  downloadKey?: string;
  downloadType: DownloadType;
  url?: string;
}) {
  const { t } = useLanguage();

  if (downloadType === "none") {
    return (
      <a
        className="portfolio-float-right"
        target="_blank"
        rel="noreferrer"
        href="https://eg.dk/it/eg-ajour/"
      >
        <button className="portfolio-button" type="button">
          {t("portfolio.action.website")}
        </button>
      </a>
    );
  }

  if (downloadType === "website") {
    return (
      <a
        className="portfolio-float-right"
        target="_blank"
        rel="noreferrer"
        href={url}
      >
        <button className="portfolio-button" type="button">
          {t("portfolio.action.website")}
        </button>
      </a>
    );
  }

  if (downloadType === "both") {
    return (
      <div className="portfolio-float-right">
        <a
          className="portfolio-margin-right-10"
          target="_blank"
          rel="noreferrer"
          href={url}
        >
          <button className="portfolio-button" type="button">
            {t("portfolio.action.website")}
          </button>
        </a>
        <a href={downloadKey} download={downloadKey}>
          <button className="portfolio-button" type="button">
            {t("portfolio.action.download")}
          </button>
        </a>
      </div>
    );
  }

  return (
    <a
      className="portfolio-float-right"
      href={`${portfolioDownloadBase}/${downloadKey}`}
      download={downloadKey}
    >
      <button className="portfolio-button" type="button">
        {t("portfolio.action.download")}
      </button>
    </a>
  );
}

function ProjectImage({ selectedProject }: { selectedProject: PreviewObject }) {
  const { t } = useLanguage();

  if (selectedProject.imageStyle === "logo") {
    return (
      <div className="portfolio-logo-title">
        <img
          src={`${portfolioImageBase}/${selectedProject.img}`}
          alt={t("portfolio.image.notAvailable")}
          className="portfolio-preview-logo"
        />
        {t(selectedProject.nameKey)}
      </div>
    );
  }

  return (
    <img
      src={`${portfolioImageBase}/${selectedProject.img}`}
      alt={t("portfolio.image.notAvailable")}
      className="portfolio-preview-image"
    />
  );
}

function AjourInfoText() {
  const { t } = useLanguage();

  return (
    <div>
      {t("portfolio.project.egAjour.detail.worked")}
      <br />
      <br />
      {t("portfolio.project.egAjour.detail.internship")}
      <br />
      <br />
      {t("portfolio.project.egAjour.detail.studentDeveloper")}
      <br />
      <br />
      {t("portfolio.project.egAjour.detail.softwareDeveloper")}
      <br />
      <br />
      {t("portfolio.project.egAjour.detail.includes")}
      <ul className="portfolio-ajour-list">
        <li>{t("portfolio.project.egAjour.detail.cropper")}</li>
        <li>
          {t("portfolio.project.egAjour.detail.viewer")}
        </li>
        <li>
          {t("portfolio.project.egAjour.detail.rewrite")}
        </li>
        <li>{t("portfolio.project.egAjour.detail.playwright")}</li>
        <li>
          {t("portfolio.project.egAjour.detail.teaching")}
        </li>
        <li>
          {t("portfolio.project.egAjour.detail.flutter")}
        </li>
      </ul>
      <br />
      <p className="portfolio-small-text">
        {t("portfolio.project.egAjour.detail.note")}
      </p>
      <br />
      <br />
      {t("portfolio.project.egAjour.detail.paywall")}
      <br />
      {t("portfolio.project.egAjour.detail.website")}
    </div>
  );
}
