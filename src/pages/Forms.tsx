import { useNavigate } from 'react-router-dom';
import FileExplorer from '../FileExplorer';
import { mockFolders, mockFiles } from '../data/parseMockData';
import { FileType } from '../FileExplorer/types';

export default function Forms() {
    const navigate = useNavigate();

    // You can filter to only show 'form' files or show all
    const filteredFiles = mockFiles.filter((f: any) => f.type === FileType.Form);
    const folders = mockFolders;

    const handleCreateNew = () => {
        navigate('/forms/new');
    };

    return (
        <div className="h-full w-full">
            <FileExplorer
                title="Forms"
                createButtonText="Create Form"
                initialFiles={filteredFiles}
                initialFolders={folders}
                onCreateFile={handleCreateNew}
            />
        </div>
    );
}
