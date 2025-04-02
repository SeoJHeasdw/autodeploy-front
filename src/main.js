// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// CSS 임포트
import './assets/main.css'

// FontAwesome 아이콘 설정 (사용할 경우)
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faTasks, 
  faCheckCircle, 
  faExclamationTriangle, 
  faClock,
  faPlus,
  faSearch,
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faCode,
  faCog,
  faServer,
  faDatabase,
  faCloudUploadAlt,
  faExclamationCircle,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// 아이콘 라이브러리에 추가
library.add(
  faTasks, 
  faCheckCircle, 
  faExclamationTriangle, 
  faClock,
  faPlus,
  faSearch,
  faArrowRight,
  faArrowLeft,
  faSpinner,
  faCode,
  faCog,
  faServer,
  faDatabase,
  faCloudUploadAlt,
  faExclamationCircle,
  faInfoCircle
)

// 앱 생성 및 마운트
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)

// WebSocket 서비스 설정
import { useDeploymentStore } from './store/modules/deployment'
import { setupDeploymentWebSocket } from './services/deployment'

app.mount('#app')

// 스토어 인스턴스 가져오기
const deploymentStore = useDeploymentStore()

// WebSocket 서비스 초기화
const wsService = setupDeploymentWebSocket(deploymentStore)

// 전역 속성으로 WebSocket 서비스 추가 (필요한 경우)
app.config.globalProperties.$wsService = wsService