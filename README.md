# Bitburner scripts

These are my bitburner scripts made using viteburner.

## Add React type

1. install react-type 

```bash
npm install @types/react
```

2. create a file named `global.d.ts` with 

```ts
import R from 'react';
declare global {
  const React: typeof R;
}
```

3. in `tsconfig.json`, under `"include"`, add `"global.d.ts"`
