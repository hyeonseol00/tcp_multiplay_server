# 멀티플레이 게임 서버 만들기
> 서버를 구축하고, 유니티 클라이언트를 사용하는 여러 명의 플레이어가 한 서버에 접속해 서로의 위치를 각 클라이언트에서 보여줄 수 있도록 합니다.

<br><br>

## 학습 프로젝트 주요 목표
1. `net` 모듈을 사용한 TCP 서버 구현
1. JavaScript의 버퍼 객체를 사용한 바이트 배열에 익숙해지기
	1. TCP의 데이터 교환은 바이트 스트림 형태입니다. 데이터를 작은 패킷으로 나누어 전송하고 재조립하여 원래의 바이트 스트림을 복원하는 방식입니다.
    1. 버퍼란 데이터를 일시적으로 저장하는 메모리 공간입니다.
1. JavaScript의 `Class` 문법 익히기
	1. 게임 객체 모델링
    1. 서버 관리
1. Unity 클라이언트 연동, Unity 맛보기

<br><br>

## 프로젝트 핵심 내용
### 디렉토리 구조 설계
> 기능별로 코드를 모듈화시켜 직관성과 재사용성을 높입니다.
또, 개발과 유지보수에 용이하도록 합니다.

```
📦tcp_multiplay_server
 ┣ 📂src
 ┃ ┣ 📂classes
 ┃ ┃ ┣ 📂managers
 ┃ ┃ ┃ ┣ 📜base.manager.js
 ┃ ┃ ┃ ┗ 📜interval.manager.js
 ┃ ┃ ┗ 📂models
 ┃ ┃ ┃ ┣ 📜game.class.js
 ┃ ┃ ┃ ┗ 📜user.class.js
 ┃ ┣ 📂config
 ┃ ┃ ┗ 📜config.js
 ┃ ┣ 📂constants
 ┃ ┃ ┣ 📜env.js
 ┃ ┃ ┣ 📜handlerIds.js
 ┃ ┃ ┣ 📜header.js
 ┃ ┃ ┗ 📜session.js
 ┃ ┣ 📂db
 ┃ ┃ ┣ 📂backup
 ┃ ┃ ┃ ┣ 📜coordinates.db.js
 ┃ ┃ ┃ ┗ 📜coordinates.queries.js
 ┃ ┃ ┣ 📂migrations
 ┃ ┃ ┃ ┗ 📜createSchemas.js
 ┃ ┃ ┣ 📂sql
 ┃ ┃ ┃ ┗ 📜user_coordinates.sql
 ┃ ┃ ┗ 📜database.js
 ┃ ┣ 📂events
 ┃ ┃ ┣ 📜onConnection.js
 ┃ ┃ ┣ 📜onData.js
 ┃ ┃ ┣ 📜onEnd.js
 ┃ ┃ ┗ 📜onError.js
 ┃ ┣ 📂handlers
 ┃ ┃ ┣ 📂game
 ┃ ┃ ┃ ┣ 📜createGame.handler.js
 ┃ ┃ ┃ ┣ 📜joinGame.handler.js
 ┃ ┃ ┃ ┗ 📜updateLocation.handler.js
 ┃ ┃ ┣ 📂user
 ┃ ┃ ┃ ┗ 📜initial.handler.js
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📂init
 ┃ ┃ ┣ 📜index.js
 ┃ ┃ ┗ 📜loadProtos.js
 ┃ ┣ 📂protobuf
 ┃ ┃ ┣ 📂notification
 ┃ ┃ ┃ ┗ 📜game.notification.proto
 ┃ ┃ ┣ 📂request
 ┃ ┃ ┃ ┣ 📜common.proto
 ┃ ┃ ┃ ┣ 📜game.proto
 ┃ ┃ ┃ ┗ 📜initial.proto
 ┃ ┃ ┣ 📂response
 ┃ ┃ ┃ ┣ 📜data.response.proto
 ┃ ┃ ┃ ┗ 📜response.proto
 ┃ ┃ ┗ 📜packetNames.js
 ┃ ┣ 📂session
 ┃ ┃ ┣ 📜game.session.js
 ┃ ┃ ┣ 📜sessions.js
 ┃ ┃ ┗ 📜user.session.js
 ┃ ┣ 📂utils
 ┃ ┃ ┣ 📂db
 ┃ ┃ ┃ ┗ 📜testConnection.js
 ┃ ┃ ┣ 📂error
 ┃ ┃ ┃ ┣ 📜customError.js
 ┃ ┃ ┃ ┣ 📜errorCodes.js
 ┃ ┃ ┃ ┗ 📜errorHandler.js
 ┃ ┃ ┣ 📂notification
 ┃ ┃ ┃ ┗ 📜game.notification.js
 ┃ ┃ ┣ 📂parser
 ┃ ┃ ┃ ┗ 📜packetParser.js
 ┃ ┃ ┣ 📂response
 ┃ ┃ ┃ ┗ 📜createResponse.js
 ┃ ┃ ┣ 📜dateFomatter.js
 ┃ ┃ ┣ 📜round.js
 ┃ ┃ ┗ 📜transformCase.js
 ┃ ┗ 📜server.js
 ┣ 📜.env
 ┣ 📜.gitignore
 ┣ 📜client.js
 ┣ 📜package-lock.json
 ┗ 📜package.json
```

<br>

### 바이트 배열의 구조
- 아래와 같은 바이트 배열 구조를 가지고 있습니다.
![](https://velog.velcdn.com/images/hyeonseol22/post/8d4b8f14-d173-4ea4-badb-c2a157e1d33d/image.png)

https://github.com/hyeonseol00/tcp_multiplay_server/blob/eeec5452883d020219c21005d1e5d3c8455ab699/src/utils/response/createResponse.js#L18-L33

<br>

### 프로토버프
https://github.com/hyeonseol00/tcp_multiplay_server/blob/eeec5452883d020219c21005d1e5d3c8455ab699/src/protobuf/response/response.proto#L1-L11

<br>

### 게임 객체 모델링
https://github.com/hyeonseol00/tcp_multiplay_server/blob/eeec5452883d020219c21005d1e5d3c8455ab699/src/classes/models/user.class.js#L4-L15

<br>

### 위치 동기화, 추측항법
https://github.com/hyeonseol00/tcp_multiplay_server/blob/eeec5452883d020219c21005d1e5d3c8455ab699/src/classes/models/user.class.js#L39-L72
https://github.com/hyeonseol00/tcp_multiplay_server/blob/eeec5452883d020219c21005d1e5d3c8455ab699/src/handlers/game/updateLocation.handler.js#L22-L24
