import type { ScreenAssets } from './assets'
import type { ScreenId } from './ids'
import { W, type Ctx } from './paint'
import * as particular from './particular'
import * as professional from './professional'

export type { Painter } from './particular'
export { screensReady, type ScreenAssets } from './assets'
export { SCREEN_IDS, SCREEN_LABELS, type ScreenId } from './ids'

export const PAINTERS: Record<ScreenId, particular.Painter> = {
  welcome: particular.welcome,
  home: particular.home,
  chatAi: particular.chatAi,
  zone: particular.zone,
  urgency: particular.urgency,
  profile: particular.profile,
  proposal: particular.proposal,
  chat: particular.chat,
  payment: particular.payment,
  proRequests: professional.proRequests,
  proQuote: professional.proQuote,
  proAgenda: professional.proAgenda,
  proWallet: professional.proWallet,
}

/** Paints `id` scaled from its 390pt design width to the canvas width. */
export function paintScreen(ctx: Ctx, id: ScreenId, assets: ScreenAssets): void {
  const unit = ctx.canvas.width / W
  ctx.save()
  ctx.setTransform(unit, 0, 0, unit, 0, 0)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.textBaseline = 'alphabetic'
  PAINTERS[id](ctx, assets)
  ctx.restore()
}
