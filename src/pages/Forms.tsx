import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileExplorer from '../FileExplorer';
import { mockFormFolders, mockFormFiles } from '../data/parseMockData';
import { FileType } from '../FileExplorer/types';
import { CreateItemDialog, TemplateItem } from '../FileExplorer/components/CreateItemDialog';
import { ClipboardDocumentListIcon, ChatBubbleOvalLeftEllipsisIcon, StarIcon, BanknotesIcon } from "@heroicons/react/24/outline";

const FORM_TEMPLATES: TemplateItem[] = [
  { id: 'f1', title: 'Contact Us', subtitle: 'A simple contact form to gather basic information.', icon: ChatBubbleOvalLeftEllipsisIcon },
  { id: 'f2', title: 'Customer Feedback', subtitle: 'Survey form to collect customer opinions and ratings.', icon: StarIcon },
  { id: 'f3', title: 'Event Registration', subtitle: 'Sign-up form for an upcoming event or webinar.', icon: ClipboardDocumentListIcon },
  { id: 'f4', title: 'Order/Payment Form', subtitle: 'Collect orders and payment details securely.', icon: BanknotesIcon },
];

export default function Forms() {
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // You can filter to only show 'form' files or show all
    const filteredFiles = mockFormFiles.filter((f: any) => f.type === FileType.Form);
    const folders = mockFormFolders;

    const handleCreateNew = () => {
        setIsCreateOpen(true);
    };

    const handleCreateForm = (mode: 'scratch' | 'template' | 'ai', data?: any) => {
        setIsCreateOpen(false);
        console.log("Create Form with mode:", mode, "data:", data);
        navigate('/forms/new');
    };

    return (
        <div className="h-full w-full">
            <FileExplorer
                title="Forms"
                fileType={FileType.Form}
                createButtonText="Create Form"
                initialFiles={filteredFiles}
                initialFolders={folders}
                onCreateFile={handleCreateNew}
            />
            <CreateItemDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateForm}
                itemType="Form"
                templates={FORM_TEMPLATES}
            />
        </div>
    );
}
