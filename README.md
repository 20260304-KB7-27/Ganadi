# 🐶 가나디 (GANADI)
> **"귀여움이 세상을 지배한다!!"** <br>
> 가나디는 가난하지 않디! 목표를 달성하며 귀여운 캐릭터를 성장시키는 가계부 서비스입니다.

<br>

## 📖 프로젝트 소개 (Project Overview)
**가나디**는 단순한 지출 기록을 넘어, 사용자의 재정 관리 상태에 따라 캐릭터가 성장하는 시스템을 도입한 **성장형 가계부**입니다. 자산 관리를 지루한 숙제가 아닌, 캐릭터를 키우는 즐거운 경험으로 바꾸고자 기획되었습니다.

* **진행 기간**: 2026.04 (KB 스켈레톤 프로젝트)
* **팀명**: TEAM 가나디 (김예림, 문수호, 이종원, 조준연, 김호성)

<br>

## ✨ 주요 기능 (Key Features)

### 1. 핵심 기능
* **재정 기록**: 직관적인 수입/지출 입력 및 카테고리 분류 기능.
* **메인 캘린더**: 날짜별 소비 내역을 한눈에 확인할 수 있는 대시보드.
* **월별 요약 및 통계**: 지출 현황을 시각화하여 데이터 기반의 소비 패턴 분석 지원.
* **고정 지출 관리**: 반복되는 내역을 자동으로 입력하고 설정할 수 있는 세팅 폼 제공.

### 2. 부가 기능
* **성장 시스템**: 소비 챌린지 성공 여부에 따라 가나디 캐릭터가 4단계(Lv.1 ~ Lv.4 부자 가나디)로 진화.
* **상태 시각화**: 캐릭터의 모습 변화를 통해 현재의 재정 건강 상태를 직관적으로 파악.

### 3. 사용자 경험(UX)
* **반응형 웹**: PC, 태블릿, 모바일 등 모든 디바이스 환경에 최적화된 레이아웃 제공.

<br>


## 👨‍💻 팀원

27회차 팀 가나디 

문수호 50031593msh@gmail.com  
김예림 yeye092302@gmail.com  
이종원 dandy0810@naver.com  
조준연 junyeon03@gmail.com

# 초기 세팅

C:\>cd Ganadi

C:\Ganadi>npm create vue

> npx  
> create-vue

T Vue.js - The Progressive JavaScript Framework  
|  
o Project name (target directory):  
| ganadi  
|  
o Use TypeScript?  
| No  
|  
o Select features to include in your project: (↑/↓ to navigate, space to select, a to  
| toggle all, enter to confirm)  
| Router (SPA development), Pinia (state management)  
|  
o Select experimental features to include in your project: (↑/↓ to navigate, space to  
| select, a to toggle all, enter to confirm)  
| none  
|

- Skip all example code and start with a blank Vue project?  
  | > Yes

cd ganadi  
npm install bootstrap@5 -> bootstrap 라이브러리 사용  
npm install axios -> http 라이브러리 사용  
npm install bootstrap-icons
npm i vue-chartjs chart.js
npm i --save vue-simple-calendar
npm install vite-plugin-pwa --save-dev
npm install  
npm run dev

새로운 터미널
cd ganadi
cd ganadi
npm install -g json-server
json-server --watch db.json --port 3000

# ✅ 커밋 컨벤션

feat: 새로운 기능 추가  
fix: 버그 수정  
docs: 문서 수정  
style: 코드 스타일 (포맷팅 등)  
refactor: 리팩토링  
test: 테스트 코드  
chore: 빌드, 설정, 기타 작업

[예시]  
feat: 로그인 API 구현 (#12)  
fix: null pointer 오류 수정 (#34)
