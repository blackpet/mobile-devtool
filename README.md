# Development Test Tool `Native`

[https://www.figma.com/file/5XpeMkyLhewdHXQfTpadsr/Firb-Mobile-Development-Mode?node-id=0%3A1](https://www.figma.com/file/5XpeMkyLhewdHXQfTpadsr/Firb-Mobile-Development-Mode?node-id=0%3A1)

[https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2F5XpeMkyLhewdHXQfTpadsr%2FFirb-Mobile-Development-Mode%3Fnode-id%3D0%253A1](https://www.figma.com/embed?embed_host=notion&url=https%3A%2F%2Fwww.figma.com%2Ffile%2F5XpeMkyLhewdHXQfTpadsr%2FFirb-Mobile-Development-Mode%3Fnode-id%3D0%253A1)

## Landing Page for Development

1. Access URL
    1. 접속할 URL 을 직접 input 에 입력
    2. URL List 항목 선택 시 input 에 주소 입력
    3. [Connect] btn 접속
2. Add to List
    1. input 에 입력한 URL 을 URL List 에 추가 (저장)

## Link to External Page

APIs > 5. Link to External page 참조

# Interface

## Customize User Agent

HTTP Header의 User-Agent 가장 마지막에 `FIRBMOBILE` 문자열을 추가하여 앱 여부 확인

> ex. Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36`/FIRBMOBILE`

Interface by `JSON String` from Web to APP

## iOS

`firb://` prefix 로 링크 호출

## Android

`window.Android.firb()` function 호출

## APIs

### 1. Device Token & App Version  `getTokenData`

접속 기기의 Device Token String, 앱의 현재 버전 요청 / 응답

1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "getTokenData"}

    // Android
    window.Android.firb({"code": "getTokenData"})
    ```

2. Response `Native —> Web`

    ```jsx
    // call script
    FirbMobile.response.tokenAndVersion(token, version)
    ```

### 2. Save User Info  `setAutoLoginData`

사용자 정보, 자동로그인 여부 요청 / 응답

```jsx
// Data Structure
code: "setAutoLoginData"
autoLoginYn: "Y" | "N"
id: 사용자ID
secret: 암호화된 인증 key
```

1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "setAutoLoginData", "autoLoginYn": "Y", "id": "test001", "secret": "4O2YDhbHf2IdL+hpm/1+ww=="}

    // Android
    window.Android.firb({"code": "setAutoLoginData", "autoLoginYn": "Y", "id": "test001", "secret": "4O2YDhbHf2IdL+hpm/1+ww=="})
    ```

2. Response `Native —> Web`

    ```jsx
    // no response
    ```

### 3. User Info  `getAutoLoginData`

[2. Save User Info] 에서 저장한 사용자 정보 요청 / 응답

1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "getAutoLoginData"}

    // Android
    window.Android.firb({"code": "getAutoLoginData"})
    ```

2. Response `Native —> Web`

    ```jsx
    // call script
    FirbMobile.response.userInfo(autoLoginYn, id, secret)
    ```

### 4. Update App  `updateApp`

[1. Device Token & App Version] 응답에서 받은 App Version 과 최신 App Version 이 다를 경우 앱 업데이트 요청.

최신버전 앱 Download URL 을 포함하여 요청

1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "updateApp", "url": "https://kird.app.download.url/kird.plist"}

    // Android
    window.Android.firb({"code": "updateApp", "url": "https://kird.app.download.url/kird.apk"})
    ```

2. Response `Native —> Web`

    ```jsx
    // no response
    ```

### 5. Link to External page  `goOutLink`

기기의 자체 브라우저(Safari / 인터넷 APP)로 연결 (앱 전환)


1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "goOutLink", "url": "http://naver.com"}

    // Android
    window.Android.firb({"code": "goOutLink", "url": "http://naver.com"})
    ```

2. Response `Native —> Web`

    ```jsx
    // no response
    ```

### 6. Open New Window  `newWindow`

내부 시스템이 아닌 외부 시스템(또는 페이지)로 링크할 경우 호출

돌아올 수 있는 `Back/Close Navigation Button` 표시

1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "newWindow", "url": "http://naver.com"}

    // Android
    window.Android.firb({"code": "newWindow", "url": "http://naver.com"})
    ```

2. Response `Native —> Web`

    ```jsx
    // no response
    ```

### 7. QR Code Reader  `qrcode`

카메라 모듈을 이용한 QR Code Reader 호출 / 응답

1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "qrcode"}

    // Android
    window.Android.firb({"code": "qrcode"})
    ```

2. Response `Native —> Web`

    ```jsx
    // call script
    FirbMobile.response.qrcode(url)
    ```

### 8. Orientation `setOrientation`

플레이어 재생 등 가로/세로 방향을 변경할 때 사용

#### orientation
- portrait
- landscape


1. Request `Web -> Native`

    ```jsx
    // iOS
    firb://{"code": "setOrientation", "orientation": "portrait"}
   

    // Android
    window.Android.firb({"code": "setOrientation", "orientation": "portrait"})
    ```


2. Response `Native —> Web`

    ```jsx
    // no response
    ```


### 9. GEO Location coordinates  `getCoordinates`

GPS 기반 좌표 호출 / 응답

1. Request `Web —> Native`

    ```jsx
    // iOS
    firb://{"code": "getCoordinates"}

    // Android
    window.Android.firb({"code": "getCoordinates"})
    ```

2. Response `Native —> Web`

    ```jsx
    // call script
    FirbMobile.response.coordinates(lat, long)
    ```
