import type { Linter } from "eslint";

declare module "@xborg/config/eslint.base" {
  export const config: Linter.Config[];
  export default config;
}

declare module "@xborg/config/eslint.library" {
  export const libraryConfig: Linter.Config[];
  export default libraryConfig;
}

declare module "@xborg/config/eslint.nestjs" {
  export const nestJsConfig: Linter.Config[];
  export default nestJsConfig;
}

declare module "@xborg/config/eslint.nextjs" {
  export const nextConfig: Linter.Config[];
  export default nextConfig;
}
