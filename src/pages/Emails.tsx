import { useNavigate } from 'react-router-dom';
import FileExplorer from '../FileExplorer';
import { mockEmailFolders, mockEmailFiles } from '../data/parseMockData';
import { FileType } from '../FileExplorer/types';

export default function Emails() {
    const navigate = useNavigate();

    // You can filter to only show 'email' files or show all
    const filteredFiles = mockEmailFiles.filter((f: any) => f.type === FileType.Email);
    const folders = mockEmailFolders;

    const handleCreateNew = () => {
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
        </div>
    );
}
