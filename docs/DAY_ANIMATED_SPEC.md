# DayAnimated (floating day header) - animation spec

How the Telegram-style sticky day header works in this library. Describes the
final implementation across `DayAnimated`, `Item` (inline separators),
`MessagesContainer`, and the shared `dayLayout` constants.

## 1. Reference behaviour (Telegram iOS, what we replicate)

The conversation is an inverted list (newest at the bottom). Each day has a
centered date pill. Two elements together read as one sticky header:

1. **Inline separator** - a pill at the top of each day's group, scrolls with the
   content like a normal row.
2. **Floating header** - while you scroll, the date of the *topmost visible day*
   sticks just under the nav bar.

Behaviour:

- **Scroll-gated visibility.** Hidden at rest. Fades in fast when scrolling
  starts, stays fully opaque for the *entire gesture* (drag + momentum, including
  slow drags and pauses), fades out shortly after motion fully stops.
- **Which date.** The day of the messages at the top of the viewport (the "stuck"
  day), pinned at a small offset under the nav bar.
- **Slide, not fade.** At a day boundary the date *slides*, it never cross-fades.
  - Scrolling into an **older** day (scroll up / toward top): the new (older) date
    **slides down from the top edge to the pin, pixel by pixel**, as the previous
    date slides down below it.
  - Scrolling into a **newer** day (scroll down / toward bottom): the newer date
    rises from below to the pin and the previous date is pushed up and off.
  - During the transition the two dates are **different**, separated by a margin,
    moving together. Never two of the same date; never a dip to 0; never a jump.
- **Top of history / "Load earlier".** At the very top the oldest day is stuck.
  Once the oldest day's own separator drops back below the pin (the "Load earlier"
  button scrolls in) nothing is stuck: the header hands the date back to the inline
  separator and hides - no duplicate over the loader. While actively loading, the
  header tucks above the top edge.

## 2. Structure & geometry

- Inverted `FlatList`. `daysPositions` (shared value) holds, per day, the cell's
  `{ y, height, createdAt }` measured via `onLayout`.
- Two elements in different view trees: inline separators (`AnimatedDayWrapper` in
  `Item`) and the floating overlay (`DayAnimated`).
- On-screen Y of a day separator's top edge (dp):
  `separatorScreenTop = (listHeight + scrolledY) - (day.y + day.height)`
- The inline pill renders `DAY_MARGIN_TOP` below `separatorScreenTop` (Day's
  container marginTop). The floating overlay overrides that margin to 0, so when it
  is pinned at `top = DAY_PIN_OFFSET` its pill lines up exactly with an inline
  separator whose `separatorScreenTop == DAY_PIN_OFFSET - DAY_MARGIN_TOP`. That
  shared line is **`DAY_HANDOFF_OFFSET = DAY_PIN_OFFSET - DAY_MARGIN_TOP`**.
  (Verified on device, all dp; the display-density factor cancels.)

## 3. Mechanics (final implementation)

### Stuck-day selection (`DayAnimated`, worklet)
- `daysPositionsArray` is sorted by **`createdAt` (newest first)**, NOT by measured
  `y`. `y` jitters while cells are (re)measured mid-scroll; sorting by date keeps
  the selection deterministic so it can't briefly jump to the wrong neighbour.
- The stuck day = the newest day whose `separatorScreenTop <= DAY_HANDOFF_OFFSET`.

### Position - the scroll-driven slide (`DayAnimated`, worklet)
- The floating header's `top` is positioned off the *next (newer)* day's separator:
  `top = min(DAY_PIN_OFFSET, nextSeparatorScreenTop + DAY_MARGIN_TOP - headerHeight - DAY_PUSH_GAP)`
- When the next separator is far below, `top = DAY_PIN_OFFSET` (pinned).
- As the next separator nears the pin the header slides with it, pixel by pixel:
  it slides **down from the top edge** as an older day takes over (scrolling up), or
  is **pushed up and off** as a newer day rises (scrolling down). `DAY_PUSH_GAP`
  keeps a margin between the outgoing and incoming pills.
