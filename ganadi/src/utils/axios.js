import axios from 'axios';

const instance = axios.create({
  // baseURL: 'api/',
  /*
  axios 요청에 대해 공통된 설정들을 구성할 수 있다.
  */
  //  headers:{
  //     //공통 헤더들
  //     Authorization: ~~
  //  }
  // time out
});

export default instance;
