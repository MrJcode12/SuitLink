import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ResumeUpload = ({ profile, onUpload, onDelete, uploading }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    const result = await onUpload(file);
    if (result?.success) {
      setSuccess("Resume uploaded and parsed successfully!");
      setTimeout(() => setSuccess(""), 5000);
    } else {
      setError(result?.error || "Failed to upload resume");
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;

    const resumeId = profile?.resumes?.[0]?._id;
    if (!resumeId) return;

    const result = await onDelete(resumeId);
    if (result?.success) {
      setSuccess("Resume deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result?.error || "Failed to delete resume");
    }
  };

  const hasResume = profile?.resumes && profile.resumes.length > 0;
  const resume = profile?.resumes?.[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg text-gray-900 font-medium">Resume</h2>
          <p className="text-sm text-gray-600 mt-1">
            Upload a PDF/DOCX to enable parsing and improve job matching.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-700 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-700 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {hasResume ? (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {resume.fileName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded{" "}
                    {new Date(resume.uploadedAt).toLocaleDateString("en-US")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={resume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-200 transition"
                  title="View Resume"
                >
                  <ExternalLink className="w-4 h-4 text-gray-700" />
                </a>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={uploading}
                  className="p-2 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Replace Resume"}
          </button>

          <p className="text-xs text-gray-500 text-center">
            PDF or DOCX, max 5MB
          </p>
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-7 h-7 text-gray-500" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            No resume uploaded
          </h3>
          <p className="text-sm text-gray-600 mb-5">
            Upload your resume to enable parsing and improve matching.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload Resume"}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Supported formats: PDF, DOCX (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
