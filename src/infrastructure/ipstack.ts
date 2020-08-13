import { GetLocation, IPAddress, Location } from '../domain/model'
import { getJson, Http } from './http'

export type IPStackResponse =
  | { latitude: null, longitude: null, city: null }
  | Location

export const createGetLocation = (http: Http, ipstackKey: string): GetLocation<IPAddress, Location | null> => ({
  async getLocation(ip: IPAddress): Promise<Location | null> {
    const l = await getJson<IPStackResponse>(http, `http://api.ipstack.com/${ip}?access_key=${ipstackKey}`)
    return l.latitude === null ? null : l
  }
})
