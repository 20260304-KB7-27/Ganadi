# Ganadi

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
