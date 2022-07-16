import * as THREE from 'three';
import { Assets } from '../../types/tcanvas';
import { sensorState } from '../store';
import { publicPath } from '../utils';
import planeFrag from './shader/planeFrag.glsl';
import planeVert from './shader/planeVert.glsl';
import { TCanvasBase } from './TCanvasBase';

export class TCanvas extends TCanvasBase {
	private mesh?: THREE.Mesh

	private assets: Assets = {
		background: { encoding: true, path: publicPath('/assets/background.jpg') }
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
		this.camera.position.z = 2
		this.setOrbitControls()
		this.scene.background = this.coveredBackgroundTexture(this.assets.background.data as THREE.Texture)
	}

	private scaleMesh = () => {
		let scale = this.size.width / 750
		scale = Math.min(1, scale)
		this.mesh && this.mesh.scale.set(scale, scale, 1)
	}

	private setResizeCallback = () => {
		this.resizeCallback = () => {
			this.coveredBackgroundTexture(this.assets.background.data as THREE.Texture)
			this.scaleMesh()
		}
	}

	private setModel = () => {
		const geometry = new THREE.PlaneGeometry()
		const material = new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: planeVert,
			fragmentShader: planeFrag,
			side: THREE.DoubleSide
		})
		this.mesh = new THREE.Mesh(geometry, material)
		this.scaleMesh()
		this.scene.add(this.mesh)
	}

	private update = () => {
		this.mesh!.rotation.y = sensorState.angle.y * 0.05
	}
}
