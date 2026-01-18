import { useState, useEffect } from "react";
import { Edit2, Save, X, FileText } from "lucide-react";

const CoverLetterEditor = ({ profile, onSave, updating }) => {
  const [editing, setEditing] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setCoverLetter(profile.coverLetter || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setError("");
    const result = await onSave({ coverLetter });
    if (result?.success) {
      setEditing(false);
    } else if (result?.error) {
      setError(result.error);
    }
  };

  const handleCancel = () => {
    setCoverLetter(profile?.coverLetter || "");
    setError("");
    setEditing(false);
  };

  const hasCoverLetter =
    profile?.coverLetter && profile.coverLetter.trim().length > 0;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg text-foreground">Cover Letter</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
          >
            <Edit2 className="w-4 h-4" />
            {hasCoverLetter ? "Edit" : "Add"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {editing ? (
        <div>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Write a compelling cover letter that highlights your experience and why you're a great fit..."
            rows={12}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-chart-1 focus:ring-1 focus:ring-chart-1 resize-none bg-input-background text-foreground"
            disabled={updating}
          />
          <p className="text-xs text-muted-foreground mt-2">
            {coverLetter.length} characters
          </p>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleCancel}
              disabled={updating}
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={updating}
              className="px-6 py-3 bg-chart-1 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 inline mr-2" />
              {updating ? "Saving..." : "Save Cover Letter"}
            </button>
          </div>
        </div>
      ) : hasCoverLetter ? (
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground whitespace-pre-line leading-relaxed">
            {profile.coverLetter}
          </p>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-foreground mb-2">
            No cover letter added
          </h3>
          <p className="text-sm text-muted-foreground">
            Add a cover letter to strengthen your job applications
          </p>
        </div>
      )}
    </div>
  );
};

export default CoverLetterEditor;
