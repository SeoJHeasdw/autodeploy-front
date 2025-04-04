<template>
  <div class="deployment-management-page">
    <div class="page-header">
      <h1>배포 관리</h1>
      <div class="header-actions">
        <div class="search-container">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="요구사항 검색..." 
            class="search-input"
            @input="handleSearch"
          />
          <i class="fas fa-search search-icon"></i>
        </div>
        <div class="filter-dropdown">
          <select v-model="statusFilter" @change="applyFilters">
            <option value="">모든 상태</option>
            <option value="pending">대기 중</option>
            <option value="in-progress">진행 중</option>
            <option value="completed">완료됨</option>
            <option value="failed">실패</option>
          </select>
        </div>
      </div>
    </div>

    <div class="deployment-stats">
      <div class="stat-card active">
        <div class="stat-icon">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.active }}</span>
          <span class="stat-label">진행 중</span>
        </div>
      </div>
      <div class="stat-card completed">
        <div class="stat-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.completed }}</span>
          <span class="stat-label">완료됨</span>
        </div>
      </div>
      <div class="stat-card failed">
        <div class="stat-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.failed }}</span>
          <span class="stat-label">실패</span>
        </div>
      </div>
      <div class="stat-card pending">
        <div class="stat-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.pending }}</span>
          <span class="stat-label">대기 중</span>
        </div>
      </div>
    </div>

    <div class="requirements-table-container">
      <table class="requirements-table">
        <thead>
          <tr>
            <th>ID</th>
            <th class="title-column">제목</th>
            <th>우선순위</th>
            <th>상태</th>
            <th>요청일</th>
            <th>배포 진행률</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="req in filteredRequirements" :key="req.id" class="requirement-row">
            <td class="id-cell">#{{ req.id }}</td>
            <td class="title-cell">{{ req.title }}</td>
            <td>
              <span class="priority-badge" :class="getPriorityClass(req.priority)">
                {{ getPriorityText(req.priority) }}
              </span>
            </td>
            <td>
              <span class="status-badge" :class="getStatusClass(req.status)">
                {{ getStatusText(req.status) }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(req.createdAt) }}</td>
            <td class="progress-cell">
              <div v-if="req.deploymentProgress !== undefined" class="progress-bar-container">
                <div 
                  class="progress-bar" 
                  :class="getProgressClass(req.status)"
                  :style="{ width: `${req.deploymentProgress}%` }"
                ></div>
                <span class="progress-text">{{ req.deploymentProgress }}%</span>
              </div>
              <button 
                v-else 
                class="deploy-btn"
                @click="startDeployment(req.id)"
              >
                배포 시작
              </button>
            </td>
            <td class="actions-cell">
              <button class="action-btn view-btn" @click="viewRequirement(req.id)" title="상세 보기">
                <i class="fas fa-eye"></i>
              </button>
              <button 
                v-if="req.deploymentProgress && req.status === 'in-progress'" 
                class="action-btn cancel-btn" 
                @click="cancelDeployment(req.id)"
                title="배포 취소"
              >
                <i class="fas fa-stop-circle"></i>
              </button>
              <button 
                v-if="req.status === 'completed'" 
                class="action-btn logs-btn" 
                @click="viewLogs(req.id)"
                title="로그 보기"
              >
                <i class="fas fa-file-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredRequirements.length === 0" class="empty-state">
      <i class="fas fa-inbox empty-icon"></i>
      <p>검색 조건에 맞는 요구사항이 없습니다.</p>
    </div>

    <div class="pagination">
      <button 
        class="pagination-btn" 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        class="pagination-btn" 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- 배포 취소 확인 모달 -->
    <div v-if="showCancelModal" class="modal-overlay" @click="showCancelModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>배포 취소 확인</h3>
          <button class="modal-close-btn" @click="showCancelModal = false">×</button>
        </div>
        <div class="modal-content">
          <p>정말로 이 배포를 취소하시겠습니까?</p>
          <p class="warning-text">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showCancelModal = false">취소</button>
          <button class="btn-danger" @click="confirmCancelDeployment">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRequirementStore } from '@/store/modules/requirement.store';
import { useDeploymentStore } from '@/store/modules/deployment.store';

const router = useRouter();
const requirementStore = useRequirementStore();
const deploymentStore = useDeploymentStore();

// 상태 변수
const requirements = ref([]);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const showCancelModal = ref(false);
const selectedDeploymentId = ref(null);
const isLoading = ref(true);

// 필터링된 요구사항 목록
const filteredRequirements = computed(() => {
  let filtered = [...requirements.value];
  
  // 검색어 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(req => 
      req.title.toLowerCase().includes(query) || 
      req.id.toString().includes(query)
    );
  }
  
  // 상태 필터링
  if (statusFilter.value) {
    filtered = filtered.filter(req => req.status === statusFilter.value);
  }
  
  return filtered;
});

