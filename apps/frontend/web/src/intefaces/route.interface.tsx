export interface IRoute {
  path?: string
  index?: boolean
  element: React.ReactElement
  handle: {
    title: string
    mainNav: boolean
  }
}
