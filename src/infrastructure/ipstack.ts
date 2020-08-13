import { IPAddress } from '../application/pets'
import { GetLocation, Location } from '../domain/model'
import { getJson, Http } from './http'

export type IPStackResponse =
  | { latitude: null, longitude: null, city: null }
  | Location

export type IPStackEnv = {
  http: Http,
  ipstackKey: string
}

export const getLocation = async (e: IPStackEnv, ip: IPAddress): Promise<Location | null> => {
  const l = await getJson<IPStackResponse>(e.http, `http://api.ipstack.com/${ip}?access_key=${e.ipstackKey}`)
  return l.latitude === null ? null : l
}
