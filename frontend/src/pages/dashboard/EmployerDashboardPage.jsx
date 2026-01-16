import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Eye,
  MessageSquare,
  Bell,
} from "lucide-react";
import StatsCard from "../../components/EmployerDashboard/StatsCard";
import ApplicantCard from "../../components/EmployerDashboard/ApplicantCard";
import JobCard from "../../components/EmployerDashboard/JobCard";
import ApplicantTableRow from "../../components/EmployerDashboard/ApplicantTableRow";
import Logo from "../../components/Auth/Shared/Logo";

// Mock data - Replace with API calls
const postedJobs = [
  {
    id: 1,
    title: "Senior UX Designer",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120,000/year",
    posted: "5 days ago",
    applicants: 45,
    viewed: 234,
    status: "active",
    newApplicants: 12,
  },
  {
    id: 2,
    title: "Frontend Developer",
    location: "Remote",
    type: "Full-time",
    salary: "$95,000/year",
    posted: "2 weeks ago",
    applicants: 89,
    viewed: 456,
    status: "active",
    newApplicants: 8,
  },
  {
    id: 3,
    title: "Product Manager",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130,000/year",
    posted: "1 month ago",
    applicants: 67,
    viewed: 312,
    status: "closed",
    newApplicants: 0,
  },
];

const recentApplicants = [
  {
    id: 1,
    name: "Sarah Johnson",
    position: "Senior UX Designer",
    avatar: "SJ",
    experience: "7 years",
    skills: ["UI/UX", "Figma", "Design Systems"],
    matchScore: 95,
    appliedDate: "2 hours ago",
    status: "new",
  },
  {
    id: 2,
    name: "Michael Chen",
    position: "Frontend Developer",
    avatar: "MC",
    experience: "5 years",
    skills: ["React", "TypeScript", "Node.js"],
    matchScore: 88,
    appliedDate: "5 hours ago",
    status: "new",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    position: "Senior UX Designer",
    avatar: "ER",
    experience: "6 years",
    skills: ["UX Research", "Prototyping", "Figma"],
    matchScore: 92,
    appliedDate: "1 day ago",
    status: "reviewing",
  },
  {
    id: 4,
    name: "David Park",
    position: "Frontend Developer",
    avatar: "DP",
    experience: "4 years",
    skills: ["React", "CSS", "GraphQL"],
    matchScore: 85,
    appliedDate: "1 day ago",
    status: "reviewing",
  },
];

const EmployerDashboardPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Handler functions - Connect to backend
  const handleViewProfile = (applicant) => {
    console.log("View applicant profile:", applicant);
    // navigate(`/employer/applicants/${applicant.id}`);
  };

  const handleEditJob = (job) => {
    console.log("Edit job:", job);
    // navigate(`/employer/jobs/edit/${job.id}`);
  };

  const handleViewApplicants = (job) => {
    console.log("View applicants for job:", job);
    // navigate(`/employer/jobs/${job.id}/applicants`);
  };

  const handlePostJob = () => {
    navigate("/employer/post-job");
  };

  const handleGoProfile = () => {
    navigate("/employer-profile");
  };

  // Stats data - Replace with API call
  const stats = [
    {
      icon: Briefcase,
      value: "3",
      label: "Active Jobs",
      trend: true,
      iconBgColor: "bg-chart-1/10",
      iconColor: "text-chart-1",
    },
    {
      icon: Users,
      value: "201",
      label: "Total Applicants",
      trend: true,
      iconBgColor: "bg-chart-2/10",
      iconColor: "text-chart-2",
    },
    {
      icon: Eye,
      value: "1,002",
      label: "Profile Views",
      trend: true,
      iconBgColor: "bg-chart-3/10",
      iconColor: "text-chart-3",
    },
    {
      icon: MessageSquare,
      value: "20",
      label: "New Applicants",
      trend: true,
      iconBgColor: "bg-chart-4/10",
      iconColor: "text-chart-4",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Logo />
              {/* add conditionals to have that credibility checkmark. */}
              <span className="px-2 py-1 bg-chart-1/10 text-chart-1 text-xs rounded-full ml-2 font-medium">
                Employer
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "overview"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("jobs")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "jobs"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                My Jobs
              </button>
              <button
                onClick={() => setActiveTab("applicants")}
                className={`text-sm font-medium pb-1 ${
                  activeTab === "applicants"
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-600 hover:text-gray-900"
                } py-1`}
              >
                Applicants
              </button>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePostJob}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Post Job</span>
              </button>
              <button className="relative">
                <Bell className="size-5 text-gray-600 hover:text-gray-900" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-600 rounded-full" />
              </button>
              <button
                onClick={handleGoProfile}
                className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm"
              >
                TC
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Recent Applicants */}
            <div className="bg-white rounded-xl border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg text-gray-900">Recent Applicants</h2>
                  <button
                    onClick={() => setActiveTab("applicants")}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    View all
                  </button>
                </div>
              </div>
              <div>
                {recentApplicants.map((applicant) => (
                  <ApplicantCard
                    key={applicant.id}
                    applicant={applicant}
                    onViewProfile={handleViewProfile}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* My Jobs Tab */}
        {activeTab === "jobs" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-gray-900">Posted Jobs</h2>
                <button
                  onClick={handlePostJob}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  <Plus className="size-4" />
                  <span className="text-sm">Post New Job</span>
                </button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="size-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div>
              {postedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEditJob}
                  onViewApplicants={handleViewApplicants}
                />
              ))}
            </div>
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === "applicants" && (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-gray-900">All Applicants</h2>
                <div className="flex items-center gap-2">
                  <select
                    value={jobFilter}
                    onChange={(e) => setJobFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                  >
                    <option value="all">All Jobs</option>
                    <option value="ux-designer">Senior UX Designer</option>
                    <option value="frontend-dev">Frontend Developer</option>
                    <option value="product-manager">Product Manager</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                      Match Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentApplicants.map((applicant) => (
                    <ApplicantTableRow
                      key={applicant.id}
                      applicant={applicant}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboardPage;
