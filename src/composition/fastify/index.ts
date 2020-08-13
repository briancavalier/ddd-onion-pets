import accepts from 'accepts'
import fastify from 'fastify'

import { getPetsNear } from '../../application/pets'
import { IPAddress, Location } from '../../domain/model'
import { http } from '../../infrastructure/http-node'
import { createGetLocation } from '../../infrastructure/ipstack'
import { createGetPets, PetfinderAuth } from '../../infrastructure/petfinder'
import { showAdoptablePets } from '../../presentation/adoptablePets'

const petfinderAuth: PetfinderAuth = {
  client_id: process.env.PETFINDER_ID ?? '',
  client_secret: process.env.PETFINDER_SECRET ?? '',
  grant_type: 'client_credentials'
}

const env = {
  ...createGetLocation(http, process.env.IPSTACK_KEY ?? ''),
  ...createGetPets(http, petfinderAuth)
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
