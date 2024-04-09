import { ApplicationPath, Options, RouteObject } from '@/application-routes';

function generateNextRoute(route: RouteObject): string {
  let nextRoute = route.path;

  if (route.params) {
    Object.entries(route.params).forEach(([key, value]) => {
      nextRoute = nextRoute.replace(
        `[${key}]`,
        encodeURIComponent(String(value))
      );
    });
  }

  if (route.options?.query) {
    const queryParams = new URLSearchParams(
      route.options.query as Record<string, string>
    );
    nextRoute += `?${queryParams.toString()}`;
  }

  if (route.options?.hash) {
    nextRoute += `#${route.options.hash}`;
  }

  return nextRoute;
}

export const route = <PathKey extends ApplicationPath>(
  path: PathKey,
  ...options: Options<PathKey> extends undefined
    ? [undefined?]
    : [Options<PathKey>]
) => {
  return generateNextRoute({
    path,
    ...options[0],
  } as RouteObject);
};
