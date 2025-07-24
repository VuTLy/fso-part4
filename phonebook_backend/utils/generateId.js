function generateUniqueId(items, max = 1_000_000_000) {
  let id
  do {
    id = String(Math.floor(Math.random() * max) + 1)
  } while (items.find(item => item.id === id))
  return id
}

module.exports = generateUniqueId