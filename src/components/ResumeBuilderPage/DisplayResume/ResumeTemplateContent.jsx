import { ModernTemplate } from "../Templates/ModernTemplate";
import { MinimalTemplate } from "../Templates/MinimalTemplate";
import { CreativeTemplate } from "../Templates/CreativeTemplate";
import IndiaTemplate from "../Templates/IndiaTemplate";
import { ProfessionalTemplate } from "../Templates/ProfessionalTemplate";
import { CanadaTemplate } from "../Templates/CanadaTemplate";
import EuropenUnionTemplate from "../Templates/EuropenUnionTemplate";
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
      [TEMPLATES.MINIMAL]: MinimalTemplate,
      [TEMPLATES.CREATIVE]: CreativeTemplate,
      [TEMPLATES.PROFESSIONAL]: ProfessionalTemplate,
      [TEMPLATES.EUROPASS]: EuropassTemplate,
      [TEMPLATES.CANADA]: CanadaTemplate,
      [TEMPLATES.EUROPE]: EuropenUnionTemplate,
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