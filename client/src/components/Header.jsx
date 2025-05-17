import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../images/logo.svg';
import '../styles/header.css'; // Make sure this CSS file exists

export default function Header({ page }) {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="header">
            <div className="header-content">
                <div className="logo-section">
                    <img src={Logo} alt="Logo" className="logo" />
                    <div className="titles">
                        <h2>Question Paper Generator</h2>
                        <h3>Faculty Dashboard</h3>
                    </div>
                </div>
                <div className="page-title">
                    {page && <h1>{page}</h1>}
                </div>
                {user && (
                    <ProfileMenu 
                        userRole={user.role} 
                    />
                )}
            </div>
        </div>
    );
}
