// Shared layout constants so the inline day separators (rendered inside the
// list) and the floating sticky day header (the DayAnimated overlay) hand off
// at exactly the same screen line. Keeping these in sync is what makes the
// Telegram-style "push" read as a single sticky header with no duplicate badge
// and no gap at the day boundary.

// Screen-Y (px from the top of the list) where a day header sticks and where
// the inline separator hands over to the floating header.
export const DAY_PIN_OFFSET = 10

// Vertical margin baked into the inline separator's relative-scroll math
// (see useRelativeScrolledPositionToBottomOfDay). rel = separatorScreenTop - DAY_MARGIN_TOP.
export const DAY_MARGIN_TOP = 5

// Px range over which the inline separator cross-fades around the pin line as
// the floating header takes over, to avoid a one-frame pop at the handoff.
export const DAY_HANDOFF_FADE = 6

// The separatorScreenTop value at which an inline separator's pill reaches the
// floating header's pinned pill position, so they hand off at the exact same
// spot. The inline pill sits `DAY_MARGIN_TOP` below its separatorScreenTop
// (Day's container marginTop); the floating header overrides that margin to 0,
// so its pinned pill sits `DAY_MARGIN_TOP` higher. They coincide at
// separatorScreenTop = DAY_PIN_OFFSET - DAY_MARGIN_TOP.
export const DAY_HANDOFF_OFFSET = DAY_PIN_OFFSET - DAY_MARGIN_TOP
