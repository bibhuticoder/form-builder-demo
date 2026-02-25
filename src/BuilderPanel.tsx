import { SubNav } from "./components";
import { DocumentTextIcon, GlobeAltIcon, SparklesIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ComponentShowcase from "./ComponentShowcase";
import FormBuilder from "./BuilderPanelTabs/FormBuilder/FormBuilder";
import EmailBuilder from "./BuilderPanelTabs/EmailBuilder/EmailBuilder";


export default function BuilderPanel() {
  const [activeTab, setActiveTab] = useState<string>("form-builder");

  const handleTabClick = (value: string) => {
    setActiveTab(value);
  };

  const subNavItems = [
    {
      label: "Form Builder",
      value: "form-builder",
      icon: <DocumentTextIcon className="w-5 h-5" />
    },
    {
      label: "Email Builder",
      value: "email-builder",
      icon: <EnvelopeIcon className="w-5 h-5" />
    },
    {
      label: "Website Builder",
      value: "website-builder",
      icon: <GlobeAltIcon className="w-5 h-5" />
    },
    {
      label: "Component Showcase",
      value: "component-showcase",
      icon: <SparklesIcon className="w-5 h-5" />
    }
  ];

  return (
    <div>
      <div className="border">
        <SubNav
          items={subNavItems}
          activeTab={activeTab}
          onTabClick={handleTabClick}
        />
      </div>

      {activeTab === "form-builder" && <FormBuilder />}

      {activeTab === "email-builder" && <EmailBuilder />}

      {activeTab === "website-builder" && (
        <div className="p-6">
          <div className="flex items-center space-x-6">
            <h1 className="flex items-center gap-2">
              <GlobeAltIcon className="text-blue-500 h-8 w-8" />
              Website Builder
            </h1>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 dark:text-gray-400">Website builder content goes here.</p>
          </div>
        </div>
      )}

      {activeTab === "component-showcase" && <ComponentShowcase />}
    </div>
  );
}
