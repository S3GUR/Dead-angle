import { StateCoordinator } from '../core/StateCoordinator.js';

class CalendarModuleClass {
  constructor() {
    this.currentDate = new Date();
    this.initialized = false;
    this.alertedTaskIds = new Set();
    this.startHour = 8;
    this.endHour = 22;
    this.hourHeight = 60; // height in pixels of 1 hour row
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
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
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

    // Format week title
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
      
      // Corner label
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

    // Group tasks by date (supporting single legacy date or new multiple slots)
    const tasksByDate = {};
    if (state.projects) {
      state.projects.forEach(project => {
        if (project.tasks) {
          project.tasks.forEach(task => {
            // A. Single legacy schedule support
            if (task.scheduledDate) {
              if (!tasksByDate[task.scheduledDate]) {
                tasksByDate[task.scheduledDate] = [];
              }
              tasksByDate[task.scheduledDate].push({ 
                project, 
                task, 
                time: task.scheduledTime || '', 
                duration: parseFloat(task.scheduledDuration || 1) 
              });
            }
            // B. Multi-slots scheduling support
            if (task.scheduledSlots && Array.isArray(task.scheduledSlots)) {
              task.scheduledSlots.forEach(slot => {
                if (slot.date) {
                  if (!tasksByDate[slot.date]) {
                    tasksByDate[slot.date] = [];
                  }
                  tasksByDate[slot.date].push({ 
                    project, 
                    task, 
                    time: slot.time || '', 
                    duration: parseFloat(slot.duration || 1) 
                  });
                }
              });
            }
          });
        }
      });
    }

    // 1. RENDER HOUR COLUMN LABELS & TIMELINE BACKGROUND
    const hourLabelCol = document.createElement('div');
    hourLabelCol.className = 'hour-labels-column';
    
    // Add "All-day" row label
    const allDayLabel = document.createElement('div');
    allDayLabel.className = 'calendar-hour-label-cell all-day';
    allDayLabel.innerText = 'Toute la journée';
    allDayLabel.style.height = '60px';
    hourLabelCol.appendChild(allDayLabel);

    // Add hourly row labels
    for (let h = this.startHour; h <= this.endHour; h++) {
      const lbl = document.createElement('div');
      lbl.className = 'calendar-hour-label-cell';
      lbl.innerText = `${String(h).padStart(2, '0')}:00`;
      lbl.style.height = `${this.hourHeight}px`;
      hourLabelCol.appendChild(lbl);
    }
    grid.appendChild(hourLabelCol);

    // 2. RENDER DAY COLUMNS
    const todayStr = this.formatDateString(new Date());
    
    weekDates.forEach(date => {
      const dateStr = this.formatDateString(date);
      const isToday = dateStr === todayStr;
      
      const dayColumn = document.createElement('div');
      dayColumn.className = `calendar-day-column ${isToday ? 'today' : ''}`;
      
      // A. All-day cell at top of the day column
      const allDayCell = document.createElement('div');
      allDayCell.className = 'calendar-day-all-day-slot';
      allDayCell.style.height = '60px';
      allDayCell.onclick = (e) => {
        if (e.target.closest('.calendar-task-item')) return;
        this.openScheduleModal(dateStr, '');
      };

      const dayAllDayTasks = (tasksByDate[dateStr] || []).filter(({ time }) => !time);
      this.renderAllDayTasks(allDayCell, dayAllDayTasks, dateStr);
      dayColumn.appendChild(allDayCell);

      // B. Hourly timeline block container
      const timelineBody = document.createElement('div');
      timelineBody.className = 'calendar-day-timeline-body';
      const totalHours = this.endHour - this.startHour + 1;
      timelineBody.style.height = `${totalHours * this.hourHeight}px`;

      // Render background horizontal gridlines
      for (let i = 0; i < totalHours; i++) {
        const line = document.createElement('div');
        line.className = 'timeline-gridline';
        line.style.height = `${this.hourHeight}px`;
        timelineBody.appendChild(line);
      }

      // Add click handler to timeline body to pre-fill specific time
      timelineBody.onclick = (e) => {
        if (e.target.closest('.calendar-task-item')) return;
        const rect = timelineBody.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const hourFloat = this.startHour + (clickY / this.hourHeight);
        
        const hourInt = Math.floor(hourFloat);
        const minutesInt = Math.floor((hourFloat - hourInt) * 60);
        
        // Round to nearest 15 minutes
        let roundedMinutes = Math.round(minutesInt / 15) * 15;
        let finalHour = hourInt;
        if (roundedMinutes === 60) {
          roundedMinutes = 0;
          finalHour += 1;
        }
        
        const finalTime = `${String(finalHour).padStart(2, '0')}:${String(roundedMinutes).padStart(2, '0')}`;
        this.openScheduleModal(dateStr, finalTime);
      };

      // C. Render timed tasks absolutely positioned inside the timeline body
      const timedTasks = (tasksByDate[dateStr] || []).filter(({ time }) => time);
      this.renderTimedTasks(timelineBody, timedTasks, dateStr);

      dayColumn.appendChild(timelineBody);
      grid.appendChild(dayColumn);
    });
  }

