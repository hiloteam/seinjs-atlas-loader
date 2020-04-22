/**
 * @File   : index.tsx
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 2018-6-8 15:52:44
 * @Description:
 */
import './base.scss';
import * as Sein from 'seinjs';
import 'seinjs-audio';

const particles = require('./assets/particles.atlas');

async function main() {
  const engine = new Sein.Engine();
  const game = new Sein.Game(
    'game',
    {
      canvas: document.getElementById('container') as HTMLCanvasElement,
      clearColor: new Sein.Color(0, .6, .9, 1),
      width: window.innerWidth,
      height: window.innerHeight
    }
  );
  engine.addGame(game);

  game.addWorld('main', Sein.GameModeActor, Sein.LevelScriptActor);

  await game.start();

  const camera = game.world.addActor('camera', Sein.PerspectiveCameraActor, {
    aspect: window.innerWidth / window.innerHeight,
    fov: 60,
    far: 1000,
    near: .01,
    position: new Sein.Vector3(-10, 0, 10)
  });
  camera.lookAt(new Sein.Vector3(0, 0, 0));

  const atlas = await game.resource.load<'Atlas'>({url: particles, type: 'Atlas', name: 'particles.atlas'})
  console.log(atlas);
}

main();
