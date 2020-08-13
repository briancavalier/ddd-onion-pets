import accepts from 'accepts'
import fastify from 'fastify'

import { getPetsNear, IPAddress } from '../../application/pets'
import { Location } from '../../domain/model'
import { http } from '../../infrastructure/http-node'
import { getLocation } from '../../infrastructure/ipstack'
import { getPets, PetfinderAuth } from '../../infrastructure/petfinder'
import { showAdoptablePets } from '../../presentation/adoptablePets'

const petfinderAuth: PetfinderAuth = {
  client_id: process.env.PETFINDER_ID ?? '',
  client_secret: process.env.PETFINDER_SECRET ?? '',
  grant_type: 'client_credentials'
}

const ipstackKey = process.env.IPSTACK_KEY ?? ''

const env = {
  getLocation,
  getPets,
  http,
  petfinderAuth,
  ipstackKey,
}

type Query = { lat?: string, lon?: string, r?: string }

const parseUserInfo = (q: Query, ip: string): Location | IPAddress => {
  const latitude = Number(q.lat)
  const longitude = Number(q.lon)
  return latitude && longitude
    ? { latitude, longitude, radiusMiles: Number(q.r) || 25 }
    : ip as IPAddress
}

fastify({ logger: true })
  .get<{ Querystring: Query }>('/', async (req, rep) => {
    const a = await getPetsNear(env, parseUserInfo(req.query, req.ip))

    accepts(req.raw).types(['html'])
      ? rep.header('content-type', 'text/html;charset=utf-8').send(showAdoptablePets(a))
      : rep.header('content-type', 'application/json').send(a)
  })
  .listen(3000).then(x => console.log(`Ready: ${x}`))