- While `isLoading`, `top = -headerHeight` (tucked above the top).

### Handoff opacity - hard cutoffs (no fades)
The date stays solid (opacity 1) through the floating <-> inline handoff because
both sides hard-cut at the same pixel, rather than cross-fading:
- **Inline separator** (`Item`): `opacity = (belowHandoff || !headerShowsThisDay) ? 1 : 0`
  where `belowHandoff = separatorScreenTop > DAY_HANDOFF_OFFSET` and
  `headerShowsThisDay = floatingRenderedDate === this day's createdAt`.
- **Floating header `stuckGate`** (`DayAnimated`): `curSep <= DAY_HANDOFF_OFFSET ? 1 : 0`
  (hard hide when nothing is stuck - the top-of-history / loader case).

### Render gate - covering the JS-thread text lag
The header's date *text* is React state, updated via `runOnJS`, so it lags the
worklet by ~1 frame. Without handling, scrolling into a newer day flashes the old
date at the pin (the header takes over on-screen there; scrolling into an older day
it takes over off-screen, so the lag is invisible - hence the bug was top->bottom
only). Fix:
- `DayAnimated` publishes the date it is actually rendering to the
  `floatingRenderedDate` shared value (a `useEffect` on the rendered `createdAt`).
- Header `renderGate = sticky.createdAt === floatingRenderedDate ? 1 : 0` - the
  header is hidden for any frame where its text hasn't caught up.
- During that frame the inline separator stays up (`!headerShowsThisDay`) and shows
  the correct date. Net: header opacity = `fade * stuckGate * renderGate`.

### Visibility / fade (`DayAnimated` + `MessagesContainer`)
- Driven by an `isScrollActive` shared value set from the scroll handler's
  `onBeginDrag` / `onEndDrag` / `onMomentumBegin` / `onMomentumEnd` - NOT from
  per-scroll-delta idle timers. This keeps the header at full opacity for the whole
  gesture (slow drags and pauses included) instead of flickering out on a pause.
- `isScrollActive` true -> fade in (`FADE_IN_DURATION`), cancel pending fade-out.
  false -> schedule fade-out (`FADE_OUT_DELAY` then `FADE_OUT_DURATION`). A flick's
  momentum re-asserts `isScrollActive` via `onMomentumBegin` within the delay, so it
  stays visible through momentum.

## 4. Constants (`dayLayout.ts`)
- `DAY_PIN_OFFSET = 10` - resting top offset of the floating header.
- `DAY_MARGIN_TOP = 5` - Day container marginTop baked into the inline rel math.
- `DAY_HANDOFF_OFFSET = DAY_PIN_OFFSET - DAY_MARGIN_TOP` - the shared handoff line.
- `DAY_PUSH_GAP = 8` - margin kept between the two date pills during the slide.
- `DAY_HANDOFF_FADE = 10` - legacy; no longer used by the hard-cutoff handoff.

## 5. Debug switches (`DayAnimated`, all OFF/1 for production)
- `DEBUG_TIME_SCALE` - multiply fade durations/delay to capture fades frame-by-frame.
- `DEBUG_FORCE_OPACITY` - keep the header at full opacity to study geometry.
- `DEBUG_OVERLAY` - on-screen readout of `top / curSep / headerHeight / load`.

## 6. Verified edge cases (Android emulator, multi-day data + Load earlier)
- [x] Handoff between days, both directions: solid date, no dip, no duplicate, gap.
- [x] Scroll into newer day (top->bottom): no 1-frame wrong-date flash (render gate).
- [x] "Load earlier" at the top: no duplicate over the loader; tucks while loading;
      correct day after prepend.
- [x] At rest: header hidden (Telegram shows the date only while scrolling).
- [~] Fast fling across many days: during a very fast fling the header may stay
      hidden (render gate never settles) and the inline separators carry the dates;
      self-corrects as scrolling slows. Acceptable.