// 통계 데이터
const stats = computed(() => {
  return {
    active: requirements.value.filter(req => req.status === 'in-progress').length,
    completed: requirements.value.filter(req => req.status === 'completed').length,
    failed: requirements.value.filter(req => req.status === 'failed').length,
    pending: requirements.value.filter(req => req.status === 'pending').length
  };
});

// 총 페이지 수
const totalPages = computed(() => {
  return Math.ceil(filteredRequirements.value.length / pageSize.value) || 1;
});

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  isLoading.value = true;
  
  try {
    // 요구사항 데이터 로드
    await requirementStore.fetchRequirements();
    
    // 배포 정보 통합
    const reqs = requirementStore.requirements.map(req => {
      // 모의 배포 데이터 생성 (실제로는 API에서 가져올 것)
      const hasDeployment = Math.random() > 0.3; // 70%의 확률로 배포 정보 있음
      const deploymentStatus = getRandomDeploymentStatus();
      
      return {
        ...req,
        deploymentProgress: hasDeployment ? getProgressForStatus(deploymentStatus) : undefined,
        status: hasDeployment ? deploymentStatus : req.status
      };
    });
    
    requirements.value = reqs;
  } catch (error) {
    console.error('데이터 로딩 중 오류 발생:', error);
  } finally {
    isLoading.value = false;
  }
});

// 랜덤 배포 상태 생성 (데모용)
function getRandomDeploymentStatus() {
  const statuses = ['pending', 'in-progress', 'completed', 'failed'];
  const weights = [0.2, 0.3, 0.4, 0.1]; // 확률 가중치
  
  const random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    sum += weights[i];
    if (random < sum) return statuses[i];
  }
  
  return statuses[0];
}

// 상태에 따른 진행률 생성
function getProgressForStatus(status) {
  switch (status) {
    case 'pending':
      return 0;
    case 'in-progress':
      return Math.floor(Math.random() * 80) + 10; // 10-90%
    case 'completed':
      return 100;
    case 'failed':
      return Math.floor(Math.random() * 70) + 10; // 10-80%
    default:
      return 0;
  }
}

// 검색 처리
function handleSearch() {
  currentPage.value = 1; // 검색 시 첫 페이지로 이동
}

// 필터 적용
function applyFilters() {
  currentPage.value = 1; // 필터 변경 시 첫 페이지로 이동
}

// 페이지 변경
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// 우선순위 클래스
function getPriorityClass(priority) {
  switch (priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return '';
  }
}

// 우선순위 텍스트
function getPriorityText(priority) {
  switch (priority) {
    case 'high':
      return '높음';
    case 'medium':
      return '중간';
    case 'low':
      return '낮음';
    default:
      return priority;
  }
}

// 상태 클래스
function getStatusClass(status) {
  switch (status) {
    case 'completed':
      return 'status-completed';
    case 'in-progress':
      return 'status-in-progress';
    case 'pending':
      return 'status-pending';
    case 'failed':
      return 'status-failed';
    default:
      return '';
  }
}

// 상태 텍스트
function getStatusText(status) {
  switch (status) {
    case 'completed':
      return '완료됨';
    case 'in-progress':
      return '진행 중';
    case 'pending':
      return '대기 중';
    case 'failed':
      return '실패';
    default:
      return status;
  }
}

// 진행 바 클래스
function getProgressClass(status) {
  switch (status) {
    case 'completed':
      return 'progress-completed';
    case 'in-progress':
      return 'progress-in-progress';
    case 'failed':
      return 'progress-failed';
    default:
      return '';
  }
}

// 날짜 형식화
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// 요구사항 상세 보기 페이지로 이동
function viewRequirement(id) {
  router.push(`/deployments/${id}`);
}

// 배포 시작
function startDeployment(reqId) {
  // 배포 시작 로직
  const reqIndex = requirements.value.findIndex(r => r.id === reqId);
  
  if (reqIndex !== -1) {
    // 상태 업데이트 (실제로는 API 호출 후 응답에 따라 처리)
    requirements.value[reqIndex] = {
      ...requirements.value[reqIndex],
      status: 'in-progress',
      deploymentProgress: 5
    };
    
    // 배포 페이지로 이동
    router.push(`/deployments/${reqId}`);
  }
}

// 배포 취소 모달 표시
function cancelDeployment(reqId) {
  selectedDeploymentId.value = reqId;
  showCancelModal.value = true;
}

// 배포 취소 확인
function confirmCancelDeployment() {
  const reqId = selectedDeploymentId.value;
  if (!reqId) return;
  
  const reqIndex = requirements.value.findIndex(r => r.id === reqId);
  
  if (reqIndex !== -1) {
    // 상태 업데이트 (실제로는 API 호출 후 응답에 따라 처리)
    requirements.value[reqIndex] = {
      ...requirements.value[reqIndex],
      status: 'failed',
      deploymentProgress: requirements.value[reqIndex].deploymentProgress
    };
    
    showCancelModal.value = false;
    selectedDeploymentId.value = null;
  }
}

// 로그 보기
function viewLogs(reqId) {
  router.push(`/deployments/${reqId}/logs`);
}
</script>

