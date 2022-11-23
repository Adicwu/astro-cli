import Carousel from '@comps/Carousel'
import React from 'react'

const imgs = [
  'https://api.adicw.cn/images/StudyImg/20200413114835.jpg',
  'https://api.adicw.cn/images/StudyImg/20190804113325.jpg',
  'https://api.adicw.cn/images/StudyImg/6045ae7a6871d.jpg',
  'https://api.adicw.cn/images/StudyImg/601b8b9320113.jpg',
  'https://api.adicw.cn/images/StudyImg/62f89c001df61.png'
]
const xx: React.FC = () => {
  return (
    <Carousel>
      {imgs.map((pic, i) => (
        <Carousel.Item key={i}>
          <img
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            src={pic}
            alt=""
          />
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
export default xx
