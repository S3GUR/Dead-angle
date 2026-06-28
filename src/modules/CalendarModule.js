import { StateCoordinator } from '../core/StateCoordinator.js';

class CalendarModuleClass {
  constructor() {
    this.currentDate = new Date();
    this.initialized = false;
    this.alertedTaskIds = new Set();
  }

  init() {
    if (this.initialized) return;

    // Month Navigation
    const prevBtn = document.getElementById('prev-month-btn');
    const nextBtn = document.getElementById('next-month-btn');
    if (prevBtn) prevBtn.addEventListener('click', () => this.changeMonth(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.changeMonth(1));

    // Schedule Task Modal trigger
    const scheduleBtn = document.getElementById('schedule-task-btn');
    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => this.openScheduleModal());
    }

    // Modal select dependency
    const projSelect = document.getElementById('schedule-project-select');
    if (projSelect) {
      projSelect.addEventListener('change', (e) => this.loadProjectTasks(e.target.value));
    }

    // Form submit
    const form = document.getElementById('schedule-task-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleScheduleSubmit(e));
    }

    // Start background alert checker
    setInterval(() => this.checkAlerts(StateCoordinator.state), 20000);

    this.initialized = true;
  }

  render(state) {
    this.init();
    this.renderCalendarGrid(state);
    this.checkAlerts(state); // check immediately on tab render
  }

  changeMonth(direction) {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.renderCalendarGrid(StateCoordinator.state);
  }

  renderCalendarGrid(state) {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Set Month Title
    const monthTitle = document.getElementById('calendar-current-month');
    if (monthTitle) {
      const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];
      monthTitle.innerText = `${monthNames[month]} ${year}`;
    }

    const grid = document.getElementById('calendar-days-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Day calculations
    const firstDayIndex = new Date(year, month, 1).getDay();
    const startDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // European offset: Monday is index 0
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();

    // Map scheduled tasks by date string
    const tasksByDate = {};
    if (state.projects) {
      state.projects.forEach(project => {
        if (project.tasks) {
          project.tasks.forEach(task => {
            if (task.scheduledDate) {
              if (!tasksByDate[task.scheduledDate]) {
                tasksByDate[task.scheduledDate] = [];
              }
              tasksByDate[task.scheduledDate].push({
                project,
                task
              });
            }
          });
        }
      });
    }

    // 1. Render Grey days from previous month
    for (let i = startDay - 1; i >= 0; i--) {
      const dayNum = prevTotalDays - i;
      const prevMonthDate = new Date(year, month - 1, dayNum);
      const dateStr = this.formatDateString(prevMonthDate);
      
      const dayCell = this.createDayCell(dayNum, true, dateStr, tasksByDate[dateStr]);
      grid.appendChild(dayCell);
    }

    // 2. Render Active days of current month
    const todayStr = this.formatDateString(new Date());
    for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
      const currentMonthDate = new Date(year, month, dayNum);
      const dateStr = this.formatDateString(currentMonthDate);
      const isToday = dateStr === todayStr;

      const dayCell = this.createDayCell(dayNum, false, dateStr, tasksByDate[dateStr], isToday);
      grid.appendChild(dayCell);
    }

    // 3. Render Grey days of next month to fill grid (42 cells total)
    const currentCellsCount = startDay + totalDays;
    const remainingCells = 42 - currentCellsCount;
    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const nextMonthDate = new Date(year, month + 1, dayNum);
      const dateStr = this.formatDateString(nextMonthDate);

      const dayCell = this.createDayCell(dayNum, true, dateStr, tasksByDate[dateStr]);
      grid.appendChild(dayCell);
    }
  }

  createDayCell(dayNum, isMuted, dateStr, tasks = [], isToday = false) {
    const cell = document.createElement('div');
    cell.className = `calendar-day-cell ${isMuted ? 'muted' : ''} ${isToday ? 'today' : ''}`;
    
    // Add click event to cell to quickly pre-fill date input
    cell.addEventListener('click', (e) => {
      // Prevent opening modal if clicking inside a task or checkbox
      if (e.target.closest('.calendar-task-item') || e.target.closest('.card-task-checkbox')) return;
      this.openScheduleModal(dateStr);
    });

    const dayNumberSpan = document.createElement('span');
    dayNumberSpan.className = 'day-number';
    dayNumberSpan.innerText = dayNum;
    cell.appendChild(dayNumberSpan);

    if (tasks.length > 0) {
      const tasksWrapper = document.createElement('div');
      tasksWrapper.className = 'calendar-day-tasks';
      
      tasks.forEach(({ project, task }) => {
        const taskItem = document.createElement('div');
        taskItem.className = `calendar-task-item ${task.completed ? 'completed' : ''}`;
        taskItem.title = `Projet: ${project.name}\nTâche: ${task.text}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'card-task-checkbox';
        checkbox.checked = task.completed;
        checkbox.style.cssText = 'width: 14px; height: 14px; position: static; opacity: 1; pointer-events: auto; flex-shrink: 0;';
        
        checkbox.addEventListener('change', (e) => {
          this.toggleTaskStatus(project.id, task.id, e.target.checked);
        });

        const label = document.createElement('span');
        label.className = 'calendar-task-text';
        label.innerText = (task.scheduledTime ? `[${task.scheduledTime}] ` : '') + task.text;

        taskItem.appendChild(checkbox);
        taskItem.appendChild(label);
        tasksWrapper.appendChild(taskItem);
      });

      cell.appendChild(tasksWrapper);
    }

    return cell;
  }

  toggleTaskStatus(projectId, taskId, completed) {
    StateCoordinator.updateState(state => {
      const proj = state.projects.find(p => p.id === projectId);
      if (proj && proj.tasks) {
        const task = proj.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = completed;
          
          // Re-calculate project progress %
          const completedCount = proj.tasks.filter(t => t.completed).length;
          proj.progress = Math.round((completedCount / proj.tasks.length) * 100);

          StateCoordinator.logActivity('project', `Tâche '${task.text}' ${completed ? 'cochée' : 'décochée'} depuis le calendrier.`);
        }
      }
    }, ['projects']);
  }

  formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  openScheduleModal(prefilledDate = null) {
    const modal = document.getElementById('schedule-task-modal');
    if (!modal) return;

    // Prefill project dropdown
    const projSelect = document.getElementById('schedule-project-select');
    if (projSelect) {
      projSelect.innerHTML = '<option value="">-- Sélectionnez un projet --</option>';
      StateCoordinator.state.projects.forEach(p => {
        projSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
      });
    }

    // Prefill date
    const dateInput = document.getElementById('schedule-date');
    if (dateInput) {
      dateInput.value = prefilledDate || this.formatDateString(new Date());
    }

    // Reset task select
    const taskSelect = document.getElementById('schedule-task-select');
    if (taskSelect) {
      taskSelect.innerHTML = "<option value=''>-- Choisissez d'abord un projet --</option>";
    }

    modal.classList.add('active');
  }

  loadProjectTasks(projectId) {
    const taskSelect = document.getElementById('schedule-task-select');
    if (!taskSelect) return;

    if (!projectId) {
      taskSelect.innerHTML = "<option value=''>-- Choisissez d'abord un projet --</option>";
      return;
    }

    const proj = StateCoordinator.state.projects.find(p => p.id === projectId);
    if (!proj || !proj.tasks || proj.tasks.length === 0) {
      taskSelect.innerHTML = "<option value=''>Aucune tâche disponible dans ce projet</option>";
      return;
    }

    taskSelect.innerHTML = '<option value="">-- Sélectionnez la tâche --</option>';
    proj.tasks.forEach(t => {
      // Add indicator if already scheduled
      const statusText = t.scheduledDate ? ' (Déjà planifiée)' : '';
      taskSelect.innerHTML += `<option value="${t.id}">${t.text}${statusText}</option>`;
    });
  }

  handleScheduleSubmit(e) {
    e.preventDefault();

    const projectId = document.getElementById('schedule-project-select').value;
    const taskId = document.getElementById('schedule-task-select').value;
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;

    if (!projectId || !taskId || !date) return;

    StateCoordinator.updateState(state => {
      const proj = state.projects.find(p => p.id === projectId);
      if (proj && proj.tasks) {
        const task = proj.tasks.find(t => t.id === taskId);
        if (task) {
          task.scheduledDate = date;
          task.scheduledTime = time || '';
          
          StateCoordinator.logActivity('project', `Tâche '${task.text}' planifiée pour le ${date} ${time ? `à ${time}` : ''}.`);
        }
      }
    }, ['projects']);

    document.getElementById('schedule-task-modal').classList.remove('active');
    document.getElementById('schedule-task-form').reset();
  }

  // Active alarm checker
  checkAlerts(state) {
    const now = new Date();
    const currentDateStr = this.formatDateString(now);
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!state.projects) return;

    state.projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          // If task is scheduled, not completed, and date is today
          if (task.scheduledDate === currentDateStr && !task.completed) {
            const alertKey = `${task.id}-${task.scheduledDate}`;
            
            // If the task has a specific time
            if (task.scheduledTime) {
              // Trigger alarm if the current time matches the scheduled time and we haven't alerted yet
              if (currentTimeStr >= task.scheduledTime && !this.alertedTaskIds.has(alertKey)) {
                this.showToastAlert(
                  "Tâche Planifiée Arrivée !",
                  `La tâche <strong>${task.text}</strong> du projet <em>${project.name}</em> est planifiée pour aujourd'hui à ${task.scheduledTime}.`
                );
                this.alertedTaskIds.add(alertKey);
              }
            } else {
              // If no time is specified, alert once during the day when checking
              if (!this.alertedTaskIds.has(alertKey)) {
                this.showToastAlert(
                  "Tâche Prévue Aujourd'hui !",
                  `La tâche <strong>${task.text}</strong> du projet <em>${project.name}</em> est planifiée pour aujourd'hui.`
                );
                this.alertedTaskIds.add(alertKey);
              }
            }
          }
        });
      }
    });
  }

  showToastAlert(title, text) {
    const container = document.getElementById('wink-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'glass-panel toast-alert';
    
    // Toast design matching premium aesthetic
    toast.style.cssText = `
      padding: 16px 20px;
      background: rgba(13, 11, 26, 0.9);
      border: 1px solid var(--primary);
      border-radius: var(--radius-md);
      box-shadow: 0 8px 32px var(--primary-glow);
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 6px;
      pointer-events: auto;
      min-width: 280px;
      max-width: 350px;
      position: relative;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(20px);
    `;
    
    toast.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
        <strong style="color: var(--accent-purple); font-size: 0.95rem; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-bell-ring fa-bounce" style="color: var(--primary);"></i> ${title}
        </strong>
        <button class="modal-close" style="font-size: 1.2rem; line-height: 1; border: none; background: transparent; cursor: pointer; color: var(--text-muted);">&times;</button>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-top: 4px;">${text}</p>
    `;

    container.appendChild(toast);
    
    // Trigger CSS slide-up animation programmatically
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    // Bind close click
    toast.querySelector('.modal-close').addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    });

    // Auto remove after 10 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 10000);
  }
}

export const CalendarModule = new CalendarModuleClass();
