import type { AbstractNBridge } from './nbridge';

const SERVICE = 'link';
let nbridge;

function initLinkBridge(_nbridge: AbstractNBridge) {
	nbridge = _nbridge;
}

/**
 * 브라우저 이동
 */
async function openBrowser(url: string) {
	if (!nbridge) {
		console.log('nbridge is not initialized!');
	}
	return await nbridge.callToNative(SERVICE, 'browser', { url });
}

export { initLinkBridge, openBrowser };
