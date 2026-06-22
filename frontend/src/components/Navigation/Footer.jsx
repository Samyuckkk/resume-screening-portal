import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="mt-auto border-t border-[#e8e8e8] bg-white">
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#457eff] text-xs font-extrabold text-white">
              R
            </div>
            <span className="text-base font-bold text-[#121224]">
              Recruvo
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#717b9e]">
            India&apos;s leading job portal for finding the right job and hiring the right talent.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#121224]">For Job Seekers</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#717b9e]">
            <li><Link to="/jobs" className="hover:text-[#457eff]">Browse Jobs</Link></li>
            <li><Link to="/register" className="hover:text-[#457eff]">Create Account</Link></li>
            <li><Link to="/candidate" className="hover:text-[#457eff]">My Recruvo</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#121224]">For Employers</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#717b9e]">
            <li><Link to="/recruiter/jobs/create" className="hover:text-[#457eff]">Post a Job</Link></li>
            <li><Link to="/recruiter" className="hover:text-[#457eff]">Recruiter Dashboard</Link></li>
            <li><Link to="/register" className="hover:text-[#457eff]">Register as Recruiter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#121224]">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#717b9e]">
            <li><Link to="/profile" className="hover:text-[#457eff]">My Profile</Link></li>
            <li><Link to="/login" className="hover:text-[#457eff]">Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-[#e8e8e8] pt-6 text-center text-xs text-[#717b9e]">
        &copy; {new Date().getFullYear()} Recruvo. All rights reserved. Built for resume screening &amp; recruitment.
      </div>
    </div>
  </footer>
);

export default Footer;
