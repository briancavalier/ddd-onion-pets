import { AdoptablePets, GetLocation, GetPets, Location, Pet } from '../domain/model'

export type IPAddress = string & { _type: 'IPAddress' }

export const isIPAddress = (x: unknown): x is IPAddress =>
  typeof x === 'string' && x.length > 0

export type Env<LocationEnv, PetsEnv> = LocationEnv & PetsEnv & {
  getLocation: GetLocation<LocationEnv, IPAddress, Location | null>,
  getPets: GetPets<PetsEnv, Location, readonly Pet[]>
}

export const getPetsNear = async <LocationEnv, PetsEnv>(e: Env<LocationEnv, PetsEnv>, x: IPAddress | Location): Promise<AdoptablePets<Location | null, readonly Pet[]>> => {
  const location = isIPAddress(x) ? await e.getLocation(e, x) : x
  return { location, pets: location === null ? [] : await e.getPets(e, location) }
}
