import UAParser from 'ua-parser-js';

type settingDataCallback = (version: string, autoLoginYn: 'Y' | 'N', pushYn: 'Y' | 'N') => void;
type TokenAndVersionCallback = (token: string, version: string, device: MobileOS) => void;
type UserInfoCallback = (autoLoginYn: 'Y' | 'N', id: string, secret: string) => void;
type QRCodeCallback = (url: string) => void;
type CoordinatesCallback = (lat: number, long: number) => void;
interface Callback {
  settingData?: settingDataCallback;
  tokenAndVersion?: TokenAndVersionCallback;
  userInfo?: UserInfoCallback;
  qrcode?: QRCodeCallback;
  coordinates?: CoordinatesCallback;
}
export type MobileInfo = Record<'ios' | 'android', {download: string, version: string}>;
enum MobileOS {
  IOS = 'ios',
  ANDROID = 'android'
}

const uap = new UAParser();
const logger = {log: console.log};

export default (function(w, uap, logger, _debug) {
  const os = uap.getOS().name.toLowerCase();
  let mobileInfo: MobileInfo;
  const callback: Callback = {};

  const request = {
    settingData: function (_fn: settingDataCallback) {
      // assign callback
      if (!!_fn && typeof _fn === 'function') {
        callback.settingData = _fn;
      }

      const code = 'getSettingData';

      requestToNative({code});
    },
    tokenAndVersion: function (_fn: TokenAndVersionCallback) {
      // assign callback
      if (!!_fn && typeof _fn === 'function') {
        callback.tokenAndVersion = _fn;
      }

      const code = 'getTokenData';

      requestToNative({code});
    },
    closeWindow: function (url) {
      const code = 'closeWindow';

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
      requestToNative({code, autoLoginYn, id, secret: 'a crypted secret key'});
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

      requestToNative({code, url});
    },

    qrcode: function (_fn: QRCodeCallback) {
      // assign callback
      if (!!_fn && typeof _fn === 'function') {
        callback.qrcode = _fn;
      }

      const code = 'qrcode';

      requestToNative({code});
    },

    coordinates: function (_fn: CoordinatesCallback) {
      // assign callback
      if (!!_fn && typeof _fn === 'function') {
        callback.coordinates = _fn;
      }

      const code = 'getCoordinates';

      requestToNative({code});
    },

    orientation: function(orientation = 'portrait') {
      const code = 'setOrientation';

      requestToNative({code, orientation});
    }

  };

  const response = {
    // callback for request.tokenAndVersion()
    settingData: function (version, autoLoginYn, pushYn) {
      log('settingData', {version, autoLoginYn, pushYn});

      // invoke callback with data
      if (callback.settingData) {
        callback.settingData(
            autoLoginYn,
            pushYn,
            version
        );
      }
    },

    tokenAndVersion: function (token, version) {
      log('tokenAndVersion', {token, version});

      // invoke callback with data
      if (callback.tokenAndVersion) {
        callback.tokenAndVersion(
          token,
          version,
          os.toUpperCase()
        );
      }

      request.updateApp(version);
    },

    // callback for request.userInfo()
    userInfo: function (autoLoginYn, id, secret) {
      log('userInfo', {autoLoginYn, id, secret: secret});

      // invoke callback with data
      if (callback.userInfo) {
        callback.userInfo(autoLoginYn, id, secret);
      }
    },

    // callback for request.qrcode()
    qrcode: function (url) {
      log('qrcode', url);

      // invoke callback with data
      if (callback.qrcode) {
        callback.qrcode(url);
      }
    },

    // callback for request.qrcode()
    coordinates: function (lat, long) {
      log('coordinates', lat, long);

      // invoke callback with data
      if (callback.coordinates) {
        callback.coordinates(lat, long);
      }
    },
  };


  // is Firb Native App correctly?
  function isNativeApp() {
    return /.+FIRBMOBILE$/.test(uap.getUA());
  }

  function isMobile() {
    return os === 'ios' || os === 'android';
  }

  function requestToNative(data) {
    log('requestToNative', data);

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
