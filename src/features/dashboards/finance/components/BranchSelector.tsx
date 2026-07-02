import React from 'react';

interface Branch {
  id: string;
  name: string;
}

interface BranchSelectorProps {
  selectedBranches: string[];
  onChange: (branchIds: string[]) => void;
  includeAllBranches?: boolean;
  branches: Branch[];
  className?: string;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({
  selectedBranches,
  onChange,
  includeAllBranches = true,
  branches,
  className
}) => {
  const handleSelectAll = () => {
    onChange(['all']);
  };

  const handleSelectBranch = (branchId: string) => {
    if (selectedBranches.includes(branchId)) {
      const newSelection = selectedBranches.filter(id => id !== branchId);
      onChange(newSelection.length > 0 ? newSelection : ['all']);
    } else {
      const newSelection = selectedBranches.includes('all') 
        ? [branchId] 
        : [...selectedBranches, branchId];
      onChange(newSelection);
    }
  };

  return (
    <div className={`branch-selector ${className || ''}`}>
      <div className="selector-header">
        <label className="selector-label">Branch Scope:</label>
        <span className="branch-count">
          {selectedBranches.includes('all') 
            ? `${branches.length} Branches` 
            : `${selectedBranches.length} Selected`}
        </span>
      </div>
      
      <div className="branch-options">
        {includeAllBranches && (
          <button
            className={`branch-option ${selectedBranches.includes('all') ? 'active' : ''}`}
            onClick={handleSelectAll}
          >
            🌐 All Branches
          </button>
        )}
        
        {branches.map((branch) => (
          <button
            key={branch.id}
            className={`branch-option ${selectedBranches.includes(branch.id) ? 'active' : ''}`}
            onClick={() => handleSelectBranch(branch.id)}
          >
            {branch.name}
          </button>
        ))}
      </div>

      <style>{`
        .branch-selector {
          background: #ffffff;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }
        .selector-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .selector-label {
          font-weight: 600;
          color: #2c3e50;
        }
        .branch-count {
          font-size: 0.9rem;
          color: #7f8c8d;
        }
        .branch-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .branch-option {
          padding: 8px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          color: #2c3e50;
        }
        .branch-option:hover {
          background: #f5f5f5;
          border-color: #3498db;
        }
        .branch-option.active {
          background: #3498db;
          color: white;
          border-color: #3498db;
        }
      `}</style>
    </div>
  );
};

export default BranchSelector;