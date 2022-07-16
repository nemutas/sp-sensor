import * as THREE from 'three';
import { Assets } from '../../types/tcanvas';
import { sensorState } from '../store';
import { publicPath } from '../utils';
import planeFrag from './shader/planeFrag.glsl';
import planeVert from './shader/planeVert.glsl';
import { TCanvasBase } from './TCanvasBase';

export class TCanvas extends TCanvasBase {
	private material?: THREE.ShaderMaterial
	private targetTilt = new THREE.Vector2()

	private assets: Assets = {
		texture: { path: publicPath('/assets/texture.jpg') }
	}

	constructor(parentNode: ParentNode) {
		super(parentNode)

		this.loadAssets(this.assets).then(() => {
			this.setScene()
			this.setModel()
			this.setResizeCallback()
			this.animate(this.update)
		})
	}

	private setScene = () => {
		this.setOrthographicCamera(-1, 1, 1, -1, 0, 10)
		this.camera.position.z = 1
	}

	private setResizeCallback = () => {
		this.resizeCallback = () => {
			if (this.material) {
				const textureScale = this.calcTextureScale(this.assets.texture.data as THREE.Texture)
				this.material.uniforms.u_uvScale.value.set(textureScale.x, textureScale.y)
			}
		}
	}

	private calcTextureScale = (texture: THREE.Texture) => {
		const imageAspect = texture.image.width / texture.image.height
		const aspect = this.size.aspect
		return aspect < imageAspect ? { x: aspect / imageAspect, y: 1 } : { x: 1, y: imageAspect / aspect }
	}

	private setModel = () => {
		const texture = this.assets.texture.data as THREE.Texture
		texture.wrapS = THREE.MirroredRepeatWrapping
		texture.wrapT = THREE.MirroredRepeatWrapping
		const textureScale = this.calcTextureScale(texture)

		const geometry = new THREE.PlaneGeometry(2, 2)
		this.material = new THREE.ShaderMaterial({
			uniforms: {
				u_texture: { value: texture },
				u_uvScale: { value: new THREE.Vector2(textureScale.x, textureScale.y) },
				u_tilt: { value: new THREE.Vector2() }
			},
			vertexShader: planeVert,
			fragmentShader: planeFrag,
			side: THREE.DoubleSide
		})
		const mesh = new THREE.Mesh(geometry, this.material)
		this.scene.add(mesh)
	}

	private update = () => {
		// snsor angle constraints
		// https://developer.mozilla.org/ja/docs/Web/Events/Orientation_and_motion_data_explained
		const tiltX = sensorState.angle.y / (Math.PI / 2)
		const tiltY = (sensorState.angle.x - Math.PI / 4) / Math.PI
		this.targetTilt.set(tiltX, -tiltY)
		this.material!.uniforms.u_tilt.value.lerp(this.targetTilt, 0.1)
	}
}
