import Card from "designSystem/Card";
import { AboutSectionConfig } from "./aboutSectionFixtures";

const AboutSection = ({ Icon, title, content }: AboutSectionConfig) => (
  <Card className="bg-default-background/95 pb-0">
    <h2 className="sticky top-header bg-gradient-to-b from-default-background from-80% to-transparent -m-card mb-0 p-card rounded-t transition-colors flex items-center gap-4">
      {Icon && <Icon />} {title}
    </h2>
    <div className="[&_a]:text-link space-y-4 pb-8">{content}</div>
  </Card>
);

export default AboutSection;
