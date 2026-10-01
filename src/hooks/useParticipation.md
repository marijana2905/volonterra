# useParticipation Hook

A custom React Query hook for managing user participation in actions.

## Features

- ✅ Check participation status
- ✅ Create participation
- 🚧 Cancel participation (prepared for future implementation)
- ✅ Automatic cache invalidation
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications

## Usage

```tsx
import { useParticipation } from '@/hooks/useParticipation';

const MyComponent = ({ actionId }: { actionId: string }) => {
  const { isLoading, isParticipating, canParticipate, isSubmitting, participate, session } =
    useParticipation(actionId);

  if (isLoading) return <div>Loading...</div>;

  if (!session || session.data?.user.role !== 'VOLUNTEER') {
    return <div>Only volunteers can participate</div>;
  }

  if (isParticipating) {
    return <div>Already participating</div>;
  }

  return (
    <button onClick={() => participate()} disabled={isSubmitting}>
      {isSubmitting ? 'Joining...' : 'Join Action'}
    </button>
  );
};
```

## Return Values

### States

- `isLoading`: Boolean indicating if the participation status is being checked
- `isParticipating`: Boolean indicating if the user is already participating
- `canParticipate`: Boolean indicating if the user can participate (is volunteer & not
  participating)
- `canCancel`: Boolean indicating if the user can cancel participation
- `isSubmitting`: Boolean indicating if any mutation is in progress
- `session`: Current user session

### Data

- `participationData`: Raw participation check response

### Actions

- `participate()`: Function to create participation
- `cancelParticipation()`: Function to cancel participation (future feature)

### Advanced

- `participationQuery`: React Query query object for participation status
- `participationMutation`: React Query mutation object for creating participation
- `cancelParticipationMutation`: React Query mutation object for canceling participation
- `refetchParticipation()`: Function to manually refetch participation status
- `participationError`: Error from participation mutation
- `cancelError`: Error from cancel mutation

## Query Keys

The hook uses a query key factory for consistent cache management:

```tsx
import { participationKeys } from '@/hooks/useParticipation';

// Access query keys
participationKeys.all; // ['participation']
participationKeys.check(actionId, userId); // ['participation', 'check', actionId, userId]
participationKeys.byAction(actionId); // ['participation', 'byAction', actionId]
participationKeys.byUser(userId); // ['participation', 'byUser', userId]
```

## Future Enhancements

The hook is designed to be extensible. Future features can include:

1. **Cancel Participation**: Already structured for easy implementation
2. **Group Participation**: Can be extended to handle group participation
3. **Participation History**: Add queries for participation history
4. **Real-time Updates**: Add WebSocket integration for real-time updates
5. **Optimistic Updates**: Add optimistic updates for better UX

## Cache Management

The hook automatically invalidates related caches when mutations occur:

- Participation status for the specific action
- All participations for the action
- All participations for the user

This ensures data consistency across the application.
