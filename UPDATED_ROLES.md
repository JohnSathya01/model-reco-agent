# Updated User Roles

## Role Structure

The authentication system has been updated to reflect the correct organizational roles:

### 1. Specialisation Head / Admin
**Email**: `admin@test.com`  
**Password**: `admin123`  
**Access Level**: Full system access

**Permissions**:
- ✅ Full access to all features
- ✅ User management
- ✅ Organization settings
- ✅ Create, edit, delete all recommendations
- ✅ View all recommendations across organization
- ✅ Code generator access
- ✅ API specifications
- ✅ Architecture design
- ✅ Cost management and budgets
- ✅ Export all data
- ✅ Analytics and reports

---

### 2. Engineer
**Email**: `engineer@test.com`  
**Password**: `engineer123`  
**Access Level**: Generate recommendations and access ML features

**Permissions**:
- ✅ Create and manage own recommendations
- ✅ Generate ML recommendations
- ✅ Access to all ML features (model selection, fine-tuning)
- ✅ Code generator access
- ✅ API specifications
- ✅ View own recommendations
- ✅ Export own recommendations
- ❌ View other users' recommendations
- ❌ User management
- ❌ Organization settings

**Note**: Engineers are automatically navigated to the recommendation generation screen upon login.

---

### 3. Solution Architect
### 3. Solution Architect
**Email**: `arch@test.com`  
**Password**: `arch123`  
**Access Level**: Architecture and deployment planning

**Permissions**:
- ✅ Create and manage own recommendations
- ✅ Full access to architecture generation
- ✅ Deployment planning
- ✅ Cost estimation and optimization
- ✅ Code generator access
- ✅ API specifications
- ✅ View team recommendations
- ✅ Export architecture diagrams and specifications
- ❌ User management
- ❌ Organization settings

---

### 4. Project Manager
### 4. Project Manager
**Email**: `pm@test.com`  
**Password**: `pm123`  
**Access Level**: View-only with cost tracking

**Permissions**:
- ✅ View team recommendations
- ✅ Cost estimation and budget tracking
- ✅ Timeline and resource planning
- ✅ Export cost reports
- ✅ Dashboard and analytics access
- ❌ Create or edit recommendations
- ❌ Code generation
- ❌ Architecture design
- ❌ User management

---

### 5. Viewer
**Email**: `viewer@test.com`  
**Password**: `viewer123`  
**Access Level**: Read-only access

**Permissions**:
- ✅ View assigned recommendations
- ✅ View dashboards and reports
- ❌ Create, edit, or delete recommendations
- ❌ Export data
- ❌ Code generation
- ❌ Cost management
- ❌ User management

---

## Removed Roles

The following roles have been removed from the system:

- ❌ **ML Engineer** - Replaced with "Engineer" role
- ❌ **Data Scientist** - No longer needed

---

## Permission Matrix

| Feature | Specialisation Head | Engineer | Solution Architect | Project Manager | Viewer |
|---------|-------------------|----------|-------------------|-----------------|--------|
| Create Recommendations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Own Recommendations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Delete Own Recommendations | ✅ | ✅ | ✅ | ❌ | ❌ |
| View All Recommendations | ✅ | Own Only | Team Only | Team Only | Assigned Only |
| Code Generator | ✅ | ✅ | ✅ | ❌ | ❌ |
| API Specifications | ✅ | ✅ | ✅ | ❌ | ❌ |
| Architecture Design | ✅ | ✅ | ✅ | View Only | View Only |
| Cost Estimation | ✅ | ✅ | ✅ | ✅ | View Only |
| Export Data | ✅ | ✅ | ✅ | Reports Only | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Organization Settings | ✅ | ❌ | ❌ | ❌ | ❌ |
| Analytics Dashboard | ✅ | Own Data | Team Data | Team Data | Assigned Only |

---

## Files Updated

1. **src/pages/LoginPage.tsx**
   - Updated dummy credentials to 4 roles
   - Updated demo credentials display

2. **src/contexts/AuthContext.tsx**
   - Updated User interface with correct role types

3. **AUTHENTICATION_GUIDE.md**
   - Updated demo credentials table
   - Updated dummy authentication logic section

---

## Testing

To test the updated roles:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Test each role:**
   - Login as Specialisation Head: `admin@test.com` / `admin123`
   - Login as Engineer: `engineer@test.com` / `engineer123` (navigates to recommendation screen)
   - Login as Solution Architect: `arch@test.com` / `arch123`
   - Login as Project Manager: `pm@test.com` / `pm123`
   - Login as Viewer: `viewer@test.com` / `viewer123`

3. **Verify:**
   - User name displays correctly in header
   - Role displays correctly (capitalized with spaces)
   - Logout works for all roles

---

## Next Steps

When implementing role-based feature access:

1. **Create Permission Hook**
   ```typescript
   // src/hooks/usePermissions.ts
   export const usePermissions = () => {
     const { user } = useAuth();
     
     return {
       canCreateRecommendations: ['admin', 'engineer', 'solution-architect'].includes(user?.role || ''),
       canEditRecommendations: ['admin', 'engineer', 'solution-architect'].includes(user?.role || ''),
       canAccessCodeGenerator: ['admin', 'engineer', 'solution-architect'].includes(user?.role || ''),
       canManageUsers: user?.role === 'admin',
       canViewCosts: ['admin', 'engineer', 'solution-architect', 'project-manager'].includes(user?.role || ''),
       canExportData: ['admin', 'engineer', 'solution-architect'].includes(user?.role || ''),
     };
   };
   ```

2. **Use in Components**
   ```typescript
   const { canAccessCodeGenerator } = usePermissions();
   
   {canAccessCodeGenerator && (
     <CodeGeneratorButton />
   )}
   ```

3. **Create RoleGuard Component**
   ```typescript
   <RoleGuard roles={['admin', 'engineer', 'solution-architect']}>
     <CodeGeneratorTab />
   </RoleGuard>
   ```

---

**Status**: ✅ Roles updated successfully  
**Build**: ✅ Passing  
**Ready for**: Backend integration and role-based feature access implementation