  renderAllDayTasks(container, tasks, dateStr) {
    if (tasks.length === 0) return;
    
    tasks.forEach(({ project, task, duration }) => {
      const taskItem = this.createTaskBlock(project, task, dateStr, '', duration);
      taskItem.classList.add('all-day-block');
      container.appendChild(taskItem);
    });
  }

  renderTimedTasks(container, tasks, dateStr) {
    tasks.forEach(({ project, task, time, duration }) => {
      const [hours, minutes] = time.split(':').map(Number);
      const startHourFloat = hours + minutes / 60;
      
      // Calculate start and end range
      if (startHourFloat >= this.startHour && startHourFloat <= this.endHour + 1) {
        const top = (startHourFloat - this.startHour) * this.hourHeight;
        const height = duration * this.hourHeight;
        
        const block = this.createTaskBlock(project, task, dateStr, time, duration);
        block.style.position = 'absolute';
        block.style.top = `${top}px`;
        block.style.height = `${height}px`;
        block.style.left = '4px';
        block.style.right = '4px';
        block.style.zIndex = '10';

        // Print extra info inside block if tall enough
        if (duration >= 1) {
          const info = document.createElement('div');
          info.className = 'task-duration-info';
          info.innerText = `${time} (${duration}h)`;
          block.appendChild(info);
        }

        container.appendChild(block);
      }
    });
  }

