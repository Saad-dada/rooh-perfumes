export const TOTAL_HERO_FRAMES = 48
export const HERO_FRAME_FOLDERS = ['ashq', 'qalb', 'sifr'] as const

type HeroFramesByFolder = Record<string, HTMLImageElement[]>

const padFrame = (index: number) => String(index).padStart(3, '0')
const frameSrc = (frameFolder: string, frameIndex: number) =>
  `/frames/${frameFolder}/frame_${padFrame(frameIndex + 1)}.png`

let heroFramesCache: HeroFramesByFolder | null = null
let heroFramesPromise: Promise<HeroFramesByFolder> | null = null

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

export const getHeroFramesCache = () => heroFramesCache

export const preloadHeroFrames = async (): Promise<HeroFramesByFolder> => {
  if (heroFramesCache) {
    return heroFramesCache
  }

  if (heroFramesPromise) {
    return heroFramesPromise
  }

  heroFramesPromise = (async () => {
    const loadedByFolder: HeroFramesByFolder = {}

    for (const folder of HERO_FRAME_FOLDERS) {
      const tasks = Array.from({ length: TOTAL_HERO_FRAMES }, (_, index) =>
        loadImage(frameSrc(folder, index)),
      )
      loadedByFolder[folder] = await Promise.all(tasks)
    }

    heroFramesCache = loadedByFolder
    return loadedByFolder
  })()

  return heroFramesPromise
}
