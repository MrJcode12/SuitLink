// frontend/src/components/ApplicantProfile/CoverLetterEditor.jsx
import { useState, useEffect } from "react";
import { Edit2, Save, X, FileText } from "lucide-react";

const CoverLetterEditor = ({ profile, onSave, updating }) => {
  const [editing, setEditing] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (profile) {
      setCoverLetter(profile.coverLetter || "");
    }
  }, [profile]);

  const handleSave = async () => {
    const result = await onSave({ coverLetter });
    if (result?.success) {
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setCoverLetter(profile?.coverLetter || "");
    setEditing(false);
  };

  const hasCoverLetter =
    profile?.coverLetter && profile.coverLetter.trim().length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-gray-900 font-medium">Cover Letter</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            {hasCoverLetter ? "Edit" : "Add"}
          </button>
        )}
      </div>

      {editing ? (
        <div>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write a compelling cover letter that highlights your experience and why you're a great fit..."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none"
            disabled={updating}
          />
          <p className="text-xs text-gray-500 mt-2">
            {coverLetter.length} characters
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCancel}
              disabled={updating}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updating}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {updating ? "Saving..." : "Save Cover Letter"}
            </button>
          </div>
        </div>
      ) : hasCoverLetter ? (
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {profile.coverLetter}
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            No cover letter added
          </h3>
          <p className="text-sm text-gray-500">
            Add a cover letter to strengthen your job applications
          </p>
        </div>
      )}
    </div>
  );
};

export default CoverLetterEditor;
