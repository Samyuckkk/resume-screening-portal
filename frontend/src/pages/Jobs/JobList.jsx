import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetJobs } from '../../hooks/useJobs';
import { SkeletonCard } from '../../components/Common/Loaders';
import EmptyState from '../../components/Common/EmptyState';
import { Search, MapPin, DollarSign, Briefcase, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const JobList = () => {
  const { data: jobs, isLoading, error } = useGetJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Available Careers
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Discover roles suited for your skills and career trajectory.
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 glass rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by job title, description, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
          />
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by location (e.g. Remote, New York)..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Job Grid / List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 p-6 glass rounded-2xl border border-rose-200 dark:border-rose-900/30">
          <p className="text-rose-600 dark:text-rose-400 font-semibold">Error loading jobs. Please check the backend connection.</p>
        </div>
      ) : filteredJobs?.length === 0 ? (
        <EmptyState
          title="No Jobs Found"
          description={
            searchQuery || locationFilter
              ? "We couldn't find any jobs matching your search parameters. Try adjusting your queries!"
              : 'There are currently no job postings available. Check back soon!'
          }
          icon={Briefcase}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              {/* Top border decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Full-time
                  </span>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850 flex flex-col gap-2">
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.salary || 'Competitive'}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-end">
                  <Link
                    to={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
