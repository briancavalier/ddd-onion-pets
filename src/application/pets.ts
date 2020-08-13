import {
  AdoptablePets, GetLocation, GetPets, IPAddress, isIPAddress, Location, Pet
} from '../domain/model'

export type Env = GetLocation<IPAddress | Location, Location | null> & GetPets<Location, readonly Pet[]>

export const getPetsNear = async ({ getLocation, getPets }: Env, x: IPAddress | Location): Promise<AdoptablePets<Location | null, readonly Pet[]>> => {
  const location = isIPAddress(x) ? await getLocation(x) : x
  return { location, pets: location === null ? [] : await getPets(location) }
}
