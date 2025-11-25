import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import type { Database } from '../../lib/database.types';

type Job = Database['public']['Tables']['jobs']['Row'];

interface JobCardProps {
  job: Job;
  onViewDetails: (job: Job) => void;
}

export const JobCard = ({ job, onViewDetails }: JobCardProps) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.job_type)}`}>
                {getJobTypeLabel(job.job_type)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      {(job.salary_min || job.salary_max) && (
        <div className="flex items-center text-gray-700 font-medium mb-4">
          <DollarSign className="w-5 h-5 mr-1 text-green-600" />
          {job.salary_min && job.salary_max
            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
            : job.salary_min
            ? `From $${job.salary_min.toLocaleString()}`
            : `Up to $${job.salary_max?.toLocaleString()}`}
        </div>
      )}

      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => onViewDetails(job)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        View Details
      </button>
    </div>
  );
};
