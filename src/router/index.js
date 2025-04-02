// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '대시보드' }
  },
  {
    path: '/requirements',
    name: 'Requirements',
    component: () => import('@/views/Requirements.vue'),
    meta: { title: '요구사항 관리' }
  },
  {
    path: '/requirements/new',
    name: 'NewRequirement',
    component: () => import('@/views/RequirementForm.vue'),
    meta: { title: '새 요구사항 등록' }
  },
  {
    path: '/requirements/:id',
    name: 'RequirementDetail',
    component: () => import('@/views/RequirementDetail.vue'),
    props: true,
    meta: { title: '요구사항 상세' }
  },
  {
    path: '/deployments',
    name: 'Deployments',
    component: () => import('@/views/Deployments.vue'),
    meta: { title: '배포 관리' }
  },
  {
    path: '/deployments/:id',
    name: 'DeploymentDetail',
    component: () => import('@/views/DeploymentDetail.vue'),
    props: true,
    meta: { title: '배포 상세' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
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