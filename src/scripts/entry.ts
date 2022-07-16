import { sensorState } from './store';
import { TCanvas } from './three/TCanvas';

class App {
	private canvas: TCanvas

	constructor() {
		const parentNode = document.querySelector('body')!
		this.canvas = new TCanvas(parentNode)
		this.addEvents()
	}

	private addEvents = () => {
		window.addEventListener('beforeunload', () => {
			this.dispose()
		})
		window.addEventListener('deviceorientation', this.handleDeviceorientation.bind(this))
	}

	private handleDeviceorientation = (e: DeviceOrientationEvent) => {
		const pi2 = Math.PI * 2
		sensorState.angle = { x: (e.beta ?? 0) / pi2, y: (e.gamma ?? 0) / pi2, z: (e.alpha ?? 0) / pi2 }
		// console.log(e.beta, e.gamma, e.alpha)
	}

	private dispose = () => {
		this.canvas.dispose()
	}
}

new App()
