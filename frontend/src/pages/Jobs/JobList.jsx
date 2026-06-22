import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ChevronRight, IndianRupee, MapPin, Search } from 'lucide-react';
import EmptyState from '../../components/Common/EmptyState';
import { SkeletonCard } from '../../components/Common/Loaders';
import { useGetJobs } from '../../hooks/useJobs';

const formatSalary = (salary) => {
  if (!salary) return 'Not disclosed';
  const num = Number(salary);
  if (Number.isNaN(num)) return salary;
  if (num >= 100000) return `${(num / 100000).toFixed(1)} Lacs PA`;
  return `${num.toLocaleString('en-IN')} PA`;
};

const JobList = () => {
  const { data: jobs, isLoading, error } = useGetJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(jobs?.map((j) => j.location).filter(Boolean) || [])];

  return (
    <div>
      {/* Hero search — Recruvo-style */}
      <section className="bg-gradient-to-r from-[#457eff] to-[#5b8fff] px-4 py-10 md:py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-white md:text-4xl">
            Find your dream job now
          </h1>
          <p className="mt-2 text-sm text-white/80 md:text-base">
            {jobs?.length || 0}+ jobs from top companies — apply with one click
          </p>

          <div className="mt-6 rounded-lg bg-white p-2 shadow-lg md:p-3">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex-1 flex items-center gap-2">
                <Search className="h-4 w-4 text-[#717b9e] shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter skills / designations / companies"
                  className="field !h-11 !rounded !border-0 !bg-[#f8f9fa] !px-3.5"
                />
              </div>
              <div className="flex-1 md:max-w-[220px] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#717b9e] shrink-0" />
                <input
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Enter location"
                  className="field !h-11 !rounded !border-0 !bg-[#f8f9fa] !px-3.5"
                />
              </div>
              <button type="button" className="btn-primary !h-11 !rounded !px-8">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Filters sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="data-card sticky top-[72px] space-y-4">
              <h3 className="text-sm font-semibold text-[#121224]">Filter jobs by</h3>
              <div>
                <p className="mb-2 text-xs font-medium text-[#717b9e]">Location</p>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => setLocationFilter('')}
                    className={`block w-full rounded px-2 py-1.5 text-left text-sm ${!locationFilter ? 'bg-[#eef3ff] font-medium text-[#457eff]' : 'text-[#474d6a] hover:bg-gray-50'}`}
                  >
                    All locations
                  </button>
                  {locations.slice(0, 8).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setLocationFilter(loc)}
                      className={`block w-full rounded px-2 py-1.5 text-left text-sm ${locationFilter === loc ? 'bg-[#eef3ff] font-medium text-[#457eff]' : 'text-[#474d6a] hover:bg-gray-50'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Job listings */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#121224]">
                {filteredJobs?.length || 0} Jobs Found
              </h2>
              {(searchQuery || locationFilter) && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setLocationFilter(''); }}
                  className="text-sm text-[#457eff] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : error ? (
              <EmptyState
                title="Unable to load jobs"
                description="Please check your connection and try again."
                icon={Briefcase}
              />
            ) : filteredJobs?.length === 0 ? (
              <EmptyState
                title="No jobs found"
                description={searchQuery || locationFilter ? 'Try different keywords or remove filters.' : 'New jobs will appear here once recruiters post them.'}
                icon={Briefcase}
              />
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="job-card group block">
                    <div className="flex gap-4">
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded border border-[#e8e8e8] bg-[#f8f9fa] text-lg font-bold text-[#457eff] sm:flex">
                        {job.title.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-base font-semibold text-[#121224] group-hover:text-[#457eff] md:text-lg">
                              {job.title}
                            </h3>
                            <p className="mt-0.5 text-sm text-[#717b9e]">Company · Hiring now</p>
                          </div>
                          <span className="soft-pill shrink-0 bg-[#edf7ed] text-[#47b749]">Open</span>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#474d6a]">
                          {job.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-[#717b9e]" />
                              {job.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5 text-[#717b9e]" />
                            {formatSalary(job.salary)}
                          </span>
                        </div>

                        <p className="mt-2 line-clamp-2 text-sm text-[#717b9e]">{job.description}</p>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-[#717b9e]">Posted recently</span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-[#457eff] opacity-0 transition-opacity group-hover:opacity-100">
                            View & Apply
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
