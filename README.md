# 관계 중점 채팅 앱
-------------
#### 프로젝트 소개
* 프로젝트명
    * RelationShip
* 프로젝트 주제
    * 관계 강조형 채팅 앱
* 프로젝트 목적
    * 평소 채팅 앱을 이용하여 채팅할 때 누군가와의 약속을 잡거나 여행 일정 등을 관리할 때 매번 메모 앱을 들어가서 따로 입력하고 또 그것을 후에 찾는 것에 대해 불편함을 느꼈다. 기존의 채팅앱과 메모장 앱은 다른 앱에 해당하여 나중에 이를 찾고 정리하기 불편함으로 이를 채팅방 내부의 개인 메모장을 만들어 각 상대에 해당하는 적절한 정보를 저장하며 간편히 이용할 수 있게 하려고 채팅방 메모장 기능을 구현하는 것을 계획하였다.
    * 기존 채팅 앱의 경우(카카오톡, 기본 메시지 등)는 주로 가나다순 정렬이나 최신 대화 순 정렬로 나열되어 있다. 그렇기에 관계가 많아질수록 그들의 관계를 한눈에 보기가 힘들어진다. 이를 현재 사용자 주변의 관계를 더 쉽고 한 번에 볼 수 있으면 좋을 것 같다고 생각하여 마인드맵 형태의 관계도로 표현할 수 있는 기능을 구현하기로 계획하였다.
    * 단순히 주변 관계를 나열하여 보여주는 것은 사람 수가 많아지거나 동명이인이 있는 경우 상대방과 어떤 관계인지 확인하기 불편하다고 느껴 특정 그룹을 만들고 그룹에 해당하는 친구들을 추가하여 그룹화하는 기능이 있으면 편리할 것 같다고 생각하여 관계 그룹화 기능을 계획하였다.

#### 설치 방법

이 앱을 플레이스토어 또는 앱스토어같은 소프트웨어 다운로드 서비스에 등록하지 않았기 때문에 앱을 설치할 수는 없다. 단, 위 깃허브 소스를 다운로드 받아 필요한 파일들을 설치하고 서버를 설정한다면 에뮬레이터에서 앱을 확인할 수 있다.

#### 작업 환경
* python 3.x
* Django 4.2.7
* React Native 0.72.x
* MySQL 8.0.x
* Redis 7.2

#### 환경 구축
/api # for server
/app # for front
* 서버
    * virtualenv 설치 후 api 디렉토리에서 python manage.py runserver 명렁어 실행
    * no module name 오류로 나오는 모듈을 pip install로 설치
    * ./core/settings.py에 DB 및 Redis 설정
    * MySQL에 kwchat.sql 생성
* 프론트
    * app 디렉토리 이동 후 npm install 명령어로 라이브러리 설치
    * android
        * npm run android 명령으로 emulator 실행
    * ios
        * npm run ios -- --simulator='iPhone model name'

#### 사용법
* 회원가입 후 로그인
* 연락하고자 하는 친구 추가 또는 요청 수락
* 친구 리스트에서 친구를 눌러 대화 화면으로 이동
* 대화 시작

#### 기능
* 친구 추가 요청
* 프로필 이미지 수정
* 메세지 전송
* 대화 화면 내 개인 메모장

#### 스크린샷
<img src="screenshots/login.png" alt="App screenshot - login screen" width="250" /> <img src="screenshots/friendlist.png" alt="App screenshot - friend list" width="250" /> <img src="screenshots/request.png" alt="App screenshot - send friend request" width="250" /> <img src="screenshots/accept.png" alt="App screenshot - aceept friend request" width="250" /> <img src="screenshots/chat.png" alt="App screenshot - chat screen" width="250" /> <img src="screenshots/profile.png" alt="App screenshot - user profile" width="250" />

#### 라이센스
MIT License

#### Made By
* 15조 푸른 태양을 쓰러뜨린 자들
    * 정준영
    * 유지윤
    * 전병은
    * 김민서