import UAParser from 'ua-parser-js';
import {v4 as uuid} from 'uuid';

export interface AbstractNBridge {
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

type Logger = {
	log: (...args: any[]) => void;
	error?: (...args: any[]) => void;
};

const uap = new UAParser();
const logger: Logger = {log: console.log, error: console.error};

export default (function (w, uap, logger, _debug = true) {
	const os = uap.getOS().name.toLowerCase();
	const promises = [];

	function getNbridge(): NBridge {
		if (os === 'android') return w?.['nBridge'] as AndroidNBridge;
		if (os === 'ios') return w?.['webkit']?.['messageHandlers']?.['nBridge'] as IosNBridge;

		throw new Error('nBridge is not defined');
	}

	function platform() {
		const nbridge: NBridge = getNbridge();

		if (!nbridge) return 'web';
		else return os;
	}

	function isNativeApp() {
		return /.+ICODIMOBILE$/.test(uap.getUA());
	}

	function isMobile() {
		return ['android', 'ios'].includes(platform());
	}

	function onBridgeReady() {
		const nbridge: NBridge = getNbridge();

		logger.log('onBridgeReady!');

		if (os === 'android') {
			(nbridge as AndroidNBridge).onBridgeReady();
		} else if (os === 'ios') {
			const param = {command: 'onBridgeReady'};
			(nbridge as IosNBridge).postMessage(JSON.stringify(param));
		}
	}

	function callToNative(service, action, option = {}) {
		const nbridge: NBridge = getNbridge();

		return new Promise((resolve, reject) => {
			const promiseId = uuid();

			promises[promiseId] = {resolve, reject};

			try {
				const command = {service, action, promiseId, option};
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

	function setLogger(_logger: Logger) {
		logger = {...logger, ..._logger};
	}

	function setDebugMode(value: boolean) {
		_debug = value;
	}

	function log(...args) {
		if (_debug) {
			logger.log(...args);
		}
	}

	return {
		platform,
		isMobile,
		onBridgeReady,
		callToNative,
		resolvePromise,
		finallyResolvePromise,

		setLogger,
		setDebugMode
	};
})(window, uap, logger, true);
