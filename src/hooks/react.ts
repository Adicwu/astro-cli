import { debounce } from '@/utils'
import { useEffect, useRef, useState } from 'react'

export function useComponentLifecycle({
  mounted,
  unmounted
}: {
  mounted?: () => void
  unmounted?: () => void
}) {
  useEffect(() => {
    mounted?.()
    return () => {
      unmounted?.()
    }
  }, [])
}

export function useEventListener(
  type: string,
  cb: () => void,
  target?: HTMLElement
) {
  const getTarget = () => {
    return target || window
  }
  const listener = debounce(cb, 300)
  useComponentLifecycle({
    mounted() {
      getTarget()?.addEventListener(type, listener)
      cb()
    },
    unmounted() {
      getTarget()?.removeEventListener(type, listener)
    }
  })
}

export function useRect(target: React.RefObject<HTMLDivElement>) {
  const [rect, setRect] = useState({
    w: 0,
    h: 0
  })
  const resize = () => {
    const res = target.current?.getBoundingClientRect()
    if (!res) return
    setRect({
      w: res.width,
      h: res.height
    })
  }
  useEventListener('resize', resize)
  return [rect, resize] as const
}

export function useInterval(
  fn: () => void,
  { delay = 1000, autoplay = true } = {}
) {
  const ref = useRef<() => void>(() => {})
  const [timer, setTimer] = useState<number | null>(null)

  useEffect(() => {
    ref.current = fn
  })

  const start = () => {
    setTimer(
      setInterval(() => {
        ref.current()
      }, delay)
    )
  }
  const clear = () => {
    if (timer) {
      clearInterval(timer)
      setTimer(null)
    }
  }
  const reset = () => {
    clear()
    start()
  }

  useComponentLifecycle({
    mounted() {
      autoplay && start()
    },
    unmounted() {
      clear()
    }
  })

  return { start, clear, reset }
}
