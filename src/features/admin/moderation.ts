export function moderatePost(hidden: Record<number, string>, id: number, reason: string | null) {
  const next = { ...hidden }
  if (reason === null) delete next[id]
  else {
    const trimmed = reason.trim()
    if (trimmed.length < 5 || trimmed.length > 255) throw new Error('Lý do cần từ 5–255 ký tự.')
    next[id] = trimmed
  }
  return next
}
