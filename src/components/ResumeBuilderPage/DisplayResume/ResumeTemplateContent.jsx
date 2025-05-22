import { ModernTemplate } from "../Templates/ModernTemplate";
import { MinimalTemplate } from "../Templates/MinimalTemplate";
import { CreativeTemplate } from "../Templates/CreativeTemplate";
import { ProfessionalTemplate } from "../Templates/ProfessionalTemplate";
import { SidebarTemplate } from "../Templates/SidebarTemplate";
import { CanadaTemplate } from "../Templates/CanadaTemplate";
import { EuropenUnionTemplate } from "../Templates/EuropenUnionTemplate";
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
}) => {
  const TemplateComponent =
    {
      [TEMPLATES.MODERN]: ModernTemplate,
      [TEMPLATES.MINIMAL]: MinimalTemplate,
      [TEMPLATES.CREATIVE]: CreativeTemplate,
      [TEMPLATES.PROFESSIONAL]: ProfessionalTemplate,
      // [TEMPLATES.SIDEBAR]: SidebarTemplate,
      [TEMPLATES.EUROPASS]: EuropassTemplate,
      [TEMPLATES.CANADA]: CanadaTemplate,
      [TEMPLATES.EUROPE]: EuropenUnionTemplate,
      [TEMPLATES.AUSTRALIA]: AustraliaTemplate,
      [TEMPLATES.USA]: UsaTemplate,
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
  };

  return <TemplateComponent {...commonProps} />;
};
