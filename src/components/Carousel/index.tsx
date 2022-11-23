import { useComponentLifecycle, useInterval, useRect } from '@/hooks/react'
import { assginClass } from '@/utils'
import React, {
  createContext,
  CSSProperties,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import './index.less'

interface CarouselCtxProps {
  rect: ReturnType<typeof useRect>[0]
  active: number
  childLength: number
  pushKey: (key: number) => Promise<number>
}

const CarouselCtx = createContext<CarouselCtxProps | null>(null)

const CarouselItem: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const carouselCtx = useContext(CarouselCtx)!
  const [index, setIndex] = useState(0)

  const computOffset = () => {
    const { w } = carouselCtx.rect
    if (carouselCtx.active === 0 && index === carouselCtx.childLength - 1) {
      return -w * carouselCtx.childLength
    }
    if (carouselCtx.active === carouselCtx.childLength - 1 && index === 0) {
      return w * carouselCtx.childLength
    }
    return 0
  }

  const selfStyle = useMemo<CSSProperties>(() => {
    return {
      width: `${carouselCtx.rect.w}px`,
      transform: `translateX(${computOffset()}px)`
    }
  }, [carouselCtx, index])
  const children = useMemo(() => props.children, [props.children])

  useComponentLifecycle({
    mounted() {
      carouselCtx!.pushKey(Math.random()).then(setIndex)
    }
  })

  return (
    <div className="carousel-item" style={selfStyle}>
      {children}
    </div>
  )
}

const Carousel: React.FC<{
  children: React.ReactNode[]
  autoplay?: boolean
  interval?: number
}> & {
  Item: typeof CarouselItem
} = (props) => {
  const { autoplay = true, interval = 3000 } = props
  const selfEl = useRef<HTMLDivElement>(null)
  const [selfRect] = useRect(selfEl)

  const [active, setActive] = useState(0)
  const [fakeActive, setFakeActive] = useState(0)
  const [itemKeys, setItemKeys] = useState<number[]>([])
  const [isTransition, setIsTransition] = useState(true)

  const childLength = useMemo(() => props.children.length, [props.children])
  const provider = useMemo<CarouselCtxProps>(
    () => ({
      rect: selfRect,
      active,
      childLength,
      pushKey: (key) =>
        new Promise((resolve) => {
          const i = itemKeys.indexOf(key)
          if (!!~i) {
            resolve(i)
          } else {
            setItemKeys((keys) => {
              const newKeys = [...keys, key]
              resolve(newKeys.length - 1)
              return newKeys
            })
          }
        })
    }),
    [selfRect, itemKeys, active, childLength]
  )
  const trackStyle = useMemo<CSSProperties>(
    () => ({
      width: `${selfRect.w * childLength}px`,
      transform: `translateX(${-fakeActive * selfRect.w}px)`
    }),
    [selfRect, fakeActive, childLength]
  )

  const finishOffset = () => {
    // todo 丑陋
    setTimeout(() => {
      setIsTransition(true)
    }, 50)
  }
  const manualCutover = (type: 'next' | 'prev') => {
    if (!~fakeActive) return
    autoplayHandler.clear()
    switch (type) {
      case 'next': {
        next()
        break
      }
      case 'prev': {
        prev()
        break
      }
    }
    autoplayHandler.start()
  }
  const next = () => {
    if (active + 1 >= childLength) {
      setFakeActive(childLength)
      setTimeout(() => {
        setIsTransition(false)
        setFakeActive(0)
        setActive(0)
        finishOffset()
      }, 500)
    } else {
      setActive(active + 1)
      setFakeActive(active + 1)
    }
  }
  const prev = () => {
    if (active - 1 < 0) {
      setFakeActive(-1)
      setTimeout(() => {
        setIsTransition(false)
        setFakeActive(childLength - 1)
        setActive(childLength - 1)
        finishOffset()
      }, 500)
    } else {
      setActive(active - 1)
      setFakeActive(active - 1)
    }
  }

  const autoplayHandler = useInterval(next, {
    delay: interval,
    autoplay
  })

  return (
    <div className="carousel" ref={selfEl}>
      <div
        className={assginClass('carousel-track', isTransition && 'transition')}
        style={trackStyle}
      >
        <CarouselCtx.Provider value={provider}>
          {props.children}
        </CarouselCtx.Provider>
      </div>
      <div className="carousel-indicators"></div>
      <div
        className="carousel-arrow left"
        onClick={manualCutover.bind(null, 'prev')}
      ></div>
      <div
        className="carousel-arrow right"
        onClick={manualCutover.bind(null, 'next')}
      ></div>
    </div>
  )
}

Carousel.Item = CarouselItem

export default Carousel
