import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { theme } from '../styles/theme';

// CSS styles to replace the style jsx
const styles = {
  profileMenu: {
    position: 'relative'
  },
  profileIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: theme.colors.primary.main,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  profileIconHover: {
    opacity: '0.9'
  },
  initial: {
    color: 'white',
    fontWeight: 500,
    fontSize: '1rem',
    textTransform: 'uppercase'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '0.5rem',
    background: 'white',
    borderRadius: theme.borderRadius.md,
    boxShadow: theme.shadows.lg,
    minWidth: '200px',
    zIndex: 1000
  },
  userInfo: {
    padding: '1rem',
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  name: {
    fontWeight: 600,
    color: theme.colors.text.primary
  },
  email: {
    fontSize: '0.9rem',
    color: theme.colors.text.secondary
  },
  role: {
    fontSize: '0.8rem',
    color: theme.colors.primary.main,
    fontWeight: 500,
    textTransform: 'uppercase'
  },
  menuItems: {
    padding: '0.5rem'
  },
  menuButton: {
    width: '100%',
    padding: '0.5rem 1rem',
    textAlign: 'left',
    background: 'none',
    border: 'none',
    borderRadius: theme.borderRadius.sm,
    cursor: 'pointer',
    color: theme.colors.text.primary,
    transition: 'background-color 0.2s'
  },
  menuButtonHover: {
    background: theme.colors.background.hover
  }
};

export default function ProfileMenu({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [iconHover, setIconHover] = useState(false);
  const [buttonHover, setButtonHover] = useState(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const displayName = user?.name || 'User';
  const displayEmail = user?.email || '';

  const handleLogout = async () => {
    try {
      setIsOpen(false); // Close the menu immediately for better UX
      
      // Show loading state if needed
      // setLoading(true);
      
      await logout();
      // No need for navigation here as AuthContext handles it
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally show an error message to the user
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div style={styles.profileMenu} className="profile-menu">
      <div 
        style={{
          ...styles.profileIcon,
          ...(iconHover ? styles.profileIconHover : {})
        }} 
        className="profile-icon" 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIconHover(true)}
        onMouseLeave={() => setIconHover(false)}
      >
        <span style={styles.initial} className="initial">{getInitials(displayName)[0]}</span>
      </div>
      
      {isOpen && (
        <div style={styles.dropdownMenu} className="dropdown-menu">
          <div style={styles.userInfo} className="user-info">
            <span style={styles.name} className="name">{displayName}</span>
            <span style={styles.email} className="email">{displayEmail}</span>
            <span style={styles.role} className="role">{userRole}</span>
          </div>
          <div style={styles.menuItems} className="menu-items">
            <button 
              style={{
                ...styles.menuButton,
                ...(buttonHover === 'profile' ? styles.menuButtonHover : {})
              }}
              onMouseEnter={() => setButtonHover('profile')}
              onMouseLeave={() => setButtonHover(null)}
              onClick={() => {
                setIsOpen(false);
                const role = userRole.toLowerCase();
                navigate(`/${role}/profile`);
              }}
            >
              View Profile
            </button>
            <button 
              style={{
                ...styles.menuButton,
                ...(buttonHover === 'logout' ? styles.menuButtonHover : {})
              }}
              onMouseEnter={() => setButtonHover('logout')}
              onMouseLeave={() => setButtonHover(null)}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 