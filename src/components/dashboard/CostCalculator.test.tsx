/**
 * Unit tests for CostCalculator component - Role-Based Access Control
 * Tests permission checks for different user roles and lock states
 * 
 * Requirements tested:
 * - 2.2: Solution Architect role can edit when unlocked
 * - 2.5: Non-Solution Architect users cannot edit after creation
 * - 3.2: Admin can edit even when locked
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CostCalculator } from './CostCalculator';
import * as AuthContext from '../../contexts/AuthContext';

// Mock the useAuth hook
const mockUseAuth = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  // Default mock implementation
  vi.spyOn(AuthContext, 'useAuth').mockImplementation(mockUseAuth);
});

// Helper to set up auth context with specific role
const setupAuthMock = (role: 'admin' | 'engineer' | 'solution-architect' | 'project-manager' | 'viewer') => {
  mockUseAuth.mockReturnValue({
    user: {
      email: 'test@example.com',
      name: 'Test User',
      role,
      isAuthenticated: true
    },
    loading: false,
    login: vi.fn(),
    logout: vi.fn(),
    setUser: vi.fn(),
    isAuthenticated: true
  });
};

describe('CostCalculator - Role-Based Access Control', () => {
  describe('Solution Architect Role', () => {
    it('should allow editing when not locked', () => {
      setupAuthMock('solution-architect');
      
      const { container } = render(<CostCalculator isLocked={false} />);
      
      // Check that inputs are not disabled
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
      
      // Check for "You can edit" indicator
      expect(screen.getByText('You can edit')).toBeInTheDocument();
    });

    it('should prevent editing when locked', () => {
      setupAuthMock('solution-architect');
      
      const { container } = render(<CostCalculator isLocked={true} />);
      
      // Check that inputs are disabled
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
      
      // Check for read-only indicator
      expect(screen.getByText('Read Only')).toBeInTheDocument();
      expect(screen.getByText('Cost Calculator Locked')).toBeInTheDocument();
    });
  });

  describe('Admin Role', () => {
    it('should allow editing even when locked', () => {
      setupAuthMock('admin');
      
      const { container } = render(<CostCalculator isLocked={true} />);
      
      // Admin should be able to edit even when locked
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
    });

    it('should allow editing when not locked', () => {
      setupAuthMock('admin');
      
      const { container } = render(<CostCalculator isLocked={false} />);
      
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
    });
  });

  describe('Project Manager Role', () => {
    it('should prevent editing regardless of lock status', () => {
      setupAuthMock('project-manager');
      
      const { container } = render(<CostCalculator isLocked={false} />);
      
      // Check that inputs are disabled
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
      
      // Check for read-only indicator
      expect(screen.getByText('Read Only')).toBeInTheDocument();
      // Use getAllByText since the text appears in both tooltip and banner
      const messages = screen.getAllByText(/Only Solution Architects and Administrators can edit/);
      expect(messages.length).toBeGreaterThan(0);
    });
  });

  describe('Viewer Role', () => {
    it('should prevent editing regardless of lock status', () => {
      setupAuthMock('viewer');
      
      const { container } = render(<CostCalculator isLocked={false} />);
      
      // Check that inputs are disabled
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
      
      // Check for read-only indicator
      expect(screen.getByText('Read Only')).toBeInTheDocument();
    });
  });

  describe('Engineer Role', () => {
    it('should prevent editing regardless of lock status', () => {
      setupAuthMock('engineer');
      
      const { container } = render(<CostCalculator isLocked={false} />);
      
      // Check that inputs are disabled
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
      
      // Check for read-only indicator
      expect(screen.getByText('Read Only')).toBeInTheDocument();
    });
  });

  describe('Visual Indicators', () => {
    it('should display lock status with details when locked', () => {
      setupAuthMock('solution-architect');
      
      const lockStatus = {
        isLocked: true,
        lockedAt: new Date('2024-01-15'),
        lockedBy: 'admin@example.com'
      };
      
      render(<CostCalculator isLocked={true} lockStatus={lockStatus} />);
      
      expect(screen.getByText('Cost Calculator Locked')).toBeInTheDocument();
      // Use getAllByText since the text appears in both tooltip and banner
      const messages = screen.getAllByText(/locked by admin@example.com/);
      expect(messages.length).toBeGreaterThan(0);
    });

    it('should show read-only banner for non-editable users', () => {
      setupAuthMock('viewer');
      
      render(<CostCalculator isLocked={false} />);
      
      expect(screen.getByText('View Only Mode')).toBeInTheDocument();
    });
  });

  describe('Lock Status Integration', () => {
    it('should respect lockStatus prop over isLocked prop', () => {
      setupAuthMock('solution-architect');
      
      const lockStatus = {
        isLocked: true,
        lockedAt: new Date('2024-01-15'),
        lockedBy: 'admin@example.com'
      };
      
      const { container } = render(<CostCalculator isLocked={false} lockStatus={lockStatus} />);
      
      // Should be locked because lockStatus.isLocked is true
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
    });
  });

  describe('All Input Types', () => {
    it('should disable all input types (range, select, checkbox) for unauthorized users', () => {
      setupAuthMock('viewer');
      
      const { container } = render(<CostCalculator isLocked={false} />);
      
      // Check range inputs
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
      
      // Check select inputs
      const selectInputs = container.querySelectorAll('select');
      expect(selectInputs.length).toBeGreaterThan(0);
      selectInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
      
      // Check checkbox inputs
      const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxInputs.length).toBeGreaterThan(0);
      checkboxInputs.forEach(input => {
        expect(input).toBeDisabled();
      });
    });

    it('should enable all input types for Solution Architect when not locked', () => {
      setupAuthMock('solution-architect');
      
      const { container } = render(<CostCalculator isLocked={false} />);
      
      // Check range inputs
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
      
      // Check select inputs
      const selectInputs = container.querySelectorAll('select');
      expect(selectInputs.length).toBeGreaterThan(0);
      selectInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
      
      // Check checkbox inputs
      const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxInputs.length).toBeGreaterThan(0);
      checkboxInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
    });

    it('should enable all input types for Admin even when locked', () => {
      setupAuthMock('admin');
      
      const { container } = render(<CostCalculator isLocked={true} />);
      
      // Check range inputs
      const rangeInputs = container.querySelectorAll('input[type="range"]');
      expect(rangeInputs.length).toBeGreaterThan(0);
      rangeInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
      
      // Check select inputs
      const selectInputs = container.querySelectorAll('select');
      expect(selectInputs.length).toBeGreaterThan(0);
      selectInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
      
      // Check checkbox inputs
      const checkboxInputs = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxInputs.length).toBeGreaterThan(0);
      checkboxInputs.forEach(input => {
        expect(input).not.toBeDisabled();
      });
    });
  });

  describe('Permission Logic Validation', () => {
    it('should correctly implement canEdit logic for all role combinations', () => {
      // Test matrix of role + lock status combinations
      const testCases = [
        { role: 'admin' as const, isLocked: false, expected: true },
        { role: 'admin' as const, isLocked: true, expected: true },
        { role: 'solution-architect' as const, isLocked: false, expected: true },
        { role: 'solution-architect' as const, isLocked: true, expected: false },
        { role: 'project-manager' as const, isLocked: false, expected: false },
        { role: 'project-manager' as const, isLocked: true, expected: false },
        { role: 'viewer' as const, isLocked: false, expected: false },
        { role: 'viewer' as const, isLocked: true, expected: false },
        { role: 'engineer' as const, isLocked: false, expected: false },
        { role: 'engineer' as const, isLocked: true, expected: false },
      ];

      testCases.forEach(({ role, isLocked, expected }) => {
        setupAuthMock(role);
        const { container } = render(<CostCalculator isLocked={isLocked} />);
        
        const rangeInputs = container.querySelectorAll('input[type="range"]');
        expect(rangeInputs.length).toBeGreaterThan(0);
        
        rangeInputs.forEach(input => {
          if (expected) {
            expect(input).not.toBeDisabled();
          } else {
            expect(input).toBeDisabled();
          }
        });
      });
    });
  });
});
