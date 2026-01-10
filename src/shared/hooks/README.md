# Custom Hooks Documentation

## useAppDispatch

Typed version of `useDispatch` hook from React-Redux.

```typescript
import { useAppDispatch } from "@/shared/store";

const dispatch = useAppDispatch();
dispatch(loginUser({ email, password }));
```

## useAppSelector

Typed version of `useSelector` hook from React-Redux.

```typescript
import { useAppSelector } from "@/shared/store";

const { user, isLoading } = useAppSelector((state) => state.auth);
```

## Custom Hook Template

```typescript
import { useState, useEffect } from "react";

export function useCustomHook() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects here
  }, []);

  return { state, setState };
}
```
