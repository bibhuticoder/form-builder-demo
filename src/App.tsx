import BuilderPanel from './BuilderPanel'
import { ThemeToggle } from './components'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Cleave Form Builder
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Build forms and websites with ease
            </p>
          </div>
          <ThemeToggle />
        </header>
        
        <main>
          <BuilderPanel />
        </main>
      </div>
    </div>
  )
}

export default App
