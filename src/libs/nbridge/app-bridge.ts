import type { AbstractNBridge } from './nbridge';

const SERVICE = 'app';
let nbridge;

function initAppBridge(_nbridge: AbstractNBridge) {
	nbridge = _nbridge;
}

/**
 * 앱 정보
 */
async function appInfo() {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return await nbridge.callToNative(SERVICE, 'appInfo', {});
}

/**
 * 기기 정보
 */
async function deviceInfo() {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return await nbridge.callToNative(SERVICE, 'deviceInfo', {});
}

/**
 * 앱 종료
 */
async function exit() {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return await nbridge.callToNative(SERVICE, 'exit', {});
}

/**
 * 앱 설정 이동
 */
async function goSettings() {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return await nbridge.callToNative(SERVICE, 'goSettings', {});
}

/**
 * 캐시 삭제
 */
async function clearCache() {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return await nbridge.callToNative(SERVICE, 'clearCache', {});
}

export { initAppBridge, appInfo, deviceInfo, exit, goSettings, clearCache };
