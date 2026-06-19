import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ChevronRight, DollarSign, MapPin, Search } from 'lucide-react';
import EmptyState from '../../components/Common/EmptyState';
import { SkeletonCard } from '../../components/Common/Loaders';
import { PageHeader } from '../../components/Common/ui';
import { useGetJobs } from '../../hooks/useJobs';

const JobList = () => {
  const { data: jobs, isLoading, error } = useGetJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Career marketplace"
        title="Explore high-impact roles"
        description="Browse premium job opportunities, discover the right fit, and move from learning to placement with a cleaner application experience."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-card rounded-[2rem] p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Search roles</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Product design, data science, frontend..." className="field pl-11" />
          </div>
        </div>
        <div className="surface-card rounded-[2rem] p-4">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Preferred location</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} placeholder="Remote, Bangalore, New York..." className="field pl-11" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <EmptyState title="Unable to load jobs" description="The catalog could not be loaded right now. Please verify the backend connection and try again." icon={Briefcase} />
      ) : filteredJobs?.length === 0 ? (
        <EmptyState
          title="No matching roles found"
          description={searchQuery || locationFilter ? 'Try broadening your search or removing the location filter to discover more roles.' : 'New opportunities will appear here once they are published.'}
          icon={Briefcase}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <motion.article
              key={job.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="surface-card flex h-full flex-col justify-between rounded-[2rem] p-6"
            >
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Open role</p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-bold text-slate-900">{job.title}</h3>
                  </div>
                  <span className="soft-pill bg-emerald-50 text-emerald-700">Active</span>
                </div>
                <p className="line-clamp-3 text-sm leading-7 text-slate-500">{job.description}</p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Location</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{job.location}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">Compensation</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{job.salary || 'Competitive'}</p>
                  </div>
                </div>
                <Link to={`/jobs/${job.id}`} className="btn-primary w-full">
                  <span>View role details</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;

