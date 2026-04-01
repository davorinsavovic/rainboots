// components/EmailCampaigns.jsx
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import './EmailCampaigns.css';

const EmailCampaigns = () => {
  const location = useLocation();

  return (
    <div className='email-campaigns-container'>
      <div className='email-campaigns-header'>
        <div className='header-content'>
          <h2 className='campaigns-title'>Email Campaigns</h2>
          <p className='campaigns-description'>
            Create, manage, and send targeted email campaigns to your leads
          </p>
        </div>
      </div>

      <div className='campaigns-tabs'>
        <NavLink
          to='/dashboard/email-campaigns/templates'
          className={({ isActive }) =>
            `campaigns-tab ${isActive ? 'active' : ''}`
          }
        >
          <span className='tab-icon'>✉️</span>
          <span className='tab-label'>Email Templates</span>
          <span className='tab-description'>Create and manage templates</span>
        </NavLink>

        <NavLink
          to='/dashboard/email-campaigns/send'
          className={({ isActive }) =>
            `campaigns-tab ${isActive ? 'active' : ''}`
          }
        >
          <span className='tab-icon'>📬</span>
          <span className='tab-label'>Send Campaign</span>
          <span className='tab-description'>Send to selected leads</span>
        </NavLink>
      </div>

      <div className='campaigns-content'>
        <Outlet />
      </div>
    </div>
  );
};

export default EmailCampaigns;
