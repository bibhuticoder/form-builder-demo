import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileExplorer from '../FileExplorer';
import { mockEmailFolders, mockEmailFiles } from '../data/parseMockData';
import { FileType } from '../FileExplorer/types';
import { CreateItemDialog, TemplateItem } from '../FileExplorer/components/CreateItemDialog';
import { DocumentIcon, CalendarIcon, UserPlusIcon, ShoppingCartIcon, ClockIcon, ChatBubbleBottomCenterTextIcon, BoltIcon, NewspaperIcon } from "@heroicons/react/24/outline";

const EMAIL_TEMPLATES: TemplateItem[] = [
  { id: 't1', title: 'Long Term Nurture Sequence', subtitle: 'Send a series of emails to new leads over 7 days.', icon: DocumentIcon },
  { id: 't2', title: 'Webinar Registration', subtitle: 'Confirm registration and send reminders before the event.', icon: CalendarIcon },
  { id: 't3', title: 'Customer Onboarding', subtitle: 'Welcome new customers and guide them through setup.', icon: UserPlusIcon },
  { id: 't4', title: 'Abandoned Cart Recovery', subtitle: 'Remind users about items left in their cart.', icon: ShoppingCartIcon },
  { id: 't5', title: 'Appointment Reminder', subtitle: 'Send SMS and Email reminders for upcoming appointments.', icon: ClockIcon },
  { id: 't6', title: '9-Word Follow Up', subtitle: 'A simple, direct question to re-engage dead leads.', icon: ChatBubbleBottomCenterTextIcon },
  { id: 't7', title: 'Fast 5 Follow Up', subtitle: 'Rapidly engage new leads with 5 touches in 5 minutes.', icon: BoltIcon },
  { id: 't8', title: 'Monthly Newsletter', subtitle: 'Regular content digest sent to your subscriber base.', icon: NewspaperIcon },
];

export default function Emails() {
    const navigate = useNavigate();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // You can filter to only show 'email' files or show all
    const filteredFiles = mockEmailFiles.filter((f: any) => f.type === FileType.Email);
    const folders = mockEmailFolders;

    const handleCreateNew = () => {
        setIsCreateOpen(true);
    };

    const handleCreateEmail = (mode: 'scratch' | 'template' | 'ai', data?: any) => {
        setIsCreateOpen(false);
        console.log("Create Email with mode:", mode, "data:", data);
        // Navigate or handle other ways based on selected mode
        navigate('/emails/new');
    };

    return (
        <div className="h-full w-full">
            <FileExplorer
                title="Emails"
                fileType={FileType.Email}
                createButtonText="Create Email"
                initialFiles={filteredFiles}
                initialFolders={folders}
                onCreateFile={handleCreateNew}
            />
            <CreateItemDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateEmail}
                itemType="Email"
                templates={EMAIL_TEMPLATES}
            />
        </div>
    );
}
