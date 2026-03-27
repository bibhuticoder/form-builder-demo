
import React, { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  GripVertical,
  Mail,
  MessageSquare,
  Bell,
  Link2,
  Unlink,
  Facebook,
  Video,
  FileText,
  Chrome,
  Check,
  ChevronsUpDown,
  Search
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// --- Types ---

interface AutomationConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node | null;
  onSave: (nodeId: string, data: any) => void;
  edges?: Edge[];
}

// --- Mock Data ---

const USERS = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'u3', name: 'Support Team', email: 'support@example.com' },
];

const TEAMS = [
  { id: 't1', name: 'Sales Team' },
  { id: 't2', name: 'Marketing Team' },
  { id: 't3', name: 'Customer Success' },
];

const AUTOMATIONS = [
  { id: 'a1', name: 'Onboarding Sequence' },
  { id: 'a2', name: 'Re-engagement Campaign' },
  { id: 'a3', name: 'Webinar Follow-up' },
];

const MOCK_TAGS = [
  { id: 'tag1', label: 'new-lead' },
  { id: 'tag2', label: 'customer' },
  { id: 'tag3', label: 'vip' },
  { id: 'tag4', label: 'churned' },
  { id: 'tag5', label: 'interested' },
];

// --- Icons ---

const GoogleIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
)

const TikTokIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

// --- Sub-Components for Different Configs ---

const FormSubmittedConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const formSources = [
    { id: 'cleave', name: 'Cleave Form', icon: FileText, integrate: false },
    { id: 'facebook', name: 'Facebook Form', icon: Facebook, integrate: true },
    { id: 'google', name: 'Google Form', icon: GoogleIcon, integrate: true },
    { id: 'tiktok', name: 'TikTok Form', icon: TikTokIcon, integrate: true },
  ];

  const getFormList = (sourceId: string) => {
    switch (sourceId) {
      case 'facebook':
        return [
          { id: 'fb1', name: 'Lead Gen Campaign Q1' },
          { id: 'fb2', name: 'Webinar Registration Form' },
          { id: 'fb3', name: 'Product Interest Survey' },
        ];
      case 'google':
        return [
          { id: 'g1', name: 'Customer Feedback Survey' },
          { id: 'g2', name: 'Event Registration' },
        ];
      case 'tiktok':
        return [
          { id: 'tt1', name: 'Influencer Collab Application' },
          { id: 'tt2', name: 'Viral Contest Entry' },
        ];
      case 'cleave':
        return [
          { id: 'c1', name: 'Contact Us Form' },
          { id: 'c2', name: 'Newsletter Signup' },
          { id: 'c3', name: 'Quote Request' }
        ];
      default:
        return [];
    }
  };

  const selectedSourceForms = getFormList(data.formType);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Form Source</Label>
        <Select
          value={data.formType}
          onValueChange={(val) => {
            const source = formSources.find(s => s.id === val);
            onChange({
              ...data,
              formType: val,
              icon: source?.icon, // Pass icon to parent for node rendering
              formId: undefined // Reset selected form when source changes
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Source" />
          </SelectTrigger>
          <SelectContent>
            {formSources.map(source => (
              <SelectItem key={source.id} value={source.id} className="w-full">
                <div className="flex items-center justify-between w-full min-w-[320px]">
                  <div className="flex items-center gap-2">
                    <source.icon className="w-4 h-4 text-muted-foreground" />
                    <span>{source.name}</span>
                  </div>
                  {source.integrate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs font-bold text-primary hover:text-primary/80 hover:bg-primary/10 ml-auto z-50 pointer-events-auto uppercase -mr-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Try to prevent selection if possible, though SelectItem might capture it
                        alert(`Integrating with ${source.name}...`);
                      }}
                    >
                      Integrate
                    </Button>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data.formType && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label>Select Form</Label>
          <Select
            value={data.formId}
            onValueChange={(val) => {
              const selectedForm = selectedSourceForms.find(f => f.id === val);
              onChange({
                ...data,
                formId: val,
                subtitle: selectedForm ? `Form is: ${selectedForm.name}` : undefined
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select a ${data.formType} form...`} />
            </SelectTrigger>
            <SelectContent>
              {selectedSourceForms.map(form => (
                <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

const TagTriggerConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [tags, setTags] = useState(MOCK_TAGS);

  // Initialize type to 'added' if not set
  useEffect(() => {
    if (!data.triggerType) {
      onChange({ ...data, triggerType: 'added', label: 'Tag Added' });
    }
  }, []);

  // Initialize selected tag from data if exists
  const selectedTag = tags.find(t => t.id === data.tagId) || null;

  const handleCreateTag = () => {
    if (!searchValue) return;

    // Convert to slug format: lowercase and replace spaces with hyphens
    const slug = searchValue.toLowerCase().trim().replace(/\s+/g, '-');

    const newTag = { id: `new-${Date.now()}`, label: slug };
    setTags([...tags, newTag]);
    onChange({ ...data, tagId: newTag.id, tagName: newTag.label, subtitle: `Tag is: ${newTag.label}` });
    setOpen(false);
    setSearchValue("");
  };

  const handleSearchChange = (value: string) => {
    // Convert input to lowercase and replace spaces with hyphens on the fly
    const slugified = value.toLowerCase().replace(/\s+/g, '-');
    setSearchValue(slugified);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Trigger Condition</Label>
        <div className="flex items-center space-x-2 border p-1 rounded-md bg-slate-100 w-fit">
          <Button
            variant={data.triggerType === 'added' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...data, triggerType: 'added', label: 'Tag Added' })}
            className="h-8"
          >
            Tag Added
          </Button>
          <Button
            variant={data.triggerType === 'removed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...data, triggerType: 'removed', label: 'Tag Removed' })}
            className="h-8"
          >
            Tag Removed
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Select Tag</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedTag ? selectedTag.label : "Select tag..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search tags..."
                value={searchValue}
                onValueChange={handleSearchChange}
              />
              <CommandList>
                <CommandEmpty className="py-2 px-2 text-sm">
                  <div className="flex flex-col items-center gap-2 p-2">
                    <span className="text-muted-foreground">No tag found.</span>
                    {searchValue && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={handleCreateTag}
                      >
                        Create "{searchValue}"
                      </Button>
                    )}
                  </div>
                </CommandEmpty>
                <CommandGroup heading="Existing Tags">
                  {tags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.label}
                      onSelect={() => {
                        onChange({ ...data, tagId: tag.id, tagName: tag.label, subtitle: `Tag is: ${tag.label}` });
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          data.tagId === tag.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
                {searchValue && !tags.find(t => t.label.toLowerCase() === searchValue.toLowerCase()) && (
                  <CommandGroup heading="Actions">
                    <CommandItem onSelect={handleCreateTag} className="cursor-pointer text-primary">
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{searchValue}"
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        <p>Trigger automation when the tag <strong>{selectedTag?.label || '...'}</strong> is {data.triggerType === 'added' ? 'added to' : 'removed from'} a contact.</p>
      </div>
    </div>
  );
};

const UserMultiSelect = ({
  selectedIds = [],
  onChange
}: {
  selectedIds: string[],
  onChange: (ids: string[]) => void
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const allOptions = [...USERS, ...TEAMS];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-auto min-h-[40px] py-2">
          <div className="flex flex-wrap gap-1">
            {selectedIds.length > 0
              ? selectedIds.map(id => {
                const opt = allOptions.find(o => o.id === id);
                return opt ? (
                  <span key={id} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs border border-primary/20">
                    {opt.name}
                  </span>
                ) : null;
              })
              : <span className="text-muted-foreground">Select users or teams...</span>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search users..." onValueChange={setSearchValue} />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              {allOptions.map(option => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    if (selectedIds.includes(option.id)) {
                      onChange(selectedIds.filter(id => id !== option.id));
                    } else {
                      onChange([...selectedIds, option.id]);
                    }
                    setOpen(true);
                  }}
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedIds.includes(option.id)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}>
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const TaskConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  useEffect(() => {
    if (!data.triggerType) {
      onChange({ ...data, triggerType: 'added', label: 'Task Added', subtitle: 'Task Added' });
    }
  }, []);

  const TASK_TYPES = [
    { id: 'all', label: 'Any Type' },
    { id: 'call', label: 'Call' },
    { id: 'email', label: 'Email' },
    { id: 'todo', label: 'To-do' },
    { id: 'meeting', label: 'Meeting' },
  ];

  const PRIORITIES = [
    { id: 'all', label: 'Any Priority' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  const updateConfig = (key: string, value: any) => {
    const newData = { ...data, [key]: value };

    // Update subtitle based on config
    let sub = '';
    if (newData.triggerType === 'added') sub = 'Task Added';
    else if (newData.triggerType === 'updated') sub = 'Task Updated';
    else if (newData.triggerType === 'completed') sub = 'Task Completed';

    if (newData.taskType && newData.taskType !== 'all') {
      const typeLabel = TASK_TYPES.find(t => t.id === newData.taskType)?.label;
      sub += ` (${typeLabel})`;
    }

    onChange({ ...newData, subtitle: sub });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Trigger Condition</Label>
        <div className="flex items-center space-x-2 border p-1 rounded-md bg-slate-100 w-fit">
          <Button
            variant={data.triggerType === 'added' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...data, triggerType: 'added', label: 'Task Added', subtitle: 'Task Added' })}
            className="h-8"
          >
            Task Added
          </Button>
          <Button
            variant={data.triggerType === 'updated' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...data, triggerType: 'updated', label: 'Task Updated', subtitle: 'Task Updated' })}
            className="h-8"
          >
            Task Updated
          </Button>
          <Button
            variant={data.triggerType === 'completed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...data, triggerType: 'completed', label: 'Task Completed', subtitle: 'Task Completed' })}
            className="h-8"
          >
            Task Completed
          </Button>
        </div>
      </div>

      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Filter by Type</Label>
            <Select
              value={data.taskType || 'all'}
              onValueChange={(val) => updateConfig('taskType', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPES.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Filter by Priority</Label>
            <Select
              value={data.priority || 'all'}
              onValueChange={(val) => updateConfig('priority', val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Assigned User</Label>
          <UserMultiSelect
            selectedIds={data.assignedUsers || []}
            onChange={(ids) => updateConfig('assignedUsers', ids)}
          />
          <p className="text-xs text-muted-foreground">Leave empty to trigger for any user.</p>
        </div>
      </div>

      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        <p>
          Trigger automation when a
          {data.priority && data.priority !== 'all' ? <strong> {PRIORITIES.find(p => p.id === data.priority)?.label} priority </strong> : ''}
          {data.taskType && data.taskType !== 'all' ? <strong> {TASK_TYPES.find(t => t.id === data.taskType)?.label} </strong> : ' task'}
          is <strong>{data.triggerType === 'added' ? 'added' : data.triggerType === 'completed' ? 'completed' : 'updated'}</strong>.
        </p>
      </div>
    </div>
  );
};

const EntityTriggerConfig = ({ data, onChange, entityName }: { data: any, onChange: (d: any) => void, entityName: string }) => {
  useEffect(() => {
    if (!data.triggerType) {
      onChange({ ...data, triggerType: 'added', label: `${entityName} Added` });
    }
  }, []);

  const CONTACT_FIELDS = [
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'tags', label: 'Tags' },
    { id: 'assigned_user', label: 'Assigned User' },
    { id: 'pipeline_stage', label: 'Pipeline Stage' },
  ];

  const COMPANY_FIELDS = [
    { id: 'name', label: 'Company Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'website', label: 'Website' },
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'industry', label: 'Industry' },
    { id: 'size', label: 'Company Size' },
  ];

  const NOTE_FIELDS = [
    { id: 'user_id', label: 'Created By' },
    { id: 'body', label: 'Note Body' },
  ];

  const FIELDS = entityName === 'Company' ? COMPANY_FIELDS : entityName === 'Note' ? NOTE_FIELDS : CONTACT_FIELDS;

  const OPERATORS = [
    { id: 'changed', label: 'Has changed' },
    { id: 'changed_to', label: 'Has changed to' },
    { id: 'includes', label: 'Includes' },
  ];

  const generateSubtitle = (conditions: any[]) => {
    if (!conditions || conditions.length === 0) return `${entityName} Updated`;
    if (conditions.length === 1) {
      const c = conditions[0];
      const fieldLabel = FIELDS.find(f => f.id === c.field)?.label || c.field || 'Field';
      if (c.operator === 'changed') return `${fieldLabel} changed`;
      if (c.operator === 'changed_to') return `${fieldLabel} changed to ${c.value}`;
      return `${fieldLabel} updated`;
    }
    return `${conditions.length} fields monitored`;
  };

  const addCondition = () => {
    const newConditions = [...(data.conditions || []), { field: '', operator: 'changed', value: '' }];
    const subtitle = generateSubtitle(newConditions);
    onChange({ ...data, conditions: newConditions, subtitle });
  };

  const updateCondition = (index: number, field: string, value: any) => {
    const newConditions = [...(data.conditions || [])];
    newConditions[index] = { ...newConditions[index], [field]: value };
    const subtitle = generateSubtitle(newConditions);
    onChange({ ...data, conditions: newConditions, subtitle });
  };

  const removeCondition = (index: number) => {
    const newConditions = [...(data.conditions || [])].filter((_, i) => i !== index);
    const subtitle = generateSubtitle(newConditions);
    onChange({ ...data, conditions: newConditions, subtitle });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Trigger Condition</Label>
        <div className="flex items-center space-x-2 border p-1 rounded-md bg-slate-100 w-fit">
          <Button
            variant={data.triggerType === 'added' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...data, triggerType: 'added', label: `${entityName} Added`, subtitle: `${entityName} Added` })}
            className="h-8"
          >
            {entityName} Added
          </Button>
          <Button
            variant={data.triggerType === 'removed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChange({ ...data, triggerType: 'removed', label: `${entityName} Removed`, subtitle: `${entityName} Removed` })}
            className="h-8"
          >
            {entityName} Removed
          </Button>
          <Button
            variant={data.triggerType === 'updated' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              // Initialize with one empty condition if none exist
              const defaultField = entityName === 'Company' ? 'name' : entityName === 'Note' ? 'body' : 'city';
              const initialConditions = data.conditions && data.conditions.length > 0 ? data.conditions : [{ field: defaultField, operator: 'changed' }];
              const subtitle = generateSubtitle(initialConditions);
              onChange({ ...data, triggerType: 'updated', label: `${entityName} Updated`, conditions: initialConditions, subtitle });
            }}
            className="h-8"
          >
            {entityName} Updated
          </Button>
        </div>
      </div>

      {data.triggerType === 'updated' && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monitor Fields</Label>
          </div>

          <div className="space-y-2">
            {(data.conditions || []).map((condition: any, index: number) => (
              <div key={index} className="flex gap-2 items-start group">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Select
                      value={condition.field}
                      onValueChange={(val) => {
                        // If switching to user_id, force operator to 'changed_to'
                        if (val === 'user_id') {
                          const newConditions = [...(data.conditions || [])];
                          newConditions[index] = { ...newConditions[index], field: val, operator: 'changed_to', value: [] };
                          const subtitle = generateSubtitle(newConditions);
                          onChange({ ...data, conditions: newConditions, subtitle });
                        } else {
                          updateCondition(index, 'field', val);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Field" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELDS.filter(f => {
                          // For Notes, filter out fields that are already selected in OTHER conditions
                          if (entityName === 'Note') {
                            const isSelectedElsewhere = (data.conditions || []).some((c: any, i: number) => i !== index && c.field === f.id);
                            return !isSelectedElsewhere;
                          }
                          return true;
                        }).map(f => (
                          <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {condition.field !== 'user_id' && (
                      <Select
                        value={condition.operator}
                        onValueChange={(val) => updateCondition(index, 'operator', val)}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map(op => (
                            <SelectItem key={op.id} value={op.id}>{op.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeCondition(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Render value input based on operator AND field */}
                  {condition.operator === 'changed_to' && condition.field !== 'user_id' && (
                    <Input
                      placeholder={`Enter value for ${FIELDS.find(f => f.id === condition.field)?.label || 'field'}...`}
                      value={condition.value || ''}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                  )}

                  {condition.operator === 'includes' && (
                    <Input
                      placeholder={`Enter text to check if included in ${FIELDS.find(f => f.id === condition.field)?.label || 'field'}...`}
                      value={condition.value || ''}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                  )}

                  {/* Special User Selection for "Created By" - always show when user_id is selected */}
                  {condition.field === 'user_id' && (
                    <div className="flex-1 space-y-2">
                      <UserMultiSelect
                        selectedIds={condition.value || []}
                        onChange={(newIds) => updateCondition(index, 'value', newIds)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(data.conditions?.length < FIELDS.length) && (
              <Button
                variant="outline"
                size="sm"
                onClick={addCondition}
                className="text-xs flex items-center gap-1 mt-2"
              >
                <Plus className="h-3 w-3" /> Add Field
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        {data.triggerType === 'updated' ? (
          <p>
            Trigger when
            {data.conditions && data.conditions.length > 0 ? (
              <span>
                {' '}<strong>{data.conditions.length} fields</strong> are updated on a {entityName.toLowerCase()}.
              </span>
            ) : (
              <span> any field is updated on a {entityName.toLowerCase()}.</span>
            )}
          </p>
        ) : (
          <p>Trigger automation when a <strong>{entityName}</strong> is {data.triggerType === 'added' ? 'added to' : 'removed from'} your list.</p>
        )}
      </div>
    </div>
  );
};

const BirthdayConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  useEffect(() => {
    // Only set default values if they aren't set or if they are incorrect
    if (data.label !== 'Birthday' || data.subtitle !== 'Triggers on contact\'s birthday') {
      onChange({
        ...data,
        label: 'Birthday',
        subtitle: 'Triggers on contact\'s birthday'
      });
    }
  }, []); // Only run on mount

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        <p>This automation will trigger based on a contact's listed birthday.</p>
        <p className="mt-2 text-xs text-muted-foreground">If a contact doesn't have a birthday listed, they won't trigger this automation.</p>
      </div>
    </div>
  );
};

const ChannelMultiSelect = ({
  selectedIds = [],
  onChange
}: {
  selectedIds: string[],
  onChange: (ids: string[]) => void
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const allOptions = [
    { id: 'sms', name: 'SMS' },
    { id: 'email', name: 'Email' },
    { id: 'call', name: 'Calls' },
    { id: 'fb', name: 'Facebook / Messenger' },
    { id: 'gmb', name: 'Google Business' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
  ];

  const handleSelectAll = () => {
    if (selectedIds.length === allOptions.length) {
      onChange([]);
    } else {
      onChange(allOptions.map(o => o.id));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-auto min-h-[40px] py-2">
          <div className="flex flex-wrap gap-1">
            {selectedIds.length > 0
              ? (selectedIds.length === allOptions.length ? (
                <span className="text-foreground font-medium">All Channels</span>
              ) : (
                selectedIds.map(id => {
                  const opt = allOptions.find(o => o.id === id);
                  return opt ? (
                    <span key={id} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs border border-primary/20">
                      {opt.name}
                    </span>
                  ) : null;
                })
              ))
              : <span className="text-muted-foreground">Select channels...</span>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search channels..." onValueChange={setSearchValue} />
          <CommandList>
            <CommandEmpty>No channel found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                key="all"
                value="Select All"
                onSelect={() => {
                  handleSelectAll();
                  setOpen(true);
                }}
                className="font-medium border-b"
              >
                <div className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selectedIds.length === allOptions.length
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                )}>
                  <Check className={cn("h-4 w-4")} />
                </div>
                Select All
              </CommandItem>
              {allOptions.map(option => (
                <CommandItem
                  key={option.id}
                  value={option.name}
                  onSelect={() => {
                    if (selectedIds.includes(option.id)) {
                      onChange(selectedIds.filter(id => id !== option.id));
                    } else {
                      onChange([...selectedIds, option.id]);
                    }
                    setOpen(true);
                  }}
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedIds.includes(option.id)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}>
                    <Check className={cn("h-4 w-4")} />
                  </div>
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const DNDConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const allOptions = [
    { id: 'sms', name: 'SMS' },
    { id: 'email', name: 'Email' },
    { id: 'call', name: 'Calls' },
    { id: 'fb', name: 'Facebook / Messenger' },
    { id: 'gmb', name: 'Google Business' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
  ];

  useEffect(() => {
    // Migration logic: If old single 'dndChannel' exists but new 'dndChannels' array doesn't
    if (data.dndChannel && !data.dndChannels) {
      let newChannels: string[] = [];
      if (data.dndChannel === 'all') {
        newChannels = allOptions.map(o => o.id);
      } else {
        newChannels = [data.dndChannel];
      }

      // Also ensure triggerType is migrated if needed (though it seems we kept 'dnd_on'/'dnd_off' mostly compatible, just removed 'updated')
      // But we did rename 'Enabled' to 'Silenced' in UI, underlying value 'dnd_on' is same.

      // Force update to new structure
      updateConfig('dndChannels', newChannels);
    }
    // Initialization for new nodes
    else if (!data.triggerType) {
      const allIds = allOptions.map(o => o.id);
      onChange({ ...data, triggerType: 'dnd_on', label: 'DND Silenced', dndChannels: allIds, subtitle: 'DND Silenced (All Channels)' });
    }
  }, []);

  const updateConfig = (key: string, value: any) => {
    // Create new data object, intentionally clearing legacy 'dndChannel' if we are setting 'dndChannels'
    const newData = { ...data, [key]: value };
    if (key === 'dndChannels') {
      delete newData.dndChannel; // Cleanup legacy field
    }

    // Subtitle generation logic
    let sub = '';
    if (newData.triggerType === 'dnd_on') sub = 'DND Silenced';
    else if (newData.triggerType === 'dnd_off') sub = 'Channel Reactivated';

    if (newData.dndChannels && newData.dndChannels.length > 0) {
      if (newData.dndChannels.length === allOptions.length) {
        sub += ` (All Channels)`;
      } else if (newData.dndChannels.length === 1) {
        const channelLabel = newData.dndChannels[0].toUpperCase();
        sub += ` (${channelLabel})`;
      } else {
        sub += ` (${newData.dndChannels.length} Channels)`;
      }
    } else {
      sub += ` (No Channels Selected)`;
    }

    onChange({ ...newData, subtitle: sub, label: newData.triggerType === 'dnd_on' ? 'DND Silenced' : 'DND Reactivated' });
  };


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Trigger Condition</Label>
        <div className="flex items-center space-x-2 border p-1 rounded-md bg-slate-100 w-fit">
          <Button
            variant={data.triggerType === 'dnd_on' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => updateConfig('triggerType', 'dnd_on')}
            className="h-8"
          >
            Silenced
          </Button>
          <Button
            variant={data.triggerType === 'dnd_off' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => updateConfig('triggerType', 'dnd_off')}
            className="h-8"
          >
            Active
          </Button>
        </div>
      </div>

      <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <Label>Channels</Label>
        <ChannelMultiSelect
          selectedIds={data.dndChannels || []}
          onChange={(ids) => updateConfig('dndChannels', ids)}
        />
        <p className="text-xs text-muted-foreground">Select channels to monitor.</p>
      </div>

      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        {data.triggerType === 'dnd_on' ? (
          <p>Trigger when a contact's communication channel is <strong>silenced</strong> (they opt-out or DND is enabled) for
            <strong> {(!data.dndChannels || data.dndChannels.length === 0) ? 'no channels (select at least one)' :
              (data.dndChannels.length === allOptions.length ? 'all channels' : `${data.dndChannels.length} selected channel(s)`)}
            </strong>.</p>
        ) : (
          <p>Trigger when a contact's communication channel is <strong>reactivated</strong> (they opt-in or DND is disabled) for
            <strong> {(!data.dndChannels || data.dndChannels.length === 0) ? 'no channels (select at least one)' :
              (data.dndChannels.length === allOptions.length ? 'all channels' : `${data.dndChannels.length} selected channel(s)`)}
            </strong>.</p>
        )}
      </div>
    </div>
  );
};

const SocialMessageConfig = ({ data, onChange, type }: { data: any, onChange: (d: any) => void, type: 'dm' | 'comment' }) => {
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Video },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
    { id: 'cleave', name: 'Cleave', icon: FileText }, // Added Cleave as requested
  ];

  useEffect(() => {
    if (!data.platform) {
      onChange({ ...data, platform: 'instagram', label: `${type === 'dm' ? 'DM' : 'Comment'} Received`, subtitle: 'Instagram' });
    }
  }, []);

  const updateConfig = (key: string, value: any) => {
    const newData = { ...data, [key]: value };

    const p = platforms.find(pl => pl.id === (key === 'platform' ? value : newData.platform));
    const platformName = p?.name || 'Social';

    let sub = `${platformName} ${type === 'dm' ? 'DM' : 'Comment'}`;
    if (newData.keyword) {
      sub += ` ("${newData.keyword}")`;
    }

    // Update icon as well
    newData.icon = p?.icon;

    onChange({ ...newData, subtitle: sub });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Platform</Label>
        <Select
          value={data.platform}
          onValueChange={(val) => updateConfig('platform', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {platforms.map(p => (
              <SelectItem key={p.id} value={p.id}>
                <div className="flex items-center gap-2">
                  <p.icon className="w-4 h-4" /> {p.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Contains Phrase (Optional)</Label>
        <Input
          value={data.keyword || ''}
          onChange={(e) => updateConfig('keyword', e.target.value)}
          placeholder='e.g. "info", "price", "demo"'
        />
        <p className="text-xs text-muted-foreground">Leave empty to trigger on all incoming {type === 'dm' ? 'messages' : 'comments'}.</p>
      </div>

      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        <p>Trigger when you receive a <strong>{type === 'dm' ? 'direct message' : 'comment'}</strong> on <strong>{platforms.find(p => p.id === data.platform)?.name}</strong> {data.keyword ? `containing "${data.keyword}"` : ''}.</p>
      </div>
    </div>
  );
};

const CALL_STATUSES = [
  { id: 'completed', label: 'Call Completed' },
  { id: 'missed', label: 'No Answer' },
  { id: 'voicemail', label: 'Voicemail' },
  { id: 'busy', label: 'Busy' },
  { id: 'failed', label: 'Failed' },
];

const DIRECTIONS = [
  { id: 'all', label: 'Any Direction' },
  { id: 'inbound', label: 'Incoming' },
  { id: 'outbound', label: 'Outgoing' },
];

const StatusMultiSelect = ({
  selectedIds = [],
  onChange
}: {
  selectedIds: string[],
  onChange: (ids: string[]) => void
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-auto min-h-[40px] py-2">
          <div className="flex flex-wrap gap-1">
            {selectedIds.length > 0
              ? (selectedIds.length === CALL_STATUSES.length ? <span className="text-foreground font-medium">Any Status</span> : selectedIds.map(id => {
                const opt = CALL_STATUSES.find(o => o.id === id);
                return opt ? (
                  <span key={id} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs border border-primary/20">
                    {opt.label}
                  </span>
                ) : null;
              }))
              : <span className="text-muted-foreground">Select statuses...</span>}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-2" align="start">
        <div className="space-y-1">
          <div
            onClick={() => {
              if (selectedIds.length === CALL_STATUSES.length) {
                onChange([]);
              } else {
                onChange(CALL_STATUSES.map(o => o.id));
              }
            }}
            className={cn(
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            )}
          >
            <div className={cn(
              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
              selectedIds.length === CALL_STATUSES.length
                ? "bg-primary text-primary-foreground"
                : "opacity-50 [&_svg]:invisible"
            )}>
              <Check className={cn("h-4 w-4")} />
            </div>
            Select All
          </div>
          <div className="h-px bg-border my-1" />
          {CALL_STATUSES.map(option => (
            <div
              key={option.id}
              className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (selectedIds.includes(option.id)) {
                  onChange(selectedIds.filter(id => id !== option.id));
                } else {
                  onChange([...selectedIds, option.id]);
                }
              }}
            >
              <div className={cn(
                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                selectedIds.includes(option.id)
                  ? "bg-primary text-primary-foreground"
                  : "opacity-50 [&_svg]:invisible"
              )}>
                <Check className={cn("h-4 w-4")} />
              </div>
              {option.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CallStatusConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  useEffect(() => {
    // Initialize with all statuses selected if not set
    if (!data.statuses) {
      // If coming from single select legacy data
      if (data.status && data.status !== 'all') {
        onChange({ ...data, statuses: [data.status], direction: data.direction || 'all', subtitle: 'Call Status' });
      } else {
        onChange({ ...data, statuses: CALL_STATUSES.map(s => s.id), direction: 'all', subtitle: 'Any Call Status' });
      }
    }
  }, []);

  const updateConfig = (key: string, value: any) => {
    const newData = { ...data, [key]: value };

    // Subtitle generation
    let sub = '';
    const directionLabel = DIRECTIONS.find(d => d.id === newData.direction)?.label;

    // Count selected statuses
    const selectedCount = newData.statuses?.length || 0;
    const allSelected = selectedCount === CALL_STATUSES.length;

    let statusText = '';
    if (selectedCount === 0) statusText = 'No Status';
    else if (allSelected) statusText = 'Any Status';
    else if (selectedCount === 1) statusText = CALL_STATUSES.find(s => s.id === newData.statuses[0])?.label || 'Call';
    else statusText = `${selectedCount} Statuses`;

    if (newData.direction && newData.direction !== 'all') {
      sub = `${directionLabel} ${statusText}`;
    } else {
      sub = statusText;
    }

    onChange({ ...newData, subtitle: sub });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Call Status</Label>
        <StatusMultiSelect
          selectedIds={data.statuses || []}
          onChange={(ids) => updateConfig('statuses', ids)}
        />
      </div>

      <div className="space-y-2">
        <Label>Call Direction</Label>
        <Select
          value={data.direction || 'all'}
          onValueChange={(val) => updateConfig('direction', val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIRECTIONS.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        <p>
          Trigger automation when a call results in: <strong>
            {(!data.statuses || data.statuses.length === 0) ? 'no status (select at least one)' :
              (data.statuses.length === CALL_STATUSES.length ? 'any status' :
                data.statuses.map((s: string) => CALL_STATUSES.find(cs => cs.id === s)?.label).join(', '))}
          </strong>
          {data.direction && data.direction !== 'all' && (
            <span> ({DIRECTIONS.find(d => d.id === data.direction)?.label})</span>
          )}.
        </p>
      </div>
    </div>
  );
};

const EmailConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>From Name</Label>
        <Input
          value={data.fromName || ''}
          onChange={e => onChange({ ...data, fromName: e.target.value })}
          placeholder="e.g. Sales Team"
        />
      </div>
      <div className="space-y-2">
        <Label>From Email</Label>
        <Input
          value={data.fromEmail || ''}
          onChange={e => onChange({ ...data, fromEmail: e.target.value })}
          placeholder="e.g. sales@company.com"
        />
      </div>
      <div className="space-y-2">
        <Label>Subject</Label>
        <Input
          value={data.subject || ''}
          onChange={e => onChange({ ...data, subject: e.target.value })}
          placeholder="Enter email subject..."
        />
      </div>
      <div className="space-y-2">
        <Label>Message Body</Label>
        <div className="min-h-[200px] border rounded-md">
          <ReactQuill
            theme="snow"
            value={data.message || ''}
            onChange={(content: string) => onChange({ ...data, message: content })}
            modules={modules}
            formats={formats}
            className="h-[180px]"
          />
        </div>
        <div className="h-8"></div> {/* Spacer for toolbar */}
      </div>
    </div>
  );
};

const NotificationConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const [recipientType, setRecipientType] = useState(data.recipientType || 'user');

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Send Notification To</Label>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="user"
              name="recipientType"
              checked={recipientType === 'user'}
              onChange={() => { setRecipientType('user'); onChange({ ...data, recipientType: 'user' }); }}
              className="accent-primary"
            />
            <Label htmlFor="user" className="cursor-pointer font-normal">Specific User</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="team"
              name="recipientType"
              checked={recipientType === 'team'}
              onChange={() => { setRecipientType('team'); onChange({ ...data, recipientType: 'team' }); }}
              className="accent-primary"
            />
            <Label htmlFor="team" className="cursor-pointer font-normal">Team</Label>
          </div>
        </div>

        {recipientType === 'user' ? (
          <Select
            value={data.recipientId}
            onValueChange={(val) => onChange({ ...data, recipientId: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select User..." />
            </SelectTrigger>
            <SelectContent>
              {USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
            </SelectContent>
          </Select>
        ) : (
          <Select
            value={data.recipientId}
            onValueChange={(val) => onChange({ ...data, recipientId: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Team..." />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-3">
        <Label>Channels</Label>
        <div className="space-y-2 border rounded-lg p-4 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email"
              checked={data.channels?.email}
              onCheckedChange={(c) => onChange({ ...data, channels: { ...data.channels, email: c } })}
            />
            <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer font-normal">
              <Mail className="w-4 h-4 text-slate-500" /> Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sms"
              checked={data.channels?.sms}
              onCheckedChange={(c) => onChange({ ...data, channels: { ...data.channels, sms: c } })}
            />
            <Label htmlFor="sms" className="flex items-center gap-2 cursor-pointer font-normal">
              <MessageSquare className="w-4 h-4 text-slate-500" /> SMS
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inApp"
              checked={data.channels?.inApp}
              onCheckedChange={(c) => onChange({ ...data, channels: { ...data.channels, inApp: c } })}
            />
            <Label htmlFor="inApp" className="flex items-center gap-2 cursor-pointer font-normal">
              <Bell className="w-4 h-4 text-slate-500" /> In-App Notification
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea
          value={data.message || ''}
          onChange={e => onChange({ ...data, message: e.target.value })}
          placeholder="Notification message..."
        />
      </div>
    </div>
  );
};

const IfElseConfig = ({ data, onChange, edges, node }: { data: any, onChange: (d: any) => void, edges?: Edge[], node: Node }) => {
  // Determine number of branches based on edges
  const branchesCount = edges ? edges.filter(e => e.source === node.id).length : 2;
  const safeBranchesCount = Math.max(Math.min(branchesCount, 5), 2); // Clamp between 2 and 5

  // Initialize branches if needed or if branch count changed
  const branches = data.branches && data.branches.length === safeBranchesCount
    ? data.branches
    : Array(safeBranchesCount).fill({ name: '', condition: '', value: '' }).map((b, i) => ({ ...b, name: `Branch ${i + 1}` }));

  const updateBranch = (index: number, key: string, value: any) => {
    const newBranches = [...branches];
    newBranches[index] = { ...newBranches[index], [key]: value };
    onChange({ ...data, branches: newBranches });
  };

  const CONDITIONS = [
    {
      label: "Contact Details",
      options: [
        { id: "tags", label: "Tags" },
        { id: "email", label: "Email" },
        { id: "phone", label: "Phone" },
        { id: "country", label: "Country" },
      ]
    },
    {
      label: "Events",
      options: [
        { id: "email_opened", label: "Email Opened" },
        { id: "link_clicked", label: "Link Clicked" },
        { id: "reply_received", label: "Reply Received" },
        { id: "form_submitted", label: "Form Submitted" },
      ]
    },
    {
      label: "Date & Time",
      options: [
        { id: "current_day", label: "Current Day of Week" },
        { id: "current_hour", label: "Current Hour" },
        { id: "is_business_hours", label: "Is Business Hours" },
      ]
    }
  ];

  const OPERATORS = {
    tags: [
      { id: "includes", label: "Includes" },
      { id: "excludes", label: "Does not include" },
      { id: "is_empty", label: "Is empty" },
      { id: "is_not_empty", label: "Is not empty" }
    ],
    email: [
      { id: "contains", label: "Contains" },
      { id: "does_not_contain", label: "Does not contain" },
      { id: "ends_with", label: "Ends with" }
    ],
    general: [
      { id: "is", label: "Is" },
      { id: "is_not", label: "Is not" },
      { id: "contains", label: "Contains" }
    ],
    boolean: [
      { id: "true", label: "True" },
      { id: "false", label: "False" }
    ]
  };

  const getOperators = (conditionId: string) => {
    if (conditionId === 'tags') return OPERATORS.tags;
    if (conditionId === 'email') return OPERATORS.email;
    if (conditionId === 'is_business_hours') return OPERATORS.boolean;
    return OPERATORS.general;
  };

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
        <p className="text-sm text-amber-800">
          Configure conditions for your {safeBranchesCount} branches. The first matching condition will determine the path.
        </p>
      </div>

      <div className="space-y-4">
        {branches.map((branch: any, idx: number) => {
          // Use 'None' for the last branch as a fallback if desired, or allow all to be conditional
          // Typically last branch is "Else" / "Default"
          const isLast = idx === branches.length - 1;

          return (
            <Card key={idx} className="p-4 border-l-4 border-l-amber-500">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">
                    {isLast ? "Default Branch (Else)" : `Branch ${idx + 1}`}
                  </Label>
                </div>

                {!isLast && (
                  <>
                    <div className="space-y-2">
                      <Label>Branch Name</Label>
                      <Input
                        value={branch.name}
                        onChange={(e) => updateBranch(idx, 'name', e.target.value)}
                        placeholder={`e.g. Interested Leads`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Condition</Label>
                        <Select
                          value={branch.condition}
                          onValueChange={(val) => updateBranch(idx, 'condition', val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITIONS.map(group => (
                              <CommandGroup key={group.label} heading={group.label}>
                                {group.options.map(opt => (
                                  <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                                ))}
                              </CommandGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {branch.condition && (
                        <div className="space-y-2">
                          <Label>Operator</Label>
                          <Select
                            value={branch.operator}
                            onValueChange={(val) => updateBranch(idx, 'operator', val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              {getOperators(branch.condition).map(op => (
                                <SelectItem key={op.id} value={op.id}>{op.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>

                    {branch.condition && !['is_business_hours', 'is_empty', 'is_not_empty'].includes(branch.condition) && !['is_empty', 'is_not_empty', 'true', 'false'].includes(branch.operator) && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                        <Label>Value</Label>
                        <Input
                          value={branch.value}
                          onChange={(e) => updateBranch(idx, 'value', e.target.value)}
                          placeholder="Value to match..."
                        />
                      </div>
                    )}
                  </>
                )}

                {isLast && (
                  <p className="text-sm text-muted-foreground italic">
                    Any contacts that do not match the above conditions will follow this path.
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const SplitTestConfig = ({ data, onChange, node, edges }: { data: any, onChange: (d: any) => void, node: Node, edges?: Edge[] }) => {
  // Determine number of branches based on edges
  const branchesCount = edges ? edges.filter(e => e.source === node.id).length : 2;
  const safeBranchesCount = Math.max(Math.min(branchesCount, 5), 2); // Clamp between 2 and 5

  // Initialize weights if needed or if branch count changed
  const initialWeights = data.weights && data.weights.length === safeBranchesCount
    ? data.weights
    : Array(safeBranchesCount).fill(Math.floor(100 / safeBranchesCount));

  // Correction for remainder if creating new weights
  if (!data.weights || data.weights.length !== safeBranchesCount) {
    const sum = initialWeights.reduce((a: number, b: number) => a + b, 0);
    if (sum < 100) initialWeights[0] += (100 - sum);
  }

  const [weights, setWeights] = useState<number[]>(initialWeights);
  const [isLinked, setIsLinked] = useState(data.isLinked !== false); // Default to true
  const [testType, setTestType] = useState(data.testType || 'duration');
  const [notifyMe, setNotifyMe] = useState(data.notifyMe || false);

  // Sync state with parent data
  useEffect(() => {
    const hasChanged =
      JSON.stringify(weights) !== JSON.stringify(data.weights) ||
      isLinked !== data.isLinked ||
      testType !== data.testType ||
      notifyMe !== data.notifyMe;

    if (hasChanged) {
      onChange({ ...data, weights, isLinked, testType, notifyMe });
    }
  }, [weights, isLinked, testType, notifyMe]);

  const updateWeight = (index: number, val: number) => {
    // Clamp value between 0 and 100
    val = Math.max(0, Math.min(100, val));

    const newWeights = [...weights];
    const oldVal = newWeights[index];

    if (val === oldVal) return;

    // If we are setting one value, the rest need to adjust to keep sum = 100
    // Calculate the difference we need to absorb
    const diff = val - oldVal;

    // We can't absorb more than what the others have
    // But if we increase one, we decrease others. If we decrease one, we increase others.

    newWeights[index] = val;

    // Indices of other branches
    const otherIndices = newWeights.map((_, i) => i).filter(i => i !== index);
    const otherTotal = otherIndices.reduce((sum, i) => sum + weights[i], 0);

    if (otherTotal === 0) {
      // If all others are 0, we can only decrease the current one (which creates a gap < 100)
      // Or if we are decreasing the current one, we distribute the gain evenly?
      if (diff < 0) {
        const gain = -diff;
        const split = gain / otherIndices.length;
        otherIndices.forEach(i => newWeights[i] += split);
      } else {
        // If we try to increase current but others are 0, we can't.
        // But actually, if others are 0, current must be 100.
        // So we can only decrease.
      }
    } else {
      // Distribute the diff among others proportionally
      // If diff is positive (increase), we subtract from others
      // If diff is negative (decrease), we add to others

      let remainingDiff = diff;

      otherIndices.forEach((i, idx) => {
        // Calculate proportion based on current weight relative to otherTotal
        const ratio = weights[i] / otherTotal;

        // If it's the last one, just take the remainder to avoid rounding issues
        if (idx === otherIndices.length - 1) {
          newWeights[i] -= remainingDiff;
        } else {
          const share = Math.round(diff * ratio);
          newWeights[i] -= share;
          remainingDiff -= share;
        }

        // Clamp to ensure no negative weights
        // This acts as a limiter: if one hits 0, the next takes more load?
        // Simple proportional logic might produce negatives if diff is large.
        // Let's rely on the fact that UI sliders prevent jumping too far, 
        // but for safety we should re-normalize if needed.
      });
    }

    // Final safety normalization
    // Ensure no negatives
    for (let i = 0; i < newWeights.length; i++) {
      if (newWeights[i] < 0) newWeights[i] = 0;
    }

    // Re-sum and adjust largest or last non-index
    let newSum = newWeights.reduce((a, b) => a + b, 0);

    if (newSum !== 100) {
      const error = 100 - newSum;
      // Find a candidate to absorb error (preferably not the one we just modified, unless it's the only one)
      // Add to the largest of the others to minimize relative impact
      let adjustIdx = -1;
      let maxVal = -1;

      otherIndices.forEach(i => {
        if (newWeights[i] > maxVal) {
          maxVal = newWeights[i];
          adjustIdx = i;
        }
      });

      if (adjustIdx === -1) adjustIdx = otherIndices[0]; // Fallback

      if (newWeights[adjustIdx] + error >= 0) {
        newWeights[adjustIdx] += error;
      } else {
        // If still can't absorb, just force last one
        newWeights[newWeights.length - 1] += error;
      }
    }

    setWeights(newWeights);
    setIsLinked(false); // Custom adjustment breaks "even link"
  };

  const handleLink = () => {
    setIsLinked(true);
    const even = Math.floor(100 / safeBranchesCount);
    const newWeights = Array(safeBranchesCount).fill(even);

    // Remainder
    const sum = newWeights.reduce((a, b) => a + b, 0);
    if (sum < 100) {
      for (let i = 0; i < (100 - sum); i++) {
        newWeights[i]++;
      }
    }
    setWeights(newWeights);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> It's recommended to test different email subjects and open rates in your first tests before adjusting body content and conversions or clicks.
        </p>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <p className="text-sm text-amber-800">
          Adjust the traffic split for your {safeBranchesCount} branches. Total must equal 100%.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          variant={isLinked ? "default" : "outline"}
          size="sm"
          onClick={handleLink}
          className="gap-2"
          title="Distribute Evenly"
        >
          {isLinked ? <Link2 className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
          {isLinked ? "Distribute Evenly" : "Unlinked (Custom)"}
        </Button>
      </div>

      <div className="space-y-6">
        {weights.map((weight: number, idx: number) => (
          <div key={idx} className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-medium">Branch {String.fromCharCode(65 + idx)}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => updateWeight(idx, parseInt(e.target.value) || 0)}
                  className="w-16 h-8 text-right font-mono font-bold"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[weight]}
              max={100}
              step={1}
              onValueChange={(vals) => updateWeight(idx, vals[0])}
              className="py-2"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t space-y-4">
        <div className="space-y-2">
          <Label>Winning Criteria</Label>
          <Select
            value={data.winnerCriteria || 'manual'}
            onValueChange={(val) => onChange({ ...data, winnerCriteria: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select criteria..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manually Select Winner</SelectItem>
              <SelectItem value="opens">Highest Open Rate</SelectItem>
              <SelectItem value="clicks">Highest Click Rate</SelectItem>
              <SelectItem value="conversions">Highest Conversion Rate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="notifyMe"
            checked={notifyMe}
            onCheckedChange={(c) => setNotifyMe(c === true)}
          />
          <Label htmlFor="notifyMe" className="cursor-pointer font-normal">
            Notify me when a winner is chosen
          </Label>
        </div>

        <div className="space-y-3 pt-2">
          <Label>Test Settings</Label>
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-md">
            <Button
              variant={testType === 'duration' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setTestType('duration')}
            >
              Test Duration
            </Button>
            <Button
              variant={testType === 'contacts' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setTestType('contacts')}
            >
              Contact Count
            </Button>
          </div>

          {testType === 'duration' ? (
            <div className="flex gap-2 animate-in fade-in slide-in-from-top-1">
              <Input
                type="number"
                className="w-20"
                placeholder="4"
                value={data.durationVal || ''}
                onChange={(e) => onChange({ ...data, durationVal: e.target.value })}
              />
              <Select
                value={data.durationUnit || 'hours'}
                onValueChange={(val) => onChange({ ...data, durationUnit: val })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              <Label className="text-xs text-muted-foreground">Run test for the first:</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 1000"
                  value={data.contactCount || ''}
                  onChange={(e) => onChange({ ...data, contactCount: e.target.value })}
                  className="flex-1"
                />
                <span className="text-sm font-medium">Contacts</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SendToAutomationConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Select Destination Automation</Label>
      <Select
        value={data.targetAutomationId}
        onValueChange={(val) => onChange({ ...data, targetAutomationId: val })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select automation..." />
        </SelectTrigger>
        <SelectContent>
          {AUTOMATIONS.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        The contact will assume the 'Start' position of the selected automation.
      </p>
    </div>
  </div>
);

const EngagementScoreConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  useEffect(() => {
    if (data.score === undefined) {
      onChange({ ...data, score: 50, operator: 'gt', subtitle: 'Greater than 50' });
    }
  }, []);

  const updateConfig = (key: string, value: any) => {
    const newData = { ...data, [key]: value };

    // Generate subtitle
    const score = key === 'score' ? value : (data.score ?? 50);
    const operator = key === 'operator' ? value : (data.operator || 'gt');

    let operatorText = '';
    switch (operator) {
      case 'eq': operatorText = 'Equal to'; break;
      case 'gte': operatorText = 'Greater than or equal to'; break;
      case 'lte': operatorText = 'Less than or equal to'; break;
      case 'gt': operatorText = 'Greater than'; break;
      case 'lt': operatorText = 'Less than'; break;
      default: operatorText = 'Greater than';
    }

    newData.subtitle = `${operatorText} ${score}`;
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Condition</Label>
        <Select
          value={data.operator || 'gt'}
          onValueChange={(val) => updateConfig('operator', val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eq">Equals</SelectItem>
            <SelectItem value="gt">Greater than</SelectItem>
            <SelectItem value="gte">Greater than or equals</SelectItem>
            <SelectItem value="lt">Less than</SelectItem>
            <SelectItem value="lte">Less than or equals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Score Threshold</Label>
          <span className="bg-slate-100 px-2 py-1 rounded text-sm font-mono font-bold text-slate-700">
            {data.score ?? 50}
          </span>
        </div>
        <Slider
          value={[data.score ?? 50]}
          max={100}
          step={1}
          onValueChange={(vals) => updateConfig('score', vals[0])}
          className="py-2"
        />
      </div>

      <div className="p-4 border rounded-md bg-slate-50 text-slate-600 text-sm">
        <p>Trigger automation when a contact's engagement score is <strong>{data.operator === 'eq' ? 'equal to' : data.operator === 'gte' ? 'greater than or equal to' : data.operator === 'lte' ? 'less than or equal to' : data.operator === 'lt' ? 'less than' : 'greater than'} {data.score ?? 50}</strong>.</p>
      </div>
    </div>
  );
};

const LoopBackConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => (
  <div className="space-y-4">
    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-2">
      <p className="text-sm text-amber-800">
        Connect this step to an earlier part of your automation to create a loop.
      </p>
    </div>
    <div className="space-y-2">
      <Label>Loop Target</Label>
      <Input value="Use the connection handle on the canvas" disabled />
      <p className="text-xs text-muted-foreground">
        Drag the connector from the loop node to any previous step on the canvas to set the target.
      </p>
    </div>
    <div className="space-y-2 mt-4">
      <Label>Maximum Loops (Safety)</Label>
      <Input
        type="number"
        placeholder="1"
        min={1}
        max={5}
        value={data.maxLoops || 1}
        onChange={(e) => {
          let val = parseInt(e.target.value);
          if (val > 5) val = 5;
          if (val < 1) val = 1;
          onChange({ ...data, maxLoops: val });
        }}
      />
      <p className="text-xs text-muted-foreground">Maximum of 5 loops allowed to prevent infinite cycles.</p>
    </div>
  </div>
);

const WaitConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const [mode, setMode] = useState<'time' | 'condition'>(data.mode || 'time');

  useEffect(() => {
    if (!data.mode) {
      onChange({ ...data, mode: 'time', durationVal: 1, durationUnit: 'hours', subtitle: 'Wait 1 hours' });
    }
  }, []);

  const updateData = (updates: any) => {
    const newData = { ...data, ...updates };

    // Generate subtitle
    let sub = '';
    if (newData.mode === 'time') {
      sub = `Wait ${newData.durationVal} ${newData.durationUnit}`;
      if (newData.resumeWindow) sub += ' (Window)';
    } else {
      const eventLabel = WAIT_EVENTS.find(e => e.id === newData.waitEvent)?.label || 'Event';
      sub = `Wait for ${eventLabel}`;
    }

    onChange({ ...newData, subtitle: sub });
  };

  const WAIT_EVENTS = [
    { id: 'email_opened', label: 'Email Opened' },
    { id: 'email_replied', label: 'Email Replied' },
    { id: 'link_clicked', label: 'Link Clicked' },
    { id: 'form_submitted', label: 'Form Submitted' },
    { id: 'sms_replied', label: 'SMS Replied' },
    { id: 'appointment_booked', label: 'Appointment Booked' },
    { id: 'tag_added', label: 'Tag Added' },
    { id: 'field_updated', label: 'Field Updated' },
  ];

  const DAYS = [
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' },
    { id: 'sun', label: 'Sun' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-md">
        <Button
          variant={mode === 'time' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => { setMode('time'); updateData({ mode: 'time' }); }}
        >
          Time Delay
        </Button>
        <Button
          variant={mode === 'condition' ? 'default' : 'ghost'}
          size="sm"
          className="flex-1"
          onClick={() => { setMode('condition'); updateData({ mode: 'condition' }); }}
        >
          Wait for Event
        </Button>
      </div>

      {mode === 'time' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label>Wait Duration</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                className="w-24"
                value={data.durationVal || ''}
                onChange={(e) => updateData({ durationVal: e.target.value })}
              />
              <Select
                value={data.durationUnit || 'hours'}
                onValueChange={(val) => updateData({ durationUnit: val })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resume Window</Label>
                <p className="text-xs text-muted-foreground">Only resume on specific days/times</p>
              </div>
              <Checkbox
                checked={data.resumeWindow || false}
                onCheckedChange={(c) => updateData({ resumeWindow: c === true })}
              />
            </div>

            {data.resumeWindow && (
              <div className="space-y-4 pl-2 border-l-2 border-slate-100 ml-1">
                <div className="space-y-2">
                  <Label className="text-xs">Allowed Days</Label>
                  <div className="flex flex-wrap gap-1">
                    {DAYS.map(day => {
                      const selected = (data.resumeDays || []).includes(day.id);
                      return (
                        <div
                          key={day.id}
                          onClick={() => {
                            const current = data.resumeDays || [];
                            const newDays = selected
                              ? current.filter((d: string) => d !== day.id)
                              : [...current, day.id];
                            updateData({ resumeDays: newDays });
                          }}
                          className={cn(
                            "px-2 py-1 text-xs rounded border cursor-pointer select-none transition-colors",
                            selected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-white hover:bg-slate-50 text-slate-600"
                          )}
                        >
                          {day.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Start Time</Label>
                    <Input
                      type="time"
                      value={data.resumeStartTime || "09:00"}
                      onChange={(e) => updateData({ resumeStartTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">End Time</Label>
                    <Input
                      type="time"
                      value={data.resumeEndTime || "17:00"}
                      onChange={(e) => updateData({ resumeEndTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-2">
            <p className="text-sm text-amber-800">
              The automation will pause here until the selected event occurs for the contact.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Wait For Event</Label>
            <Select
              value={data.waitEvent}
              onValueChange={(val) => updateData({ waitEvent: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event..." />
              </SelectTrigger>
              <SelectContent>
                {WAIT_EVENTS.map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.waitEvent && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
              {data.waitEvent.includes('email') && (
                <p className="text-xs text-muted-foreground">Applies to the most recent email sent in this automation.</p>
              )}
              {data.waitEvent.includes('sms') && (
                <p className="text-xs text-muted-foreground">Applies to the most recent SMS sent in this automation.</p>
              )}
            </div>
          )}

          <div className="pt-4 border-t space-y-2">
            <Label>Timeout (Optional)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                className="w-24"
                placeholder="None"
                value={data.timeoutVal || ''}
                onChange={(e) => updateData({ timeoutVal: e.target.value })}
              />
              <Select
                value={data.timeoutUnit || 'days'}
                onValueChange={(val) => updateData({ timeoutUnit: val })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">If event doesn't happen within this time, continue anyway.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const GenericConfig = ({ data, onChange, type }: { data: any, onChange: (d: any) => void, type: string }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Label</Label>
      <Input
        value={data.label || ''}
        onChange={e => onChange({ ...data, label: e.target.value })}
      />
    </div>
    <div className="space-y-2">
      <Label>Description</Label>
      <Input
        value={data.subtitle || ''}
        onChange={e => onChange({ ...data, subtitle: e.target.value })}
      />
    </div>
    <div className="p-4 border rounded-md bg-slate-50 text-slate-500 text-sm italic">
      Specific settings for {type} will appear here.
    </div>
  </div>
);

// --- Main Modal Component ---

export function AutomationConfigModal({ isOpen, onClose, node, onSave, edges }: AutomationConfigModalProps) {
  const [formData, setFormData] = useState<any>({});

  // Reset form when node changes
  useEffect(() => {
    if (node) {
      setFormData({ ...node.data });
    }
  }, [node]);

  const handleSave = () => {
    if (node) {
      onSave(node.id, formData);
      onClose();
    }
  };

  if (!node) return null;

  const renderContent = () => {
    const label = node.data?.label || '';

    if (label === 'Form Submitted') return <FormSubmittedConfig data={formData} onChange={setFormData} />;
    if (label === 'Tags' || label === 'Tag Added' || label === 'Tag Removed') return <TagTriggerConfig data={formData} onChange={setFormData} />;
    if (label === 'Contacts' || label === 'Contact Added' || label === 'Contact Removed' || label === 'Contact Updated') return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Contact" />;
    if (label === 'Companies' || label === 'Company Added' || label === 'Company Removed') return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Company" />;
    if (label === 'Notes' || label === 'Note Added' || label === 'Note Removed' || label === 'Note Updated') return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Note" />;
    if (label === 'Tasks' || label === 'Task Added' || label === 'Task Updated' || label === 'Task Completed') return <TaskConfig data={formData} onChange={setFormData} />;
    if (label === 'Engagement Score') return <EngagementScoreConfig data={formData} onChange={setFormData} />;
    if (label === 'Birthday') return <BirthdayConfig data={formData} onChange={setFormData} />;
    if (label === 'Do Not Disturb' || label === 'DND Enabled' || label === 'DND Disabled' || label === 'DND Silenced' || label === 'DND Active' || label === 'DND Reactivated') return <DNDConfig data={formData} onChange={setFormData} />;
    if (label === 'Direct Messages' || label === 'DM Received') return <SocialMessageConfig data={formData} onChange={setFormData} type="dm" />;
    if (label === 'Comments' || label === 'Comment Received') return <SocialMessageConfig data={formData} onChange={setFormData} type="comment" />;
    if (label === 'Call Status') return <CallStatusConfig data={formData} onChange={setFormData} />;

    if (label === 'Send Email') return <EmailConfig data={formData} onChange={setFormData} />;
    if (label === 'Send Notification') return <NotificationConfig data={formData} onChange={setFormData} />;
    if (label === 'If / Else') return <IfElseConfig data={formData} onChange={setFormData} edges={edges} node={node} />;
    if (label === 'Split Test (A/B)') return <SplitTestConfig data={formData} onChange={setFormData} node={node} edges={edges} />;
    if (label === 'Wait' || label === 'Delay') return <WaitConfig data={formData} onChange={setFormData} />;
    if (label === 'Send To Automation') return <SendToAutomationConfig data={formData} onChange={setFormData} />;
    if (node.type === 'loopBack') return <LoopBackConfig data={formData} onChange={setFormData} />;
    if (label === 'End Automation') return <div className="p-4 text-center text-slate-500">End nodes do not have configuration settings.</div>;

    // Fallback
    return <GenericConfig data={formData} onChange={setFormData} type={label} />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-md bg-white border shadow-sm shrink-0 ${node.type === 'trigger' ? 'text-blue-500' :
                node.type === 'action' ? 'text-emerald-500' : 'text-amber-500'
              }`}>
              {node.data?.icon && <node.data.icon className="w-5 h-5" />}
            </div>
            <div>
              <DialogTitle>{node.data?.label || 'Configuration'}</DialogTitle>
              <DialogDescription>{node.data?.subtitle || 'Configure settings'}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4 px-1">
          <div className="py-4">
            {renderContent()}
          </div>
        </div>

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
