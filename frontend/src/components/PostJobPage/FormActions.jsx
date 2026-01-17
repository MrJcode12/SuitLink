import { Save } from "lucide-react";

const FormActions = ({ onCancel, onSaveDraft, onPublish, isSubmitting }) => {
  return (
    <div className="flex items-center justify-end gap-3 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
        disabled={isSubmitting}
      >
        <Save className="size-4" />
        Save as Draft
      </button>
      <button
        type="submit"
        className="px-6 py-3 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Publishing..." : "Publish Job"}
      </button>
    </div>
  );
};

export default FormActions;
