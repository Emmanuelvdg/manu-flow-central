
import React from 'react';
import { Database, File, Link2 } from 'lucide-react';

const FileButtons = () => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Files</div>
      <div className="flex space-x-4">
        <button className="text-blue-600">
          <Database className="h-5 w-5" />
        </button>
        <button className="text-blue-600">
          <File className="h-5 w-5" />
        </button>
        <button className="text-blue-600">
          <Link2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FileButtons;
