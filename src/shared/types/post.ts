export type Person = {
  name: string
  handle: string
  initial: string
  tone: string
  verified?: boolean
}

export type Post = {
  id: number
  author: Person
  time: string
  copy: string
  topic: string
  media?: 'city' | 'tech'
  image?: string
  quote?: string
  comments: number
  replies: string[]
  reposts: number
  likes: number
}

export type Profile = Person & { bio: string; location: string }
export type PostAction = 'like' | 'save' | 'repost'
