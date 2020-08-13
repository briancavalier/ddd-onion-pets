import { getPetsNear } from '../application/pets'
import { GetPets, Location, Pet } from '../domain/model'
import { getJson, Http, postJson, readJson } from './http'

export type PetfinderPets = {
  animals: readonly Animal[]
}

export type Animal = {
  name: string,
  url: string,
  photos: readonly Photo[]
}

export type Photo = {
  medium: string
}

export type PetfinderToken = {
  access_token: string
}

export type PetfinderAuth = {
  grant_type: 'client_credentials',
  client_id: string,
  client_secret: string
}

export type PetfinderEnv = {
  http: Http,
  petfinderAuth: PetfinderAuth
}

export const getPets = async (e: PetfinderEnv, l: Location): Promise<readonly Pet[]> => {
  const token = await petfinderAuth(e.http, e.petfinderAuth)
  const { animals } = await petfinderPets(e.http, token, l)
  return animals.map(toPet)
}

export const toPet = ({ name, url, photos }: Animal): Pet =>
  ({ name, url, photoUrl: photos[0]?.medium })

export const petfinderAuth = (http: Http, auth: PetfinderAuth): Promise<PetfinderToken> =>
  postJson<PetfinderToken>(http, 'https://api.petfinder.com/v2/oauth2/token', auth)

export const petfinderPets = (http: Http, { access_token }: PetfinderToken, l: Location): Promise<PetfinderPets> =>
  getJson<PetfinderPets>(http, `https://api.petfinder.com/v2/animals?location=${l.latitude},${l.longitude}&distance=10`, {
    Authorization: `Bearer ${access_token}`
  })
