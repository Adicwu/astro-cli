import React, { CSSProperties, useMemo } from 'react'
import './index.less'

const Image: React.FC<{
  src?: string
  aspectRratio?: number
}> = ({ src = '', aspectRratio = 16 / 9 } = {}) => {
  const selfStyle = useMemo<CSSProperties>(
    () => ({
      paddingTop: `${(100 / aspectRratio).toFixed(2)}%`
    }),
    [aspectRratio]
  )
  return (
    <div className="aw-image" style={selfStyle}>
      <img src={src} alt="" />
    </div>
  )
}

export default React.memo(Image, () => false)
