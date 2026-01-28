import { useState, useEffect, useRef, useCallback, memo } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ChevronLeft, 
  Settings, 
  Eye, 
  Code, 
  Type, 
  Mail, 
  Phone, 
  MapPin, 
  CheckSquare, 
  Circle, 
  AlignLeft, 
  Image as ImageIcon, 
  Video, 
  CreditCard, 
  AlertCircle,
  Globe,
  XCircle,
  EyeOff,
  Palette,
  Sliders,
  Plus,
  Trash2,
  Copy,
  GripVertical,
  Search,
  Layout,
  Columns,
  MoreVertical,
  Layers,
  Undo,
  Redo,
  ArrowLeft,
  Building2,
  Map,
  Calendar as CalendarIcon,
  Clock,
  Upload,
  Link2,
  MousePointerClick,
  ShieldCheck,
  Monitor,
  Tablet,
  Smartphone,
  ArrowRightCircle,
  MessageSquare,
  Ban,
  ToggleLeft,
  ChevronRight,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock Data for Form Elements
const ELEMENT_GROUPS = [
  {
    title: "Contact Fields",
    items: [
      { id: "fname", icon: Type, label: "First Name" },
      { id: "lname", icon: Type, label: "Last Name" },
      { id: "email", icon: Mail, label: "Email Address" },
      { id: "phone", icon: Phone, label: "Phone Number" },
      { id: "company", icon: Building2, label: "Business Name" },
      { id: "address", icon: MapPin, label: "Address" },
      { id: "city", icon: Map, label: "City" },
      { id: "state", icon: Map, label: "State" },
      { id: "zip", icon: Hash, label: "Zip Code" },
      { id: "website", icon: Link2, label: "Website" },
    ]
  },
  {
    title: "Custom Fields",
    items: [
      { id: "text", icon: Type, label: "Text Input" },
      { id: "textarea", icon: AlignLeft, label: "Text Area" },
      { id: "number", icon: Hash, label: "Number" },
      { id: "checkbox", icon: CheckSquare, label: "Checkbox" },
      { id: "radio", icon: Circle, label: "Radio Button" },
      { id: "dropdown", icon: Sliders, label: "Dropdown" },
      { id: "date", icon: CalendarIcon, label: "Date Picker" },
      { id: "time", icon: Clock, label: "Time Picker" },
      { id: "upload", icon: Upload, label: "File Upload" },
      { id: "button", icon: MousePointerClick, label: "Button" },
    ]
  },
  {
    title: "Layout & Media",
    items: [
      { id: "heading", icon: Type, label: "Heading" },
      { id: "paragraph", icon: AlignLeft, label: "Paragraph" },
      { id: "image", icon: ImageIcon, label: "Image" },
      { id: "video", icon: Video, label: "Video" },
      { id: "divider", icon: Sliders, label: "Divider" },
      { id: "captcha", icon: ShieldCheck, label: "Captcha" },
    ]
  }
];

// Helper for Lucide icon dynamic import if needed, but here we imported them directly
function Hash(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

// Helper for Color Picker
const ColorPickerField = ({ 
  label, 
  color, 
  onChange 
}: { 
  label: string; 
  color: string; 
  onChange: (c: string) => void; 
}) => {
  // Convert hex to rgb for display
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(color);

  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-500">{label}</Label>
      <div className="flex gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className="h-8 w-8 rounded border border-slate-200 cursor-pointer shadow-sm shrink-0 transition-transform hover:scale-105"
              style={{ backgroundColor: color }} 
            />
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-white border-slate-200 shadow-xl z-50">
            <div className="flex flex-col gap-3">
              <HexColorPicker color={color} onChange={onChange} className="w-full !w-full !h-40" />
              
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <Label className="text-[10px] w-6 text-slate-500 font-mono">HEX</Label>
                    <Input 
                        value={color} 
                        onChange={(e) => onChange(e.target.value)} 
                        className="h-7 text-xs font-mono uppercase" 
                    />
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => navigator.clipboard.writeText(color)}>
                        <Copy className="h-3 w-3" />
                    </Button>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <Label className="text-[10px] w-6 text-slate-500 font-mono">RGB</Label>
                    <div className="flex gap-1 flex-1">
                        <Input value={rgb.r} readOnly className="h-7 text-xs font-mono text-center px-0 bg-slate-50" />
                        <Input value={rgb.g} readOnly className="h-7 text-xs font-mono text-center px-0 bg-slate-50" />
                        <Input value={rgb.b} readOnly className="h-7 text-xs font-mono text-center px-0 bg-slate-50" />
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={() => navigator.clipboard.writeText(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}>
                        <Copy className="h-3 w-3" />
                    </Button>
                 </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex-1 relative">
           <Input 
               value={color} 
               onChange={(e) => onChange(e.target.value)}
               className="bg-white border-slate-200 text-xs text-slate-900 h-8 font-mono uppercase" 
               placeholder="#FFFFFF" 
           />
        </div>
      </div>
    </div>
  );
};

