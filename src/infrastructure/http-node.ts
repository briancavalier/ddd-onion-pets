import { request as requestHttp } from 'http'
import { request as requestHttps } from 'https'
import { parse } from 'url'

import { Request, Response } from './http'

export const http = <A>(r: Request<A>): Promise<Response<A>> => {
  const req = { ...r, ...parse(r.url) }
  return new Promise(resolve => {
    const c = req.protocol === 'https:'
      ? requestHttps(req, resolve)
      : requestHttp(req, resolve)

    if (r.method === 'POST' && r.body) c.write(r.body)
    c.end()
  })
}
