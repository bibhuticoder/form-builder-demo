import AutomationBuilder from "@/components/automation-builder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, HelpCircle, Settings, Clock, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimezoneCombobox } from "@/components/timezone-combobox";

export default function AutomationsPage() {
  const [automationName, setAutomationName] = useState("New Lead Nurture Sequence");
  const [allowReEntry, setAllowReEntry] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [stopOnResponse, setStopOnResponse] = useState(false);
  const [timezone, setTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [sendWindowStart, setSendWindowStart] = useState("09:00");
  const [sendWindowEnd, setSendWindowEnd] = useState("17:00");
  const [activeDays, setActiveDays] = useState([true, true, true, true, true, false, false]); // M-F default
  const [executionTimezoneEnabled, setExecutionTimezoneEnabled] = useState(true);
  const [sendWindowEnabled, setSendWindowEnabled] = useState(true);

  const toggleDay = (index: number) => {
    const newDays = [...activeDays];
    newDays[index] = !newDays[index];
    setActiveDays(newDays);
  };

  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const timeOptions = Array.from({ length: 24 * 2 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mock Header */}
        <header className="h-16 border-b bg-white flex items-center px-6 justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Input 
              value={automationName}
              onChange={(e) => setAutomationName(e.target.value)}
              className="text-xl font-semibold text-gray-800 border-transparent hover:border-slate-200 focus:border-primary px-2 h-9 w-[300px] bg-transparent shadow-none"
            />
            <div className="h-6 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-3">
                <span className={`text-sm font-medium px-2 py-1 rounded-full border flex items-center justify-center gap-1.5 transition-colors w-24
                    ${isActive 
                        ? 'text-primary bg-primary/10 border-primary/20' 
                        : 'text-slate-500 bg-slate-100 border-slate-200'
                    }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-slate-400'}`}></span>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
            </div>

            <div className="ml-4 border-l pl-4 border-slate-200">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 h-9 text-slate-600">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[340px] p-4" align="start">
                    <DropdownMenuLabel className="px-0 pb-2 text-base font-semibold">Automation Settings</DropdownMenuLabel>
                    
                    {/* Active Status */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="automation-active" className="text-sm font-medium">Enable Automation</Label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[300px]">
                                            <p className="text-xs">When <strong>Inactive</strong>, this automation is paused. No contacts will enter or be processed by this automation, even if triggers occur.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <Switch 
                            id="automation-active" 
                            checked={isActive}
                            onCheckedChange={setIsActive}
                        />
                    </div>

                    {/* Allow Re-entry */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="re-entry" className="text-sm font-medium">Allow Re-entry</Label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[300px]">
                                            <p className="text-xs">If enabled, contacts can enter this automation multiple times. If disabled, contacts can only enter this automation once.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <Switch 
                            id="re-entry" 
                            checked={allowReEntry}
                            onCheckedChange={setAllowReEntry}
                        />
                    </div>

                    {/* Stop on Response */}
                    <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="stop-response" className="text-sm font-medium">Stop on Response</Label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[300px]">
                                            <p className="text-xs">If enabled, the automation will stop for a contact if they reply to a message.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                        <Switch 
                            id="stop-response" 
                            checked={stopOnResponse}
                            onCheckedChange={setStopOnResponse}
                        />
                    </div>

                    <DropdownMenuSeparator className="my-2" />

                    {/* Execution Timezone */}
                    <div className="space-y-2 py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                                    Execution Timezone
                                </Label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[300px]">
                                            <p className="text-xs">If enabled, this automation will only trigger during the set times relative to this timezone. If disabled, it will default to your account timezone set in your settings.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Switch 
                                id="execution-timezone-toggle" 
                                checked={executionTimezoneEnabled}
                                onCheckedChange={setExecutionTimezoneEnabled}
                            />
                        </div>
                        <div className={executionTimezoneEnabled ? "" : "opacity-50 pointer-events-none"}>
                             <TimezoneCombobox value={timezone} onValueChange={setTimezone} />
                        </div>
                    </div>

                    {/* Send Window */}
                    <div className="space-y-3 py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                                    Send Window
                                </Label>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-[300px]">
                                            <p className="text-xs">Automations will only trigger during the set days and hours. Actions will wait until the next available day before triggering.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <Switch 
                                id="send-window-toggle" 
                                checked={sendWindowEnabled}
                                onCheckedChange={setSendWindowEnabled}
                            />
                        </div>
                        
                        <div className={sendWindowEnabled ? "space-y-3" : "space-y-3 opacity-50 pointer-events-none"}>
                            <div className="flex gap-1 justify-between">
                                {days.map((day, i) => (
                                    <button
                                        key={i}
                                        onClick={() => toggleDay(i)}
                                        className={`w-8 h-8 rounded-md text-xs font-medium transition-colors border
                                            ${activeDays[i] 
                                                ? 'bg-primary text-white border-primary' 
                                                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-[10px] font-medium text-slate-500 uppercase">Start</span>
                                    <Select value={sendWindowStart} onValueChange={setSendWindowStart}>
                                        <SelectTrigger className="h-8 text-xs w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map(t => (
                                                <SelectItem key={`start-${t}`} value={t} className="text-xs">{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <span className="text-slate-400 text-xs pt-4">to</span>
                                <div className="flex flex-col gap-1 flex-1">
                                    <span className="text-[10px] font-medium text-slate-500 uppercase">Stop</span>
                                    <Select value={sendWindowEnd} onValueChange={setSendWindowEnd}>
                                        <SelectTrigger className="h-8 text-xs w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timeOptions.map(t => (
                                                <SelectItem key={`end-${t}`} value={t} className="text-xs">{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-sm text-muted-foreground">Last saved 2m ago</div>
             <Button size="sm" className="bg-primary text-white hover:bg-primary/90">Save Automation</Button>
          </div>
        </header>

        {/* The "Main Window" - Where the Automation Builder lives */}
        <div className="flex-1 overflow-hidden relative">
            <AutomationBuilder />
        </div>
      </main>
    </div>
  );
}
