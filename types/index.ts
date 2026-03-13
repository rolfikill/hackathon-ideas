export interface Idea {
  id: string
  title: string
  description: string
  category: string | null
  user_id: string
  created_at: string
  vote_count?: number
  comment_count?: number
  user_has_voted?: boolean
}

export interface Vote {
  id: string
  idea_id: string
  user_id: string
  created_at: string
}

export interface Comment {
  id: string
  idea_id: string
  user_id: string
  content: string
  created_at: string
}
