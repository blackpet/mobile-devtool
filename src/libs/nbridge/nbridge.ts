import UAParser from 'ua-parser-js';
import { v4 as uuid } from 'uuid';

interface AbstractNBridge {
	callToNative: (service: string, action: string, option?: any) => void;
}

interface AndroidNBridge extends AbstractNBridge {
	onBridgeReady: () => void;
	callFromWeb: (stringifyCommand: string) => void;
}

interface IosNBridge extends AbstractNBridge {
	postMessage: (stringifyCommand: string) => void;
}

type NBridge = AndroidNBridge | IosNBridge;

const uap = new UAParser();
const logger = { log: console.log, error: console.error };

export default (function (w, uap, logger, _debug = true) {
	const os = uap.getOS().name.toLowerCase();
	const promises = [];
	const nbridge: NBridge = getNbridge();

	function getNbridge(): NBridge {
		if (os === 'android') return w?.['nBridge'] as AndroidNBridge;
		if (os === 'ios') return w?.['webkit']?.['messageHandlers']?.['nBridge'] as IosNBridge;

		throw new Error('no nBridge!!!');
	}

	function platform() {
		let _platform = 'web';

		// android
		if (os === 'android' && w?.['nBridge']) _platform = os;
		// ios
		if (os === 'ios' && w?.['webkit']?.['messageHandlers']?.['nBridge']) _platform = os;

		return _platform;
	}

	function isNativeApp() {
		return /.+ICODIMOBILE$/.test(uap.getUA());
	}

	function isMobile() {
		return ['android', 'ios'].includes(platform());
	}

	function onBridgeReady() {
		if (nbridge) {
			throw new Error('no nBridge!!!');
		}

		if (os === 'android') {
			(nbridge as AndroidNBridge).onBridgeReady();
		} else if (os === 'ios') {
			const param = { command: 'onBridgeReady' };
			(nbridge as IosNBridge).postMessage(JSON.stringify(param));
		}
	}

	function callToNative(service, action, option = {}) {
		return new Promise((resolve, reject) => {
			const promiseId = uuid();

			promises[promiseId] = { resolve, reject };

			try {
				const command = { service, action, promiseId, option };
				const stringifyCommand = JSON.stringify(command);

				if (os === 'android') {
					(nbridge as AndroidNBridge).callFromWeb(stringifyCommand);
				} else if (os === 'ios') {
					(nbridge as IosNBridge).postMessage(stringifyCommand);
				}
			} catch (e) {
				logger.error(e);
				throw e;
			}
		});
	}

	function resolvePromise(promiseId: string, response: any, error: any) {
		if (error) {
			promises[promiseId].reject(response);
		} else {
			promises[promiseId].resolve(response);
		}
	}

	function finallyResolvePromise(promiseId: string, response: any, error: any) {
		if (error) {
			promises[promiseId].reject(response);
		} else {
			promises[promiseId].resolve(response);
		}
		delete promises[promiseId];
	}

	return {
		platform,
		isMobile,
		onBridgeReady,
		callToNative,
		resolvePromise,
		finallyResolvePromise
	};
})(window, uap, logger, true);
