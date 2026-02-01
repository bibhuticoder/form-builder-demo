'use client'

import {
  Breadcrumb,
  Button,
  Card,
  DefaultDisclosureTransition,
  ErrorBanner,
  IconInput,
  IconSelect,
  Loading,
  PageNav,
  ProfilePicture,
  SaveButton,
  SimplePagination,
  SlidingPanel,
  SmoothProgressBar,
  StyledSelect,
  SubNav,
  Toast,
  TvModal,
  type BreadcrumbItem
} from './components'
import { Disclosure } from '@headlessui/react'
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  CogIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  SparklesIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function ComponentShowcase() {
  // State for various components
  const [showToast, setShowToast] = useState(false)
  const [showError, setShowError] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const [currentView, setCurrentView] = useState('Components')
  const [searchValue, setSearchValue] = useState('')
  const [selectValue, setSelectValue] = useState('')
  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Builder', href: '/builder' },
    { label: 'Component Showcase', isActive: true }
  ]

  // SubNav items
  const subNavItems = [
    { label: 'Overview', value: 'overview', icon: <SparklesIcon className="w-5 h-5" /> },
    { label: 'Analytics', value: 'analytics', icon: <ChartBarIcon className="w-5 h-5" /> },
    { label: 'Settings', value: 'settings', icon: <CogIcon className="w-5 h-5" /> }
  ]

  // PageNav items
  const pageNavItems = [
    { name: 'Components', href: '#components' },
    { name: 'Inputs', href: '#inputs' },
    { name: 'Tables', href: '#tables' }
  ]

  // Select options
  const selectOptions = [
    { value: '', label: 'Select an option' },
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]



  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' }
  ]

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowToast(true)
    }, 2000)
  }

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-8 p-6">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} showHomeIcon={true} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Component Showcase
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          A comprehensive demo of all shared components available in the Cleave UI library.
        </p>
      </div>

      {/* SubNav */}
      <Card>
        <SubNav items={subNavItems} activeTab={activeTab} onTabClick={setActiveTab} />
      </Card>

      {/* Conditional Loading */}
      {!!showLoading ? (
        <Card className="h-64">
          <Loading />
        </Card>
      ) : (
        <>
          {/* Error Banner */}
          {showError && (
            <ErrorBanner
              error="This is a sample error message"
              onRetry={() => setShowError(false)}
              showReferenceDataErrors={false}
            />
          )}

          {/* Progress Bar */}
          {progress > 0 && progress < 100 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Progress Bar
              </h3>
              <SmoothProgressBar progress={progress} />
            </Card>
          )}

          {/* Buttons Section */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Buttons
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="save">Save Button</Button>
              <Button variant="transparent">Transparent Button</Button>
              <Button variant="slim">
                <SparklesIcon className="w-4 h-4" />
                Slim Button
              </Button>
              <Button variant="primary" disabled>
                Disabled Button
              </Button>
              <SaveButton isSaving={isSaving} onClick={handleSave}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </div>
          </Card>

          {/* Inputs Section */}
          <Card id="inputs">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Input Components
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Input
                </label>
                <IconInput
                  icon={<MagnifyingGlassIcon className="w-5 h-5" />}
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Input
                </label>
                <IconInput
                  icon={<EnvelopeIcon className="w-5 h-5" />}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Styled Select
                </label>
                <StyledSelect
                  value={selectValue}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectValue(e.target.value)}
                  options={selectOptions}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Icon Select
                </label>
                <IconSelect
                  icon={<BuildingOfficeIcon className="w-5 h-5" />}
                  value={selectValue}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectValue(e.target.value)}
                  options={selectOptions}
                />
              </div>
            </div>
          </Card>

          {/* Profile & Navigation */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Profile & Navigation
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Profile Pictures
                </h4>
                <div className="flex items-center gap-4">
                  <ProfilePicture name="John Doe" size="sm" />
                  <ProfilePicture name="Jane Smith" size="md" />
                  <ProfilePicture name="Bob Johnson" size="lg" />
                  <ProfilePicture
                    name="Alice Williams"
                    imageUrl="/profile_pic.png"
                    size="lg"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Page Navigation
                </h4>
                <PageNav
                  navigation={pageNavItems}
                  currentView={currentView}
                  onNavChange={setCurrentView}
                />
              </div>
            </div>
          </Card>

          {/* Table Section */}
          <Card id="tables">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Slick Table
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tableData.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => console.log('Row clicked:', row)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {row.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {row.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {row.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <SimplePagination
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
              />
            </div>
          </Card>

          {/* Disclosure/Accordion */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Disclosure (Accordion)
            </h3>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 dark:bg-purple-900 px-4 py-2 text-left text-sm font-medium text-purple-900 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-800 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>What is this component?</span>
                    <span>{open ? '−' : '+'}</span>
                  </Disclosure.Button>
                  <DefaultDisclosureTransition show={open}>
                    <Disclosure.Panel static className="px-4 pt-4 pb-2 text-sm text-gray-600 dark:text-gray-400">
                      This is a disclosure component that can expand and collapse content. It's
                      perfect for FAQs, collapsible sections, and more!
                    </Disclosure.Panel>
                  </DefaultDisclosureTransition>
                </>
              )}
            </Disclosure>
          </Card>

          {/* Interactive Demos */}
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Interactive Demos
            </h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => setShowToast(true)}>
                Show Toast
              </Button>
              <Button variant="secondary" onClick={() => setShowError(!showError)}>
                Toggle Error Banner
              </Button>
              <Button variant="primary" onClick={() => setShowLoading(true)}>
                Show Loading (5s)
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(true)}>
                Open Modal
              </Button>
              <Button variant="primary" onClick={() => setShowPanel(true)}>
                Open Sliding Panel
              </Button>
              <Button variant="save" onClick={simulateProgress}>
                Simulate Progress
              </Button>
            </div>
          </Card>
        </>
      )}

      {/* Toast */}
      {showToast && (
        <Toast
          message="Action completed successfully!"
          onClose={() => setShowToast(false)}
          onUndo={() => {
            console.log('Undo clicked')
            setShowToast(false)
          }}
          duration={5000}
        />
      )}

      {/* Modal */}
      <TvModal isOpen={showModal} onClose={() => setShowModal(false)} title="Sample Modal">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            This is a sample modal dialog. You can use this component to display important
            information or get user confirmation.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(false)
                setShowToast(true)
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      </TvModal>

      {/* Sliding Panel */}
      <SlidingPanel isOpen={showPanel} onClose={() => setShowPanel(false)} title="Details Panel">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Panel Content</h4>
          <p className="text-gray-600 dark:text-gray-400">
            This sliding panel is perfect for showing detailed information without leaving the
            current page. It slides in from the right side of the screen.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">User Information</span>
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Contact Details</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">Phone Number</span>
            </div>
          </div>
        </div>
      </SlidingPanel>


    </div>
  )
}
