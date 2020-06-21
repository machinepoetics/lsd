import React, { useEffect } from 'react'
import { Box } from 'rebass'

const constraints = {
  audio: true,
  video: true
}

const hasGetUserMedia = () =>
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)


export const Video = () => {

  useEffect(() => {
    const video = document.querySelector('video')

    navigator.mediaDevices.getUserMedia(constraints).
      then((stream) => {
        if (video) {
          video.srcObject = stream
        }
      })
  }, [])

  return <Box>
    <video autoPlay />
  </Box>

}