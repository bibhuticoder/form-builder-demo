import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileExplorer from '../FileExplorer';
import { FileItem, FileType } from '../FileExplorer/types';
import { mockFolders, mockFiles } from '../data/parseMockData';
import { CreateItemDialog, TemplateItem } from '../FileExplorer/components/CreateItemDialog';
import { ArrowPathIcon, UserGroupIcon, PaperAirplaneIcon, CogIcon } from "@heroicons/react/24/outline";

const AUTOMATION_TEMPLATES: TemplateItem[] = [
  { id: 'a1', title: 'Welcome Series', subtitle: 'A sequence of messages to welcome new subscribers.', icon: UserGroupIcon },
  { id: 'a2', title: 'Abandoned Cart', subtitle: 'Automated follow-ups for incomplete checkouts.', icon: ArrowPathIcon },
  { id: 'a3', title: 'Re-engagement Workflow', subtitle: 'Win back inactive users with targeted offers.', icon: PaperAirplaneIcon },
  { id: 'a4', title: 'Custom API Trigger', subtitle: 'Trigger workflows from your custom application integrations.', icon: CogIcon },
];

export default function Automations() {
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // We could filter here or let FileExplorer show all files depending on business logic.
    // For now we'll show all items as requested to test generic file routing.
    const files: FileItem[] = mockFiles;
    const folders = mockFolders;

    const handleCreateNew = () => {
        setIsCreateOpen(true);
    };

    const handleCreateAutomation = (mode: 'scratch' | 'template' | 'ai', data?: any) => {
        setIsCreateOpen(false);
        console.log("Create Automation with mode:", mode, "data:", data);
        navigate('/automations/new');
    };

    return (
        <div className="h-full w-full">
            <FileExplorer
                title="Automations"
                fileType={FileType.Automation}
                createButtonText="Create Automation"
                initialFiles={files}
                initialFolders={folders}
                onCreateFile={handleCreateNew}
            />
            <CreateItemDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateAutomation}
                itemType="Automation"
                templates={AUTOMATION_TEMPLATES}
            />
        </div>
    );
}
