import {
  http as mswHttp,
  delay,
  HttpResponse,
  type HttpResponseResolver,
  type RequestHandlerOptions,
} from 'msw';

export { delay, HttpResponse };

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const withBase = (path: string | RegExp): string | RegExp =>
  path instanceof RegExp ? path : `${BASE}${path}`;

const wrap =
  (
    method: (
      path: string | RegExp,
      resolver: HttpResponseResolver,
      options?: RequestHandlerOptions
    ) => ReturnType<typeof mswHttp.get>
  ) =>
  (
    path: string | RegExp,
    resolver: HttpResponseResolver,
    options?: RequestHandlerOptions
  ) =>
    method(withBase(path), resolver, options);

export const http = {
  get: wrap((p, r, o) => mswHttp.get(p, r, o)),
  post: wrap((p, r, o) => mswHttp.post(p, r, o)),
  put: wrap((p, r, o) => mswHttp.put(p, r, o)),
  patch: wrap((p, r, o) => mswHttp.patch(p, r, o)),
  delete: wrap((p, r, o) => mswHttp.delete(p, r, o)),
};
