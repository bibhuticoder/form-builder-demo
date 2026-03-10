import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import {
  DocumentIcon,
  ViewColumnsIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

export interface TemplateItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

interface CreateItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (mode: 'scratch' | 'template' | 'ai', data?: any) => void;
  itemType: string;
  templates: TemplateItem[];
}

const TemplateCard = ({ template, selected, onClick }: { template: TemplateItem, selected: boolean, onClick: () => void }) => {
  const Icon = template.icon;
  return (
    <div
      className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 hover:bg-slate-50 flex items-start gap-3 ${selected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-slate-200 bg-white'
        }`}
      onClick={onClick}
    >
      <div className={`p-2 rounded-md shrink-0 ${selected ? 'bg-white text-primary' : 'bg-slate-100 text-slate-500'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-medium text-sm text-slate-900">{template.title}</h4>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{template.subtitle}</p>
      </div>
    </div>
  );
};

export const CreateItemDialog: React.FC<CreateItemDialogProps> = ({ isOpen, onClose, onCreate, itemType, templates }) => {
  const [createMode, setCreateMode] = useState<'scratch' | 'template' | 'ai'>('scratch');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");

  const handleCreate = () => {
    let data;
    if (createMode === 'template') data = selectedTemplateId;
    if (createMode === 'ai') data = aiPrompt;
    onCreate(createMode, data);
  };

  const lowerType = itemType.toLowerCase();

  const bodyContent = (
    <div className="flex flex-col -mx-3 -my-4 h-[550px]">
      <div className="p-4 shrink-0 border-b border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-3 gap-4">
          <div
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center text-center gap-3 border ${createMode === 'scratch' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
              }`}
            onClick={() => setCreateMode('scratch')}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${createMode === 'scratch' ? "bg-white text-primary shadow-sm" : "bg-slate-100 text-slate-500"
              }`}>
              <DocumentIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-xs">Start From Scratch</h3>
              <p className="text-[10px] text-slate-500 mt-1">Build your {lowerType} from a blank canvas.</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center text-center gap-3 border ${createMode === 'template' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
              }`}
            onClick={() => setCreateMode('template')}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${createMode === 'template' ? "bg-white text-primary shadow-sm" : "bg-slate-100 text-slate-500"
              }`}>
              <ViewColumnsIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-xs">Use a Template</h3>
              <p className="text-[10px] text-slate-500 mt-1">Choose from pre-built layout patterns.</p>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center text-center gap-3 border ${createMode === 'ai' ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
              }`}
            onClick={() => setCreateMode('ai')}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${createMode === 'ai' ? "bg-white text-primary shadow-sm" : "bg-slate-100 text-slate-500"
              }`}>
              <SparklesIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-xs">Create with AI</h3>
              <p className="text-[10px] text-slate-500 mt-1">Describe what you need and let AI build it.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="p-6">
          {createMode === 'scratch' && (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-500">
              <DocumentIcon className="w-12 h-12 text-slate-200 mb-4" />
              <p className="max-w-xs text-sm">You are ready to start with a blank canvas. Click "Create {itemType}" to begin.</p>
            </div>
          )}

          {createMode === 'template' && (
            <div className="grid grid-cols-1 gap-2">
              {templates.length > 0 ? templates.map(t => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  selected={selectedTemplateId === t.id}
                  onClick={() => setSelectedTemplateId(t.id)}
                />
              )) : (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No templates available for {lowerType} yet.
                </div>
              )}
            </div>
          )}

          {createMode === 'ai' && (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg flex gap-3">
                <SparklesIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm text-primary">
                  <p className="font-medium">What should this {lowerType} do?</p>
                  <p className="opacity-80">Be as specific as possible about layout, tone, and goals.</p>
                </div>
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={`e.g. Create a holiday promotion ${lowerType} with a hero image and a discount code.`}
                className="w-full min-h-[120px] resize-none bg-white border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex justify-end gap-2 -mx-3 -my-2 pr-2">
      <Button variant="outline" onClick={onClose} className="px-4 py-2 text-sm">Cancel</Button>
      <Button
        variant="primary"
        onClick={handleCreate}
        disabled={
          (createMode === 'template' && !selectedTemplateId) ||
          (createMode === 'ai' && !aiPrompt.trim())
        }
        className="gap-2 px-4 py-2 flex items-center text-sm"
      >
        {createMode === 'ai' && <SparklesIcon className="w-4 h-4 mr-1" />}
        Create {itemType}
      </Button>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={`Create New ${itemType}`}
      subtitle={`How would you like to start building your ${lowerType}?`}
      body={bodyContent}
      footer={footerContent}
      className="max-w-3xl"
    />
  );
};
