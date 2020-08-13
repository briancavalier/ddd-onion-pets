import { AdoptablePets, Location, Pet } from '../domain/model'

export const showAdoptablePets = ({ location, pets }: AdoptablePets<Location | null, readonly Pet[]>): string => `<!doctype html>
  <head></head>
  <body>
    <form action="" method="GET">
      <input type="text" name="location" value="${location ?? ''}" />
      <button type="submit">Find Pets</button>
    </form>
    <ul>
      ${pets.map(p => `<li>${JSON.stringify(p)}</li>`)}
    </ul>
  </body>
`