<style scoped>
.deployment-management-page {
  padding: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--gray-900);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.search-container {
  position: relative;
}

.search-input {
  width: 250px;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-500);
}

.filter-dropdown select {
  padding: 0.6rem 2rem 0.6rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  background-color: var(--white);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.filter-dropdown select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
}

/* 통계 카드 */
.deployment-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 1.25rem;
}

.stat-card.active .stat-icon {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--info);
}

.stat-card.completed .stat-icon {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

.stat-card.failed .stat-icon {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

.stat-card.pending .stat-icon {
  background-color: rgba(255, 159, 28, 0.1);
  color: var(--warning);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--gray-600);
}

/* 요구사항 테이블 */
.requirements-table-container {
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
}

.requirements-table th,
.requirements-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--gray-200);
}

.requirements-table th {
  background-color: var(--gray-100);
  font-weight: 600;
  color: var(--gray-700);
  font-size: 0.875rem;
}

.requirements-table tbody tr:hover {
  background-color: var(--gray-50);
}

.requirements-table tbody tr:last-child td {
  border-bottom: none;
}

.id-cell {
  font-family: var(--font-family-mono);
  color: var(--gray-700);
  font-weight: 500;
}

.title-column {
  width: 25%;
}

.title-cell {
  font-weight: 500;
  color: var(--gray-900);
}

.date-cell {
  color: var(--gray-600);
  font-size: 0.875rem;
}

/* 우선순위 배지 */
.priority-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.priority-high {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

.priority-medium {
  background-color: rgba(255, 159, 28, 0.1);
  color: var(--warning);
}

.priority-low {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

/* 상태 배지 */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.status-completed {
  background-color: rgba(6, 214, 160, 0.1);
  color: var(--success);
}

.status-in-progress {
  background-color: rgba(76, 201, 240, 0.1);
  color: var(--info);
}

.status-pending {
  background-color: rgba(108, 117, 125, 0.1);
  color: var(--gray-600);
}

.status-failed {
  background-color: rgba(230, 57, 70, 0.1);
  color: var(--danger);
}

/* 진행 바 */
.progress-cell {
  min-width: 150px;
}

.progress-bar-container {
  height: 8px;
  background-color: var(--gray-200);
  border-radius: var(--radius-full);
  position: relative;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-in-progress {
  background-color: var(--info);
  background-image: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.15) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255, 255, 255, 0.15) 50%, 
    rgba(255, 255, 255, 0.15) 75%, 
    transparent 75%, 
    transparent);
  background-size: 1rem 1rem;
  animation: progress-animation 1s linear infinite;
}

.progress-completed {
  background-color: var(--success);
}

.progress-failed {
  background-color: var(--danger);
}

.progress-text {
  position: absolute;
  right: 0;
  top: 12px;
  font-size: 0.75rem;
  color: var(--gray-700);
}

/* 배포 버튼 */
.deploy-btn {
  padding: 0.4rem 0.75rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.deploy-btn:hover {
  background-color: var(--primary-dark);
}

/* 액션 버튼 */
.actions-cell {
  white-space: nowrap;
  width: 100px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  margin-right: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn {
  color: var(--primary);
}

.view-btn:hover {
  background-color: rgba(67, 97, 238, 0.1);
}

.cancel-btn {
  color: var(--danger);
}

.cancel-btn:hover {
  background-color: rgba(230, 57, 70, 0.1);
}

.logs-btn {
  color: var(--gray-600);
}

.logs-btn:hover {
  background-color: var(--gray-200);
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: 1.5rem;
}

.empty-icon {
  font-size: 3rem;
  color: var(--gray-300);
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--gray-600);
  font-size: 1rem;
  margin: 0;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--white);
  border: 1px solid var(--gray-300);
  margin: 0 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--primary);
  color: white;
  border-color: var(--primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  padding: 0 1rem;
  font-size: 0.9rem;
  color: var(--gray-600);
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  width: 100%;
  max-width: 500px;
  background-color: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  color: var(--gray-600);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.modal-close-btn:hover {
  background-color: var(--gray-200);
}

.modal-content {
  padding: 1.5rem;
}

.modal-content p {
  margin: 0 0 1rem;
  font-size: 1rem;
}

.warning-text {
  color: var(--danger);
  font-weight: 500;
}

.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--gray-200);
  background-color: var(--gray-50);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: var(--white);
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  color: var(--gray-700);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--gray-100);
  border-color: var(--gray-400);
}

.btn-danger {
  padding: 0.5rem 1rem;
  background-color: var(--danger);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

@keyframes progress-animation {
  0% { background-position: 1rem 0; }
  100% { background-position: 0 0; }
}

/* 반응형 스타일 */
@media (max-width: 1200px) {
  .deployment-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-container, .search-input, .filter-dropdown, .filter-dropdown select {
    width: 100%;
  }
  
  .deployment-stats {
    grid-template-columns: 1fr;
  }
  
  .requirements-table-container {
    overflow-x: auto;
  }
  
  .requirements-table {
    min-width: 900px;
  }
}
</style>