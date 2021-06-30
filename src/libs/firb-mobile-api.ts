import UAParser from 'ua-parser-js';

type TokenAndVersionCallback = ({token, version, device}: {token: string, version: string, device: string}) => void;
type UserInfoCallback = ({autoLoginYn, id, secret}: { autoLoginYn: 'Y' | 'N', id: string, secret: string }) => void;
type QRCodeCallback = (url: string) => void;
interface Callback {
  tokenAndVersion: TokenAndVersionCallback;
  userInfo: UserInfoCallback;
  qrcode: QRCodeCallback;
}
type MobileInfo = Record<'ios' | 'android', {download: string, version: string}>;
enum MobileOS {
  IOS = 'ios',
  ANDROID = 'android'
}

const uap = new UAParser();
const logger = {log: console.log};

export default (function(w, uap, logger, _debug) {
  const os = uap.getOS().name.toLowerCase();
  let mobileInfo: MobileInfo;
  let callback: Callback;

  const request = {
    tokenAndVersion: function (_fn: TokenAndVersionCallback) {
      // assign callback
      if (!!_fn && typeof _fn === 'function') {
        callback.tokenAndVersion = _fn;
      }

      const code = 'getTokenData';

      requestToNative({code});
    },

    userInfo: function (_fn: UserInfoCallback) {
      // assign callback
      if (!!_fn && typeof _fn === 'function') {
        callback.userInfo = _fn;
      }

      const code = 'getAutoLoginData';

      requestToNative({code});
    },

    saveUserInfo: function (autoLoginYn, id) {
      const code = 'setAutoLoginData';

      // TODO blackpet: 서버에서 암회화된 id, key 를 받아와야 한다!

      requestToNative({code, autoLoginYn, id, secret: '4O2YDhbHf2IdL+hpm/1+ww=='});
    },

    updateApp: function (ver) {
      const code = 'updateApp';

      log('DB ver:' + mobileInfo[os].version + ' / App ver:' + ver);
      // version check & update
      if (ver === mobileInfo[os].version) {
        log('APP version is up to date');
      } else {
        log('Start APP update');
        requestToNative({code, url: mobileInfo[os].download});
      }
    },

    linkTo: function (url = 'http://naver.com') {
      const code = 'goOutLink';

      requestToNative({code, url});
    },

    openWindow: function (url) {
      const code = 'newWindow';

      requestToNative({code, url: url});
    },

    qrcode: function (_fn: QRCodeCallback) {
      // assign callback
      if (!!_fn && typeof _fn === 'function') {
        callback.qrcode = _fn;
      }

      const code = 'qrcode';

      requestToNative({code});
    },

  };

  const response = {
    // callback for request.tokenAndVersion()
    tokenAndVersion: function (token, version) {
      log({token, version}, 'tokenAndVersion');

      // invoke callback with data
      if (callback.tokenAndVersion) {
        callback.tokenAndVersion({
          token,
          version,
          device: os.toUpperCase()
        });
      }

      request.updateApp(version);
    },

    // callback for request.userInfo()
    userInfo: function (autoLoginYn, id, secret) {
      log({autoLoginYn, id, secret: secret}, 'userInfo');

      // invoke callback with data
      if (callback.userInfo) {
        callback.userInfo({autoLoginYn, id, secret: secret});
      }
    },

    // callback for request.qrcode()
    qrcode: function (url) {
      log(url, 'qrcode');

      // invoke callback with data
      if (callback.qrcode) {
        callback.qrcode(url);
      }
    }
  };


  // is Firb Native App correctly?
  function isNativeApp() {
    return /.+FIRBMOBILE$/.test(uap.getUA());
  }

  function isMobile() {
    return os === 'ios' || os === 'android';
  }

  function requestToNative(data) {
    log(data, 'requestToNative');

    // Native App 인 경우에만 실행한다!
    if (!isNativeApp()) {
      log('[ERROR] This is not Native App connection!')
      return;
    }

    const jsonStr = encodeURIComponent(JSON.stringify(data));

    // iOS
    if (os === MobileOS.IOS) {
      location.href = 'firb://' + jsonStr;
    }

    // Android
    else if (os === MobileOS.ANDROID) {
      if (!window['Android']) {
        log('[ERROR] window.Android is not defined!');
        return;
      } else if (!window['Android'].firb) {
        log('[ERROR] window.Android.web2app is not defined!');
        return;
      }
      window['Android'].firb(jsonStr);
    }

    else {
      log('[ERROR] cannot detected device type!');
    }
  }

  function setLogger(_logger: {log: (...args: any[]) => void}) {
    logger = _logger;
  }

  function isDebugMode(value) {
    _debug = value;
  }

  function setMobileInfo(info: MobileInfo) {
    mobileInfo = info;
  }

  function log(...args) {
    if (_debug) {
      logger.log(...args);
    }
  }

  return {
    request,
    response,
    setLogger,
    setMobileInfo,
    isDebugMode,
  };
})(window, uap, logger, true);
