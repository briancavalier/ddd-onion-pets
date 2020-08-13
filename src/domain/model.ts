export type Pet = {
  readonly name: string,
  readonly url: string,
  readonly photoUrl?: string
}

export type Location = {
  readonly longitude: number,
  readonly latitude: number,
  readonly radiusMiles: number
}

export type AdoptablePets<Location, Pets> = {
  readonly location: Location,
  readonly pets: Pets
}

export type GetPets<Env, Location, Pets> = (e: Env, l: Location) => Promise<Pets>

export type GetLocation<Env, UserInfo, Location> = (e: Env, u: UserInfo) => Promise<Location>