  createTaskBlock(project, task, dateStr, timeStr, duration) {
    const taskItem = document.createElement('div');
    taskItem.className = `calendar-task-item ${task.completed ? 'completed' : ''}`;
    taskItem.title = `Projet: ${project.name}\nTâche: ${task.name}\nHeure: ${timeStr || 'Toute la journée'}${duration ? `\nDurée: ${duration}h` : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'card-task-checkbox';
    checkbox.checked = task.completed;
    checkbox.style.cssText = 'width: 14px; height: 14px; margin: 0; opacity: 1; pointer-events: auto; flex-shrink: 0; cursor: pointer;';

    checkbox.onchange = (e) => {
      this.toggleTaskStatus(project.id, task.id, e.target.checked);
    };

    const textWrapper = document.createElement('div');
    textWrapper.style.cssText = 'display: flex; flex-direction: column; overflow: hidden;';

    const label = document.createElement('span');
    label.className = 'calendar-task-text';
    label.innerText = task.name;

    const projLabel = document.createElement('span');
    projLabel.style.cssText = 'font-size: 0.65rem; color: var(--text-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
    projLabel.innerText = project.name;

    textWrapper.appendChild(label);
    textWrapper.appendChild(projLabel);

    taskItem.appendChild(checkbox);
    taskItem.appendChild(textWrapper);

    // Unschedule button
    const unscheduleBtn = document.createElement('button');
    unscheduleBtn.className = 'unschedule-task-btn';
    unscheduleBtn.innerHTML = '&times;';
    unscheduleBtn.title = 'Retirer cette planification';
    unscheduleBtn.style.cssText = 'border: none; background: transparent; color: var(--text-dark); cursor: pointer; font-size: 1.1rem; padding: 0 2px; line-height: 1; margin-left: auto; display: flex; align-items: center; justify-content: center;';
    unscheduleBtn.onclick = (e) => {
      e.stopPropagation();
      this.unscheduleTask(project.id, task.id, dateStr, timeStr);
    };
    taskItem.appendChild(unscheduleBtn);

    return taskItem;
  }

  toggleTaskStatus(projectId, taskId, completed) {
    StateCoordinator.updateState(state => {
      const proj = state.projects.find(p => String(p.id) === String(projectId));
      if (proj && proj.tasks) {
        const task = proj.tasks.find(t => String(t.id) === String(taskId));
        if (task) {
          task.completed = completed;
          
          // Re-calculate project progress
          const completedCount = proj.tasks.filter(t => t.completed).length;
          proj.progress = Math.round((completedCount / proj.tasks.length) * 100);

          StateCoordinator.logActivity('project', `Tâche '${task.name}' ${completed ? 'cochée' : 'décochée'} depuis le calendrier.`);
        }
      }
    }, ['projects']);
  }

  unscheduleTask(projectId, taskId, date, time) {
    if (confirm("Voulez-vous retirer cette planification du calendrier ?")) {
      StateCoordinator.updateState(state => {
        const proj = state.projects.find(p => String(p.id) === String(projectId));
        if (proj && proj.tasks) {
          const task = proj.tasks.find(t => String(t.id) === String(taskId));
          if (task) {
            // A. Remove legacy fields if they match
            if (task.scheduledDate === date && task.scheduledTime === time) {
              delete task.scheduledDate;
              delete task.scheduledTime;
              delete task.scheduledDuration;
            }
            // B. Remove matching slot from multi-slots
            if (task.scheduledSlots && Array.isArray(task.scheduledSlots)) {
              task.scheduledSlots = task.scheduledSlots.filter(s => !(s.date === date && s.time === time));
            }
            StateCoordinator.logActivity('project', `Planification de '${task.name}' retirée.`);
          }
        }
      }, ['projects']);
    }
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

    // Reset duration
    const durInput = document.getElementById('schedule-duration');
    if (durInput) durInput.value = '1';

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

    const proj = StateCoordinator.state.projects.find(p => String(p.id) === String(projectId));
    if (!proj || !proj.tasks || proj.tasks.length === 0) {
      taskSelect.innerHTML = "<option value=''>Aucune tâche disponible dans ce projet</option>";
      return;
    }

    const uncompletedTasks = proj.tasks.filter(t => !t.completed);
    if (uncompletedTasks.length === 0) {
      taskSelect.innerHTML = "<option value=''>Toutes les tâches de ce projet sont terminées</option>";
      return;
    }

    taskSelect.innerHTML = '<option value="">-- Sélectionnez la tâche --</option>';
    uncompletedTasks.forEach(t => {
      let planText = '';
      const slotsCount = (t.scheduledSlots ? t.scheduledSlots.length : 0) + (t.scheduledDate ? 1 : 0);
      if (slotsCount > 0) {
        planText = ` (${slotsCount} planifiée${slotsCount > 1 ? 's' : ''})`;
      }
      taskSelect.innerHTML += `<option value="${t.id}">${t.name}${planText}</option>`;
    });
  }

  handleScheduleSubmit(e) {
    try {
      e.preventDefault();

      const projectId = document.getElementById('schedule-project-select').value;
      const taskId = document.getElementById('schedule-task-select').value;
      const date = document.getElementById('schedule-date').value;
      const time = document.getElementById('schedule-time').value;
      const duration = parseFloat(document.getElementById('schedule-duration').value) || 1;

      if (!projectId || !taskId || !date) return;

      StateCoordinator.updateState(state => {
        const proj = state.projects.find(p => String(p.id) === String(projectId));
        if (proj && proj.tasks) {
          const task = proj.tasks.find(t => String(t.id) === String(taskId));
          if (task) {
            if (!task.scheduledSlots) {
              task.scheduledSlots = [];
            }

            // Migrate legacy slot if present
            if (task.scheduledDate) {
              task.scheduledSlots.push({
                date: task.scheduledDate,
                time: task.scheduledTime || '',
                duration: parseFloat(task.scheduledDuration || 1)
              });
              delete task.scheduledDate;
              delete task.scheduledTime;
              delete task.scheduledDuration;
            }

            // Append new slot
            task.scheduledSlots.push({
              date,
              time: time || '',
              duration
            });

            StateCoordinator.logActivity('project', `Tâche '${task.name}' planifiée sur le calendrier.`);
          }
        }
      }, ['projects']);

      document.getElementById('schedule-task-modal').classList.remove('active');
      document.getElementById('schedule-task-form').reset();
    } catch (err) {
      alert("Erreur de planification: " + err.message + "\n" + err.stack);
      console.error(err);
    }
  }

  checkAlerts(state) {
    const now = new Date();
    const currentDateStr = this.formatDateString(now);
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (!state.projects) return;

    state.projects.forEach(project => {
      if (project.tasks) {
        project.tasks.forEach(task => {
          if (task.completed) return;

          // Check legacy date alert
          if (task.scheduledDate === currentDateStr) {
            this.triggerAlertIfNeeded(project, task, task.scheduledTime, currentDateStr);
          }

          // Check multi-slots alerts
          if (task.scheduledSlots && Array.isArray(task.scheduledSlots)) {
            task.scheduledSlots.forEach(slot => {
              if (slot.date === currentDateStr) {
                this.triggerAlertIfNeeded(project, task, slot.time, currentDateStr);
              }
            });
          }
        });
      }
    });
  }

  triggerAlertIfNeeded(project, task, time, dateStr) {
    const alertKey = `${task.id}-${dateStr}-${time || 'allday'}`;
    const now = new Date();
    const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (time) {
      if (currentTimeStr >= time && !this.alertedTaskIds.has(alertKey)) {
        this.showToastAlert(
          "Tâche Planifiée Arrivée !",
          `La tâche <strong>${task.name}</strong> du projet <em>${project.name}</em> est planifiée pour aujourd'hui à ${time}.`
        );
        this.alertedTaskIds.add(alertKey);
      }
    } else {
      if (!this.alertedTaskIds.has(alertKey)) {
        this.showToastAlert(
          "Tâche Prévue Aujourd'hui !",
          `La tâche <strong>${task.name}</strong> du projet <em>${project.name}</em> est planifiée pour aujourd'hui.`
        );
        this.alertedTaskIds.add(alertKey);
      }
    }
  }

  showToastAlert(title, text) {
    const container = document.getElementById('dead-angle-toast-container');
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
