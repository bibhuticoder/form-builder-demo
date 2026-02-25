import { useNavigate } from 'react-router-dom';
import FileExplorer from '../FileExplorer';
import { FileItem, FileType } from '../FileExplorer/types';
import { mockFolders, mockFiles } from '../data/parseMockData';

export default function Automations() {
    const navigate = useNavigate();

    // We could filter here or let FileExplorer show all files depending on business logic.
    // For now we'll show all items as requested to test generic file routing.
    const files: FileItem[] = mockFiles;
    const folders = mockFolders;

    const handleCreateNew = () => {
        // Navigate to a dedicated creation page or open a specialized modal. 
        // Here we'll just navigate to a new automation path as a placeholder handler
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
        </div>
    );
}
