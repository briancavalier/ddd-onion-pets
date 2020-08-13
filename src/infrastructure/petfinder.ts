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

export const createGetPets = (http: Http, auth: PetfinderAuth): GetPets<Location, readonly Pet[]> => ({
  async getPets(l: Location): Promise<readonly Pet[]> {
    const token = await petfinderAuth(http, auth)
    const { animals } = await petfinderPets(http, token, l)
    return animals.map(toPet)
  }
})

export const toPet = ({ name, url, photos }: Animal): Pet =>
  ({ name, url, photoUrl: photos[0]?.medium })

export const petfinderAuth = (http: Http, auth: PetfinderAuth): Promise<PetfinderToken> =>
  postJson<PetfinderToken>(http, 'https://api.petfinder.com/v2/oauth2/token', auth)

export const petfinderPets = (http: Http, { access_token }: PetfinderToken, l: Location): Promise<PetfinderPets> =>
  getJson<PetfinderPets>(http, `https://api.petfinder.com/v2/animals?location=${l.latitude},${l.longitude}&distance=10`, {
    Authorization: `Bearer ${access_token}`
  })
