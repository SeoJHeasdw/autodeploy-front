import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: '대시보드' }
  },
  {
    path: '/requirements',
    name: 'Requirements',
    component: () => import('@/pages/requirements/RequirementFormPage.vue'),
    meta: { title: '요구사항 관리' }
  },
  {
    path: '/requirements/new',
    name: 'NewRequirement',
    component: () => import('@/pages/requirements/RequirementFormPage.vue'),
    meta: { title: '새 요구사항 등록' }
  },
  {
    path: '/requirements/:id',
    name: 'RequirementDetail',
    component: () => import('@/pages/requirements/RequirementDetailPage.vue'),
    props: true,
    meta: { title: '요구사항 상세' }
  },
  {
    path: '/deployments',
    name: 'Deployments',
    component: () => import('@/pages/deployments/DeploymentPage.vue'),
    meta: { title: '배포 관리' }
  },
  {
    path: '/deployments/:id',
    name: 'DeploymentDetail',
    component: () => import('@/pages/deployments/DeploymentDetailPage.vue'),
    props: true,
    meta: { title: '배포 상세' }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/pages/AnalyticsPage.vue'),
    meta: { title: '분석 및 통계' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { title: '시스템 설정' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '페이지를 찾을 수 없습니다' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 페이지 타이틀 설정
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | 자동화 CI/CD 플랫폼` : '자동화 CI/CD 플랫폼';
  next();
});

export default router;