import { useState } from "react"
import { Outlet, NavLink } from "react-router-dom"
import { HomeIcon, DocumentTextIcon, EnvelopeIcon, ChevronLeftIcon, ChevronRightIcon, BoltIcon } from "@heroicons/react/24/outline"
import { ThemeToggle } from "./components"

const navItems = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Forms", href: "/forms", icon: DocumentTextIcon },
  { name: "Emails", href: "/emails", icon: EnvelopeIcon },
  { name: "Automations", href: "/automations", icon: BoltIcon },
]

export default function SidebarLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden h-screen">
      <div className={`${isCollapsed ? "w-16" : "w-64"} z-10 transition-all duration-300 bg-primary dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 shrink-0 h-full relative`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full p-1 text-gray-500 hover:text-gray-900 dark:hover:text-white">
          {isCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeftIcon className="w-4 h-4" />}
        </button>

        <div className="w-full mt-10 px-2 space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white hover:bg-primary ${isActive ? "bg-blue-50 hover:bg-white !text-blue-700 dark:bg-blue-900/50 dark:text-blue-200" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="shrink-0 flex items-center justify-between px-4 h-16">
          <div>
            <h1 className="font-bold text-gray-900 dark:text-white">Cleave Form Builder</h1>
          </div>
        </header>

<<<<<<< HEAD
        <main className="flex-1 overflow-hidden px-4 pb-4 h-full relative">
=======
        <main className="flex-1 overflow-hidden px-4 h-full relative">
>>>>>>> b6edd87a625d77b0bc80bf3a63178f95692eff5b
          <Outlet />
        </main>
      </div>
    </div>
  )
}
