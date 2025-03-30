import { Howl } from 'howler';

export const sounds = new Howl({
  src: ['sound-sprites-3.mp3'],
  sprite: {
    sprayShake: [4104, 2058],
    spraying: [829, 216],
    reload: [15339, 1351],
    shoot1: [9139, 146],
    shoot2: [11587, 126],
    shoot3: [11789, 91]
  }
})