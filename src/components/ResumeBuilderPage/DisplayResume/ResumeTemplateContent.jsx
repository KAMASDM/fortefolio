import { ModernTemplate } from "../Templates/ModernTemplate";
import {
  ModernNeoTemplate,
  ModernSlateTemplate,
  ModernAuroraTemplate,
  ModernMetroTemplate,
  ModernZenTemplate,
  ModernNovaTemplate,
  ModernEdgeTemplate,
  ModernPrismTemplate,
  ModernSummitTemplate,
  ModernFlowTemplate,
} from "../Templates/ModernVariantsTemplate";
import { MinimalTemplate } from "../Templates/MinimalTemplate";
import { CreativeTemplate } from "../Templates/CreativeTemplate";
import IndiaTemplate from "../Templates/IndiaTemplate";
import { ProfessionalTemplate } from "../Templates/ProfessionalTemplate";
import { ExecutiveTemplate } from "../Templates/ExecutiveTemplate";
import { ClassicTemplate } from "../Templates/ClassicTemplate";
import { TimelineTemplate } from "../Templates/TimelineTemplate";
import { SidebarTemplate } from "../Templates/SidebarTemplate";
import { CanadaTemplate } from "../Templates/CanadaTemplate";
import EuropeanUnionTemplate from "../Templates/EuropenUnionTemplate";
import { EuropassTemplate } from "../Templates/NewTemplate";
import { AustraliaTemplate } from "../Templates/AustraliaTemplate";
import { UsaTemplate } from "../Templates/UsaTemplate";
import { constants } from "../ResumePreview/constants";

const { TEMPLATES } = constants;

export const ResumeTemplateContent = ({
  resumeData,
  activeTemplate,
  fontFamily,
  colorScheme,
  isSectionEmpty,
  getInitials,
  formatDate,
  isMobile,
  isSmallMobile,
  starredSections = [],
  toggleStarSection = () => {},
  sectionOrder = ['experience', 'education', 'projects', 'skills', 'references'], // Default order
  fontSize = 10,
}) => {
  const TemplateComponent =
    {
      [TEMPLATES.MODERN]: ModernTemplate,
      [TEMPLATES.MODERN_NEO]: ModernNeoTemplate,
      [TEMPLATES.MODERN_SLATE]: ModernSlateTemplate,
      [TEMPLATES.MODERN_AURORA]: ModernAuroraTemplate,
      [TEMPLATES.MODERN_METRO]: ModernMetroTemplate,
      [TEMPLATES.MODERN_ZEN]: ModernZenTemplate,
      [TEMPLATES.MODERN_NOVA]: ModernNovaTemplate,
      [TEMPLATES.MODERN_EDGE]: ModernEdgeTemplate,
      [TEMPLATES.MODERN_PRISM]: ModernPrismTemplate,
      [TEMPLATES.MODERN_SUMMIT]: ModernSummitTemplate,
      [TEMPLATES.MODERN_FLOW]: ModernFlowTemplate,
      [TEMPLATES.MINIMAL]: MinimalTemplate,
      [TEMPLATES.CREATIVE]: CreativeTemplate,
      [TEMPLATES.PROFESSIONAL]: ProfessionalTemplate,
      [TEMPLATES.EXECUTIVE]: ExecutiveTemplate,
      [TEMPLATES.CLASSIC]: ClassicTemplate,
      [TEMPLATES.TIMELINE]: TimelineTemplate,
      [TEMPLATES.SIDEBAR]: SidebarTemplate,
      [TEMPLATES.EUROPASS]: EuropassTemplate,
      [TEMPLATES.CANADA]: CanadaTemplate,
      [TEMPLATES.EUROPE]: EuropeanUnionTemplate,
      [TEMPLATES.AUSTRALIA]: AustraliaTemplate,
      [TEMPLATES.USA]: UsaTemplate,
      [TEMPLATES.INDIA]: IndiaTemplate,
    }[activeTemplate] || ModernTemplate;

  const commonProps = {
    resumeData,
    formatDate,
    colorScheme,
    fontFamily,
    isSectionEmpty,
    toggleStarSection,
    starredSections,
    getInitials,
    isMobile,
    isSmallMobile,
    sectionOrder, // Pass the order to the template
    fontSize, // Pass font size to the template
  };

  return <TemplateComponent {...commonProps} />;
};