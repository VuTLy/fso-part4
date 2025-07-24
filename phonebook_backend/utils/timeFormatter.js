/**
 * Returns the local time formatted as:
 * "Mon, July 21, 2025, 17:42:10 GMT-0700 (Pacific Daylight Time)"
 * Automatically uses the machine's local time zone and locale.
 */
function getFormattedLocalTime(date = new Date()) {
  // Format date using system's default locale and time zone
  const dateStr = date.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // Calculate GMT offset
  const tzOffsetMinutes = date.getTimezoneOffset()
  const offsetHours = String(Math.abs(Math.floor(tzOffsetMinutes / 60))).padStart(2, '0')
  const offsetMinutes = String(Math.abs(tzOffsetMinutes % 60)).padStart(2, '0')
  const gmtSign = tzOffsetMinutes <= 0 ? '+' : '-'
  const gmtOffset = `GMT${gmtSign}${offsetHours}${offsetMinutes}`

  // Get local time zone name (e.g., "Pacific Daylight Time")
  const timeZoneName = new Intl.DateTimeFormat(undefined, { timeZoneName: 'long' })
    .formatToParts(date)
    .find(part => part.type === 'timeZoneName')?.value || ''

  return `${dateStr} ${gmtOffset} (${timeZoneName})`
}

module.exports = getFormattedLocalTime