import { StateCoordinator } from '../core/StateCoordinator.js';
import { formatMoney } from '../core/Utils.js';

class ProjectsModuleClass {
  constructor() {
    this.currentProjectFilter = 'all';
    this.modalTasks = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Bind project filters
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        filterTags.forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
        this.currentProjectFilter = tag.getAttribute('data-filter');
        this.render(StateCoordinator.state);
      });
    });

    // Add project triggers
    const addProjBtnView = document.getElementById('add-project-btn-view');
    if (addProjBtnView) {
      addProjBtnView.addEventListener('click', () => this.openProjectModal());
    }

    // Modal tasks addition
    const addTaskToProjectBtn = document.getElementById('add-task-to-project-btn');
    if (addTaskToProjectBtn) {
      addTaskToProjectBtn.addEventListener('click', () => this.addTaskToProject());
    }

    // Form submit
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
      projectForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Modal close binds
    const closeProjectModalBtn = document.getElementById('close-project-modal');
    if (closeProjectModalBtn) closeProjectModalBtn.addEventListener('click', () => this.closeProjectModal());

    const cancelProjectModalBtn = document.getElementById('cancel-project-modal');
    if (cancelProjectModalBtn) cancelProjectModalBtn.addEventListener('click', () => this.closeProjectModal());

    this.initialized = true;
  }

  render(state) {
    this.init();
    
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    container.innerHTML = '';

    let filtered = state.projects || [];
    if (this.currentProjectFilter !== 'all') {
      filtered = state.projects.filter(p => p.status === this.currentProjectFilter);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-panel empty-state" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-list-check"></i>
          <p class="empty-state-title">Aucun projet trouvé</p>
          <p class="empty-state-desc">Commencez par ajouter un nouveau projet personnel ou professionnel pour suivre votre avancement.</p>
          <button class="glass-button primary" id="empty-state-add-project-btn">
            Créer un projet
          </button>
        </div>
      `;
      const btn = document.getElementById('empty-state-add-project-btn');
      if (btn) btn.addEventListener('click', () => this.openProjectModal());
      return;
    }

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'glass-panel project-card';
      
      const statusLabels = {
        'not-started': 'Non commencé',
        'in-progress': 'En cours',
        'on-hold': 'En pause',
        'completed': 'Terminé'
      };

      const deadlineText = proj.deadline ? new Date(proj.deadline).toLocaleDateString('fr-FR', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Sans limite';
      const budgetText = proj.budget > 0 ? formatMoney(proj.budget) : 'Aucun';
      const completedTasks = proj.tasks ? proj.tasks.filter(t => t.completed).length : 0;
      const totalTasks = proj.tasks ? proj.tasks.length : 0;

      card.innerHTML = `
        <div class="project-card-header">
          <div>
            <h4 class="project-title">${proj.name}</h4>
            <p class="project-desc" title="${proj.description || ''}">${proj.description || 'Aucune description fournie.'}</p>
          </div>
          <span class="status-badge ${proj.status}">${statusLabels[proj.status]}</span>
        </div>

        <div class="project-progress-area">
          <div class="progress-info">
            <span>Progression</span>
            <span>${proj.progress}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${proj.progress}%"></div>
          </div>
        </div>

        <div class="project-details-mini">
          <div class="detail-item">
            <i class="fa-regular fa-clock"></i>
            <span>Temps : <strong class="hours-val">${proj.timeSpent || 0} h</strong></span>
          </div>
          <div class="detail-item">
            <i class="fa-solid fa-euro-sign"></i>
            <span>Budget : <strong>${budgetText}</strong></span>
          </div>
          <div class="detail-item" style="grid-column: span 2;">
            <i class="fa-regular fa-calendar-check"></i>
            <span>Échéance : <strong>${deadlineText}</strong></span>
          </div>
        </div>

        <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <button class="card-tasks-toggle-btn" data-id="${proj.id}">
            <i class="fa-solid fa-chevron-down"></i>
            <span>Tâches (${completedTasks}/${totalTasks})</span>
          </button>
        </div>
        <div class="card-tasks-wrapper" id="tasks-wrapper-${proj.id}">
          <!-- Tasks list loaded dynamically below -->
        </div>

        <div class="project-card-footer" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
          <div class="time-spent-input-group">
            <button class="time-spent-btn dec-hours-btn" data-id="${proj.id}">-</button>
            <span style="font-size:0.78rem; color:var(--text-muted); padding: 0 4px;">Heures</span>
            <button class="time-spent-btn inc-hours-btn" data-id="${proj.id}">+</button>
          </div>

          <div class="project-actions">
            <button class="action-btn edit-proj-btn" data-id="${proj.id}" title="Modifier">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="action-btn delete delete-proj-btn" data-id="${proj.id}" title="Supprimer">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);

      // Render tasks in wrapper
      const tasksWrapper = card.querySelector(`#tasks-wrapper-${proj.id}`);
      if (proj.tasks && proj.tasks.length > 0) {
        proj.tasks.forEach(task => {
          const taskRow = document.createElement('div');
          taskRow.className = `card-task-row ${task.completed ? 'completed' : ''}`;
          taskRow.innerHTML = `
            <label class="card-task-label">
              <input type="checkbox" class="card-task-checkbox" data-proj-id="${proj.id}" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
              <span>${task.name}</span>
            </label>
            <span class="priority-dot ${task.priority}" title="Priorité : ${task.priority}"></span>
          `;
          tasksWrapper.appendChild(taskRow);
        });
      } else {
        tasksWrapper.innerHTML = `<div style="font-size:0.75rem; color:var(--text-dark); text-align:center; padding:8px;">Aucune tâche définie.</div>`;
      }
    });

    // Add listeners inside container elements
    container.querySelectorAll('.inc-hours-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.adjustProjectHours(id, 1);
      });
    });

    container.querySelectorAll('.dec-hours-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.adjustProjectHours(id, -1);
      });
    });

    container.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openProjectModal(id);
      });
    });

    container.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteProject(id);
      });
    });

    container.querySelectorAll('.card-tasks-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const wrapper = container.querySelector(`#tasks-wrapper-${id}`);
        const icon = e.currentTarget.querySelector('i');
        
        wrapper.classList.toggle('expanded');
        if (wrapper.classList.contains('expanded')) {
          icon.className = 'fa-solid fa-chevron-up';
        } else {
          icon.className = 'fa-solid fa-chevron-down';
        }
      });
    });

    container.querySelectorAll('.card-task-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const projId = e.target.getAttribute('data-proj-id');
        const taskId = e.target.getAttribute('data-task-id');
        const checked = e.target.checked;
        this.toggleCardTask(projId, taskId, checked);
      });
    });
  }

  adjustProjectHours(id, amount) {
    StateCoordinator.updateState(state => {
      const idx = state.projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        const current = parseFloat(state.projects[idx].timeSpent || 0);
        state.projects[idx].timeSpent = Math.max(0, current + amount);
      }
    }, ['projects']);
  }

  toggleCardTask(projId, taskId, checked) {
    StateCoordinator.updateState(state => {
      const projIdx = state.projects.findIndex(p => p.id === projId);
      if (projIdx !== -1) {
        const taskIdx = state.projects[projIdx].tasks.findIndex(t => t.id === taskId);
        if (taskIdx !== -1) {
          state.projects[projIdx].tasks[taskIdx].completed = checked;
          const tasks = state.projects[projIdx].tasks;
          const completedCount = tasks.filter(t => t.completed).length;
          state.projects[projIdx].progress = Math.round((completedCount / tasks.length) * 100);
        }
      }
    }, ['projects']);
  }

  openProjectModal(id = null) {
    const projectModal = document.getElementById('project-modal');
    const projectForm = document.getElementById('project-form');
    if (!projectModal || !projectForm) return;

    projectForm.reset();
    document.getElementById('project-id').value = '';
    document.getElementById('project-modal-title').innerText = "Créer un nouveau projet";
    this.modalTasks = [];
    
    if (id) {
      const proj = StateCoordinator.state.projects.find(p => p.id === id);
      if (proj) {
        document.getElementById('project-id').value = proj.id;
        document.getElementById('project-name').value = proj.name;
        document.getElementById('project-desc').value = proj.description || '';
        document.getElementById('project-status').value = proj.status;
        document.getElementById('project-progress').value = proj.progress;
        document.getElementById('project-time-spent').value = proj.timeSpent || 0;
        document.getElementById('project-budget').value = proj.budget || 0;
        document.getElementById('project-deadline').value = proj.deadline || '';
        document.getElementById('project-modal-title').innerText = "Modifier le projet";
        
        this.modalTasks = proj.tasks ? [ ...proj.tasks ] : [];
      }
    }
    this.renderModalTasks();
    projectModal.classList.add('active');
  }

  closeProjectModal() {
    const projectModal = document.getElementById('project-modal');
    if (projectModal) projectModal.classList.remove('active');
  }

  renderModalTasks() {
    const container = document.getElementById('modal-tasks-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (this.modalTasks.length === 0) {
      container.innerHTML = `<div style="font-size:0.8rem; color:var(--text-dark); text-align:center; padding:10px;">Aucune tâche créée pour ce projet.</div>`;
      return;
    }
    
    this.modalTasks.forEach((task, idx) => {
      const row = document.createElement('div');
      row.className = 'modal-task-item';
      
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="priority-dot ${task.priority}"></span>
          <span style="${task.completed ? 'text-decoration:line-through; color:var(--text-dark);' : ''}">${task.name}</span>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="checkbox" class="modal-task-chk" data-index="${idx}" ${task.completed ? 'checked' : ''} style="cursor:pointer;">
          <button type="button" class="action-btn delete remove-modal-task-btn" data-index="${idx}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      container.appendChild(row);
    });
    
    // Bind modal checkbox change
    container.querySelectorAll('.modal-task-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        this.modalTasks[idx].completed = e.target.checked;
        this.renderModalTasks();
      });
    });

    // Bind modal task remove
    container.querySelectorAll('.remove-modal-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        this.modalTasks.splice(idx, 1);
        this.renderModalTasks();
      });
    });
  }

  addTaskToProject() {
    const taskNameInput = document.getElementById('new-task-name');
    const prioritySelect = document.getElementById('new-task-priority');
    if (!taskNameInput || !prioritySelect) return;

    const name = taskNameInput.value.trim();
    const priority = prioritySelect.value;
    
    if (name) {
      this.modalTasks.push({
        id: 't-' + Date.now(),
        name,
        completed: false,
        priority
      });
      taskNameInput.value = '';
      prioritySelect.value = 'medium';
      this.renderModalTasks();
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const name = document.getElementById('project-name').value.trim();
    const description = document.getElementById('project-desc').value.trim();
    const status = document.getElementById('project-status').value;
    let progress = parseInt(document.getElementById('project-progress').value) || 0;
    const timeSpent = parseFloat(document.getElementById('project-time-spent').value) || 0;
    const budget = parseFloat(document.getElementById('project-budget').value) || 0;
    const deadline = document.getElementById('project-deadline').value;

    if (this.modalTasks.length > 0) {
      const completedCount = this.modalTasks.filter(t => t.completed).length;
      progress = Math.round((completedCount / this.modalTasks.length) * 100);
    }

    StateCoordinator.updateState(state => {
      if (id) {
        // Edit
        const idx = state.projects.findIndex(p => p.id === id);
        if (idx !== -1) {
          state.projects[idx] = { ...state.projects[idx], name, description, status, progress, timeSpent, budget, deadline, tasks: this.modalTasks };
          StateCoordinator.logActivity('project', `Projet '${name}' mis à jour.`);
        }
      } else {
        // Add
        const newProj = {
          id: 'proj-' + Date.now(),
          name,
          description,
          status,
          progress,
          timeSpent,
          budget,
          deadline,
          tasks: this.modalTasks
        };
        state.projects.push(newProj);
        StateCoordinator.logActivity('project', `Projet '${name}' créé.`);
      }
    }, ['projects']);

    this.closeProjectModal();
  }

  deleteProject(id) {
    const proj = StateCoordinator.state.projects.find(p => p.id === id);
    if (proj && confirm(`Voulez-vous vraiment supprimer le projet "${proj.name}" ?`)) {
      StateCoordinator.updateState(state => {
        state.projects = state.projects.filter(p => p.id !== id);
        StateCoordinator.logActivity('project', `Projet '${proj.name}' supprimé.`);
      }, ['projects']);
    }
  }
}

export const ProjectsModule = new ProjectsModuleClass();
