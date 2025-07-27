export const AIDescriptionButton = ({ 
  onClick, 
  isLoading, 
  disabled, 
  className = "btn btn-sm btn-outline btn-secondary" 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <span className="loading loading-spinner loading-xs"></span>
          Generating...
        </>
      ) : (
        <>
          <span className="text-lg">🤖</span>
          AI Suggest
        </>
      )}
    </button>
  );
};

export const AISuggestionCard = ({ 
  suggestion, 
  onUse, 
  onDismiss 
}) => {
  if (!suggestion) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 space-y-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-blue-800 flex items-center gap-2">
          <span className="text-lg">🤖</span>
          AI Generated Description
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onUse}
            className="btn btn-xs btn-primary hover:btn-primary-focus"
          >
            ✓ Use This
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="btn btn-xs btn-ghost hover:btn-error"
          >
            ✕ Dismiss
          </button>
        </div>
      </div>
      <div className="bg-white rounded p-3 border-l-4 border-blue-400">
        <p className="text-sm text-gray-700 leading-relaxed">
          {suggestion}
        </p>
      </div>
      <div className="text-xs text-blue-600">
        💡 You can edit this description after applying it
      </div>
    </div>
  );
};
