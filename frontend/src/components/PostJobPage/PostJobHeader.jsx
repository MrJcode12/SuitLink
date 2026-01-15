import { ArrowLeft, Briefcase, Eye } from "lucide-react";

const PostJobHeader = ({ onBack, onPreview, onPublish, isSubmitting }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg"
              type="button"
            >
              <ArrowLeft className="size-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <Briefcase className="size-7 text-emerald-600" />
              <span className="text-xl text-gray-900">SuitLink</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPreview}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Eye className="size-4" />
              <span className="text-sm">Preview</span>
            </button>
            <button
              onClick={onPublish}
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors text-sm"
            >
              {isSubmitting ? "Publishing..." : "Publish Job"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PostJobHeader;
