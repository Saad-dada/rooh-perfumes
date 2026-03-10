export const TOTAL_HERO_FRAMES = 48
export const HERO_FRAME_FOLDERS = ['ashq', 'qalb', 'sifr'] as const

type HeroFramesByFolder = Record<string, HTMLImageElement[]>

const padFrame = (index: number) => String(index).padStart(3, '0')
const frameSrc = (frameFolder: string, frameIndex: number) =>
  `/frames/${frameFolder}/frame_${padFrame(frameIndex + 1)}.png`

const folderCache: HeroFramesByFolder = {}
const folderPromises: Partial<Record<string, Promise<HTMLImageElement[]>>> = {}
let allFramesPromise: Promise<HeroFramesByFolder> | null = null

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

/** Loads a single folder's frames — resolves as soon as that folder is ready. */
export const preloadHeroFolder = async (folder: string): Promise<HTMLImageElement[]> => {
  if (folderCache[folder]) return folderCache[folder]
  return loadFolderImages(folder)
}

/** Loads all folders in parallel. Resolves when every folder is ready. */
export const preloadHeroFrames = async (): Promise<HeroFramesByFolder> => {
  if (allFramesPromise) return allFramesPromise

  allFramesPromise = Promise.all(
    HERO_FRAME_FOLDERS.map((folder) => loadFolderImages(folder)),
  ).then(() => folderCache)

  return allFramesPromise
}
