import { useEffect } from "react";
import { X, Building, MapPin, Calendar, FileText } from "lucide-react";

const ApplicationJobModal = ({
  application,
  onClose,
  formatDate,
  getStatusColor,
  getStatusLabel,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onEsc);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  if (!application) return null;

  const job = application.jobPosting || {};
  const companyName =
    job?.company?.companyName || application?.company?.companyName || "Company";

  return (
    <div
      className="fixed inset-0 z-50 p-4 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white w-full max-w-4xl rounded-2xl border border-gray-200 shadow-2xl ring-1 ring-black/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-200 p-6 flex items-start justify-between">
          <div className="min-w-0 pr-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-2xl font-medium text-gray-900 truncate">
                {job?.title || "Job Details"}
              </h2>
              <span
                className={`px-2.5 py-1 text-xs rounded-full ${getStatusColor?.(
                  application.status
                )}`}
              >
                {getStatusLabel?.(application.status)}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="inline-flex items-center gap-2 min-w-0">
                {job?.company?.logo?.url ? (
                  <img
                    src={job.company.logo.url}
                    alt={companyName}
                    className="w-8 h-8 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <Building className="w-4 h-4 text-emerald-700" />
                  </span>
                )}
                <span className="text-gray-900 font-medium truncate">
                  {companyName}
                </span>
              </div>

              {job?.location && (
                <div className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{job.location}</span>
                </div>
              )}

              <div className="inline-flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Applied {formatDate?.(application.createdAt)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Application Summary
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {getStatusLabel?.(application.status)}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-xs text-gray-500">Applied On</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {formatDate?.(application.createdAt)}
                    </p>
                  </div>
                </div>

                {application?.notes && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {application.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Job Snapshot
                </h3>
                {job?.description ? (
                  <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                    {job.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    No job description available for this posting.
                  </p>
                )}
              </div>

              {job?.requirements?.skills?.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    Skills (from posting)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Cover Letter Sent
                  </h3>
                </div>

                {application?.coverLetter ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    No cover letter was included in this application.
                  </p>
                )}
              </div>

              <div className="bg-emerald-700 text-white rounded-2xl p-5">
                <p className="text-sm text-emerald-100">
                  Tip: If your status stays in{" "}
                  <span className="font-medium text-white">Pending</span> for a
                  while, refine your profile and tailor future cover letters to
                  improve match quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-200 p-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationJobModal;
