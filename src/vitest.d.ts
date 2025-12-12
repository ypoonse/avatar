// Minimal Vitest-style globals to satisfy TS in this sandboxed environment.
declare const test: (
  name: string,
  fn: () => void | Promise<void>
) => void;
declare const it: typeof test;
declare const describe: typeof test;
declare const expect: (value: unknown) => any;