// Memoized Form Element Item to prevent unnecessary re-renders
const FormElementItem = ({ 
  field, 
  provided, 
  snapshot, 
  isSelected, 
  onSelect, 
  onDelete,
  activeBreakpoint,
  activeSubElement,
  onUpdate
}: {
  field: any;
  provided: any;
  snapshot: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  activeBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  activeSubElement?: string | null;
  onUpdate?: (id: string, key: string, value: any) => void;
}) => {
  const widthClass = (() => {
    // Resolve width based on active breakpoint
    const width = (() => {
        if (activeBreakpoint && activeBreakpoint !== 'xl' && field.responsive?.[activeBreakpoint]?.width) {
            return field.responsive[activeBreakpoint].width;
        }
        return field.style?.width || 'full';
    })();

    // No longer forcing mobile 100% - respecting the responsive setting
    // const isMobile = activeBreakpoint === 'xs';
    // if (isMobile) return 'col-span-12';
    
    // Using Grid columns for layout as requested
    if (width === 'three-quarters') return 'col-span-9'; // 75% of 12
    if (width === 'half') return 'col-span-6'; // 50% of 12
    if (width === 'third') return 'col-span-4'; // 33% of 12
    if (width === 'quarter') return 'col-span-3'; // 25% of 12
    return 'col-span-12'; // 100%
  })();

  const resolveStyle = (key: string, defaultValue?: any) => {
      if (activeBreakpoint && activeBreakpoint !== 'xl' && field.responsive?.[activeBreakpoint]?.[key] !== undefined) {
          return field.responsive[activeBreakpoint][key];
      }
      return field.style?.[key] !== undefined ? field.style[key] : defaultValue;
  };

  // Local state for preview interactions
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (field.selectionMode === 'single') {
        if (checked) {
            setSelectedOptions([value]);
        } else {
            setSelectedOptions([]);
        }
    } else {
        if (checked) {
            setSelectedOptions(prev => [...prev, value]);
        } else {
            setSelectedOptions(prev => prev.filter(v => v !== value));
        }
    }
  };

  const widgetStyle = {
      backgroundColor: resolveStyle('windowBackgroundColor'),
      borderStyle: resolveStyle('windowBorderStyle'),
      borderWidth: resolveStyle('windowBorderStyle') !== 'none' ? (resolveStyle('windowBorderWidth') ? `${resolveStyle('windowBorderWidth')}px` : '1px') : '0px',
      borderColor: resolveStyle('windowBorderColor'),
      borderTopLeftRadius: resolveStyle('windowBorderTopLeftRadius') ? `${resolveStyle('windowBorderTopLeftRadius')}px` : (resolveStyle('windowBorderRadius') ? `${resolveStyle('windowBorderRadius')}px` : undefined),
      borderTopRightRadius: resolveStyle('windowBorderTopRightRadius') ? `${resolveStyle('windowBorderTopRightRadius')}px` : (resolveStyle('windowBorderRadius') ? `${resolveStyle('windowBorderRadius')}px` : undefined),
      borderBottomRightRadius: resolveStyle('windowBorderBottomRightRadius') ? `${resolveStyle('windowBorderBottomRightRadius')}px` : (resolveStyle('windowBorderRadius') ? `${resolveStyle('windowBorderRadius')}px` : undefined),
      borderBottomLeftRadius: resolveStyle('windowBorderBottomLeftRadius') ? `${resolveStyle('windowBorderBottomLeftRadius')}px` : (resolveStyle('windowBorderRadius') ? `${resolveStyle('windowBorderRadius')}px` : undefined),
      marginTop: resolveStyle('windowMarginTop') ? `${resolveStyle('windowMarginTop')}px` : undefined,
      marginRight: resolveStyle('windowMarginRight') ? `${resolveStyle('windowMarginRight')}px` : undefined,
      marginBottom: resolveStyle('windowMarginBottom') ? `${resolveStyle('windowMarginBottom')}px` : undefined,
      marginLeft: resolveStyle('windowMarginLeft') ? `${resolveStyle('windowMarginLeft')}px` : undefined,
      paddingTop: resolveStyle('windowPaddingTop') ? `${resolveStyle('windowPaddingTop')}px` : undefined,
      paddingRight: resolveStyle('windowPaddingRight') ? `${resolveStyle('windowPaddingRight')}px` : undefined,
      paddingBottom: resolveStyle('windowPaddingBottom') ? `${resolveStyle('windowPaddingBottom')}px` : undefined,
      paddingLeft: resolveStyle('windowPaddingLeft') ? `${resolveStyle('windowPaddingLeft')}px` : undefined,
  };

  const labelStyle = {
      fontFamily: field.style?.labelFontFamily || field.style?.fontFamily,
      fontSize: field.style?.labelFontSize ? `${field.style.labelFontSize}${field.style.labelFontSizeUnit || 'px'}` : (field.style?.fontSize ? `${field.style.fontSize}${field.style.fontSizeUnit || 'px'}` : undefined),
      fontWeight: field.style?.labelFontWeight ? (
          field.style.labelFontWeight === 'light' ? 300 :
          field.style.labelFontWeight === 'normal' ? 400 :
          field.style.labelFontWeight === 'medium' ? 500 :
          field.style.labelFontWeight === 'semibold' ? 600 :
          field.style.labelFontWeight === 'bold' ? 700 : 400
      ) : (field.style?.fontWeight ? (
          field.style.fontWeight === 'light' ? 300 :
          field.style.fontWeight === 'normal' ? 400 :
          field.style.fontWeight === 'medium' ? 500 :
          field.style.fontWeight === 'semibold' ? 600 :
          field.style.fontWeight === 'bold' ? 700 : 400
      ) : undefined),
      color: field.style?.labelColor,
  };

  const inputMarginStyle = {
      marginTop: field.style?.inputMarginTop ? `${field.style.inputMarginTop}px` : undefined,
      marginRight: field.style?.inputMarginRight ? `${field.style.inputMarginRight}px` : undefined,
      marginBottom: field.style?.inputMarginBottom ? `${field.style.inputMarginBottom}px` : undefined,
      marginLeft: field.style?.inputMarginLeft ? `${field.style.inputMarginLeft}px` : undefined,
  };

  const textStyle: React.CSSProperties = {
      fontFamily: field.style?.inputFontFamily || field.style?.fontFamily,
      fontSize: field.style?.inputFontSize ? `${field.style.inputFontSize}${field.style.inputFontSizeUnit || 'px'}` : (field.style?.fontSize ? `${field.style.fontSize}${field.style.fontSizeUnit || 'px'}` : undefined),
      fontWeight: field.style?.inputFontWeight ? (
          field.style.inputFontWeight === 'light' ? 300 :
          field.style.inputFontWeight === 'normal' ? 400 :
          field.style.inputFontWeight === 'medium' ? 500 :
          field.style.inputFontWeight === 'semibold' ? 600 :
          field.style.inputFontWeight === 'bold' ? 700 : 400
      ) : (field.style?.fontWeight ? (
          field.style.fontWeight === 'light' ? 300 :
          field.style.fontWeight === 'normal' ? 400 :
          field.style.fontWeight === 'medium' ? 500 :
          field.style.fontWeight === 'semibold' ? 600 :
          field.style.fontWeight === 'bold' ? 700 : 400
      ) : undefined),
      color: field.style?.inputColor || field.style?.color,
      
      // Decoration - use input-specific properties
      backgroundColor: field.style?.inputBackgroundColor || field.style?.backgroundColor,
      borderStyle: field.style?.inputBorderStyle || field.style?.borderStyle,
      borderWidth: (field.style?.inputBorderStyle || field.style?.borderStyle) !== 'none' ? (field.style?.inputBorderWidth ? `${field.style.inputBorderWidth}px` : (field.style?.borderWidth ? `${field.style.borderWidth}px` : undefined)) : '0px',
      borderColor: (field.style?.inputBorderStyle || field.style?.borderStyle) === 'none' ? 'transparent' : (field.style?.inputBorderColor || field.style?.borderColor),
      borderTopLeftRadius: field.style?.inputBorderTopLeftRadius ? `${field.style.inputBorderTopLeftRadius}px` : (field.style?.inputBorderRadius ? `${field.style.inputBorderRadius}px` : (field.style?.borderRadius ? `${field.style.borderRadius}px` : undefined)),
      borderTopRightRadius: field.style?.inputBorderTopRightRadius ? `${field.style.inputBorderTopRightRadius}px` : (field.style?.inputBorderRadius ? `${field.style.inputBorderRadius}px` : (field.style?.borderRadius ? `${field.style.borderRadius}px` : undefined)),
      borderBottomRightRadius: field.style?.inputBorderBottomRightRadius ? `${field.style.inputBorderBottomRightRadius}px` : (field.style?.inputBorderRadius ? `${field.style.inputBorderRadius}px` : (field.style?.borderRadius ? `${field.style.borderRadius}px` : undefined)),
      borderBottomLeftRadius: field.style?.inputBorderBottomLeftRadius ? `${field.style.inputBorderBottomLeftRadius}px` : (field.style?.inputBorderRadius ? `${field.style.inputBorderRadius}px` : (field.style?.borderRadius ? `${field.style.borderRadius}px` : undefined)),
  };
  
  const helpTextStyle = {
      fontFamily: field.style?.helpTextFontFamily || field.style?.fontFamily,
      fontSize: field.style?.helpTextFontSize ? `${field.style.helpTextFontSize}${field.style.helpTextFontSizeUnit || 'px'}` : undefined,
      fontWeight: field.style?.helpTextFontWeight ? (
          field.style.helpTextFontWeight === 'light' ? 300 :
          field.style.helpTextFontWeight === 'normal' ? 400 :
          field.style.helpTextFontWeight === 'medium' ? 500 :
          field.style.helpTextFontWeight === 'semibold' ? 600 :
          field.style.helpTextFontWeight === 'bold' ? 700 : 400
      ) : undefined,
      color: field.style?.helpTextColor || '#64748b'
  };

  // Placeholder styles as CSS variables for ::placeholder pseudo-element
  const placeholderCssVars: React.CSSProperties = {
      '--placeholder-color': field.style?.placeholderColor || '#9ca3af',
      '--placeholder-font-family': field.style?.placeholderFontFamily || 'inherit',
      '--placeholder-font-size': field.style?.placeholderFontSize ? `${field.style.placeholderFontSize}${field.style.placeholderFontSizeUnit || 'px'}` : 'inherit',
      '--placeholder-font-weight': field.style?.placeholderFontWeight ? (
          field.style.placeholderFontWeight === 'light' ? '300' :
          field.style.placeholderFontWeight === 'normal' ? '400' :
          field.style.placeholderFontWeight === 'medium' ? '500' :
          field.style.placeholderFontWeight === 'semibold' ? '600' :
          field.style.placeholderFontWeight === 'bold' ? '700' : '400'
      ) : 'inherit',
  } as React.CSSProperties;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
          ...provided.draggableProps.style,
          ...widgetStyle,
          // Apply padding logic here: if we want padding to be INSIDE the border, we use padding
          // The widgetStyle already contains padding from the "window" settings
      }}
      id={`field-${field.id}`}
      className={`relative box-border transition-colors duration-200 cursor-pointer group/field focus:outline-none ${widthClass} ${isSelected ? (activeSubElement === 'window' ? 'border-[#5533ff] ring-4 ring-[#5533ff]/30 z-20' : 'border-[#5533ff] bg-indigo-50/10 ring-2 ring-[#5533ff]/20 z-10') : 'border-dashed border-transparent hover:border-[#5533ff] hover:bg-slate-50'} ${snapshot.isDragging ? 'shadow-2xl ring-2 ring-[#5533ff] bg-white opacity-90 z-50' : ''}`}
      onClick={() => onSelect(field.id)}
    >
      <div className="p-2 h-full"> {/* Inner content wrapper for internal spacing if needed, can be removed if strictly flat structure desired, but useful for gutter inside the border */}
      
      {/* Elementor-style overlay actions */}
      <div className={`absolute top-0 right-0 -translate-y-full bg-[#5533ff] text-white text-[10px] px-2 py-0.5 rounded-t-md opacity-0 ${isSelected ? 'opacity-100' : 'group-hover/field:opacity-100'} transition-opacity font-medium tracking-wide flex items-center gap-2 z-10`}>
         {/* Strip HTML from label for preview if needed, or just truncate */}
         <span className="uppercase max-w-[100px] truncate">{field.label?.replace(/<[^>]*>?/gm, '') || field.label}</span>
         <div className="flex gap-1 border-l border-white/20 pl-2">
           <Trash2 
              className="w-3 h-3 cursor-pointer hover:text-red-200" 
              onClick={(e) => onDelete(field.id, e)}
           />
           <GripVertical className="w-3 h-3 cursor-grab" />
         </div>
      </div>

      {/* Dynamic Link Styles */}
      {/* Link styling removed per user request */}

      {field.type === "heading" && (
        <input
            value={field.label}
            onChange={(e) => onUpdate?.(field.id, "label", e.target.value)}
            className={`font-bold text-slate-900 tracking-tight bg-transparent border-none focus:outline-none w-full ${
                (field.headingLevel === 'h1' || !field.headingLevel) ? 'text-4xl' :
                field.headingLevel === 'h2' ? 'text-3xl' :
                field.headingLevel === 'h3' ? 'text-2xl' :
                field.headingLevel === 'h4' ? 'text-xl' :
                field.headingLevel === 'h5' ? 'text-lg' :
                'text-base'
            }`}
            style={{...textStyle, color: field.style?.color || textStyle.color }}
        />
      )}

      {(field.type === "fname" || field.type === "lname" || field.type === "email" || field.type === "text" || field.type === "phone" || field.type === "company" || field.type === "address" || field.type === "city" || field.type === "state" || field.type === "zip" || field.type === "website") && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className={`text-slate-700 font-medium ${isSelected && activeSubElement === 'label' ? 'ring-2 ring-[#5533ff] ring-offset-2 rounded px-1' : ''}`} style={labelStyle}>
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
          <input 
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            placeholder={field.placeholder} 
            className={`flex h-9 w-full rounded-md border bg-white border-slate-200 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:ring-[#5533ff] styled-placeholder ${isSelected && activeSubElement === 'input' ? 'ring-2 ring-[#5533ff] ring-offset-2' : ''}`} 
            style={{
              ...textStyle,
              ...placeholderCssVars,
              color: field.style?.inputColor || field.style?.color || '#1e293b',
              marginTop: field.style?.inputMarginTop ? `${field.style.inputMarginTop}px` : undefined,
              marginRight: field.style?.inputMarginRight ? `${field.style.inputMarginRight}px` : undefined,
              marginBottom: field.style?.inputMarginBottom ? `${field.style.inputMarginBottom}px` : undefined,
              marginLeft: field.style?.inputMarginLeft ? `${field.style.inputMarginLeft}px` : undefined,
              paddingTop: field.style?.inputPaddingTop ? `${field.style.inputPaddingTop}px` : '8px',
              paddingRight: field.style?.inputPaddingRight ? `${field.style.inputPaddingRight}px` : '12px',
              paddingBottom: field.style?.inputPaddingBottom ? `${field.style.inputPaddingBottom}px` : '8px',
              paddingLeft: field.style?.inputPaddingLeft ? `${field.style.inputPaddingLeft}px` : '12px',
            }}
          />
          {field.helpText && (
              <p 
                  className={`text-[10px] mt-1 ${isSelected && activeSubElement === 'help' ? 'ring-2 ring-[#5533ff] ring-offset-2 rounded px-1' : ''}`} 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "textarea" && (
        <div className="space-y-2">
          <Label className={`text-slate-700 font-medium ${isSelected && activeSubElement === 'label' ? 'ring-2 ring-[#5533ff] ring-offset-2 rounded px-1' : ''}`} style={labelStyle}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <textarea 
            className={`w-full rounded-md border border-slate-200 bg-white text-sm focus:ring-[#5533ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 styled-placeholder ${!field.style?.inputPaddingTop && !field.style?.inputPaddingRight && !field.style?.inputPaddingBottom && !field.style?.inputPaddingLeft ? 'px-3 py-2' : ''} ${isSelected && activeSubElement === 'input' ? 'ring-2 ring-[#5533ff] ring-offset-2' : ''}`} 
            style={{
              ...textStyle, 
              ...inputMarginStyle,
              ...placeholderCssVars,
              color: field.style?.inputColor || field.style?.color || '#1e293b',
              height: 'auto', 
              minHeight: field.rows ? `${field.rows * 20 + 20}px` : '128px',
              paddingTop: field.style?.inputPaddingTop ? `${field.style.inputPaddingTop}px` : undefined,
              paddingRight: field.style?.inputPaddingRight ? `${field.style.inputPaddingRight}px` : undefined,
              paddingBottom: field.style?.inputPaddingBottom ? `${field.style.inputPaddingBottom}px` : undefined,
              paddingLeft: field.style?.inputPaddingLeft ? `${field.style.inputPaddingLeft}px` : undefined,
            }} 
            placeholder={field.placeholder} 
          />
          {field.helpText && (
              <p 
                  className={`text-[10px] mt-1 ${isSelected && activeSubElement === 'help' ? 'ring-2 ring-[#5533ff] ring-offset-2 rounded px-1' : ''}`} 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "button" && (
        <div className="pt-4 pointer-events-none">
          <Button className="w-full bg-[#5533ff] hover:bg-[#4422dd] text-white h-11 text-base shadow-lg shadow-indigo-500/20" style={{...textStyle, color: field.style?.color || 'white'}}>{field.label}</Button>
        </div>
      )}

      {field.type === "number" && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-slate-700 font-medium" style={labelStyle}>
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
            </Label>
          </div>
          <Input type="number" placeholder={field.placeholder} className="bg-white border-slate-200 focus:ring-[#5533ff]" style={textStyle} />
          {field.helpText && (
              <p 
                  className="text-[10px] mt-1" 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "checkbox" && (
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium" style={labelStyle}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="space-y-2">
            {(field.options || [
                { label: 'Option 1', value: 'option_1' },
                { label: 'Option 2', value: 'option_2' },
                { label: 'Option 3', value: 'option_3' }
            ]).map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                    <Checkbox 
                        id={`${field.id}-${index}`} 
                        checked={selectedOptions.includes(option.value)}
                        onCheckedChange={(checked) => handleCheckboxChange(option.value, checked as boolean)}
                    />
                    <Label htmlFor={`${field.id}-${index}`} className="font-normal text-slate-600" style={{...textStyle, fontSize: field.style?.fontSize ? `${Math.max(12, parseInt(field.style.fontSize) - 2)}${field.style.fontSizeUnit || 'px'}` : undefined}}>
                        {option.label}
                    </Label>
                </div>
            ))}
          </div>
          {field.helpText && (
              <p 
                  className="text-[10px] mt-1" 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "radio" && (
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium" style={labelStyle}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <RadioGroup defaultValue={field.options?.[0]?.value || 'option_1'}>
            {(field.options || [
                { label: 'Option 1', value: 'option_1' },
                { label: 'Option 2', value: 'option_2' },
            ]).map((option: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${field.id}-${index}`} />
                    <Label htmlFor={`${field.id}-${index}`} className="font-normal text-slate-600" style={{...textStyle, fontSize: field.style?.fontSize ? `${Math.max(12, parseInt(field.style.fontSize) - 2)}${field.style.fontSizeUnit || 'px'}` : undefined}}>
                        {option.label}
                    </Label>
                </div>
            ))}
          </RadioGroup>
          {field.helpText && (
              <p 
                  className="text-[10px] mt-1" 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "dropdown" && (
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium" style={labelStyle}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Select>
            <SelectTrigger className="bg-white border-slate-200" style={textStyle}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
                {(field.options || []).map((option: any, index: number) => (
                    <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          {field.helpText && (
              <p 
                  className="text-[10px] mt-1" 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "date" && (
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium" style={labelStyle}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <div className={cn(
                "relative flex items-center cursor-pointer",
                isSelected && activeSubElement === 'input' ? 'ring-2 ring-[#5533ff] ring-offset-2 rounded-md' : ''
              )}>
                <div className="absolute left-0 h-full flex items-center justify-center w-10 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md text-slate-400 z-10">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div 
                  className={cn(
                    "w-full h-10 pl-12 pr-3 flex items-center bg-white border border-slate-200 rounded-md text-sm hover:bg-slate-50 transition-colors",
                    !date && "text-slate-500"
                  )}
                  style={{...textStyle, color: date ? textStyle.color : undefined}}
                >
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white shadow-xl border-slate-200 rounded-lg" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-lg"
              />
            </PopoverContent>
          </Popover>
          {field.helpText && (
              <p 
                  className="text-[10px] mt-1" 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "time" && (
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium" style={labelStyle}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <div className={cn(
                "relative flex items-center cursor-pointer",
                isSelected && activeSubElement === 'input' ? 'ring-2 ring-[#5533ff] ring-offset-2 rounded-md' : ''
              )}>
                <div className="absolute left-0 h-full flex items-center justify-center w-10 bg-slate-50 border border-r-0 border-slate-200 rounded-l-md text-slate-400 z-10">
                  <Clock className="h-4 w-4" />
                </div>
                <div 
                  className={cn(
                    "w-full h-10 pl-12 pr-3 flex items-center bg-white border border-slate-200 rounded-md text-sm hover:bg-slate-50 transition-colors",
                    !time && "text-slate-500"
                  )}
                  style={{...textStyle, color: time ? textStyle.color : undefined}}
                >
                  {time || <span>Select time</span>}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-white shadow-xl border-slate-200 rounded-lg" align="start">
              <div className="space-y-4">
                <div className="text-sm font-medium text-slate-700">Select Time</div>
                <div className="flex items-center gap-2">
                  <Select onValueChange={(h) => setTime(prev => {
                    const [, m = "00", p = "AM"] = (prev || "12:00 AM").match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
                    return `${h}:${m} ${p}`;
                  })}>
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue placeholder="Hr" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-48">
                      {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                        <SelectItem key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-slate-400 font-medium">:</span>
                  <Select onValueChange={(m) => setTime(prev => {
                    const [, h = "12", , p = "AM"] = (prev || "12:00 AM").match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
                    return `${h}:${m} ${p}`;
                  })}>
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent className="bg-white max-h-48">
                      {Array.from({length: 60}, (_, i) => i).map(m => (
                        <SelectItem key={m} value={String(m).padStart(2, '0')}>{String(m).padStart(2, '0')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(p) => setTime(prev => {
                    const [, h = "12", m = "00"] = (prev || "12:00 AM").match(/(\d+):(\d+)\s*(AM|PM)/i) || [];
                    return `${h}:${m} ${p}`;
                  })}>
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue placeholder="AM" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {field.helpText && (
              <p 
                  className="text-[10px] mt-1" 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "upload" && (
        <div className="space-y-2">
          <Label className="text-slate-700 font-medium" style={labelStyle}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </Label>
          <div 
             className={`border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-[#5533ff]/50 transition-colors cursor-pointer bg-white ${isSelected && activeSubElement === 'input' ? 'ring-2 ring-[#5533ff] ring-offset-2' : ''}`}
             style={{
                 backgroundColor: field.style?.backgroundColor || 'white',
                 borderColor: field.style?.borderColor || '#e2e8f0',
                 borderRadius: field.style?.borderRadius ? `${field.style.borderRadius}px` : undefined,
             }}
             onClick={() => fileInputRef.current?.click()}
          >
            <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => {
                    console.log("File selected:", e.target.files?.[0]);
                }}
            />
            <Upload className="h-8 w-8 mb-2 opacity-50" />
            <span className="text-sm font-medium" style={textStyle}>Click to upload file</span>
            <span className="text-xs text-slate-400 mt-1">SVG, PNG, JPG or GIF (max. 3MB)</span>
          </div>
          {field.helpText && (
              <p 
                  className="text-[10px] mt-1" 
                  style={helpTextStyle}
              >
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "paragraph" && (
        <div>
          <textarea
            value={field.label || "This is a paragraph text block. You can edit this text to provide instructions or information to your users."}
            onChange={(e) => onUpdate?.(field.id, "label", e.target.value)}
            className="text-sm leading-relaxed bg-transparent border-none resize-none w-full focus:outline-none"
            style={{...textStyle, color: field.style?.inputColor || field.style?.color || '#475569', minHeight: '60px'}}
          />
        </div>
      )}

      {field.type === "image" && (
        <div className="pointer-events-none space-y-2">
          <Label className="text-slate-700 font-medium pointer-events-auto" style={labelStyle}>{field.label}</Label>
          <div className="w-full bg-slate-100 rounded-lg flex flex-col items-center justify-center border border-slate-200 group relative overflow-hidden" title={field.altText}>
            {field.url ? (
                <img src={field.url} alt={field.altText || "Image"} className="w-full h-auto object-cover" />
            ) : (
                <div className="w-full h-48 flex flex-col items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-slate-300" />
                    {field.altText && (
                        <span className="text-[10px] text-slate-400 mt-2 max-w-[80%] truncate">Alt: {field.altText}</span>
                    )}
                </div>
            )}
          </div>
          {field.helpText && (
              <p className="text-[10px] text-slate-500 text-center italic" style={helpTextStyle}>
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "video" && (
        <div className="pointer-events-none space-y-2">
          <Label className="text-slate-700 font-medium" style={labelStyle}>{field.label}</Label>
          <div className="w-full aspect-video bg-slate-900 rounded-lg flex flex-col items-center justify-center group relative overflow-hidden" title={field.altText}>
            {field.url ? (
                <iframe 
                    src={field.url.replace("watch?v=", "embed/")} 
                    className="w-full h-full pointer-events-auto" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                />
            ) : (
                <>
                    <Video className="h-12 w-12 text-slate-600" />
                    {field.altText && (
                        <span className="text-[10px] text-slate-500 mt-2 max-w-[80%] truncate">Alt: {field.altText}</span>
                    )}
                </>
            )}
          </div>
          {field.helpText && (
              <p className="text-[10px] text-slate-500 text-center italic" style={helpTextStyle}>
                  {field.helpText}
              </p>
          )}
        </div>
      )}

      {field.type === "divider" && (
        <div className="py-4 pointer-events-none">
          <Separator className="bg-slate-200" />
        </div>
      )}

      {field.type === "captcha" && (
        <div className="p-3 border border-slate-200 rounded bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox id={`captcha-${field.id}`} />
            <Label htmlFor={`captcha-${field.id}`} className="text-sm text-slate-600 font-medium cursor-pointer">I'm not a robot</Label>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-8 w-8 text-slate-400" />
            <span className="text-[10px] text-slate-400">reCAPTCHA</span>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

// Helper for slugifying text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

import { Link as LinkIcon, Link2Off } from "lucide-react";

// Reusable Spacing Control Component
const SpacingControl = ({ 
  label, 
  values, 
  onChange, 
  onBatchChange,
  prefix = "",
  suffix = "",
  allowAuto = false,
  keyMapping,
  theme = "dark"
}: { 
  label: string; 
  values: { top: any, right: any, bottom: any, left: any }; 
  onChange: (key: string, value: any) => void;
  onBatchChange?: (updates: Record<string, any>) => void;
  prefix?: string;
  suffix?: string;
  allowAuto?: boolean;
  keyMapping?: { top: string, right: string, bottom: string, left: string } | any;
  theme?: "dark" | "light";
}) => {
  const handleCopyValue = (value: any) => {
      if (onBatchChange) {
          if (keyMapping) {
              onBatchChange({
                  [keyMapping.top]: value,
                  [keyMapping.right]: value,
                  [keyMapping.bottom]: value,
                  [keyMapping.left]: value
              });
          } else {
              onBatchChange({
                  [`${prefix}Top${suffix}`]: value,
                  [`${prefix}Right${suffix}`]: value,
                  [`${prefix}Bottom${suffix}`]: value,
                  [`${prefix}Left${suffix}`]: value
              });
          }
      } else if (keyMapping) {
          onChange(keyMapping.top, value);
          onChange(keyMapping.right, value);
          onChange(keyMapping.bottom, value);
          onChange(keyMapping.left, value);
      } else {
          onChange(`${prefix}Top${suffix}`, value);
          onChange(`${prefix}Right${suffix}`, value);
          onChange(`${prefix}Bottom${suffix}`, value);
          onChange(`${prefix}Left${suffix}`, value);
      }
  };

  const handleInputChange = (side: string, value: any) => {
      const key = keyMapping ? keyMapping[side.toLowerCase()] : `${prefix}${side}${suffix}`;
      onChange(key, value);
  };

  const isDark = theme === "dark";
  const inputClass = isDark 
    ? "bg-[#1f1f1f] border-[#404040] text-xs text-white focus-visible:ring-[#5533ff] h-7 text-center rounded-l-none pl-4 pr-1"
    : "bg-white border-slate-200 text-xs text-slate-900 focus-visible:ring-[#5533ff] h-7 text-center rounded-l-none pl-4 pr-1";
    
  const buttonClass = isDark
    ? "h-7 w-7 rounded-r-none border border-r-0 border-[#404040] bg-[#2e2e2e] text-neutral-400 hover:text-white hover:bg-[#404040] shrink-0 z-10"
    : "h-7 w-7 rounded-r-none border border-r-0 border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0 z-10";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
         <Label className={cn("text-[10px]", isDark ? "text-neutral-400" : "text-slate-500")}>{label}</Label>
      </div>
      <div className="grid grid-cols-2 gap-2">
         <div className="flex items-center relative group">
            <Button
                variant="ghost"
                size="icon"
                className={buttonClass}
                onClick={() => handleCopyValue(values.top)}
                title="Copy to all sides"
            >
                <Copy className="h-3 w-3" />
            </Button>
            <div className="relative flex-1">
                <div className={cn("absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none", isDark ? "text-neutral-500" : "text-slate-400")}>T</div>
                <Input 
                  type={allowAuto ? "text" : "number"}
                  value={values.top || ""}
                  onChange={(e) => handleInputChange("Top", e.target.value)}
                  className={inputClass} 
                  placeholder="0" 
                />
            </div>
         </div>
         <div className="flex items-center relative group">
            <Button
                variant="ghost"
                size="icon"
                className={buttonClass}
                onClick={() => handleCopyValue(values.right)}
                title="Copy to all sides"
            >
                <Copy className="h-3 w-3" />
            </Button>
            <div className="relative flex-1">
                <div className={cn("absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none", isDark ? "text-neutral-500" : "text-slate-400")}>R</div>
                <Input 
                  type={allowAuto ? "text" : "number"}
                  value={values.right || ""}
                  onChange={(e) => handleInputChange("Right", e.target.value)}
                  className={inputClass} 
                  placeholder="0" 
                />
            </div>
         </div>
         <div className="flex items-center relative group">
            <Button
                variant="ghost"
                size="icon"
                className={buttonClass}
                onClick={() => handleCopyValue(values.bottom)}
                title="Copy to all sides"
            >
                <Copy className="h-3 w-3" />
            </Button>
            <div className="relative flex-1">
                <div className={cn("absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none", isDark ? "text-neutral-500" : "text-slate-400")}>B</div>
                <Input 
                  type={allowAuto ? "text" : "number"}
                  value={values.bottom || ""}
                  onChange={(e) => handleInputChange("Bottom", e.target.value)}
                  className={inputClass} 
                  placeholder="0" 
                />
            </div>
         </div>
         <div className="flex items-center relative group">
            <Button
                variant="ghost"
                size="icon"
                className={buttonClass}
                onClick={() => handleCopyValue(values.left)}
                title="Copy to all sides"
            >
                <Copy className="h-3 w-3" />
            </Button>
            <div className="relative flex-1">
                <div className={cn("absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none", isDark ? "text-neutral-500" : "text-slate-400")}>L</div>
                <Input 
                  type={allowAuto ? "text" : "number"}
                  value={values.left || ""}
                  onChange={(e) => handleInputChange("Left", e.target.value)}
                  className={inputClass} 
                  placeholder="0" 
                />
            </div>
         </div>
      </div>
    </div>
  );
};

export default function FormBuilderPage() {
  const [formName, setFormName] = useState("Contact Us Form");
  const [activeTab, setActiveTab] = useState("content");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showLogicDialog, setShowLogicDialog] = useState(false);
  const [logicStep, setLogicStep] = useState<'select' | 'configure'>('select');
  const [selectedRuleType, setSelectedRuleType] = useState<'redirect' | 'message' | 'disqualify' | 'visibility' | null>(null);
  const [newRule, setNewRule] = useState({
    field: '',
    condition: 'equals',
    value: '',
    action: '', // for visibility: 'show' or 'hide', for redirect: URL, for message: text
    targetField: '' // for visibility rules
  });

  const resetLogicDialog = () => {
    setLogicStep('select');
    setSelectedRuleType(null);
    setNewRule({ field: '', condition: 'equals', value: '', action: '', targetField: '' });
  };

  const handleSelectRuleType = (type: 'redirect' | 'message' | 'disqualify' | 'visibility') => {
    setSelectedRuleType(type);
    setLogicStep('configure');
  };

  const handleAddRule = () => {
    const noValueConditions = ['is_empty', 'is_not_empty', 'on_submit'];
    if (!selectedRuleType || !newRule.field || (!noValueConditions.includes(newRule.condition) && !newRule.value)) return;
    
    const ruleId = `rule_${Date.now()}`;
    const conditionText = newRule.condition === 'equals' ? 'equals' :
                          newRule.condition === 'not_equals' ? 'does not equal' :
                          newRule.condition === 'contains' ? 'contains' :
                          newRule.condition === 'greater_than' ? 'is greater than' :
                          newRule.condition === 'less_than' ? 'is less than' :
                          newRule.condition === 'is_empty' ? 'is empty' :
                          newRule.condition === 'is_not_empty' ? 'is not empty' :
                          newRule.condition === 'on_submit' ? 'on submit' : newRule.condition;
    
    const rule = {
      id: ruleId,
      type: selectedRuleType === 'visibility' ? newRule.action : selectedRuleType,
      field: newRule.field,
      condition: conditionText,
      value: newRule.value,
      targetField: newRule.targetField,
      actionValue: newRule.action
    };
    
    setLogicRules(prev => [...prev, rule]);
    resetLogicDialog();
    setShowLogicDialog(false);
  };
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkSettings, setLinkSettings] = useState({
    text: "",
    url: "",
    color: "#5533ff",
    hoverColor: "#4422dd"
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSubElement, setActiveSubElement] = useState<string | null>(null);
  
  // Canvas Resizing State
  const [canvasWidth, setCanvasWidth] = useState(768); // Default to tablet/md
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Derived active breakpoint for button highlighting and responsiveness
  const activeDevice = (() => {
    if (canvasWidth < 640) return 'xs';
    if (canvasWidth < 768) return 'sm';
    if (canvasWidth < 1024) return 'md';
    if (canvasWidth < 1280) return 'lg';
    if (canvasWidth < 1536) return 'xl';
    return '2xl';
  })();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;
      
      // Auto-scroll logic when dragging near the edge
      if (scrollContainerRef.current) {
        const threshold = 50; // pixels from edge
        const scrollAmount = 20;
        const viewportWidth = window.innerWidth;
        
        if (e.clientX > viewportWidth - threshold) {
          scrollContainerRef.current.scrollLeft += scrollAmount;
        }
      }

      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(320, e.clientX - rect.left);
      setCanvasWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const [isSurveyMode, setIsSurveyMode] = useState(false);

  // Form Global Styles State
  const [formStyles, setFormStyles] = useState({
    marginTop: "0", marginRight: "auto", marginBottom: "0", marginLeft: "auto",
    paddingTop: "48", paddingRight: "48", paddingBottom: "48", paddingLeft: "48",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E5E5",
    borderStyle: "solid",
    borderWidth: "1",
    borderRadius: "12",
    borderTopLeftRadius: "12",
    borderTopRightRadius: "12",
    borderBottomRightRadius: "12",
    borderBottomLeftRadius: "12",
    maxWidth: "100",
    maxHeight: "",
    widthUnit: "%",
    heightUnit: "px",
    fontFamilyBody: "",
    fontFamilyTitle: "",
    // Background Image
    backgroundImage: "",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    backgroundAttachment: "scroll",
    backgroundWidth: "100",
    backgroundHeight: "100",
    backgroundWidthUnit: "%",
    backgroundHeightUnit: "auto",
  });

  const updateFormStyle = (key: string, value: string) => {
    setFormStyles(prev => ({ ...prev, [key]: value }));
  };

  const updateFormStyleBatch = (updates: Record<string, any>) => {
    setFormStyles(prev => ({ ...prev, ...updates }));
  };

  // Undo/Redo History State
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Mock Form Fields (Canvas State)
  const [formFields, setFormFieldsState] = useState<any[]>([]);

  // Logic Rules State
  const [logicRules, setLogicRules] = useState<any[]>([
    { id: 'rule_1', type: 'disqualify', field: 'Budget', condition: 'less than', value: '$1,000' }
  ]);

  const deleteLogicRule = (ruleId: string) => {
    setLogicRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  const editLogicRule = (rule: any) => {
    setSelectedRuleType(rule.type === 'show' || rule.type === 'hide' ? 'visibility' : rule.type);
    setNewRule({
      field: rule.field,
      condition: rule.condition === 'equals' ? 'equals' :
                 rule.condition === 'does not equal' ? 'not_equals' :
                 rule.condition === 'contains' ? 'contains' :
                 rule.condition === 'is greater than' ? 'greater_than' :
                 rule.condition === 'is less than' ? 'less_than' :
                 rule.condition === 'is empty' ? 'is_empty' :
                 rule.condition === 'is not empty' ? 'is_not_empty' :
                 rule.condition === 'on submit' ? 'on_submit' : 'equals',
      value: rule.value || '',
      action: rule.type === 'show' || rule.type === 'hide' ? rule.type : (rule.actionValue || ''),
      targetField: rule.targetField || ''
    });
    setEditingRuleId(rule.id);
    setLogicStep('configure');
    setShowLogicDialog(true);
  };

  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  const handleUpdateRule = () => {
    if (!editingRuleId) return;
    
    const noValueConditions = ['is_empty', 'is_not_empty', 'on_submit'];
    if (!selectedRuleType || !newRule.field || (!noValueConditions.includes(newRule.condition) && !newRule.value)) return;
    
    const conditionText = newRule.condition === 'equals' ? 'equals' :
                          newRule.condition === 'not_equals' ? 'does not equal' :
                          newRule.condition === 'contains' ? 'contains' :
                          newRule.condition === 'greater_than' ? 'is greater than' :
                          newRule.condition === 'less_than' ? 'is less than' :
                          newRule.condition === 'is_empty' ? 'is empty' :
                          newRule.condition === 'is_not_empty' ? 'is not empty' :
                          newRule.condition === 'on_submit' ? 'on submit' : newRule.condition;
    
    const updatedRule = {
      id: editingRuleId,
      type: selectedRuleType === 'visibility' ? newRule.action : selectedRuleType,
      field: newRule.field,
      condition: conditionText,
      value: newRule.value,
      targetField: newRule.targetField,
      actionValue: newRule.action
    };
    
    setLogicRules(prev => prev.map(r => r.id === editingRuleId ? updatedRule : r));
    resetLogicDialog();
    setEditingRuleId(null);
    setShowLogicDialog(false);
  };

  // Wrapper for setFormFields to handle history
  const setFormFields = (newFields: any[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newFields);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setFormFieldsState(newFields);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setFormFieldsState(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setFormFieldsState(history[newIndex]);
    }
  };

  const updateField = (id: string, key: string, value: any) => {
    const newFields = formFields.map(f => {
      if (f.id === id) {
        let updates: any = { [key]: value };
        // Auto-generate name from label if not customized
        if (key === "label" && !f.isNameCustomized) {
            updates.name = slugify(value);
        }
        return { ...f, ...updates };
      }
      return f;
    });
    setFormFields(newFields);
  };

  const updateFieldStyle = (id: string, key: string, value: any) => {
    const newFields = formFields.map(f => {
      if (f.id === id) {
        const currentStyle = f.style || {};
        // Always save to the main style object for now
        return { ...f, style: { ...currentStyle, [key]: value } };
      }
      return f;
    });
    setFormFields(newFields);
  };

  const updateFieldStyleBatch = (id: string, updates: Record<string, any>) => {
    const newFields = formFields.map(f => {
      if (f.id === id) {
        const currentStyle = f.style || {};
        // Always save to the main style object for now
        return { ...f, style: { ...currentStyle, ...updates } };
      }
      return f;
    });
    setFormFields(newFields);
  };

  // Helper to get the effective style value for the current breakpoint
  const getFieldStyle = (field: any, key: string, defaultValue: any) => {
      if (!field) return defaultValue;
      
      // Check active breakpoint override
      if (activeDevice && activeDevice !== 'xl' && field.responsive?.[activeDevice]?.[key] !== undefined) {
          return field.responsive[activeDevice][key];
      }
      
      // Fallback to base style
      return field.style?.[key] !== undefined ? field.style[key] : defaultValue;
  };

  const handleFieldSelect = useCallback((id: string | null) => {
    setSelectedField(id);
    if (id) {
      setIsSidebarCollapsed(false); // Ensure sidebar is open when selecting a field
    }
  }, []);

  const handleDeleteField = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFields = formFields.filter(f => f.id !== id);
    setFormFields(newFields);
    if (selectedField === id) setSelectedField(null);
  }, [formFields, selectedField]); // formFields dependency is unavoidable without larger refactor

  const handleBackToElements = () => {
    setSelectedField(null);
  };

  // State for visual line indicator
  const [dragDestinationIndex, setDragDestinationIndex] = useState<number | null>(null);

  const onDragStart = () => {
    // Optional: Add global dragging state class to body if needed
  };

  const onDragUpdate = (update: any) => {
    if (!update.destination) {
      setDragDestinationIndex(null);
      return;
    }
    if (update.destination.droppableId === "CANVAS") {
      setDragDestinationIndex(update.destination.index);
    } else {
      setDragDestinationIndex(null);
    }
  };

  const onDragEnd = (result: DropResult) => {
    setDragDestinationIndex(null);
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped from Sidebar to Canvas
    if (source.droppableId === "SIDEBAR" && destination.droppableId === "CANVAS") {
      const sourceGroupIndex = parseInt(source.index.toString().split('-')[0]);
      const sourceItemIndex = parseInt(source.index.toString().split('-')[1]);
      
      // Since we flattened the index in the draggableId, we need to find the item differently
      // Let's use the draggableId which should contain the type/id
      const itemId = result.draggableId.replace('sidebar-', '');
      
      let itemToAdd: any = null;
      
      // Find the item in groups
      for (const group of ELEMENT_GROUPS) {
        const found = group.items.find(i => i.id === itemId);
        if (found) {
            itemToAdd = found;
            break;
        }
      }

      if (itemToAdd) {
        const newField = {
          id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Use a more unique ID
          type: itemToAdd.id,
          label: itemToAdd.label,
          name: slugify(itemToAdd.label),
          isNameCustomized: false,
          action: 'submit',
          actionUrl: '',
          placeholder: "",
          required: false,
          helpText: "",
          altText: "",
          style: {},
          options: undefined as any[] | undefined, // Type placeholder
        };
        
        // Add default props based on type
        if (newField.type === "heading") {
           newField.placeholder = "Heading Text";
           newField.label = "Heading";
        } else if (newField.type === "paragraph") {
           newField.label = "This is a paragraph text block. You can edit this text to provide instructions or information to your users.";
        } else if (newField.type === "button") {
           newField.label = "Submit";
        } else if (newField.type === "textarea") {
           newField.placeholder = "Put your message here";
        } else if (newField.type === "website") {
           newField.placeholder = "Website URL";
        } else if (newField.type === "fname") {
           newField.placeholder = "First Name";
        } else if (newField.type === "lname") {
           newField.placeholder = "Last Name";
        } else if (newField.type === "email") {
           newField.placeholder = "Email Address";
        } else if (newField.type === "phone") {
           newField.placeholder = "Phone Number";
        } else if (newField.type === "company") {
           newField.placeholder = "Business Name";
        } else if (newField.type === "address") {
           newField.placeholder = "Street Address";
        } else if (newField.type === "city") {
           newField.placeholder = "City";
        } else if (newField.type === "state") {
           newField.placeholder = "State";
        } else if (newField.type === "zip") {
           newField.placeholder = "Zip Code";
        } else if (newField.type === "number") {
           newField.placeholder = "Enter number";
        } else if (["text"].includes(newField.type)) {
           newField.placeholder = "Enter text...";
        } else if (["checkbox", "radio", "dropdown"].includes(newField.type)) {
           newField.options = [
             { id: 'opt1', label: 'Option 1', value: 'option_1' },
             { id: 'opt2', label: 'Option 2', value: 'option_2' },
             { id: 'opt3', label: 'Option 3', value: 'option_3' },
           ];
        }

        const newFields = Array.from(formFields);
        newFields.splice(destination.index, 0, newField);
        setFormFields(newFields);
        // setSelectedField(newField.id); // Don't auto-select on drag
      }
      return;
    }

    // Reordering within Canvas
    if (source.droppableId === "CANVAS" && destination.droppableId === "CANVAS") {
      const newFields = Array.from(formFields);
      const [reorderedItem] = newFields.splice(source.index, 1);
      newFields.splice(destination.index, 0, reorderedItem);

      setFormFields(newFields);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
    <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex h-screen bg-neutral-900 overflow-hidden text-white font-sans">
      {/* Main Sidebar - Elementor style */}
      <aside 
        className={`${isSidebarCollapsed ? 'w-[60px]' : 'w-[300px]'} flex flex-col bg-[#2e2e2e] border-r border-[#404040] shrink-0 z-20 shadow-xl transition-all duration-300 ease-in-out relative`}
      >
        {/* Header */}
        <div className={`h-12 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-3'} bg-[#2e2e2e] border-b border-[#404040]`}>
           {!isSidebarCollapsed ? (
             selectedField ? (
               <>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   className="h-8 text-neutral-400 hover:text-white hover:bg-neutral-700 -ml-1 pr-2"
                   onClick={handleBackToElements}
                 >
                   <ArrowLeft className="w-4 h-4 mr-1" />
                   Back
                 </Button>
                 <span className="font-bold text-sm tracking-wide text-neutral-200">Edit Field</span>
               </>
             ) : (
               <>
                 <span className="font-bold text-sm tracking-wide text-neutral-200 ml-1">Form Elements</span>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-700"
                   onClick={() => setIsSidebarCollapsed(true)}
                 >
                   <ChevronLeft className="w-4 h-4" />
                 </Button>
               </>
             )
           ) : (
             <Tooltip>
               <TooltipTrigger asChild>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-10 w-10 text-neutral-200 hover:text-white hover:bg-neutral-700"
                   onClick={() => setIsSidebarCollapsed(false)}
                 >
                   <Plus className="w-6 h-6" />
                 </Button>
               </TooltipTrigger>
               <TooltipContent side="right" className="bg-neutral-800 text-neutral-200 border-neutral-700">
                 <p>Expand Sidebar</p>
               </TooltipContent>
             </Tooltip>
           )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
           {selectedField && !isSidebarCollapsed ? (
             // Properties View
             <div className="flex-1 flex flex-col h-full bg-[#2e2e2e]">
                <div className="px-4 pt-4 border-b border-[#404040]">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full grid grid-cols-3 mb-4 bg-[#1f1f1f] p-1 border border-[#404040]">
                      <TabsTrigger value="content" className="text-[10px] data-[state=active]:bg-[#404040] data-[state=active]:text-white">Content</TabsTrigger>
                      <TabsTrigger value="style" className="text-[10px] data-[state=active]:bg-[#404040] data-[state=active]:text-white">Style</TabsTrigger>
                      <TabsTrigger value="logic" className="text-[10px] data-[state=active]:bg-[#404040] data-[state=active]:text-white">Logic</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-6">
                    {activeTab === "content" && (
                      <div className="space-y-5">
                        {/* Label / Content Field - Hidden for Divider */}
                        {formFields.find(f => f.id === selectedField)?.type !== "divider" && (
                          <div className="space-y-2">
                            <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                              {["heading", "paragraph"].includes(formFields.find(f => f.id === selectedField)?.type) ? "Content" : "Label"}
                            </Label>
                            <Input 
                              value={formFields.find(f => f.id === selectedField)?.label || ""} 
                              onChange={(e) => updateField(selectedField!, "label", e.target.value)}
                              className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                            />
                          </div>
                        )}

                        {formFields.find(f => f.id === selectedField)?.type === "heading" && (
                           <div className="space-y-2">
                             <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Heading Level</Label>
                             <Select 
                               value={formFields.find(f => f.id === selectedField)?.headingLevel || "h2"}
                               onValueChange={(v) => updateField(selectedField!, "headingLevel", v)}
                             >
                               <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus:ring-[#5533ff] h-9">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                 <SelectItem value="h1">H1 (XXL)</SelectItem>
                                 <SelectItem value="h2">H2 (XL)</SelectItem>
                                 <SelectItem value="h3">H3 (Large)</SelectItem>
                                 <SelectItem value="h4">H4 (Medium)</SelectItem>
                                 <SelectItem value="h5">H5 (Small)</SelectItem>
                                 <SelectItem value="h6">H6 (Tiny)</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                        )}

                        {["text", "textarea", "number", "checkbox", "radio", "dropdown", "date", "time", "upload", "button"].includes(formFields.find(f => f.id === selectedField)?.type) && (
                           <div className="space-y-2">
                             <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Field Name (Internal)</Label>
                             <div className="flex gap-2">
                               <Input 
                                 value={formFields.find(f => f.id === selectedField)?.name || ""} 
                                 onChange={(e) => updateField(selectedField!, "name", e.target.value)}
                                 disabled={!formFields.find(f => f.id === selectedField)?.isNameCustomized}
                                 className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff] disabled:opacity-50" 
                               />
                               <Button 
                                 variant="outline" 
                                 size="icon" 
                                 className={`shrink-0 border-[#404040] bg-[#1f1f1f] hover:bg-[#2e2e2e] ${formFields.find(f => f.id === selectedField)?.isNameCustomized ? 'text-[#5533ff] border-[#5533ff]/50' : 'text-neutral-400'}`}
                                 onClick={() => {
                                    const field = formFields.find(f => f.id === selectedField);
                                    updateField(selectedField!, "isNameCustomized", !field?.isNameCustomized);
                                 }}
                               >
                                 <Pencil className="h-4 w-4" />
                               </Button>
                             </div>
                           </div>
                        )}
                        
                        {formFields.find(f => f.id === selectedField)?.type === 'button' && (
                           <div className="space-y-4 pt-2 pb-2 border-y border-[#404040]/50 my-2">
                             <div className="space-y-2">
                               <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Action</Label>
                               <Select 
                                 value={formFields.find(f => f.id === selectedField)?.action || "submit"}
                                 onValueChange={(v) => updateField(selectedField!, "action", v)}
                               >
                                 <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus:ring-[#5533ff] h-9">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                   <SelectItem value="submit">Submit Form</SelectItem>
                                   <SelectItem value="url">Open URL</SelectItem>
                                   <SelectItem value="scroll">Scroll to Element</SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>
                             
                             {formFields.find(f => f.id === selectedField)?.action === 'url' && (
                               <div className="space-y-2">
                                 <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Destination URL</Label>
                                 <Input 
                                   value={formFields.find(f => f.id === selectedField)?.actionUrl || ""} 
                                   onChange={(e) => updateField(selectedField!, "actionUrl", e.target.value)}
                                   placeholder="https://example.com"
                                   className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                                 />
                               </div>
                             )}
                             
                             {formFields.find(f => f.id === selectedField)?.action === 'scroll' && (
                               <div className="space-y-2">
                                 <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Scroll To Element</Label>
                                 <Select 
                                   value={formFields.find(f => f.id === selectedField)?.scrollToElement || ""}
                                   onValueChange={(v) => updateField(selectedField!, "scrollToElement", v)}
                                 >
                                   <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus:ring-[#5533ff] h-9">
                                     <SelectValue placeholder="Select an element" />
                                   </SelectTrigger>
                                   <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                     {formFields.filter(f => f.id !== selectedField).map((f) => (
                                       <SelectItem key={f.id} value={f.id}>
                                         {f.label || f.type} ({f.type})
                                       </SelectItem>
                                     ))}
                                   </SelectContent>
                                 </Select>
                               </div>
                             )}
                           </div>
                        )}
                        
                        {["text", "email", "textarea", "fname", "lname", "phone", "company", "address", "city", "state", "zip", "website"].includes(formFields.find(f => f.id === selectedField)?.type) && (
                           <div className="space-y-2">
                             <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Placeholder</Label>
                             <Input 
                               value={formFields.find(f => f.id === selectedField)?.placeholder || ""} 
                               onChange={(e) => updateField(selectedField!, "placeholder", e.target.value)}
                               className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                             />
                           </div>
                        )}

                        {formFields.find(f => f.id === selectedField)?.type === 'textarea' && (
                           <div className="space-y-2">
                             <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Rows</Label>
                             <Input 
                               type="number"
                               min={1}
                               value={formFields.find(f => f.id === selectedField)?.rows || 4} 
                               onChange={(e) => updateField(selectedField!, "rows", parseInt(e.target.value) || 1)}
                               className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                             />
                           </div>
                        )}

                        {!["divider", "heading", "paragraph", "image", "video", "button"].includes(formFields.find(f => f.id === selectedField)?.type) && (
                          <div className="flex items-center justify-between py-2 px-3 bg-[#1f1f1f] rounded border border-[#404040]">
                            <Label className="cursor-pointer text-sm font-medium text-neutral-300" htmlFor="required-toggle">Required</Label>
                            <Switch 
                              id="required-toggle" 
                              checked={formFields.find(f => f.id === selectedField)?.required || false} 
                              onCheckedChange={(checked) => updateField(selectedField!, "required", checked)}
                              className="data-[state=checked]:bg-[#5533ff]" 
                            />
                          </div>
                        )}
                        
                        {["checkbox", "radio", "dropdown"].includes(formFields.find(f => f.id === selectedField)?.type) && (
                           <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Options</Label>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 px-2 text-[10px] text-[#5533ff] hover:text-[#5533ff] hover:bg-[#5533ff]/10 gap-1 -mr-2"
                                    onClick={() => {
                                        const field = formFields.find(f => f.id === selectedField);
                                        const newOption = {
                                            id: `opt_${Date.now()}`,
                                            label: `Option ${field?.options?.length ? field.options.length + 1 : 1}`,
                                            value: `option_${field?.options?.length ? field.options.length + 1 : 1}`
                                        };
                                        const newOptions = [...(field?.options || []), newOption];
                                        updateField(selectedField!, "options", newOptions);
                                    }}
                                >
                                    <Plus className="w-3 h-3" />
                                    Add Option
                                </Button>
                             </div>
                             
                             <div className="space-y-2">
                                {(formFields.find(f => f.id === selectedField)?.options || []).map((option: any, index: number) => (
                                    <div key={option.id || index} className="flex gap-2 items-start">
                                        <div className="flex-1 space-y-1">
                                            <div className="flex gap-2">
                                                <Input 
                                                    value={option.label}
                                                    onChange={(e) => {
                                                        const field = formFields.find(f => f.id === selectedField);
                                                        const newOptions = [...(field?.options || [])];
                                                        newOptions[index] = { ...newOptions[index], label: e.target.value };
                                                        updateField(selectedField!, "options", newOptions);
                                                    }}
                                                    placeholder="Label"
                                                    className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff] h-8" 
                                                />
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    className="h-8 w-8 shrink-0 text-neutral-400 hover:text-red-400"
                                                    onClick={() => {
                                                        const field = formFields.find(f => f.id === selectedField);
                                                        const newOptions = field?.options.filter((_: any, i: number) => i !== index);
                                                        updateField(selectedField!, "options", newOptions);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <Input 
                                                value={option.value}
                                                onChange={(e) => {
                                                    const field = formFields.find(f => f.id === selectedField);
                                                    const newOptions = [...(field?.options || [])];
                                                    newOptions[index] = { ...newOptions[index], value: e.target.value };
                                                    updateField(selectedField!, "options", newOptions);
                                                }}
                                                placeholder="Value"
                                                className="bg-[#1f1f1f] border-[#404040] text-xs text-neutral-400 focus-visible:ring-[#5533ff] h-6 font-mono" 
                                            />
                                        </div>
                                    </div>
                                ))}
                             </div>
                           </div>
                        )}
                        
                        {["image", "video"].includes(formFields.find(f => f.id === selectedField)?.type) && (
                           <div className="space-y-4 border-y border-[#404040]/50 py-3 my-2">
                             <div className="space-y-2">
                               <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Source URL</Label>
                               <Input 
                                 value={formFields.find(f => f.id === selectedField)?.url || ""} 
                                 onChange={(e) => updateField(selectedField!, "url", e.target.value)}
                                 placeholder={formFields.find(f => f.id === selectedField)?.type === 'video' ? "https://youtube.com/..." : "https://example.com/image.jpg"} 
                                 className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                               />
                             </div>
                             <div className="space-y-2">
                               <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Alt Text</Label>
                               <Input 
                                 value={formFields.find(f => f.id === selectedField)?.altText || ""} 
                                 onChange={(e) => updateField(selectedField!, "altText", e.target.value)}
                                 placeholder="Descriptive text for accessibility" 
                                 className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                               />
                             </div>
                             <div className="space-y-2">
                               <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Caption</Label>
                               <Input 
                                 value={formFields.find(f => f.id === selectedField)?.helpText || ""} 
                                 onChange={(e) => updateField(selectedField!, "helpText", e.target.value)}
                                 placeholder="Caption displayed below the media" 
                                 className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                               />
                             </div>
                           </div>
                        )}

                        {formFields.find(f => f.id === selectedField)?.type === "checkbox" && (
                           <div className="space-y-2 pt-2">
                             <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Selection Mode</Label>
                             <Select 
                               value={formFields.find(f => f.id === selectedField)?.selectionMode || "multi"}
                               onValueChange={(v) => updateField(selectedField!, "selectionMode", v)}
                             >
                               <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus:ring-[#5533ff] h-9">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                 <SelectItem value="multi">Multi Select (Checkboxes)</SelectItem>
                                 <SelectItem value="single">Single Select (Radio-style)</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                        )}

                        {!["divider", "heading", "paragraph", "image", "video", "button"].includes(formFields.find(f => f.id === selectedField)?.type) && (
                          <>
                            <Separator className="bg-[#404040]" />
                            
                            <div className="space-y-2">
                               <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Help Text</Label>
                               <Input 
                                 value={formFields.find(f => f.id === selectedField)?.helpText || ""} 
                                 onChange={(e) => updateField(selectedField!, "helpText", e.target.value)}
                                 placeholder="Small text below input" 
                                 className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus-visible:ring-[#5533ff]" 
                               />
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activeTab === "style" && (
                       <div className="space-y-6">
                          {/* Layout Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Layout</h4>
                                {activeDevice && (
                                    <Badge variant="outline" className="text-[10px] h-5 border-[#5533ff] text-[#5533ff] bg-[#5533ff]/10">
                                        Editing {activeDevice.toUpperCase()}
                                    </Badge>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-[10px] text-neutral-400">Width</Label>
                              <Select 
                                value={getFieldStyle(formFields.find(f => f.id === selectedField), "width", "full")}
                                onValueChange={(v) => updateFieldStyle(selectedField!, "width", v)}
                              >
                                <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-sm text-white focus:ring-[#5533ff] h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                  <SelectItem value="full">Full Width (100%)</SelectItem>
                                  <SelectItem value="three-quarters">Three Quarters (75%)</SelectItem>
                                  <SelectItem value="half">Half Width (50%)</SelectItem>
                                  <SelectItem value="third">One Third (33%)</SelectItem>
                                  <SelectItem value="quarter">One Quarter (25%)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Tabs defaultValue="input" className="w-full mt-4" onValueChange={(v) => setActiveSubElement(v)}>
                              <TabsList className="grid w-full grid-cols-2 bg-[#1f1f1f]">
                                <TabsTrigger value="input" className="text-xs">Input</TabsTrigger>
                                <TabsTrigger value="window" className="text-xs">Window</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="input" className="space-y-4 mt-4">
                                <SpacingControl 
                                    label="Margin"
                                    values={{
                                        top: getFieldStyle(formFields.find(f => f.id === selectedField), "inputMarginTop", ""),
                                        right: getFieldStyle(formFields.find(f => f.id === selectedField), "inputMarginRight", ""),
                                        bottom: getFieldStyle(formFields.find(f => f.id === selectedField), "inputMarginBottom", ""),
                                        left: getFieldStyle(formFields.find(f => f.id === selectedField), "inputMarginLeft", "")
                                    }}
                                    onChange={(key, value) => updateFieldStyle(selectedField!, key, value)}
                                    onBatchChange={(updates) => updateFieldStyleBatch(selectedField!, updates)}
                                    prefix="inputMargin"
                                />
                                
                                <SpacingControl 
                                    label="Padding"
                                    values={{
                                        top: getFieldStyle(formFields.find(f => f.id === selectedField), "inputPaddingTop", ""),
                                        right: getFieldStyle(formFields.find(f => f.id === selectedField), "inputPaddingRight", ""),
                                        bottom: getFieldStyle(formFields.find(f => f.id === selectedField), "inputPaddingBottom", ""),
                                        left: getFieldStyle(formFields.find(f => f.id === selectedField), "inputPaddingLeft", "")
                                    }}
                                    onChange={(key, value) => updateFieldStyle(selectedField!, key, value)}
                                    onBatchChange={(updates) => updateFieldStyleBatch(selectedField!, updates)}
                                    prefix="inputPadding"
                                />
                              </TabsContent>

                              <TabsContent value="window" className="space-y-4 mt-4">
                                <SpacingControl 
                                    label="Margin"
                                    values={{
                                        top: getFieldStyle(formFields.find(f => f.id === selectedField), "windowMarginTop", ""),
                                        right: getFieldStyle(formFields.find(f => f.id === selectedField), "windowMarginRight", ""),
                                        bottom: getFieldStyle(formFields.find(f => f.id === selectedField), "windowMarginBottom", ""),
                                        left: getFieldStyle(formFields.find(f => f.id === selectedField), "windowMarginLeft", "")
                                    }}
                                    onChange={(key, value) => updateFieldStyle(selectedField!, key, value)}
                                    onBatchChange={(updates) => updateFieldStyleBatch(selectedField!, updates)}
                                    prefix="windowMargin"
                                />
                                
                                <SpacingControl 
                                    label="Padding"
                                    values={{
                                        top: getFieldStyle(formFields.find(f => f.id === selectedField), "windowPaddingTop", ""),
                                        right: getFieldStyle(formFields.find(f => f.id === selectedField), "windowPaddingRight", ""),
                                        bottom: getFieldStyle(formFields.find(f => f.id === selectedField), "windowPaddingBottom", ""),
                                        left: getFieldStyle(formFields.find(f => f.id === selectedField), "windowPaddingLeft", "")
                                    }}
                                    onChange={(key, value) => updateFieldStyle(selectedField!, key, value)}
                                    onBatchChange={(updates) => updateFieldStyleBatch(selectedField!, updates)}
                                    prefix="windowPadding"
                                />
                              </TabsContent>
                            </Tabs>
                          </div>

                          <Separator className="bg-[#404040]" />

                          {/* Typography Section */}
                          <div className="space-y-4">
                            <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Typography</h4>
                            
                            <Tabs defaultValue="input" className="w-full" onValueChange={(v) => setActiveSubElement(v)}>
                              <TabsList className="grid w-full grid-cols-4 bg-[#1f1f1f]">
                                <TabsTrigger value="input" className="text-[10px]">Input</TabsTrigger>
                                <TabsTrigger value="label" className="text-[10px]">Label</TabsTrigger>
                                <TabsTrigger value="placeholder" className="text-[10px]">Placeholder</TabsTrigger>
                                <TabsTrigger value="help" className="text-[10px]">Help</TabsTrigger>
                              </TabsList>

                              {/* Input Typography */}
                              <TabsContent value="input" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Font Family</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.inputFontFamily || "default"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "inputFontFamily", v === "default" ? "" : v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 font-sans">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                            <SelectItem value="default" className="font-sans">Default</SelectItem>
                                            <SelectItem value="inter" className="font-sans">Inter</SelectItem>
                                            <SelectItem value="roboto" className="font-sans">Roboto</SelectItem>
                                            <SelectItem value="playfair" className="font-serif">Playfair Display</SelectItem>
                                            <SelectItem value="lora" className="font-serif">Lora</SelectItem>
                                            <SelectItem value="mono" className="font-mono">JetBrains Mono</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Size</Label>
                                    <div className="flex">
                                      <Input 
                                        type="number" 
                                        value={formFields.find(f => f.id === selectedField)?.style?.inputFontSize || ""}
                                        onChange={(e) => updateFieldStyle(selectedField!, "inputFontSize", e.target.value)}
                                        className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus-visible:ring-[#5533ff] h-8 rounded-r-none border-r-0" 
                                        placeholder="14" 
                                      />
                                      <Select 
                                        value={formFields.find(f => f.id === selectedField)?.style?.inputFontSizeUnit || "px"}
                                        onValueChange={(v) => updateFieldStyle(selectedField!, "inputFontSizeUnit", v)}
                                      >
                                        <SelectTrigger className="w-[60px] bg-[#2e2e2e] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 rounded-l-none">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white min-w-[60px]">
                                          <SelectItem value="px">px</SelectItem>
                                          <SelectItem value="rem">rem</SelectItem>
                                          <SelectItem value="em">em</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Weight</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.inputFontWeight || "normal"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "inputFontWeight", v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                          <SelectItem value="light">Light</SelectItem>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="semibold">Semi Bold</SelectItem>
                                          <SelectItem value="bold">Bold</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <ColorPickerField 
                                    label="Input Text Color" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.inputColor || "#000000"} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "inputColor", c)} 
                                  />
                                </div>
                              </TabsContent>

                              {/* Label Typography */}
                              <TabsContent value="label" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Font Family</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.labelFontFamily || "default"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "labelFontFamily", v === "default" ? "" : v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 font-sans">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                            <SelectItem value="default" className="font-sans">Default</SelectItem>
                                            <SelectItem value="inter" className="font-sans">Inter</SelectItem>
                                            <SelectItem value="roboto" className="font-sans">Roboto</SelectItem>
                                            <SelectItem value="playfair" className="font-serif">Playfair Display</SelectItem>
                                            <SelectItem value="lora" className="font-serif">Lora</SelectItem>
                                            <SelectItem value="mono" className="font-mono">JetBrains Mono</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Size</Label>
                                    <div className="flex">
                                      <Input 
                                        type="number" 
                                        value={formFields.find(f => f.id === selectedField)?.style?.labelFontSize || ""}
                                        onChange={(e) => updateFieldStyle(selectedField!, "labelFontSize", e.target.value)}
                                        className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus-visible:ring-[#5533ff] h-8 rounded-r-none border-r-0" 
                                        placeholder="14" 
                                      />
                                      <Select 
                                        value={formFields.find(f => f.id === selectedField)?.style?.labelFontSizeUnit || "px"}
                                        onValueChange={(v) => updateFieldStyle(selectedField!, "labelFontSizeUnit", v)}
                                      >
                                        <SelectTrigger className="w-[60px] bg-[#2e2e2e] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 rounded-l-none">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white min-w-[60px]">
                                          <SelectItem value="px">px</SelectItem>
                                          <SelectItem value="rem">rem</SelectItem>
                                          <SelectItem value="em">em</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Weight</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.labelFontWeight || "medium"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "labelFontWeight", v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                          <SelectItem value="light">Light</SelectItem>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="semibold">Semi Bold</SelectItem>
                                          <SelectItem value="bold">Bold</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <ColorPickerField 
                                    label="Label Color" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.labelColor || "#A3A3A3"} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "labelColor", c)} 
                                  />
                                </div>
                              </TabsContent>

                              {/* Placeholder Typography */}
                              <TabsContent value="placeholder" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Font Family</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.placeholderFontFamily || "default"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "placeholderFontFamily", v === "default" ? "" : v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 font-sans">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                            <SelectItem value="default" className="font-sans">Default</SelectItem>
                                            <SelectItem value="inter" className="font-sans">Inter</SelectItem>
                                            <SelectItem value="roboto" className="font-sans">Roboto</SelectItem>
                                            <SelectItem value="playfair" className="font-serif">Playfair Display</SelectItem>
                                            <SelectItem value="lora" className="font-serif">Lora</SelectItem>
                                            <SelectItem value="mono" className="font-mono">JetBrains Mono</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Size</Label>
                                    <div className="flex">
                                      <Input 
                                        type="number" 
                                        value={formFields.find(f => f.id === selectedField)?.style?.placeholderFontSize || ""}
                                        onChange={(e) => updateFieldStyle(selectedField!, "placeholderFontSize", e.target.value)}
                                        className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus-visible:ring-[#5533ff] h-8 rounded-r-none border-r-0" 
                                        placeholder="14" 
                                      />
                                      <Select 
                                        value={formFields.find(f => f.id === selectedField)?.style?.placeholderFontSizeUnit || "px"}
                                        onValueChange={(v) => updateFieldStyle(selectedField!, "placeholderFontSizeUnit", v)}
                                      >
                                        <SelectTrigger className="w-[60px] bg-[#2e2e2e] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 rounded-l-none">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white min-w-[60px]">
                                          <SelectItem value="px">px</SelectItem>
                                          <SelectItem value="rem">rem</SelectItem>
                                          <SelectItem value="em">em</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Weight</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.placeholderFontWeight || "normal"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "placeholderFontWeight", v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                          <SelectItem value="light">Light</SelectItem>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="semibold">Semi Bold</SelectItem>
                                          <SelectItem value="bold">Bold</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <ColorPickerField 
                                    label="Placeholder Color" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.placeholderColor || "#9ca3af"} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "placeholderColor", c)} 
                                  />
                                </div>
                              </TabsContent>

                              {/* Help Text Typography */}
                              <TabsContent value="help" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Font Family</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.helpTextFontFamily || "default"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "helpTextFontFamily", v === "default" ? "" : v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 font-sans">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                            <SelectItem value="default" className="font-sans">Default</SelectItem>
                                            <SelectItem value="inter" className="font-sans">Inter</SelectItem>
                                            <SelectItem value="roboto" className="font-sans">Roboto</SelectItem>
                                            <SelectItem value="playfair" className="font-serif">Playfair Display</SelectItem>
                                            <SelectItem value="lora" className="font-serif">Lora</SelectItem>
                                            <SelectItem value="mono" className="font-mono">JetBrains Mono</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Size</Label>
                                    <div className="flex">
                                      <Input 
                                        type="number" 
                                        value={formFields.find(f => f.id === selectedField)?.style?.helpTextFontSize || ""}
                                        onChange={(e) => updateFieldStyle(selectedField!, "helpTextFontSize", e.target.value)}
                                        className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus-visible:ring-[#5533ff] h-8 rounded-r-none border-r-0" 
                                        placeholder="10" 
                                      />
                                      <Select 
                                        value={formFields.find(f => f.id === selectedField)?.style?.helpTextFontSizeUnit || "px"}
                                        onValueChange={(v) => updateFieldStyle(selectedField!, "helpTextFontSizeUnit", v)}
                                      >
                                        <SelectTrigger className="w-[60px] bg-[#2e2e2e] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8 rounded-l-none">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white min-w-[60px]">
                                          <SelectItem value="px">px</SelectItem>
                                          <SelectItem value="rem">rem</SelectItem>
                                          <SelectItem value="em">em</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Weight</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.helpTextFontWeight || "normal"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "helpTextFontWeight", v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                          <SelectItem value="light">Light</SelectItem>
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="medium">Medium</SelectItem>
                                          <SelectItem value="semibold">Semi Bold</SelectItem>
                                          <SelectItem value="bold">Bold</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <ColorPickerField 
                                    label="Help Text Color" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.helpTextColor || "#64748b"} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "helpTextColor", c)} 
                                  />
                                </div>
                              </TabsContent>
                            </Tabs>
                          </div>

                          <Separator className="bg-[#404040]" />

                          {/* Decoration Section */}
                          <div className="space-y-4">
                            <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Decoration</h4>
                            
                            <Tabs defaultValue="input" className="w-full" onValueChange={(v) => setActiveSubElement(v)}>
                              <TabsList className="grid w-full grid-cols-2 bg-[#1f1f1f]">
                                <TabsTrigger value="input" className="text-xs">Input</TabsTrigger>
                                <TabsTrigger value="window" className="text-xs">Window</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="input" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <ColorPickerField 
                                    label="Background" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.inputBackgroundColor || ""} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "inputBackgroundColor", c)} 
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Border</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.inputBorderStyle || "solid"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "inputBorderStyle", v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                          <SelectItem value="none">None</SelectItem>
                                          <SelectItem value="solid">Solid</SelectItem>
                                          <SelectItem value="dashed">Dashed</SelectItem>
                                          <SelectItem value="dotted">Dotted</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Width (px)</Label>
                                    <Input 
                                      type="number"
                                      min={0}
                                      value={formFields.find(f => f.id === selectedField)?.style?.inputBorderWidth || ""}
                                      onChange={(e) => updateFieldStyle(selectedField!, "inputBorderWidth", e.target.value)}
                                      className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus-visible:ring-[#5533ff] h-8" 
                                      placeholder="1" 
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                   <ColorPickerField 
                                    label="Border Color" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.inputBorderColor || "#E5E5E5"} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "inputBorderColor", c)} 
                                  />
                                </div>

                                <SpacingControl 
                                    label="Border Radius"
                                    values={{
                                        top: getFieldStyle(formFields.find(f => f.id === selectedField), "inputBorderTopLeftRadius", ""),
                                        right: getFieldStyle(formFields.find(f => f.id === selectedField), "inputBorderTopRightRadius", ""),
                                        bottom: getFieldStyle(formFields.find(f => f.id === selectedField), "inputBorderBottomRightRadius", ""),
                                        left: getFieldStyle(formFields.find(f => f.id === selectedField), "inputBorderBottomLeftRadius", "")
                                    }}
                                    onChange={(key, value) => updateFieldStyle(selectedField!, key, value)}
                                    onBatchChange={(updates) => updateFieldStyleBatch(selectedField!, updates)}
                                    keyMapping={{
                                        top: "inputBorderTopLeftRadius",
                                        right: "inputBorderTopRightRadius",
                                        bottom: "inputBorderBottomRightRadius",
                                        left: "inputBorderBottomLeftRadius"
                                    }}
                                />
                              </TabsContent>

                              <TabsContent value="window" className="space-y-4 mt-4">
                                <div className="space-y-2">
                                  <ColorPickerField 
                                    label="Background" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.windowBackgroundColor || ""} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "windowBackgroundColor", c)} 
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Border</Label>
                                    <Select 
                                      value={formFields.find(f => f.id === selectedField)?.style?.windowBorderStyle || "none"}
                                      onValueChange={(v) => updateFieldStyle(selectedField!, "windowBorderStyle", v)}
                                    >
                                        <SelectTrigger className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus:ring-[#5533ff] h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2e2e2e] border-[#404040] text-white">
                                          <SelectItem value="none">None</SelectItem>
                                          <SelectItem value="solid">Solid</SelectItem>
                                          <SelectItem value="dashed">Dashed</SelectItem>
                                          <SelectItem value="dotted">Dotted</SelectItem>
                                        </SelectContent>
                                      </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-[10px] text-neutral-400">Width (px)</Label>
                                    <Input 
                                      type="number"
                                      min={0}
                                      value={formFields.find(f => f.id === selectedField)?.style?.windowBorderWidth || ""}
                                      onChange={(e) => updateFieldStyle(selectedField!, "windowBorderWidth", e.target.value)}
                                      className="bg-[#1f1f1f] border-[#404040] text-xs text-white focus-visible:ring-[#5533ff] h-8" 
                                      placeholder="1" 
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                   <ColorPickerField 
                                    label="Border Color" 
                                    color={formFields.find(f => f.id === selectedField)?.style?.windowBorderColor || "#E5E5E5"} 
                                    onChange={(c) => updateFieldStyle(selectedField!, "windowBorderColor", c)} 
                                  />
                                </div>

                                <SpacingControl 
                                    label="Border Radius"
                                    values={{
                                        top: getFieldStyle(formFields.find(f => f.id === selectedField), "windowBorderTopLeftRadius", ""),
                                        right: getFieldStyle(formFields.find(f => f.id === selectedField), "windowBorderTopRightRadius", ""),
                                        bottom: getFieldStyle(formFields.find(f => f.id === selectedField), "windowBorderBottomRightRadius", ""),
                                        left: getFieldStyle(formFields.find(f => f.id === selectedField), "windowBorderBottomLeftRadius", "")
                                    }}
                                    onChange={(key, value) => updateFieldStyle(selectedField!, key, value)}
                                    onBatchChange={(updates) => updateFieldStyleBatch(selectedField!, updates)}
                                    keyMapping={{
                                        top: "windowBorderTopLeftRadius",
                                        right: "windowBorderTopRightRadius",
                                        bottom: "windowBorderBottomRightRadius",
                                        left: "windowBorderBottomLeftRadius"
                                    }}
                                />
                              </TabsContent>
                            </Tabs>
                          </div>
                       </div>
                    )}

                    {activeTab === "logic" && (
                      <div className="space-y-6">
                        <div className="bg-[#1f1f1f] border border-[#404040] rounded-lg p-4">
                           <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                             <Sliders className="h-4 w-4 text-[#5533ff]" />
                             Conditional Logic
                           </h3>
                           <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                             Add rules to show/hide fields, disqualify leads, or redirect users based on their inputs.
                           </p>
                           <Button 
                             className="w-full bg-[#5533ff] hover:bg-[#4422dd] text-white shadow-sm h-8 text-xs" 
                             onClick={() => setShowLogicDialog(true)}
                           >
                             Add New Condition
                           </Button>
                        </div>
                        
                        {/* Active Rules */}
                        {logicRules.length > 0 && (
                          <div className="space-y-3">
                             <Label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Active Rules</Label>
                             {logicRules.map((rule) => (
                               <div key={rule.id} className="border border-[#404040] rounded-md p-3 bg-[#1f1f1f] flex items-start justify-between gap-2">
                                  <div className="space-y-1">
                                     <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-medium ${
                                       rule.type === 'disqualify' ? 'bg-red-900/20 text-red-400 border-red-900/50' :
                                       rule.type === 'show' ? 'bg-green-900/20 text-green-400 border-green-900/50' :
                                       rule.type === 'hide' ? 'bg-yellow-900/20 text-yellow-400 border-yellow-900/50' :
                                       rule.type === 'message' ? 'bg-purple-900/20 text-purple-400 border-purple-900/50' :
                                       rule.type === 'redirect' ? 'bg-blue-900/20 text-blue-400 border-blue-900/50' :
                                       'bg-neutral-900/20 text-neutral-400 border-neutral-900/50'
                                     }`}>
                                       {rule.type === 'disqualify' ? 'Filter Submission' :
                                        rule.type === 'show' ? 'Show Field' :
                                        rule.type === 'hide' ? 'Hide Field' :
                                        rule.type === 'message' ? 'Custom Message' :
                                        rule.type === 'redirect' ? 'Page Redirect' :
                                        rule.type}
                                     </Badge>
                                     <p className="text-xs text-neutral-300 mt-1">
                                       If <span className="font-semibold text-white">{rule.field}</span> {rule.condition}{rule.value && rule.value !== '_no_value_' && <> <span className="font-semibold text-white">{rule.value}</span></>}
                                       {rule.type === 'redirect' && rule.actionValue && (
                                         <>, go to <span className="font-semibold text-blue-400">{rule.actionValue}</span></>
                                       )}
                                       {rule.type === 'message' && rule.actionValue && (
                                         <>, show message: <span className="font-semibold text-green-400 italic">"{rule.actionValue.length > 30 ? rule.actionValue.substring(0, 30) + '...' : rule.actionValue}"</span></>
                                       )}
                                       {(rule.type === 'show' || rule.type === 'hide') && rule.targetField && (
                                         <>, {rule.type} <span className="font-semibold text-yellow-400">{rule.targetField}</span></>
                                       )}
                                     </p>
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 text-neutral-500 hover:text-red-400 hover:bg-[#2e2e2e]"
                                      onClick={() => deleteLogicRule(rule.id)}
                                    >
                                       <Trash2 className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 text-neutral-500 hover:text-blue-400 hover:bg-[#2e2e2e]"
                                      onClick={() => editLogicRule(rule)}
                                    >
                                       <Pencil className="h-3 w-3" />
                                    </Button>
                                  </div>
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollArea>
             </div>
           ) : (
             // Elements View
             <>
               {/* Search - Hidden when collapsed */}
               {!isSidebarCollapsed && (
                  <div className="p-4 border-b border-[#404040]">
                     <div className="relative">
                       <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
                       <Input 
                         className="bg-[#1f1f1f] border-none text-sm pl-9 h-9 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-[#5533ff] placeholder:text-neutral-500 rounded-md text-white" 
                         placeholder="Search Fields..." 
                       />
                     </div>
                  </div>
               )}
               <ScrollArea className="flex-1">
                  <Droppable droppableId="SIDEBAR" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="p-2">
                        {!isSidebarCollapsed ? (
                          <div className="space-y-6 p-2">
                            {ELEMENT_GROUPS.map((group, idx) => (
                              <div key={idx}>
                                <h3 className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-1">{group.title}</h3>
                                <div className="grid grid-cols-2 gap-2">
                                  {group.items.map((item, itemIdx) => (
                                    <Draggable key={`sidebar-${item.id}`} draggableId={`sidebar-${item.id}`} index={parseInt(`${idx}${itemIdx}`)}>
                                      {(provided, snapshot) => (
                                        <>
                                        <div 
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`flex flex-col items-center justify-center gap-2 p-3 rounded-md bg-[#2e2e2e] hover:bg-[#404040] border border-transparent hover:border-[#5533ff]/50 cursor-grab active:cursor-grabbing transition-colors duration-200 group ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                          style={provided.draggableProps.style}
                                        >
                                          <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" strokeWidth={1.5} />
                                          <span className="text-[11px] font-medium text-neutral-300 group-hover:text-white">{item.label}</span>
                                        </div>
                                      {(snapshot.isDragging || snapshot.isDropAnimating) && (
                                           <div className="flex flex-col items-center justify-center gap-2 p-3 rounded-md bg-[#2e2e2e] border border-[#5533ff] opacity-50">
                                              <item.icon className="w-5 h-5 text-white" />
                                              <span className="text-[11px] font-medium text-white">{item.label}</span>
                                           </div>
                                        )}
                                        </>
                                      )}
                                    </Draggable>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4 py-4 w-full">
                             {ELEMENT_GROUPS.map((group, idx) => (
                               <div key={idx} className="w-full flex flex-col items-center gap-2">
                                 {/* Section Separator/Title */}
                                 <div className="w-full flex justify-center py-4 border-b border-[#404040]">
                                    <span className="vertical-text text-[9px] font-medium text-neutral-500 tracking-wider rotate-180 uppercase" style={{ writingMode: 'vertical-rl', whiteSpace: 'nowrap' }}>{group.title}</span>
                                 </div>
                                 
                                 {group.items.map((item, itemIdx) => (
                                   <Draggable key={`sidebar-${item.id}`} draggableId={`sidebar-${item.id}`} index={parseInt(`${idx}${itemIdx}`)}>
                                     {(provided, snapshot) => (
                                       <>
                                       <Tooltip>
                                         <TooltipTrigger asChild>
                                           <div 
                                             ref={provided.innerRef}
                                             {...provided.draggableProps}
                                             {...provided.dragHandleProps}
                                             className={`p-2 rounded hover:bg-[#404040] cursor-grab active:cursor-grabbing transition-colors duration-200 group/item flex justify-center ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                             style={provided.draggableProps.style}
                                           >
                                             <item.icon className="w-5 h-5 text-neutral-400 group-hover/item:text-white transition-colors" />
                                           </div>
                                         </TooltipTrigger>
                                         <TooltipContent side="right" className="bg-neutral-800 text-neutral-200 border-neutral-700 ml-2">
                                           <div className="flex flex-col gap-1">
                                             <span className="font-semibold">{item.label}</span>
                                             <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{group.title}</span>
                                           </div>
                                         </TooltipContent>
                                       </Tooltip>
                                       {(snapshot.isDragging || snapshot.isDropAnimating) && (
                                           <div className="p-2 rounded bg-[#404040] flex justify-center w-10 h-10 items-center border border-[#5533ff]">
                                              <item.icon className="w-5 h-5 text-white" />
                                           </div>
                                       )}
                                       </>
                                     )}
                                   </Draggable>
                                 ))}
                               </div>
                             ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
               </ScrollArea>
             </>
           )}
        </div>

        {/* Footer Actions */}
        <div className="h-12 border-t border-[#404040] bg-[#2e2e2e] flex items-center justify-between px-2 shrink-0">
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-neutral-400 hover:text-white"
                      onClick={() => setShowSettingsDialog(true)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-neutral-800 text-neutral-200 border-neutral-700">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
                      onClick={undo}
                      disabled={historyIndex <= 0}
                    >
                       <Undo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-neutral-800 text-neutral-200 border-neutral-700">
                    <p>Undo</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400"
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                    >
                       <Redo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-neutral-800 text-neutral-200 border-neutral-700">
                    <p>Redo</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center w-full gap-2 py-2">
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-8 w-8 text-neutral-400 hover:text-white"
                     onClick={() => setShowSettingsDialog(true)}
                   >
                     <Settings className="w-4 h-4" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="right" className="bg-neutral-800 text-neutral-200 border-neutral-700"><p>Settings</p></TooltipContent>
               </Tooltip>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#e6e6e6] relative text-slate-900">
        {/* Top Navigation Bar */}
        <header className="h-12 bg-white border-b border-neutral-200 flex items-center justify-between px-4 shadow-sm z-10 shrink-0 relative">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="bg-indigo-50 text-[#5533ff] p-1.5 rounded-md">
                   <FormInput className="h-4 w-4" />
                </span>
                <Input 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)}
                  className="border-transparent hover:border-neutral-300 focus:border-[#5533ff] font-semibold w-[180px] px-2 h-8 text-slate-800 bg-transparent"
                />
                {isSurveyMode && (
                   <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200 text-[10px] h-5 px-1.5">
                      SURVEY MODE
                   </Badge>
                )}
             </div>
           </div>

           <div className="flex items-center gap-3">
             <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-neutral-600 border-neutral-200 hover:bg-neutral-50 gap-2">
                    <Code className="h-4 w-4" />
                    Embed
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md text-slate-900">
                  <DialogHeader>
                    <DialogTitle>Embed Form</DialogTitle>
                    <DialogDescription>
                      Copy and paste this code into your website's HTML where you want the form to appear.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="bg-slate-950 text-slate-50 p-4 rounded-md font-mono text-xs overflow-x-auto my-2">
                    {`<script src="https://cleave-crm.com/forms.js"></script>
<div data-cleave-form="${formName.toLowerCase().replace(/\s+/g, '-')}" data-id="form_12345"></div>`}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Code
                    </Button>
                  </div>
                </DialogContent>
             </Dialog>

             <Button variant="outline" size="sm" className="text-neutral-600 border-neutral-200 hover:bg-neutral-50">
               <Eye className="w-4 h-4 mr-2" />
               Preview
             </Button>
             <Button size="sm" className="bg-[#5533ff] text-white hover:bg-[#4422dd] shadow-md">
               Publish
             </Button>
           </div>
        </header>

        <div className="flex justify-center py-2 bg-neutral-100/50 shrink-0 border-b border-neutral-200">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white border border-neutral-200 p-1 rounded-md shadow-sm">
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-7 w-8 text-xs font-bold rounded-sm ${activeDevice === 'xs' ? 'bg-indigo-50 text-[#5533ff]' : 'text-neutral-500 hover:text-neutral-900'}`}
                   onClick={() => setCanvasWidth(375)}
                   title="Mobile (375px)"
                 >
                   XS
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-7 w-8 text-xs font-bold rounded-sm ${activeDevice === 'sm' ? 'bg-indigo-50 text-[#5533ff]' : 'text-neutral-500 hover:text-neutral-900'}`}
                   onClick={() => setCanvasWidth(640)}
                   title="SM (640px)"
                 >
                   SM
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-7 w-8 text-xs font-bold rounded-sm ${activeDevice === 'md' ? 'bg-indigo-50 text-[#5533ff]' : 'text-neutral-500 hover:text-neutral-900'}`}
                   onClick={() => setCanvasWidth(768)}
                   title="MD (768px)"
                 >
                   MD
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-7 w-8 text-xs font-bold rounded-sm ${activeDevice === 'lg' ? 'bg-indigo-50 text-[#5533ff]' : 'text-neutral-500 hover:text-neutral-900'}`}
                   onClick={() => setCanvasWidth(1024)}
                   title="LG (1024px)"
                 >
                   LG
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-7 w-8 text-xs font-bold rounded-sm ${activeDevice === 'xl' ? 'bg-indigo-50 text-[#5533ff]' : 'text-neutral-500 hover:text-neutral-900'}`}
                   onClick={() => setCanvasWidth(1280)}
                   title="XL (1280px)"
                 >
                   XL
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   className={`h-7 w-8 text-xs font-bold rounded-sm ${activeDevice === '2xl' ? 'bg-indigo-50 text-[#5533ff]' : 'text-neutral-500 hover:text-neutral-900'}`}
                   onClick={() => setCanvasWidth(1536)}
                   title="2XL (1536px)"
                 >
                   2XL
                 </Button>
               </div>
               
               <div className="bg-white border border-neutral-200 px-3 py-1.5 rounded-md shadow-sm text-xs font-mono font-medium text-neutral-600 min-w-[80px] text-center">
                 {Math.round(canvasWidth)}px
               </div>
               
               <Tooltip>
                 <TooltipTrigger asChild>
                   <Button 
                     variant="outline" 
                     size="icon" 
                     className="h-8 w-8 border-neutral-200 text-neutral-600 hover:text-[#5533ff] hover:border-[#5533ff]"
                     onClick={() => setShowLinkDialog(true)}
                   >
                     <Link2 className="h-4 w-4" />
                   </Button>
                 </TooltipTrigger>
                 <TooltipContent side="bottom" className="bg-neutral-800 text-neutral-200 border-neutral-700">
                   <p>Link Styles</p>
                 </TooltipContent>
               </Tooltip>
             </div>
        </div>
        
        {/* Link Settings Dialog */}
        <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
          <DialogContent className="sm:max-w-md text-slate-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-[#5533ff]" />
                Link Settings
              </DialogTitle>
              <DialogDescription>
                Configure global link styles for this form. These colors will apply to all text links.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Link Text (Preview)</Label>
                <Input 
                  value={linkSettings.text}
                  onChange={(e) => setLinkSettings(prev => ({...prev, text: e.target.value}))}
                  placeholder="Enter preview text"
                  className="bg-white border-slate-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">URL</Label>
                <Input 
                  value={linkSettings.url}
                  onChange={(e) => setLinkSettings(prev => ({...prev, url: e.target.value}))}
                  placeholder="https://example.com"
                  className="bg-white border-slate-200"
                />
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <ColorPickerField 
                  label="Link Color" 
                  color={linkSettings.color} 
                  onChange={(c) => setLinkSettings(prev => ({...prev, color: c}))} 
                />
                
                <ColorPickerField 
                  label="Hover Color" 
                  color={linkSettings.hoverColor} 
                  onChange={(c) => setLinkSettings(prev => ({...prev, hoverColor: c}))} 
                />
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-xs text-slate-500 mb-2 block">Preview</Label>
                <p className="text-sm text-slate-600">
                  This is sample text with a{" "}
                  <a 
                    href="#" 
                    style={{ color: linkSettings.color, textDecoration: 'underline' }}
                    className="transition-colors"
                    onMouseEnter={(e) => e.currentTarget.style.color = linkSettings.hoverColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = linkSettings.color}
                  >
                    {linkSettings.text || "sample link"}
                  </a>
                  {" "}in it.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-[#5533ff] hover:bg-[#4422dd] text-white"
                onClick={() => {
                  updateFormStyle('linkColor', linkSettings.color);
                  updateFormStyle('linkHoverColor', linkSettings.hoverColor);
                  setShowLinkDialog(false);
                }}
              >
                Apply Styles
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Canvas Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-auto px-8 pb-8 pt-4 bg-neutral-100/50" 
          onClick={() => setSelectedField(null)}
        >
           <div className="min-w-fit w-full flex justify-center">
             <div 
               ref={containerRef}
               className={`
                 bg-white rounded-xl shadow-2xl border border-neutral-200/50 min-h-[800px] flex flex-col relative group/canvas transition-all duration-75 mb-20 shrink-0
               `}
               style={{ 
                  width: `${canvasWidth}px`,
                  maxWidth: 'none', // Override constraint to allow manual resizing
                  fontFamily: formStyles.fontFamilyBody || 'inherit'
             }}
             onClick={(e) => e.stopPropagation()} // Prevent deselection when clicking inside canvas
           >
              {/* Drag Handle */}
              <div
                className="absolute top-1/2 -right-4 -translate-y-1/2 w-6 h-16 bg-white border border-neutral-200 shadow-lg rounded-full flex items-center justify-center cursor-ew-resize hover:border-[#5533ff] hover:text-[#5533ff] transition-colors z-50 group-hover/canvas:opacity-100 opacity-0"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsResizing(true);
                }}
              >
                 <MoreVertical className="w-4 h-4 text-neutral-400" />
              </div>

              {formStyles.fontFamilyTitle && (
                <style>{`
                  #form-builder-canvas h1, 
                  #form-builder-canvas h2, 
                  #form-builder-canvas h3, 
                  #form-builder-canvas h4, 
                  #form-builder-canvas h5, 
                  #form-builder-canvas h6 { 
                    font-family: ${formStyles.fontFamilyTitle} !important; 
                  }
                `}</style>
              )}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5533ff] text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover/canvas:opacity-100 transition-opacity pointer-events-none shadow-sm font-medium z-20">
                 Editing: {formName}
              </div>

              {/* Form Container Layer */}
              <div 
                className="w-full flex-1 flex flex-col"
                style={{
                  height: formStyles.maxHeight ? `${formStyles.maxHeight}${formStyles.heightUnit}` : 'auto',
                  maxWidth: formStyles.maxWidth ? `${formStyles.maxWidth}${formStyles.widthUnit}` : '100%',
                  marginTop: `${formStyles.marginTop}px`,
                  marginRight: `${formStyles.marginRight}px`,
                  marginBottom: `${formStyles.marginBottom}px`,
                  marginLeft: `${formStyles.marginLeft}px`,
                  paddingTop: `${formStyles.paddingTop}px`,
                  paddingRight: `${formStyles.paddingRight}px`,
                  paddingBottom: `${formStyles.paddingBottom}px`,
                  paddingLeft: `${formStyles.paddingLeft}px`,
                  backgroundColor: formStyles.backgroundColor,
                  backgroundImage: formStyles.backgroundImage ? `url(${formStyles.backgroundImage})` : undefined,
                  backgroundRepeat: formStyles.backgroundRepeat,
                  backgroundSize: formStyles.backgroundSize === 'custom' 
                      ? `${formStyles.backgroundWidth}${formStyles.backgroundWidthUnit} ${formStyles.backgroundHeight}${formStyles.backgroundHeightUnit}` 
                      : formStyles.backgroundSize,
                  backgroundPosition: formStyles.backgroundPosition,
                  backgroundAttachment: formStyles.backgroundAttachment,
                  borderColor: formStyles.borderColor,
                  borderStyle: formStyles.borderStyle,
                  borderWidth: `${formStyles.borderWidth}px`,
                  borderTopLeftRadius: `${formStyles.borderTopLeftRadius || formStyles.borderRadius}px`,
                  borderTopRightRadius: `${formStyles.borderTopRightRadius || formStyles.borderRadius}px`,
                  borderBottomRightRadius: `${formStyles.borderBottomRightRadius || formStyles.borderRadius}px`,
                  borderBottomLeftRadius: `${formStyles.borderBottomLeftRadius || formStyles.borderRadius}px`,
                  alignSelf: 'center', // Center the form within the canvas
                }}
              >
                <div 
                  id="form-builder-canvas" 
                  className="flex-1 min-h-[100px] w-full content-start items-start"
                >
                  <Droppable droppableId="CANVAS">
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.droppableProps}
                        className={`form-canvas-droppable col-span-full w-full grid grid-cols-12 gap-2`}
                      >

                      {formFields.length === 0 ? (
                        <div className={`col-span-full flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center transition-colors ${snapshot.isDraggingOver ? 'border-[#5533ff] bg-indigo-50/20' : 'border-neutral-300 bg-slate-50/50'}`}>
                          <div className={`w-20 h-20 mb-6 rounded-full flex items-center justify-center ${snapshot.isDraggingOver ? 'bg-indigo-100 text-[#5533ff]' : 'bg-slate-100 text-slate-300'}`}>
                            <Layout className="w-10 h-10" />
                          </div>
                          <h3 className={`text-xl font-semibold mb-2 ${snapshot.isDraggingOver ? 'text-[#5533ff]' : 'text-slate-700'}`}>
                            {snapshot.isDraggingOver ? 'Drop Widget Here' : 'Drag Widget Here'}
                          </h3>
                          <p className="text-slate-500 max-w-sm">
                            Select an element from the sidebar and drag it here to start building your form.
                          </p>
                        </div>
                      ) : (
                        formFields.map((field, index) => (
                          <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided, snapshot) => (
                                <FormElementItem 
                                    field={field} 
                                    provided={provided} 
                                    snapshot={snapshot} 
                                    isSelected={selectedField === field.id}
                                    onSelect={handleFieldSelect}
                                    onDelete={handleDeleteField}
                                    activeBreakpoint={activeDevice}
                                    activeSubElement={activeSubElement}
                                />
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
              </div>
           </div>
          </div>
        </div>
      </main>

      {/* Logic Dialog */}
      <Dialog open={showLogicDialog} onOpenChange={(open) => { setShowLogicDialog(open); if (!open) resetLogicDialog(); }}>
        <DialogContent className="max-w-2xl text-slate-900 p-0 overflow-hidden gap-0 bg-white">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <DialogHeader>
              <DialogTitle className="text-xl text-slate-900">
                {logicStep === 'select' ? 'Add Logic Rule' : 
                 selectedRuleType === 'redirect' ? 'Configure Page Redirect' :
                 selectedRuleType === 'message' ? 'Configure Custom Message' :
                 selectedRuleType === 'disqualify' ? 'Configure Filter Rule' :
                 'Configure Conditional Visibility'}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                {logicStep === 'select' 
                  ? 'Select a rule type to automate your form\'s behavior based on visitor input.'
                  : 'Set the condition that will trigger this rule.'}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {logicStep === 'select' ? (
            <div className="p-4 grid grid-cols-2 gap-4 bg-white">
               {/* Redirect */}
               <Card 
                 className="cursor-pointer hover:border-[#5533ff] hover:bg-indigo-50/30 transition-all group border-slate-200 shadow-sm hover:shadow-md"
                 onClick={() => handleSelectRuleType('redirect')}
               >
                  <CardContent className="p-4 flex items-start gap-4 h-full">
                     <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-[#5533ff] group-hover:border-[#5533ff] transition-all">
                        <ArrowRightCircle className="h-5 w-5 text-[#5533ff] group-hover:text-white transition-colors" />
                     </div>
                     <div>
                        <h4 className="font-semibold text-slate-900 mb-1 text-sm group-hover:text-[#5533ff] transition-colors">Page Redirect</h4>
                        <p className="text-xs text-slate-500">Send visitors to a specific URL after they submit the form.</p>
                     </div>
                  </CardContent>
               </Card>

               {/* Custom Message */}
               <Card 
                 className="cursor-pointer hover:border-[#5533ff] hover:bg-indigo-50/30 transition-all group border-slate-200 shadow-sm hover:shadow-md"
                 onClick={() => handleSelectRuleType('message')}
               >
                  <CardContent className="p-4 flex items-start gap-4 h-full">
                     <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-[#5533ff] group-hover:border-[#5533ff] transition-all">
                        <MessageSquare className="h-5 w-5 text-[#5533ff] group-hover:text-white transition-colors" />
                     </div>
                     <div>
                        <h4 className="font-semibold text-slate-900 mb-1 text-sm group-hover:text-[#5533ff] transition-colors">Custom Message</h4>
                        <p className="text-xs text-slate-500">Display a personalized success message based on answers.</p>
                     </div>
                  </CardContent>
               </Card>

               {/* Disqualify */}
               <Card 
                 className="cursor-pointer hover:border-[#5533ff] hover:bg-indigo-50/30 transition-all group border-slate-200 shadow-sm hover:shadow-md"
                 onClick={() => handleSelectRuleType('disqualify')}
               >
                  <CardContent className="p-4 flex items-start gap-4 h-full">
                     <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-[#5533ff] group-hover:border-[#5533ff] transition-all">
                        <Ban className="h-5 w-5 text-[#5533ff] group-hover:text-white transition-colors" />
                     </div>
                     <div>
                        <h4 className="font-semibold text-slate-900 mb-1 text-sm group-hover:text-[#5533ff] transition-colors">Filter Submission</h4>
                        <p className="text-xs text-slate-500">Automatically reject or flag leads that don't meet your criteria.</p>
                     </div>
                  </CardContent>
               </Card>

               {/* Show/Hide */}
               <Card 
                 className="cursor-pointer hover:border-[#5533ff] hover:bg-indigo-50/30 transition-all group border-slate-200 shadow-sm hover:shadow-md"
                 onClick={() => handleSelectRuleType('visibility')}
               >
                  <CardContent className="p-4 flex items-start gap-4 h-full">
                     <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-[#5533ff] group-hover:border-[#5533ff] transition-all">
                        <ToggleLeft className="h-5 w-5 text-[#5533ff] group-hover:text-white transition-colors" />
                     </div>
                     <div>
                        <h4 className="font-semibold text-slate-900 mb-1 text-sm group-hover:text-[#5533ff] transition-colors">Conditional Visibility</h4>
                        <p className="text-xs text-slate-500">Dynamically show or hide fields based on previous inputs.</p>
                     </div>
                  </CardContent>
               </Card>
            </div>
          ) : (
            <div className="p-6 space-y-5 bg-white">
              {/* Condition Builder */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs">IF</span>
                  <span>the following condition is met:</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* Field Select */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Field</Label>
                    <Select value={newRule.field} onValueChange={(v) => {
                      const selectedFieldType = formFields.find(f => f.label === v)?.type;
                      const isButton = selectedFieldType === 'button' || v === 'Submit Button';
                      setNewRule(prev => ({ 
                        ...prev, 
                        field: v,
                        // Reset condition if switching away from button and had on_submit selected
                        condition: (!isButton && prev.condition === 'on_submit') ? 'equals' : prev.condition
                      }));
                    }}>
                      <SelectTrigger className="bg-white border-slate-200 text-sm h-9">
                        <SelectValue placeholder="Select field..." />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        {formFields.length > 0 ? formFields.map(f => (
                          <SelectItem key={f.id} value={f.label || f.id}>{f.label || f.type}</SelectItem>
                        )) : (
                          <>
                            <SelectItem value="Email">Email</SelectItem>
                            <SelectItem value="Budget">Budget</SelectItem>
                            <SelectItem value="Company Size">Company Size</SelectItem>
                            <SelectItem value="Industry">Industry</SelectItem>
                            <SelectItem value="Submit Button">Submit Button</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Condition Select */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Condition</Label>
                    <Select value={newRule.condition} onValueChange={(v) => setNewRule(prev => ({ ...prev, condition: v, value: ['is_empty', 'is_not_empty', 'on_submit'].includes(v) ? '_no_value_' : prev.value }))}>
                      <SelectTrigger className="bg-white border-slate-200 text-sm h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200">
                        <SelectItem value="equals">Equals</SelectItem>
                        <SelectItem value="not_equals">Does not equal</SelectItem>
                        <SelectItem value="contains">Contains</SelectItem>
                        <SelectItem value="greater_than">Greater than</SelectItem>
                        <SelectItem value="less_than">Less than</SelectItem>
                        <SelectItem value="is_empty">Is Empty</SelectItem>
                        <SelectItem value="is_not_empty">Is Not Empty</SelectItem>
                        {(formFields.find(f => f.label === newRule.field)?.type === 'button' || newRule.field === 'Submit Button') && (
                          <SelectItem value="on_submit">On Submit</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Value Input - Hidden for is_empty, is_not_empty, on_submit */}
                  {!['is_empty', 'is_not_empty', 'on_submit'].includes(newRule.condition) && (
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Value</Label>
                      <Input 
                        value={newRule.value}
                        onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="Enter value..."
                        className="bg-white border-slate-200 text-sm h-9"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Action Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <span className="bg-[#5533ff]/10 text-[#5533ff] px-2 py-0.5 rounded text-xs">THEN</span>
                  <span>perform this action:</span>
                </div>
                
                {selectedRuleType === 'visibility' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Action</Label>
                      <Select value={newRule.action} onValueChange={(v) => setNewRule(prev => ({ ...prev, action: v }))}>
                        <SelectTrigger className="bg-white border-slate-200 text-sm h-9">
                          <SelectValue placeholder="Select action..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200">
                          <SelectItem value="show">Show field</SelectItem>
                          <SelectItem value="hide">Hide field</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-500">Target Field</Label>
                      <Select value={newRule.targetField} onValueChange={(v) => setNewRule(prev => ({ ...prev, targetField: v }))}>
                        <SelectTrigger className="bg-white border-slate-200 text-sm h-9">
                          <SelectValue placeholder="Select field..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200">
                          {formFields.length > 0 ? formFields.map(f => (
                            <SelectItem key={f.id} value={f.label || f.id}>{f.label || f.type}</SelectItem>
                          )) : (
                            <>
                              <SelectItem value="Phone">Phone</SelectItem>
                              <SelectItem value="Address">Address</SelectItem>
                              <SelectItem value="Comments">Comments</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {selectedRuleType === 'redirect' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Redirect URL</Label>
                    <Input 
                      value={newRule.action}
                      onChange={(e) => setNewRule(prev => ({ ...prev, action: e.target.value }))}
                      placeholder="https://example.com/thank-you"
                      className="bg-white border-slate-200 text-sm h-9"
                    />
                  </div>
                )}

                {selectedRuleType === 'message' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-500">Custom Message</Label>
                    <textarea 
                      value={newRule.action}
                      onChange={(e) => setNewRule(prev => ({ ...prev, action: e.target.value }))}
                      placeholder="Thank you for your submission! We'll be in touch soon."
                      className="w-full bg-white border border-slate-200 text-sm rounded-md p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#5533ff] focus:border-transparent"
                    />
                  </div>
                )}

                {selectedRuleType === 'disqualify' && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Ban className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">Submission will be filtered</h4>
                        <p className="text-xs text-red-600 mt-1">
                          When the condition is met, the submission will be marked as disqualified and won't appear in your main lead list.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between">
             {logicStep === 'configure' && (
               <Button variant="ghost" onClick={() => setLogicStep('select')} className="text-slate-600">
                 <ChevronLeft className="h-4 w-4 mr-1" /> Back
               </Button>
             )}
             <div className="flex gap-2 ml-auto">
               <Button variant="ghost" onClick={() => { setShowLogicDialog(false); resetLogicDialog(); setEditingRuleId(null); }}>Cancel</Button>
               {logicStep === 'configure' && (
                 <Button 
                   className="bg-[#5533ff] hover:bg-[#4422dd] text-white"
                   onClick={editingRuleId ? handleUpdateRule : handleAddRule}
                   disabled={!newRule.field || (!['is_empty', 'is_not_empty', 'on_submit'].includes(newRule.condition) && !newRule.value)}
                 >
                   {editingRuleId ? 'Update Rule' : 'Add Rule'}
                 </Button>
               )}
             </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-md text-slate-900 flex flex-col max-h-[85vh] p-0 gap-0 overflow-hidden bg-white">
          <DialogHeader className="p-6 pb-2 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle>Form Settings</DialogTitle>
            <DialogDescription>Configure general settings for your form.</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 pb-6">
             <div className="flex items-center justify-between space-x-2">
               <div className="flex flex-col gap-1">
                 <Label htmlFor="survey-mode" className="font-medium text-slate-900">Survey Mode</Label>
                 <span className="text-xs text-slate-500 max-w-[280px]">Enable this to treat submissions as survey responses for reporting and analytics.</span>
               </div>
               <Switch 
                 id="survey-mode" 
                 checked={isSurveyMode}
                 onCheckedChange={setIsSurveyMode}
                 className="data-[state=checked]:bg-[#5533ff]"
               />
             </div>
             
             <Separator />
             
             <div className="space-y-4">
                <h4 className="text-sm font-medium text-slate-900 border-b pb-2 mb-2">Form Styling</h4>
                
                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label className="text-xs text-neutral-400">Max Width</Label>
                     <div className="flex">
                       <Input 
                         type="number" 
                         className="bg-white border-slate-200 text-xs text-slate-900 h-8 rounded-r-none border-r-0" 
                         value={formStyles.maxWidth}
                         onChange={(e) => updateFormStyle("maxWidth", e.target.value)}
                         placeholder="100" 
                       />
                       <Select value={formStyles.widthUnit} onValueChange={(v) => updateFormStyle("widthUnit", v)}>
                         <SelectTrigger className="w-[60px] bg-slate-50 border-slate-200 text-xs text-slate-900 h-8 rounded-l-none">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                           <SelectItem value="%">%</SelectItem>
                           <SelectItem value="px">px</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <Label className="text-xs text-neutral-400">Max Height</Label>
                     <div className="flex">
                       <Input 
                         type="number" 
                         className="bg-white border-slate-200 text-xs text-slate-900 h-8 rounded-r-none border-r-0" 
                         value={formStyles.maxHeight}
                         onChange={(e) => updateFormStyle("maxHeight", e.target.value)}
                         placeholder="Auto" 
                       />
                       <Select value={formStyles.heightUnit} onValueChange={(v) => updateFormStyle("heightUnit", v)}>
                         <SelectTrigger className="w-[60px] bg-slate-50 border-slate-200 text-xs text-slate-900 h-8 rounded-l-none">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                           <SelectItem value="%">%</SelectItem>
                           <SelectItem value="px">px</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                  </div>
                </div>

                {/* Typography Override */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Body Font</Label>
                      <Select value={formStyles.fontFamilyBody || "default"} onValueChange={(v) => updateFormStyle("fontFamilyBody", v === "default" ? "" : v)}>
                         <SelectTrigger className="bg-white border-slate-200 text-xs text-slate-900 h-8">
                            <SelectValue placeholder="Default" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                            <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                            <SelectItem value="Open Sans, sans-serif">Open Sans</SelectItem>
                            <SelectItem value="Lora, serif">Lora</SelectItem>
                            <SelectItem value="Playfair Display, serif">Playfair</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Title Font</Label>
                      <Select value={formStyles.fontFamilyTitle || "default"} onValueChange={(v) => updateFormStyle("fontFamilyTitle", v === "default" ? "" : v)}>
                         <SelectTrigger className="bg-white border-slate-200 text-xs text-slate-900 h-8">
                            <SelectValue placeholder="Default" />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                            <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
                            <SelectItem value="Oswald, sans-serif">Oswald</SelectItem>
                            <SelectItem value="Lora, serif">Lora</SelectItem>
                            <SelectItem value="Playfair Display, serif">Playfair</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>

                {/* Margin */}
                <div className="space-y-2">
                  <SpacingControl 
                    label="Form Margin"
                    theme="light"
                    values={{
                        top: formStyles.marginTop,
                        right: formStyles.marginRight,
                        bottom: formStyles.marginBottom,
                        left: formStyles.marginLeft
                    }}
                    onChange={(key, value) => updateFormStyle(key, value)}
                    onBatchChange={(updates) => updateFormStyleBatch(updates)}
                    prefix="margin"
                  />
                </div>
                
                {/* Padding */}
                <div className="space-y-2">
                  <SpacingControl 
                    label="Form Padding"
                    theme="light"
                    values={{
                        top: formStyles.paddingTop,
                        right: formStyles.paddingRight,
                        bottom: formStyles.paddingBottom,
                        left: formStyles.paddingLeft
                    }}
                    onChange={(key, value) => updateFormStyle(key, value)}
                    onBatchChange={(updates) => updateFormStyleBatch(updates)}
                    prefix="padding"
                  />
                </div>
                
                {/* Appearance */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="col-span-2">
                      <ColorPickerField 
                         label="Background Color" 
                         color={formStyles.backgroundColor} 
                         onChange={(c) => updateFormStyle("backgroundColor", c)} 
                      />
                   </div>
                   
                   <div className="col-span-2 space-y-2">
                      <Label className="text-xs text-neutral-400">Background Image URL</Label>
                      <Input 
                        value={formStyles.backgroundImage || ""} 
                        onChange={(e) => updateFormStyle("backgroundImage", e.target.value)}
                        className="bg-white border-slate-200 text-xs text-slate-900 h-8" 
                        placeholder="https://example.com/image.jpg" 
                      />
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Repeat</Label>
                      <Select value={formStyles.backgroundRepeat} onValueChange={(v) => updateFormStyle("backgroundRepeat", v)}>
                         <SelectTrigger className="bg-white border-slate-200 text-xs text-slate-900 h-8">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="no-repeat">No Repeat</SelectItem>
                            <SelectItem value="repeat">Repeat</SelectItem>
                            <SelectItem value="repeat-x">Repeat X</SelectItem>
                            <SelectItem value="repeat-y">Repeat Y</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Attachment</Label>
                      <Select value={formStyles.backgroundAttachment} onValueChange={(v) => updateFormStyle("backgroundAttachment", v)}>
                         <SelectTrigger className="bg-white border-slate-200 text-xs text-slate-900 h-8">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="scroll">Scroll</SelectItem>
                            <SelectItem value="fixed">Fixed (Parallax)</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Position</Label>
                      <Select value={formStyles.backgroundPosition} onValueChange={(v) => updateFormStyle("backgroundPosition", v)}>
                         <SelectTrigger className="bg-white border-slate-200 text-xs text-slate-900 h-8">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="top">Top</SelectItem>
                            <SelectItem value="bottom">Bottom</SelectItem>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="top left">Top Left</SelectItem>
                            <SelectItem value="top right">Top Right</SelectItem>
                            <SelectItem value="bottom left">Bottom Left</SelectItem>
                            <SelectItem value="bottom right">Bottom Right</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Size</Label>
                      <Select value={formStyles.backgroundSize} onValueChange={(v) => updateFormStyle("backgroundSize", v)}>
                         <SelectTrigger className="bg-white border-slate-200 text-xs text-slate-900 h-8">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="100% 100%">Auto</SelectItem>
                            <SelectItem value="100% auto">Fill X</SelectItem>
                            <SelectItem value="auto 100%">Fill Y</SelectItem>
                            <SelectItem value="auto">Original</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   {formStyles.backgroundSize === 'custom' && (
                     <div className="col-span-2 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="text-xs text-neutral-400">Width</Label>
                           <div className="flex">
                             <Input 
                               type="number" 
                               value={formStyles.backgroundWidth}
                               onChange={(e) => updateFormStyle("backgroundWidth", e.target.value)}
                               className="bg-white border-slate-200 text-xs text-slate-900 h-8 rounded-r-none border-r-0" 
                             />
                             <Select value={formStyles.backgroundWidthUnit} onValueChange={(v) => updateFormStyle("backgroundWidthUnit", v)}>
                               <SelectTrigger className="w-[60px] bg-slate-50 border-slate-200 text-xs text-slate-900 h-8 rounded-l-none">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-white border-slate-200 text-slate-900">
                                 <SelectItem value="%">%</SelectItem>
                                 <SelectItem value="px">px</SelectItem>
                                 <SelectItem value="auto">Auto</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <Label className="text-xs text-neutral-400">Height</Label>
                           <div className="flex">
                             <Input 
                               type="number" 
                               value={formStyles.backgroundHeight}
                               onChange={(e) => updateFormStyle("backgroundHeight", e.target.value)}
                               className="bg-white border-slate-200 text-xs text-slate-900 h-8 rounded-r-none border-r-0" 
                             />
                             <Select value={formStyles.backgroundHeightUnit} onValueChange={(v) => updateFormStyle("backgroundHeightUnit", v)}>
                               <SelectTrigger className="w-[60px] bg-slate-50 border-slate-200 text-xs text-slate-900 h-8 rounded-l-none">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="bg-white border-slate-200 text-slate-900">
                                 <SelectItem value="%">%</SelectItem>
                                 <SelectItem value="px">px</SelectItem>
                                 <SelectItem value="auto">Auto</SelectItem>
                               </SelectContent>
                             </Select>
                           </div>
                        </div>
                     </div>
                   )}
                   
                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Border Style</Label>
                      <Select value={formStyles.borderStyle} onValueChange={(v) => updateFormStyle("borderStyle", v)}>
                         <SelectTrigger className="bg-white border-slate-200 text-xs text-slate-900 h-8">
                            <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white border-slate-200 text-slate-900">
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="dashed">Dashed</SelectItem>
                            <SelectItem value="dotted">Dotted</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-xs text-neutral-400">Border Size (px)</Label>
                      <Input 
                        type="number" 
                        min={0}
                        value={formStyles.borderWidth} 
                        onChange={(e) => updateFormStyle("borderWidth", e.target.value)}
                        className="bg-white border-slate-200 text-xs text-slate-900 h-8" 
                        placeholder="1" 
                      />
                   </div>
                   
                   <div className="col-span-2">
                      <ColorPickerField 
                         label="Border Color" 
                         color={formStyles.borderColor} 
                         onChange={(c) => updateFormStyle("borderColor", c)} 
                      />
                   </div>
                   
                   <div className="col-span-2 space-y-2">
                      <SpacingControl 
                          label="Border Radius"
                          theme="light"
                          values={{
                              top: formStyles.borderTopLeftRadius,
                              right: formStyles.borderTopRightRadius,
                              bottom: formStyles.borderBottomRightRadius,
                              left: formStyles.borderBottomLeftRadius
                          }}
                          onChange={(key, value) => updateFormStyle(key, value)}
                          onBatchChange={(updates) => updateFormStyleBatch(updates)}
                          keyMapping={{
                              top: "borderTopLeftRadius",
                              right: "borderTopRightRadius",
                              bottom: "borderBottomRightRadius",
                              left: "borderBottomLeftRadius"
                          }}
                      />
                   </div>
                </div>

             </div>
          </div>
          </div>
          
          <div className="flex justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50">
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>Cancel</Button>
            <Button className="bg-[#5533ff] text-white hover:bg-[#4422dd]" onClick={() => setShowSettingsDialog(false)}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </DragDropContext>
    </TooltipProvider>
  );
}

// Icon component needed for import reference
function FormInput(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <path d="M12 12h.01" />
      <path d="M17 12h.01" />
      <path d="M7 12h.01" />
    </svg>
  );
}