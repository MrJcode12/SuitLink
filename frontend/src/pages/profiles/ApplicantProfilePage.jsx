import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  GraduationCap,
  Briefcase,
  Sparkles,
  FileText,
  AlertCircle,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useApplicantProfile from "../../hooks/useApplicantProfile";
import ProfileForm from "../../components/ApplicantProfile/ProfileForm";
import AvatarUpload from "../../components/ApplicantProfile/AvatarUpload";
import ResumeUpload from "../../components/ApplicantProfile/ResumeUpload";
import ParsedResumeDisplay from "../../components/ApplicantProfile/ParsedResumeDisplay";
import ProfileCompletionBadge from "../../components/ApplicantProfile/ProfileCompletionBadge";
import EducationManager from "../../components/ApplicantProfile/EducationManager";
import ExperienceManager from "../../components/ApplicantProfile/ExperienceManager";
import SkillsManager from "../../components/ApplicantProfile/SkillsManager";
import ApplicantProfileSetupModal from "../../components/ApplicantProfile/ApplicantProfileSetupModal";
import ApplicantNavbar from "../../components/ApplicantProfile/ApplicantNavbar";

const ApplicantProfilePage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isApplicant } = useAuth();

  const {
    profile,
    loading,
    error,
    updating,
    uploadingResume,
    uploadingAvatar,
    updateProfile,
    uploadAvatar,
    uploadResume,
    deleteResume,
    refetch,
  } = useApplicantProfile();

  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/login");
      else if (!isApplicant) navigate("/employer-dashboard");
    }
  }, [user, authLoading, isApplicant, navigate]);

  useEffect(() => {
    if (!loading && !profile && !error) setShowSetupModal(true);
  }, [loading, profile, error]);

  const handleSetupSuccess = async () => {
    setShowSetupModal(false);
    await refetch();
  };

  const handleProfileUpdate = async (data) => updateProfile(data);
  const handleAvatarUpload = async (file) => uploadAvatar(file);
  const handleResumeUpload = async (file) => uploadResume(file);
  const handleResumeDelete = async (resumeId) => deleteResume(resumeId);

  const quickStats = useMemo(() => {
    return {
      skills: profile?.skills?.length || 0,
      experience: profile?.experience?.length || 0,
      education: profile?.education?.length || 0,
      resumeScore: profile?.resumeAnalysis?.score || null,
    };
  }, [profile]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
          <p className="text-gray-600 mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {(showSetupModal || !profile) && (
        <ApplicantProfileSetupModal onSuccess={handleSetupSuccess} />
      )}

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <ApplicantNavbar />
        </header>

        <main className="max-w-6xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information, resume, and profile details.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Something went wrong
                </p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
  {/* LEFT COLUMN — PRIMARY CONTENT */}
  <div className="lg:col-span-3 space-y-6">
    <AvatarUpload
      profile={profile}
      onUpload={handleAvatarUpload}
      uploading={uploadingAvatar}
      onUpdate={refetch}
    />

    <ProfileForm
      profile={profile}
      onSave={handleProfileUpdate}
      updating={updating}
    />

    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Briefcase className="w-5 h-5 text-emerald-700" />
        <h3 className="text-lg font-medium text-gray-900">Experience</h3>
      </div>
      <ExperienceManager profile={profile} onUpdate={refetch} />
    </div>

    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-3">
        <GraduationCap className="w-5 h-5 text-emerald-700" />
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
      </div>
      <EducationManager profile={profile} onUpdate={refetch} />
    </div>

    <ParsedResumeDisplay profile={profile} />
  </div>

  {/* RIGHT COLUMN — OVERVIEW / SUPPORT */}
  <div className="lg:col-span-2 space-y-6">
    {/* Profile Strength */}
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-emerald-700" />
        <h2 className="text-lg font-medium text-gray-900">
          Profile Overview
        </h2>
      </div>
      <ProfileCompletionBadge profile={profile} />
    </div>

    {/* Quick Stats */}
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-emerald-700" />
        <h3 className="text-lg font-medium text-gray-900">
          Quick Stats
        </h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Skills</span>
          <span className="font-medium">{quickStats.skills}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Experience</span>
          <span className="font-medium">
            {quickStats.experience} positions
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Education</span>
          <span className="font-medium">
            {quickStats.education} entries
          </span>
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-between text-sm">
          <span className="text-gray-600">Resume Score</span>
          <span className="font-medium text-emerald-700">
            {quickStats.resumeScore
              ? `${quickStats.resumeScore}/100`
              : "—"}
          </span>
        </div>
      </div>
    </div>

    {/* Skills */}
    <SkillsManager profile={profile} onUpdate={refetch} />

    {/* Resume Upload */}
    <ResumeUpload
      profile={profile}
      onUpload={handleResumeUpload}
      onDelete={handleResumeDelete}
      uploading={uploadingResume}
    />
  </div>
</div>

        </main>
      </div>
    </>
  );
};

export default ApplicantProfilePage;
