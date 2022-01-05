import type { AbstractNBridge } from './nbridge';

const SERVICE = 'preference';
let nbridge;

function initPreferenceBridge(_nbridge: AbstractNBridge) {
	nbridge = _nbridge;
}

/**
 * 데이터 저장소 가져오기
 */
function getPreference(key, defaultValue) {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return nbridge.callToNative(SERVICE, 'get', {key, defaultValue});
}

/**
 * 데이터 저장소 저장
 */
function setPreference(key, value) {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return nbridge.callToNative(SERVICE, 'set', {key, value});
}

/**
 * 데이터 저장소 제거
 */
function removePreference(key) {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return nbridge.callToNative(SERVICE, 'remove', {key});
}

export { initPreferenceBridge, getPreference, setPreference, removePreference };
