class Layers {

	constructor() {

		this.mask = 1 | 0;

	}

	set( channel ) {

		this.mask = 1 << channel | 0;

	}

	enable( channel ) {

		this.mask |= 1 << channel | 0;

	}

	enableAll() {

		this.mask = 0xffffffff | 0;

	}

	toggle( channel ) {

		this.mask ^= 1 << channel | 0;

	}

	disable( channel ) {

		this.mask &= ~ ( 1 << channel | 0 );

	}

	disableAll() {

		this.mask = 0;

	}

	test( layers ) {

		return ( this.mask & layers.mask ) !== 0;

	}

}

const cameraLayer = new Layers();
const objLayer = new Layers();

// 
cameraLayer.enable(1)
cameraLayer.enable(2)
cameraLayer.enable(3)
console.log(cameraLayer);
console.log(objLayer);

export { Layers };
