import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useApplicantProfile from "../../hooks/useApplicantProfile";
import ProfileForm from "../../components/ApplicantProfile/ProfileForm";
import AvatarUpload from "../../components/ApplicantProfile/AvatarUpload";
import ResumeUpload from "../../components/ApplicantProfile/ResumeUpload";
import ParsedResumeDisplay from "../../components/ApplicantProfile/ParsedResumeDisplay";
import CoverLetterEditor from "../../components/ApplicantProfile/CoverLetterEditor";
import ProfileCompletionBadge from "../../components/ApplicantProfile/ProfileCompletionBadge";
import EducationManager from "../../components/ApplicantProfile/EducationManager";
import ExperienceManager from "../../components/ApplicantProfile/ExperienceManager";
import SkillsManager from "../../components/ApplicantProfile/SkillsManager";
import ApplicantProfileSetupModal from "../../components/ApplicantProfile/ApplicantProfileSetupModal";
import Logo from "../../components/Auth/Shared/Logo";
import ApplicantNavbar from "../../components/ApplicantProfile/ApplicantNavbar";

const ApplicantProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Check auth and role
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/login");
      } else if (!isApplicant) {
        navigate("/employer-dashboard");
      }
    }
  }, [user, authLoading, isApplicant, navigate]);

  // Check if profile exists
  useEffect(() => {
    if (!loading && !profile && !error) {
      setShowSetupModal(true);
    }
  }, [loading, profile, error]);

  const handleSetupSuccess = async () => {
    setShowSetupModal(false);
    await refetch();
  };

  const handleProfileUpdate = async (data) => {
    return await updateProfile(data);
  };

  const handleAvatarUpload = async (file) => {
    return await uploadAvatar(file);
  };

  const handleResumeUpload = async (file) => {
    return await uploadResume(file);
  };

  const handleResumeDelete = async (resumeId) => {
    return await deleteResume(resumeId);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-1 mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading profile...</p>
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
        {/* Header */}
        <header className="border-white border-b border-gray-200 sticky top-0 z-40">
          <ApplicantNavbar />
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl text-foreground mb-2">My Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information, resume, and application
              materials
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={refetch}
                className="mt-2 text-sm text-destructive underline hover:text-destructive/80"
              >
                Try again
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Avatar Upload */}
              <AvatarUpload
                profile={profile}
                onUpload={handleAvatarUpload}
                uploading={uploadingAvatar}
                onUpdate={refetch}
              />

              {/* Personal Information - ALL FIELDS NOW SAVE */}
              <ProfileForm
                profile={profile}
                onSave={handleProfileUpdate}
                updating={updating}
              />

              {/* Skills */}
              <SkillsManager profile={profile} onUpdate={refetch} />

              {/* Experience */}
              <ExperienceManager profile={profile} onUpdate={refetch} />

              {/* Education */}
              <EducationManager profile={profile} onUpdate={refetch} />

              {/* Resume Upload - WITH AI ANALYSIS */}
              <ResumeUpload
                profile={profile}
                onUpload={handleResumeUpload}
                onDelete={handleResumeDelete}
                uploading={uploadingResume}
              />

              {/* AI Resume Analysis Display */}
              <ParsedResumeDisplay profile={profile} />

              {/* Cover Letter - NOW SAVES */}
              <CoverLetterEditor
                profile={profile}
                onSave={handleProfileUpdate}
                updating={updating}
              />
            </div>

            {/* Sidebar - Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Completion Badge */}
              <ProfileCompletionBadge profile={profile} />

              {/* Quick Stats */}
              <div className="border-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg text-foreground mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Skills
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {profile?.skills?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Experience
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {profile?.experience?.length || 0} positions
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Education
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {profile?.education?.length || 0} entries
                    </span>
                  </div>
                  {profile?.resumeAnalysis?.score && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-muted-foreground">
                        Resume Score
                      </span>
                      <span className="text-sm font-medium text-chart-1">
                        {profile.resumeAnalysis.score}/100
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Tips */}
              <div className="bg-gradient-to-br from-chart-1/10 to-chart-2/10 rounded-xl border border-chart-1/20 p-6">
                <h3 className="text-lg text-foreground mb-3">Profile Tips</h3>
                <ul className="space-y-2 text-sm text-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>
                      Upload an updated resume for AI-powered insights
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>Add your work experience and education</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>List your technical and soft skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-chart-1 mt-0.5">•</span>
                    <span>Keep your contact information up to date</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ApplicantProfilePage;
