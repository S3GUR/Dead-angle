import { StateCoordinator } from '../core/StateCoordinator.js';

class CalendarModuleClass {
  constructor() {
    this.currentDate = new Date();
    this.initialized = false;
    this.alertedTaskIds = new Set();
    this.hours = [
      8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
    ];
  }

  init() {
    if (this.initialized) return;

    // Week Navigation
    const prevBtn = document.getElementById('prev-week-btn');
    const nextBtn = document.getElementById('next-week-btn');
    if (prevBtn) prevBtn.onclick = () => this.changeWeek(-7);
    if (nextBtn) nextBtn.onclick = () => this.changeWeek(7);

    // Schedule Task Modal trigger
    const scheduleBtn = document.getElementById('schedule-task-btn');
    if (scheduleBtn) {
      scheduleBtn.onclick = () => this.openScheduleModal();
    }

    // Modal select dependency
    const projSelect = document.getElementById('schedule-project-select');
    if (projSelect) {
      projSelect.onchange = (e) => this.loadProjectTasks(e.target.value);
    }

    // Form submit
    const form = document.getElementById('schedule-task-form');
    if (form) {
      form.onsubmit = (e) => this.handleScheduleSubmit(e);
    }

    // Start background alert checker
    setInterval(() => this.checkAlerts(StateCoordinator.state), 20000);

    this.initialized = true;
  }

  render(state) {
    this.init();
    this.renderCalendarGrid(state);
    this.checkAlerts(state);
  }

  changeWeek(days) {
    this.currentDate.setDate(this.currentDate.getDate() + days);
    this.renderCalendarGrid(StateCoordinator.state);
  }

  getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday (0) to get monday
    return new Date(date.setDate(diff));
  }

  formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  renderCalendarGrid(state) {
    const monday = this.getMonday(this.currentDate);
    
    // Generate dates for the 7 days of the week
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDates.push(d);
    }

    const firstDay = weekDates[0];
    const lastDay = weekDates[6];

    // Format week title: "28 Juin - 4 Juillet 2026"
    const monthNames = [
      "Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin",
      "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."
    ];
    
    const weekTitle = document.getElementById('calendar-current-week-title');
    if (weekTitle) {
      const yearText = firstDay.getFullYear() === lastDay.getFullYear() 
        ? firstDay.getFullYear() 
        : `${firstDay.getFullYear()} - ${lastDay.getFullYear()}`;
      weekTitle.innerText = `Semaine du ${firstDay.getDate()} ${monthNames[firstDay.getMonth()]} au ${lastDay.getDate()} ${monthNames[lastDay.getMonth()]} ${yearText}`;
    }

    // Render Grid Header
    const header = document.getElementById('calendar-week-header');
    if (header) {
      header.innerHTML = '';
      
      // Hours corner cell
      const hourCorner = document.createElement('div');
      hourCorner.className = 'header-hour-cell';
      hourCorner.innerText = 'Heure';
      header.appendChild(hourCorner);

      // Day headers
      const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
      const todayStr = this.formatDateString(new Date());

      weekDates.forEach((date, i) => {
        const dayHeader = document.createElement('div');
        const dateStr = this.formatDateString(date);
        const isToday = dateStr === todayStr;
        
        dayHeader.className = `header-day-col ${isToday ? 'today' : ''}`;
        dayHeader.innerHTML = `
          <span class="day-name">${dayNames[i]}</span>
          <span class="day-date-number">${date.getDate()}/${String(date.getMonth() + 1).padStart(2, '0')}</span>
        `;
        header.appendChild(dayHeader);
      });
    }

    // Render Grid Body
    const grid = document.getElementById('calendar-week-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Group tasks by date
    const tasksByDate = {};
    if (state.projects) {
      state.projects.forEach(project => {
        if (project.tasks) {
          project.tasks.forEach(task => {
            if (task.scheduledDate) {
              if (!tasksByDate[task.scheduledDate]) {
                tasksByDate[task.scheduledDate] = [];
              }
              tasksByDate[task.scheduledDate].push({ project, task });
            }
          });
        }
      });
    }

    // 1. RENDER ALL-DAY (Toute la journée) ROW
    // Hour label
    const allDayLabel = document.createElement('div');
    allDayLabel.className = 'calendar-hour-label-cell all-day';
    allDayLabel.innerText = 'All-day';
    grid.appendChild(allDayLabel);

    // Day cells for All-day row
    weekDates.forEach(date => {
      const dateStr = this.formatDateString(date);
      const allDayTasks = (tasksByDate[dateStr] || []).filter(({ task }) => !task.scheduledTime);
      const isToday = dateStr === this.formatDateString(new Date());

      const cell = document.createElement('div');
      cell.className = `calendar-week-cell all-day ${isToday ? 'today' : ''}`;
      cell.onclick = (e) => {
        if (e.target.closest('.calendar-task-item')) return;
        this.openScheduleModal(dateStr, '');
      };

      this.renderTasksIntoCell(cell, allDayTasks);
      grid.appendChild(cell);
    });

    // 2. RENDER HOURLY ROWS
    this.hours.forEach(hour => {
      // Hour label cell
      const hourCell = document.createElement('div');
      hourCell.className = 'calendar-hour-label-cell';
      hourCell.innerText = `${String(hour).padStart(2, '0')}:00`;
      grid.appendChild(hourCell);

      // Day cells for this hour
      weekDates.forEach(date => {
        const dateStr = this.formatDateString(date);
        const isToday = dateStr === this.formatDateString(new Date());
        
        // Filter tasks that match this hour (e.g. 14:30 matches 14:00 row)
        const hourTasks = (tasksByDate[dateStr] || []).filter(({ task }) => {
          if (!task.scheduledTime) return false;
          const [tHour] = task.scheduledTime.split(':').map(Number);
          return tHour === hour;
        });

        const cell = document.createElement('div');
        cell.className = `calendar-week-cell ${isToday ? 'today' : ''}`;
        
        const prefilledTime = `${String(hour).padStart(2, '0')}:00`;
        cell.onclick = (e) => {
          if (e.target.closest('.calendar-task-item')) return;
          this.openScheduleModal(dateStr, prefilledTime);
        };

        this.renderTasksIntoCell(cell, hourTasks);
        grid.appendChild(cell);
      });
    });
  }

  renderTasksIntoCell(cell, tasks) {
    if (tasks.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'calendar-day-tasks';

    tasks.forEach(({ project, task }) => {
      const taskItem = document.createElement('div');
      taskItem.className = `calendar-task-item ${task.completed ? 'completed' : ''}`;
      taskItem.title = `Projet: ${project.name}\nTâche: ${task.text}${task.scheduledTime ? `\nHeure: ${task.scheduledTime}` : ''}`;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'card-task-checkbox';
      checkbox.checked = task.completed;
      checkbox.style.cssText = 'width: 14px; height: 14px; margin: 0; opacity: 1; pointer-events: auto; flex-shrink: 0; cursor: pointer;';

      checkbox.onchange = (e) => {
        this.toggleTaskStatus(project.id, task.id, e.target.checked);
      };

      const label = document.createElement('span');
      label.className = 'calendar-task-text';
      label.innerText = (task.scheduledTime ? `${task.scheduledTime} ` : '') + task.text;

      taskItem.appendChild(checkbox);
      taskItem.appendChild(label);
      wrapper.appendChild(taskItem);
    });

    cell.appendChild(wrapper);
  }

  toggleTaskStatus(projectId, taskId, completed) {
    StateCoordinator.updateState(state => {
      const proj = state.projects.find(p => p.id === projectId);
      if (proj && proj.tasks) {
        const task = proj.tasks.find(t => t.id === taskId);
        if (task) {
          task.completed = completed;
          
          // Re-calculate project progress
          const completedCount = proj.tasks.filter(t => t.completed).length;
          proj.progress = Math.round((completedCount / proj.tasks.length) * 100);

          StateCoordinator.logActivity('project', `Tâche '${task.text}' ${completed ? 'cochée' : 'décochée'} depuis le calendrier hebdomadaire.`);
        }
      }
    }, ['projects']);
  }

  openScheduleModal(prefilledDate = null, prefilledTime = null) {
    const modal = document.getElementById('schedule-task-modal');
    if (!modal) return;

    // Populate project dropdown
    const projSelect = document.getElementById('schedule-project-select');
    if (projSelect) {
      projSelect.innerHTML = '<option value="">-- Sélectionnez un projet --</option>';
      StateCoordinator.state.projects.forEach(p => {
        projSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
      });
    }

    // Prefill date and time inputs
    const dateInput = document.getElementById('schedule-date');
    if (dateInput) {
      dateInput.value = prefilledDate || this.formatDateString(new Date());
    }

    const timeInput = document.getElementById('schedule-time');
    if (timeInput) {
      timeInput.value = prefilledTime || '';
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

  checkAlerts(state) {
    const now = new Date();
    const currentDateStr = this.formatDateString(now);
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!state.projects) return;

    state.projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (task.scheduledDate === currentDateStr && !task.completed) {
            const alertKey = `${task.id}-${task.scheduledDate}`;
            
            if (task.scheduledTime) {
              if (currentTimeStr >= task.scheduledTime && !this.alertedTaskIds.has(alertKey)) {
                this.showToastAlert(
                  "Tâche Planifiée Arrivée !",
                  `La tâche <strong>${task.text}</strong> du projet <em>${project.name}</em> est planifiée pour aujourd'hui à ${task.scheduledTime}.`
                );
                this.alertedTaskIds.add(alertKey);
              }
            } else {
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
    
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 50);

    toast.querySelector('.modal-close').onclick = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    };

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
