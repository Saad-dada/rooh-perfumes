export const TOTAL_HERO_FRAMES = 48
export const HERO_FRAME_FOLDERS = ['ashq', 'qalb', 'sifr'] as const

// Mobile loads every 2nd frame → 24 images per folder instead of 48 (~50% less data)
export const MOBILE_FRAME_STEP = 2
export const MOBILE_TOTAL_FRAMES = Math.ceil(TOTAL_HERO_FRAMES / MOBILE_FRAME_STEP) // 24

type HeroFramesByFolder = Record<string, HTMLImageElement[]>

const padFrame = (index: number) => String(index).padStart(3, '0')
const frameSrc = (frameFolder: string, frameIndex: number) =>
  `/frames/${frameFolder}/frame_${padFrame(frameIndex + 1)}.webp`

const folderCache: HeroFramesByFolder = {}
const folderPromises: Partial<Record<string, Promise<HTMLImageElement[]>>> = {}
let allFramesPromise: Promise<HeroFramesByFolder> | null = null

// ── Mobile-specific reduced-frame cache ──────────────────────────────────
const mobileFolderCache: HeroFramesByFolder = {}
const mobileFolderPromises: Partial<Record<string, Promise<HTMLImageElement[]>>> = {}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const img = new Image()
    img.src = src
    const done = () => resolve(img)

    if (img.decode) {
      void img.decode().then(done).catch(done)
    } else {
      img.onload = done
      img.onerror = done
    }
  })

const loadFolderImages = (folder: string): Promise<HTMLImageElement[]> => {
  if (folderPromises[folder]) return folderPromises[folder]!

  const promise = Promise.all(
    Array.from({ length: TOTAL_HERO_FRAMES }, (_, i) => loadImage(frameSrc(folder, i))),
  ).then((frames) => {
    folderCache[folder] = frames
    return frames
  })

  folderPromises[folder] = promise
  return promise
}

export const getHeroFramesCache = (): HeroFramesByFolder | null =>
  Object.keys(folderCache).length > 0 ? folderCache : null

export const getMobileFramesCache = (): HeroFramesByFolder | null =>
  Object.keys(mobileFolderCache).length > 0 ? mobileFolderCache : null

/** Loads a single folder's frames (full 48) — resolves as soon as that folder is ready. */
export const preloadHeroFolder = async (folder: string): Promise<HTMLImageElement[]> => {
  if (folderCache[folder]) return folderCache[folder]
  return loadFolderImages(folder)
}

/** Loads a single folder at mobile resolution (12 frames). Resolves fast. */
export const preloadHeroFolderMobile = (folder: string): Promise<HTMLImageElement[]> => {
  if (mobileFolderCache[folder]) return Promise.resolve(mobileFolderCache[folder])
  if (mobileFolderPromises[folder]) return mobileFolderPromises[folder]!

  const indices = Array.from({ length: MOBILE_TOTAL_FRAMES }, (_, i) => i * MOBILE_FRAME_STEP)
  const promise = Promise.all(indices.map((i) => loadImage(frameSrc(folder, i)))).then((frames) => {
    mobileFolderCache[folder] = frames
    mobileFolderPromises[folder] = undefined
    return frames
  })

  mobileFolderPromises[folder] = promise
  return promise
}

/** Loads all folders in parallel (full resolution). Resolves when every folder is ready. */
export const preloadHeroFrames = async (): Promise<HeroFramesByFolder> => {
  if (allFramesPromise) return allFramesPromise

  allFramesPromise = Promise.all(
    HERO_FRAME_FOLDERS.map((folder) => loadFolderImages(folder)),
  ).then(() => folderCache)

  return allFramesPromise
}

/** Loads all folders at mobile resolution in parallel. */
export const preloadHeroFramesMobile = async (): Promise<HeroFramesByFolder> => {
  await Promise.all(HERO_FRAME_FOLDERS.map((folder) => preloadHeroFolderMobile(folder)))
  return mobileFolderCache
}
