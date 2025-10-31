# 🚨 TypeScript & Vercel Deployment Issues to Fix

## Common TypeScript Errors Found in Project

### 1. **Missing Type Imports**
Several files are missing proper type imports. Need to add:

```typescript
// In files using MoveRequest, MaintenanceTicket types
import type { MoveRequest, MaintenanceTicket, Comment } from '@/lib/types';
```

### 2. **Potential 'any' Type Issues**
- `handleActivityClick` function uses `any` type for activity parameter
- Should be: `(activity: ActivityItem) => void`

### 3. **Missing Return Types**
Some functions don't have explicit return types which can cause build issues:
- Component functions should return `JSX.Element` or `React.ReactElement`

### 4. **Optional Chaining Issues**
Make sure all optional properties are properly handled:
- `residentData?.name` - good
- `ticket.assignedTo` - needs null check

### 5. **ESLint Warnings to Fix**

#### a. React Hook Dependencies
```typescript
// Current (might cause warning)
useEffect(() => {
  loadData();
}, []); // Missing dependency

// Fixed
useEffect(() => {
  loadData();
}, [loadData]); // Include all dependencies
```

#### b. Unused Variables
Remove any unused imports or variables

### 6. **Vercel-Specific Issues**

#### a. Environment Variables
Create `.env.local` for local development and set in Vercel:
```env
NEXT_PUBLIC_API_URL=https://your-api.com
```

#### b. Build Output Size
Check that individual pages don't exceed 500KB

#### c. Dynamic Imports for Large Components
```typescript
// For large components, use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false // if client-only
});
```

### 7. **Specific Files to Check**

#### `/app/resident/page.tsx`
- Line ~85: `handleActivityClick` needs proper typing
- Comment interface might not be exported

#### `/app/resident/move-requests/page.tsx`
- Ensure all getMoveRequests promises are handled
- Check formatCurrency import

#### `/app/resident/maintenance/page.tsx`
- getPriorityColor might return undefined
- Status config needs null checks

### 8. **Package.json Scripts**
Add these for better Vercel deployment:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "vercel-build": "next build"
  }
}
```

### 9. **Missing Files Check**
Ensure these exist:
- ✅ `/public/favicon.ico`
- ✅ `/app/layout.tsx`
- ✅ `/app/page.tsx`
- ⚠️  `/app/favicon.ico` (might be missing)

### 10. **Quick Fixes Script**

Run these commands to fix common issues:

```bash
# 1. Clear cache
rm -rf .next node_modules/.cache

# 2. Reinstall dependencies
npm ci

# 3. Type check
npx tsc --noEmit

# 4. Build test
npm run build
```

## Immediate Actions Required:

1. **Fix TypeScript Strict Mode Issues**
   - All variables must be typed
   - No implicit any types
   - Null checks required

2. **Add Missing Type Definitions**
   ```typescript
   // Add to /lib/types.ts
   export interface Comment {
     id: string;
     ticketId: string;
     ticketType: 'maintenance' | 'move';
     author: 'resident' | 'fm' | 'system';
     authorName: string;
     message: string;
     timestamp: string;
     isRead: boolean;
   }
   ```

3. **Fix Build Warnings**
   - Remove unused imports
   - Add missing dependencies to useEffect
   - Type all function parameters

## Vercel Deployment Checklist:

- [ ] Run `npm run build` locally - must pass
- [ ] Check `.next` output directory size
- [ ] Ensure no console.log in production code
- [ ] Add error boundaries for pages
- [ ] Set up environment variables in Vercel
- [ ] Configure build command: `npm run build`
- [ ] Configure output directory: `.next`
- [ ] Set Node version: 18.x or 20.x

## Test Commands:
```bash
# Full production test
npm run build && npm run start

# Type checking only
npx tsc --noEmit

# Lint check
npm run lint
```
