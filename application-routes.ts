export type Empty = Record<PropertyKey, never>;

export interface ApplicationRoutes {
  '/sign-up': Empty;
  '/sign-in': Empty;
  '/': Empty;
  '/salut': {
    params: { id: number };
  };
}

export type ApplicationPath = keyof ApplicationRoutes;
export type Options<PathKey extends ApplicationPath> = ParamsOption<PathKey>;
export type ParamsOption<PathKey extends ApplicationPath> =
  ApplicationRoutes[PathKey] extends Empty
    ? undefined
    : ApplicationRoutes[PathKey];

export type RouteParams = Record<string, object>;

export interface RouteOptions {
  query?: Record<string, string | number>;
  hash?: string;
}

export interface RouteObject {
  path: string;
  params?: RouteParams;
  options?: RouteOptions;
}
