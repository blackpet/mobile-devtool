import type { AbstractNBridge } from './nbridge';

const SERVICE = 'app';
let nbridge;

async function appInfo() {
	return await nbridge.callToNative(SERVICE, 'appInfo', {});
}

async function deviceInfo() {
	return await nbridge.callToNative(SERVICE, 'deviceInfo', {});
}

function initAppBridge(_nbridge: AbstractNBridge) {
	nbridge = _nbridge;
}

export { initAppBridge, appInfo, deviceInfo };
