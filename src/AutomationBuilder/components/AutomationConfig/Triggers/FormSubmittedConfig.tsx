import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { FacebookIcon, GoogleIcon, TikTokIcon } from "../helpers"
import { DocumentTextIcon } from "@heroicons/react/24/outline"

export const FormSubmittedConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const formSources = [
    { id: 'cleave', name: 'Cleave Form', icon: DocumentTextIcon },
    { id: 'facebook', name: 'Facebook Form', icon: FacebookIcon },
    { id: 'google', name: 'Google Form', icon: GoogleIcon },
    { id: 'tiktok', name: 'TikTok Form', icon: TikTokIcon },
  ];

  const getFormList = (sourceId: string) => {
    switch (sourceId) {
      case 'facebook': return [{ id: 'fb1', name: 'Lead Gen Campaign Q1' }, { id: 'fb2', name: 'Webinar Reg Form' }];
      case 'google': return [{ id: 'g1', name: 'Feedback Survey' }, { id: 'g2', name: 'Event Registration' }];
      case 'tiktok': return [{ id: 'tt1', name: 'Influencer App' }, { id: 'tt2', name: 'Viral Contest' }];
      case 'cleave': return [{ id: 'c1', name: 'Contact Us Form' }, { id: 'c2', name: 'Newsletter Signup' }];
      default: return [];
    }
  };

  const selectedSourceForms = getFormList(data.formType);
  const currentSource = formSources.find(s => s.id === data.formType);
  const currentForm = selectedSourceForms.find(f => f.id === data.formId);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Form Source</Label>
        <Select value={data.formType} onValueChange={(val) => onChange({ ...data, formType: val, formId: undefined })}>
          <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full">
            <SelectValue placeholder={currentSource?.name || "Select Source"} />
          </SelectTrigger>
          <SelectContent className="w-full">
            {formSources.map(source => (
              <SelectItem key={source.id} value={source.id} className="text-[13px] py-1.5">
                <div className="flex items-center gap-2">
                  <source.icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
                  <span className="truncate">{source.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.formType && (
        <div className="space-y-1.5 flex flex-col items-start w-full transition-all duration-200">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Select Form</Label>
          <Select value={data.formId} onValueChange={(val) => {
            const f = selectedSourceForms.find(x => x.id === val);
            onChange({ ...data, formId: val, subtitle: f ? `Form: ${f.name}` : undefined });
          }}>
            <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full">
              <SelectValue placeholder={currentForm?.name || "Select Form"} />
            </SelectTrigger>
            <SelectContent className="w-full">
              {selectedSourceForms.map(form => (
                <SelectItem key={form.id} value={form.id} className="text-[13px] py-1.5">
                  <span className="truncate">{form.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
