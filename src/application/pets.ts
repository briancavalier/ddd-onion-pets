import { AdoptablePets, GetLocation, GetPets, Location, Pet } from '../domain/model'

export type IPAddress = string & { _type: 'IPAddress' }

export const isIPAddress = (x: unknown): x is IPAddress =>
  typeof x === 'string' && x.length > 0

export type Env = GetLocation<IPAddress, Location | null> & GetPets<Location, readonly Pet[]>

export const getPetsNear = async ({ getLocation, getPets }: Env, x: IPAddress | Location): Promise<AdoptablePets<Location | null, readonly Pet[]>> => {
  const location = isIPAddress(x) ? await getLocation(x) : x
  return { location, pets: location === null ? [] : await getPets(location) }
}
