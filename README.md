# 자동화 CI/CD 플랫폼 프론트엔드

고객 요구사항 입력부터 소스 코딩, 깃랩 커밋, 젠킨스 이미지 빌드, GitOps 태그값 변경, ArgoCD 배포까지의 전체 CI/CD 파이프라인을 시각화하고 관리하는 프론트엔드 애플리케이션입니다.

## 주요 기능

- 고객 요구사항 입력 및 관리
- 배포 프로세스 실시간 모니터링
- 단계별 진행 상태 시각화
- 배포 성공/실패 추적
- 상세 로그 확인

## 기술 스택

- **프레임워크**: Vue 3 (Composition API)
- **상태 관리**: Pinia
- **라우팅**: Vue Router
- **API 통신**: Axios
- **실시간 통신**: WebSocket
- **UI 컴포넌트**: 자체 구현 + FontAwesome
- **빌드 도구**: Vite

## 프로젝트 구조

```
src/
├── assets/            # 정적 리소스 (이미지, 폰트 등)
├── components/        # 재사용 가능한 컴포넌트
│   ├── common/        # 공통 컴포넌트
│   ├── requirements/  # 요구사항 관련 컴포넌트
│   └── deployment/    # 배포 관련 컴포넌트
├── views/             # 페이지 컴포넌트
├── router/            # Vue Router 설정
├── store/             # Pinia 상태 관리
│   ├── modules/
│   └── index.js
├── services/          # API 호출 및 서비스 로직
├── utils/             # 유틸리티 함수
├── constants/         # 상수 정의
└── App.vue            # 루트 컴포넌트
```

## 설치 방법

### 필수 조건

- Node.js 16.x 이상
- npm 8.x 이상

### 설치 단계

```bash
# 저장소 클론
git clone https://github.com/your-username/automated-cicd-frontend.git
cd automated-cicd-frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## 환경 설정

`.env` 파일을 프로젝트 루트에 생성하여 환경 변수를 설정할 수 있습니다:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_BASE_URL=ws://localhost:8080/ws
```

## 주요 컴포넌트

### 요구사항 입력 폼 (RequirementForm.vue)

고객이 새로운 요구사항을 입력할 수 있는 폼 컴포넌트입니다. 제목, 상세 설명, 우선순위, 마감일 등의 정보를 입력받습니다.

### 배포 상태 모니터링 (DeploymentStatus.vue)

현재 진행 중인 배포 작업의 상태를 실시간으로 모니터링할 수 있는 컴포넌트입니다. 전체 진행률, 단계별 상태, 로그 등을 확인할 수 있습니다.

### 대시보드 (Home.vue)

최근 요구사항 및 배포 작업 현황을 한눈에 볼 수 있는 대시보드 컴포넌트입니다. 활성화된 작업, 완료된 작업, 실패한 작업 등의 통계 정보를 제공합니다.

## 백엔드 연동

이 프론트엔드 애플리케이션은 RESTful API와 WebSocket을 통해 백엔드 서비스와 통신합니다. 백엔드와의 연동을 위해 다음 URL 패턴을 사용합니다:

- REST API: `/api/*`
- WebSocket: `/ws/*`

개발 환경에서는 Vite의 프록시 기능을 사용하여 CORS 이슈를 해결합니다.

## 실시간 업데이트

배포 진행 상태는 WebSocket을 통해 실시간으로 업데이트됩니다. 다음 이벤트 타입을 처리합니다:

- `deployment_update` - 배포 상태 업데이트
- `deployment_completed` - 배포 완료
- `deployment_failed` - 배포 실패
- `deployment_step_update` - 개별 단계 업데이트
- `log_update` - 로그 업데이트

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다: `git checkout -b feature/amazing-feature`
3. 변경사항을 커밋합니다: `git commit -m 'Add some amazing feature'`
4. 브랜치에 푸시합니다: `git push origin feature/amazing-feature`
5. Pull Request를 제출합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 연락처

프로젝트 관리자 - [your-email@example.com](mailto:your-email@example.com)

프로젝트 링크: [https://github.com/your-username/automated-cicd-frontend](https://github.com/your-username/automated-cicd-frontend)