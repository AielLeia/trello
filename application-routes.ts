export type Empty = Record<PropertyKey, never>;

export interface ApplicationRoutes {
  '/': Empty;

  '/sign-up': Empty;
  '/sign-in': Empty;

  '/organization/[organizationId]': {
    params: { organizationId: string };
  };
  '/organization/[organizationId]/activity': {
    params: { organizationId: string };
  };
  '/organization/[organizationId]/settings': {
    params: { organizationId: string };
  };
  '/organization/[organizationId]/billing': {
    params: { organizationId: string };
  };

  '/board/[boardId]': {
    params: { boardId: string };
  };

  '/api/cards/[cardId]': {
    params: { cardId: string };
  };
  '/api/cards/[cardId]/audit-logs': {
    params: { cardId: string };
  };

  '/select-org': Empty;
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
