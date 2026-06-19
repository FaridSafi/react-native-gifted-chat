import { DaysPositions } from '../types'

// Shared layout constants and math so the inline day separators (rendered inside
// the list) and the floating sticky day header (the DayAnimated overlay) hand off
// at exactly the same screen line. Keeping these in sync is what makes the
// Telegram-style sticky push read as a single header with no duplicate badge and
// no gap at the day boundary.

// Screen-Y (px from the top of the list) where a day header sticks and where the
// inline separator hands over to the floating header.
export const DAY_PIN_OFFSET = 10

// Vertical margin baked into the inline separator's pill position (Day's container
// marginTop). The inline pill renders this far below its separatorScreenTop.
export const DAY_MARGIN_TOP = 5

// Vertical gap kept between the outgoing floating header and the incoming
// separator's pill during the push, so the two dates don't touch.
export const DAY_PUSH_GAP = 8

// The separatorScreenTop value at which an inline separator's pill reaches the
// floating header's pinned pill. The inline pill sits DAY_MARGIN_TOP below its
// separatorScreenTop; the floating header overrides that margin to 0, so its
// pinned pill sits DAY_MARGIN_TOP higher. They coincide - and hand off - at
// separatorScreenTop = DAY_PIN_OFFSET - DAY_MARGIN_TOP.
export const DAY_HANDOFF_OFFSET = DAY_PIN_OFFSET - DAY_MARGIN_TOP

type DayPosition = DaysPositions[string]

// On-screen Y of a day separator's top edge. `scrolledTop` is `listHeight + scrolledY`.
// (Inverted list: a separator is above the pin when this is <= DAY_HANDOFF_OFFSET.)
export const dayPositionScreenTop = (scrolledTop: number, day: DayPosition) => {
  'worklet'

  return scrolledTop - (day.y + day.height)
}

// The measured position of the day with the given createdAt (ms), or undefined if
// that day hasn't been laid out yet.
export const findDayPosition = (positions: DaysPositions, createdAt: number): DayPosition | undefined => {
  'worklet'

  const values = Object.values(positions)
  for (let i = 0; i < values.length; i++)
    if (values[i].createdAt === createdAt)
      return values[i]

  return undefined
}
