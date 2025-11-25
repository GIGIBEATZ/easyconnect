import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, MapPin, Briefcase, DollarSign, User, Send } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Job = Database['public']['Tables']['jobs']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface JobDetailsProps {
  job: Job;
  onBack: () => void;
}

export const JobDetails = ({ job, onBack }: JobDetailsProps) => {
  const { profile } = useAuth();
  const [employer, setEmployer] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobData();
  }, [job.id]);

  const loadJobData = async () => {
    setLoading(true);
    await Promise.all([loadEmployer(), checkIfApplied()]);
    setLoading(false);
  };

  const loadEmployer = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', job.employer_id)
        .maybeSingle();

      if (error) throw error;
      setEmployer(data);
    } catch (error) {
      console.error('Error loading employer:', error);
    }
  };

  const checkIfApplied = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', job.id)
        .eq('applicant_id', profile.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setHasApplied(!!data);
    } catch (error) {
      console.error('Error checking application:', error);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setApplying(true);

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: job.id,
          applicant_id: profile!.id,
          cover_letter: coverLetter,
          resume_url: resumeUrl || null,
        });

      if (error) throw error;

      setApplicationSuccess(true);
      setHasApplied(true);
    } catch (error: any) {
      setError(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      freelance: 'Freelance',
    };
    return labels[type] || type;
  };

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      full_time: 'bg-green-100 text-green-700',
      part_time: 'bg-blue-100 text-blue-700',
      contract: 'bg-orange-100 text-orange-700',
      freelance: 'bg-purple-100 text-purple-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const isJobSeeker = profile?.roles.includes('job_seeker');

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Jobs
      </button>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.job_type)}`}>
                  {getJobTypeLabel(job.job_type)}
                </span>
              </div>
            </div>

            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center text-lg font-medium text-gray-900 mb-6">
                <DollarSign className="w-6 h-6 mr-1 text-green-600" />
                {job.salary_min && job.salary_max
                  ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                  : job.salary_min
                  ? `From $${job.salary_min.toLocaleString()}`
                  : `Up to $${job.salary_max?.toLocaleString()}`}
              </div>
            )}
          </div>

          {employer && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Posted by</h3>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{employer.full_name}</p>
                  {employer.location && (
                    <p className="text-sm text-gray-600">{employer.location}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {isJobSeeker && job.status === 'open' && (
            <div className="border-t border-gray-200 pt-6">
              {hasApplied ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-800 font-medium">
                    You have already applied for this position
                  </p>
                </div>
              ) : applicationSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Application Submitted!
                  </h3>
                  <p className="text-green-800">
                    Your application has been sent to the employer. Good luck!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Apply for this Position</h2>

                  {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Letter *
                    </label>
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell the employer why you're the perfect fit for this role..."
                    />
                  </div>

                  <div>
                    <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Resume URL (optional)
                    </label>
                    <input
                      id="resumeUrl"
                      type="url"
                      value={resumeUrl}
                      onChange={(e) => setResumeUrl(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/your-resume.pdf"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          )}

          {!isJobSeeker && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800">
                  You need to have the "Job Seeker" role to apply for jobs
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
