import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import pinia from './store' // Pinia 스토어 import

// FontAwesome 설정
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
    faHome, faTachometerAlt, faClipboardList, faRocket, faChartBar, 
    faCog, faUser, faSignOutAlt, faSearch, faQuestionCircle, 
    faBell, faMoon, faSun, faPlus, faChevronRight, faChevronLeft,
    faCheck, faSpinner, faTimes, faArrowUp, faExclamationTriangle,
    faExternalLinkAlt, faEye, faEdit, faCopy, faStopCircle, faList,
    faCheckCircle, faInfoCircle, faLongArrowAltRight
  } from '@fortawesome/free-solid-svg-icons'
  
  import { 
    faGithub,
    faTwitter, 
    faLinkedin, 
    faYoutube 
  } from '@fortawesome/free-brands-svg-icons'

// 모든 아이콘 등록
library.add(
  faHome, faTachometerAlt, faClipboardList, faRocket, faChartBar, 
  faCog, faUser, faSignOutAlt, faSearch, faQuestionCircle, 
  faBell, faMoon, faSun, faPlus, faChevronRight, faChevronLeft,
  faCheck, faSpinner, faTimes, faArrowUp, faExclamationTriangle,
  faExternalLinkAlt, faEye, faEdit, faCopy, faStopCircle, faList,
  faCheckCircle, faInfoCircle, faLongArrowAltRight, 
  // 브랜드 아이콘 추가
  faGithub, faTwitter, faLinkedin, faYoutube
)

// 스토어 및 컴포넌트 초기화
import { useDeploymentStore } from '@/store/modules/deployment'
import { useRequirementStore } from '@/store/modules/requirement'

const app = createApp(App)

// FontAwesome 컴포넌트 전역 등록
app.component('font-awesome-icon', FontAwesomeIcon)

// Pinia 등록
app.use(pinia)

// 라우터 등록
app.use(router)

// 앱 마운트
app.mount('#app')

// 데모용 데이터 초기화
const initMockData = async () => {
  try {
    // 스토어 인스턴스 가져오기
    const deploymentStore = useDeploymentStore()
    const requirementStore = useRequirementStore()
    
    // 모의 데이터로 스토어 초기화
    await Promise.all([
      requirementStore.fetchRequirements(),
      deploymentStore.initWithMockData()
    ])
    
    console.log('모의 데이터 초기화 완료')
  } catch (error) {
    console.error('모의 데이터 초기화 중 오류:', error)
  }
}

// 앱 시작 시 모의 데이터 초기화
initMockData()