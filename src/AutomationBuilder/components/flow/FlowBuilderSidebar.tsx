import { useState } from "react"
import { BoltIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, EnvelopeIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Input } from "@/components/input"
import { Button } from "@/components/Button"
import { ScrollArea } from "@/components/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip"
import { TOOLBOX_ITEMS } from "../../constants/toolbox"

export function FlowBuilderSidebar({ isCollapsed, onCollapse, onExpand }: { isCollapsed: boolean; onCollapse: () => void; onExpand: () => void }) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className={`bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 h-full flex flex-col shadow-xl z-20 transition-all duration-300 ${isCollapsed ? "w-14" : "w-72"}`}>
      <Tabs defaultValue="triggers" className="flex flex-col h-full">
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600 shrink-0" onClick={onCollapse}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search..." className="pl-9 bg-slate-50 text-slate-900 placeholder:text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="triggers" className="text-slate-600 dark:text-slate-300 data-[state=active]:bg-slate-50 data-[state=active]:text-slate-900 data-[state=active]:border-slate-200 dark:data-[state=active]:bg-slate-700">
                Triggers
              </TabsTrigger>
              <TabsTrigger value="actions" className="text-slate-600 dark:text-slate-300 data-[state=active]:bg-slate-50 data-[state=active]:text-slate-900 data-[state=active]:border-slate-200 dark:data-[state=active]:bg-slate-700">
                Actions
              </TabsTrigger>
              <TabsTrigger value="logic" className="text-slate-600 dark:text-slate-300 data-[state=active]:bg-slate-50 data-[state=active]:text-slate-900 data-[state=active]:border-slate-200 dark:data-[state=active]:bg-slate-700">
                Logic
              </TabsTrigger>
            </TabsList>
          </div>
        )}

        {isCollapsed && (
          <div className="flex flex-col items-center py-2 space-y-2 border-b border-slate-200 dark:border-slate-700 overflow-visible">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600" onClick={onExpand}>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <TooltipProvider>
              <div className="flex flex-col items-center justify-center gap-2 w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="triggers" className="w-10 h-10 p-0 !inline-flex !items-center !justify-center mx-auto text-slate-500 dark:text-slate-300 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-500/30 dark:data-[state=active]:text-blue-200 dark:data-[state=active]:ring-1 dark:data-[state=active]:ring-blue-300/40">
                      <BoltIcon className="h-5 w-5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="left">Triggers</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="actions" className="w-10 h-10 p-0 !inline-flex !items-center !justify-center mx-auto text-slate-500 dark:text-slate-300 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-500/30 dark:data-[state=active]:text-emerald-200 dark:data-[state=active]:ring-1 dark:data-[state=active]:ring-emerald-300/40">
                      <EnvelopeIcon className="h-5 w-5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="left">Actions</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger value="logic" className="w-10 h-10 p-0 !inline-flex !items-center !justify-center mx-auto text-slate-500 dark:text-slate-300 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-500/30 dark:data-[state=active]:text-amber-200 dark:data-[state=active]:ring-1 dark:data-[state=active]:ring-amber-300/40">
                      <FunnelIcon className="h-5 w-5" />
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="left">Logic</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        )}

        <div className="flex-1 overflow-hidden bg-slate-50/50 dark:bg-slate-950/60">
          <ScrollArea className="h-full">
            {TOOLBOX_ITEMS.map((section) => {
              const filtered = section.items.filter((item) => (isCollapsed ? true : item.label.toLowerCase().includes(searchQuery.toLowerCase())))
              const available = filtered.filter((i) => !i.comingSoon)
              const comingSoon = filtered.filter((i) => i.comingSoon)
              return (
                <TabsContent key={section.value} value={section.value} className="m-0 h-full p-2 space-y-2 mt-0">
                  {available.map((item, idx) => (
                    <div
                      key={`avail-${idx}`}
                      draggable
                      className={`flex items-center gap-2 p-1.5 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-grab active:cursor-grabbing transition-all group ${isCollapsed ? "justify-center" : ""}`}
                      onDragStart={(event) => {
                        event.dataTransfer.setData("application/reactflow/type", item.type)
                        event.dataTransfer.setData("application/reactflow/label", item.label)
                        event.dataTransfer.setData("text/plain", JSON.stringify({ type: item.type, label: item.label }))
                        event.dataTransfer.effectAllowed = "move"
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={`p-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md transition-shadow ${item.color}`} title={isCollapsed ? item.label : undefined}>
                              <item.icon className="w-4 h-4" />
                            </div>
                          </TooltipTrigger>
                          {isCollapsed && <TooltipContent side="left">{item.label}</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                      {!isCollapsed && (
                        <>
                          <div className="flex-1">
                            <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
                          </div>
                          <EllipsisVerticalIcon className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </>
                      )}
                    </div>
                  ))}

                  {comingSoon.length > 0 && (
                    <>
                      {!isCollapsed && (
                        <div className="flex items-center gap-2 mt-6 mb-2 px-1">
                          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Coming Soon</span>
                          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
                        </div>
                      )}
                      {isCollapsed && <div className="h-px w-8 mx-auto bg-slate-200 dark:bg-slate-700 my-2" />}
                      {comingSoon.map((item, idx) => (
                        <div key={`soon-${idx}`} draggable={false} className={`flex items-center gap-2 p-1.5 rounded-md border border-transparent opacity-75 cursor-not-allowed group select-none ${isCollapsed ? "justify-center" : ""}`}>
                          <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-none grayscale">
                            <item.icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          </div>
                          {!isCollapsed && (
                            <div className="flex-1">
                              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{item.label}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </TabsContent>
              )
            })}
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}
