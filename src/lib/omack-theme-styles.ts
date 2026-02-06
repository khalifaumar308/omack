/**
 * O'Mark Healthcare Theme System - Utility Styles
 * Provides consistent styling patterns for admin, student, and instructor pages
 */

export const omackThemeStyles = {
  // Page headers
  pageHeader: {
    title: {
      fontSize: '2.125rem',
      fontWeight: 700,
      color: 'var(--omack-text-primary)',
      marginBottom: '0.5rem',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      fontSize: '0.95rem',
      color: 'var(--omack-text-secondary)',
      fontWeight: 400,
      margin: '0.5rem 0 0 0'
    }
  },

  // Section headers
  sectionHeader: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--omack-text-primary)',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid var(--omack-border-light)',
    letterSpacing: '-0.3px'
  },

  // Button styles
  buttons: {
    primary: {
      background: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)',
      color: 'white',
      padding: 'var(--omack-spacing-md) var(--omack-spacing-xl)',
      borderRadius: 'var(--omack-radius-lg)',
      border: 'none',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: 'var(--omack-shadow-md)',
      letterSpacing: '-0.3px'
    },
    secondary: {
      background: 'var(--omack-bg-lighter)',
      color: 'var(--omack-primary)',
      padding: 'var(--omack-spacing-md) var(--omack-spacing-xl)',
      borderRadius: 'var(--omack-radius-lg)',
      border: '1.5px solid var(--omack-primary)',
      fontWeight: 600,
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  },

  // Card/Container styles
  card: {
    background: 'var(--omack-bg-white)',
    border: '1px solid var(--omack-border)',
    borderRadius: 'var(--omack-radius-xl)',
    padding: 'var(--omack-spacing-xl)',
    boxShadow: 'var(--omack-shadow)',
    transition: 'all 0.3s ease'
  },

  // Table styles
  table: {
    header: {
      background: 'linear-gradient(90deg, var(--omack-primary) 0%, var(--omack-primary-light) 100%)',
      color: 'white',
      fontWeight: 700,
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    row: {
      borderBottom: '1px solid var(--omack-border-light)',
      transition: 'background-color 0.2s ease'
    },
    rowHover: {
      backgroundColor: 'var(--omack-bg-lighter)'
    }
  },

  // Form elements
  input: {
    padding: 'var(--omack-spacing-md) var(--omack-spacing-lg)',
    border: '1.5px solid var(--omack-border)',
    borderRadius: 'var(--omack-radius-lg)',
    fontSize: '0.95rem',
    color: 'var(--omack-text-primary)',
    background: 'var(--omack-bg-white)',
    transition: 'all 0.3s ease'
  },

  label: {
    color: 'var(--omack-text-primary)',
    fontWeight: 600,
    fontSize: '0.9rem',
    display: 'block',
    marginBottom: 'var(--omack-spacing-sm)',
    letterSpacing: '-0.2px'
  },

  // Status badges
  badges: {
    success: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
      padding: '0.375rem 0.75rem',
      borderRadius: 'var(--omack-radius-md)',
      fontSize: '0.85rem',
      fontWeight: 600
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b',
      padding: '0.375rem 0.75rem',
      borderRadius: 'var(--omack-radius-md)',
      fontSize: '0.85rem',
      fontWeight: 600
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      padding: '0.375rem 0.75rem',
      borderRadius: 'var(--omack-radius-md)',
      fontSize: '0.85rem',
      fontWeight: 600
    },
    info: {
      background: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6',
      padding: '0.375rem 0.75rem',
      borderRadius: 'var(--omack-radius-md)',
      fontSize: '0.85rem',
      fontWeight: 600
    }
  },

  // Alert/notification styles
  alerts: {
    success: {
      background: 'rgba(16, 185, 129, 0.05)',
      borderLeft: '4px solid #10b981',
      color: '#10b981',
      padding: 'var(--omack-spacing-lg)',
      borderRadius: 'var(--omack-radius-lg)',
      marginBottom: 'var(--omack-spacing-lg)'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.05)',
      borderLeft: '4px solid #ef4444',
      color: '#ef4444',
      padding: 'var(--omack-spacing-lg)',
      borderRadius: 'var(--omack-radius-lg)',
      marginBottom: 'var(--omack-spacing-lg)'
    },
    warning: {
      background: 'rgba(245, 158, 11, 0.05)',
      borderLeft: '4px solid #f59e0b',
      color: '#f59e0b',
      padding: 'var(--omack-spacing-lg)',
      borderRadius: 'var(--omack-radius-lg)',
      marginBottom: 'var(--omack-spacing-lg)'
    }
  },

  // Colors for consistent use
  colors: {
    primary: '#165c4b',
    primaryLight: '#1e9a6f',
    primaryDark: '#0d3d32',
    accent: '#00a86b',
    accentLight: '#26d68a',
    blue: '#1e5a8e',
    blueLight: '#3b7fb5',
    textPrimary: '#2c3e50',
    textSecondary: '#5a6c7d',
    textLight: '#7a8fa3',
    bgWhite: '#ffffff',
    bgLight: '#f8fafb',
    bgLighter: '#f1f5f7',
    border: '#e0e7f1',
    borderLight: '#ecf0f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },

  // Gradient combinations
  gradients: {
    primary: 'linear-gradient(135deg, #165c4b 0%, #1e9a6f 100%)',
    primaryAlt: 'linear-gradient(135deg, #0d3d32 0%, #165c4b 100%)',
    accent: 'linear-gradient(135deg, #00a86b 0%, #26d68a 100%)',
    blue: 'linear-gradient(135deg, #1e5a8e 0%, #3b7fb5 100%)',
    warm: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
  }
};

// Helper function to apply page-level styling
export const getPageContainerStyle = () => ({
  maxWidth: '7xl',
  marginX: 'auto',
  padding: '1.5rem'
});

// Helper function to get section container style
export const getSectionContainerStyle = () => ({
  background: 'var(--omack-bg-white)',
  borderRadius: 'var(--omack-radius-xl)',
  padding: 'var(--omack-spacing-2xl)',
  marginBottom: 'var(--omack-spacing-xl)',
  boxShadow: 'var(--omack-shadow)',
  border: '1px solid var(--omack-border-light)'
});
