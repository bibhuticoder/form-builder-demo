import BuilderPanel from './BuilderPanel'
import { ThemeToggle } from './components'

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden h-screen">
      <div className="w-64 bg-primary dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 shrink-0 h-full">
        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="shrink-0 flex items-start justify-between px-4 py-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Cleave Form Builder
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-hidden px-4 pb-4">
          <BuilderPanel />
        </main>
      </div>
    </div>
  )
}

export default App
