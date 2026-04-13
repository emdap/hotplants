import Card from "designSystem/Card";
import { AboutSectionConfig } from "./aboutSectionFixtures";

const AboutSection = ({ Icon, title, content }: AboutSectionConfig) => (
  <Card className="bg-default-background/95">
    <h4 className="sticky top-header bg-gradient-to-b from-default-background from-80% to-transparent -m-card mb-0 p-card pt-3 rounded-t transition-colors flex items-center gap-4">
      {Icon && <Icon />} {title}
    </h4>
    <p>{content}</p>
  </Card>
);

export default AboutSection;
