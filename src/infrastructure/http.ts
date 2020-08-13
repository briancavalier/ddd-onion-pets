export type Headers = { [name: string]: string | string[] | undefined }

export type Request<A> = Get<A> | Post<A>
export type Get<A> = Req<A> & { method: 'GET' }
export type Post<A> = Req<A> & { method: 'POST', body: string }
export type Req<A> = { url: string, headers: Headers, _type?: A }

export type Response<A> = { statusCode?: number, headers: Headers, _type?: A } & AsyncIterable<string>

export type Http = <A>(r: Request<A>) => Promise<Response<A>>

export const readJson = async <A>(r: Response<A>, req: Request<A>): Promise<A> => {
  if (typeof r.statusCode !== 'number') {
    return Promise.reject(new Error(`HTTP Request failed: ${JSON.stringify(req)}`))
  }

  let d = ''
  for await (const s of r) d += s
  return r.statusCode >= 300 ? Promise.reject(new Error(`${JSON.stringify(req)}: ${d}`)) : JSON.parse(d)
}

export const getJson = async <A>(http: Http, url: string, headers: Headers = {}): Promise<A> => {
  const req: Get<A> = { method: 'GET', url, headers: { Accept: 'application/json', ...headers } }
  const r = await http(req)
  return readJson(r, req)
}

export const postJson = async <A>(http: Http, url: string, body: unknown, headers: Headers = {}): Promise<A> => {
  const req: Post<A> = {
    url, body: JSON.stringify(body), method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  }
  const r = await http(req)
  return readJson(r, req)
}
