const TaskManager = require('../TaskManager');

describe('TaskManager - Day 2: US1 Create Task', () => {
  let taskManager;

  beforeEach(() => {
    // localStorage is already mocked and cleared in setupTests.js
    taskManager = new TaskManager();
  });

  describe('US1: Create Task Tests (12 test cases)', () => {
    it('should create a task with valid data', () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        status: 'to-do'
      };

      const task = taskManager.createTask(taskData);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.priority).toBe('high');
      expect(task.status).toBe('to-do');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    });

    it('should create task with minimal required data', () => {
      const taskData = {
        title: 'Minimal Task',
        priority: 'medium',
        status: 'to-do'
      };

      const task = taskManager.createTask(taskData);

      expect(task.title).toBe('Minimal Task');
      expect(task.description).toBe('');
      expect(task.priority).toBe('medium');
      expect(task.status).toBe('to-do');
    });

    it('should trim whitespace from title and description', () => {
      const taskData = {
        title: '  Trimmed Task  ',
        description: '  Trimmed Description  ',
        priority: 'low',
        status: 'in-progress'
      };

      const task = taskManager.createTask(taskData);

      expect(task.title).toBe('Trimmed Task');
      expect(task.description).toBe('Trimmed Description');
    });

    it('should add task to tasks array', () => {
      const initialLength = taskManager.tasks.length;
      
      taskManager.createTask({
        title: 'Array Test',
        priority: 'medium',
        status: 'to-do'
      });

      expect(taskManager.tasks.length).toBe(initialLength + 1);
      expect(taskManager.tasks[taskManager.tasks.length - 1].title).toBe('Array Test');
    });

    it('should save tasks to localStorage after creation', () => {
      taskManager.createTask({
        title: 'Storage Test',
        priority: 'high',
        status: 'done'
      });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'taskeasy-tasks',
        expect.any(String)
      );
    });

    it('should generate unique IDs for different tasks', () => {
      const task1 = taskManager.createTask({
        title: 'Task 1',
        priority: 'high',
        status: 'to-do'
      });

      // Change mock values to simulate different time/random
      Date.now.mockReturnValue(1640995300000);
      Math.random.mockReturnValue(0.987654321);

      const task2 = taskManager.createTask({
        title: 'Task 2',
        priority: 'low',
        status: 'done'
      });

      expect(task1.id).not.toBe(task2.id);
    });

    it('should handle all priority levels', () => {
      const priorities = ['high', 'medium', 'low'];
      
      priorities.forEach(priority => {
        const task = taskManager.createTask({
          title: `${priority} priority task`,
          priority,
          status: 'to-do'
        });
        
        expect(task.priority).toBe(priority);
      });
    });

    it('should handle all status levels', () => {
      const statuses = ['to-do', 'in-progress', 'done'];
      
      statuses.forEach(status => {
        const task = taskManager.createTask({
          title: `${status} status task`,
          priority: 'medium',
          status
        });
        
        expect(task.status).toBe(status);
      });
    });

    it('should set createdAt and updatedAt timestamps', () => {
      const task = taskManager.createTask({
        title: 'Timestamp Test',
        priority: 'medium',
        status: 'to-do'
      });

      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
      expect(new Date(task.createdAt)).toBeInstanceOf(Date);
      expect(new Date(task.updatedAt)).toBeInstanceOf(Date);
    });

    it('should handle empty description gracefully', () => {
      const task = taskManager.createTask({
        title: 'No Description Task',
        description: '',
        priority: 'medium',
        status: 'to-do'
      });

      expect(task.description).toBe('');
    });

    it('should handle undefined description', () => {
      const task = taskManager.createTask({
        title: 'Undefined Description Task',
        priority: 'medium',
        status: 'to-do'
      });

      expect(task.description).toBe('');
    });

    it('should create multiple tasks successfully', () => {
      const tasksToCreate = [
        { title: 'Task 1', priority: 'high', status: 'to-do' },
        { title: 'Task 2', priority: 'medium', status: 'in-progress' },
        { title: 'Task 3', priority: 'low', status: 'done' }
      ];

      tasksToCreate.forEach(taskData => {
        taskManager.createTask(taskData);
      });

      expect(taskManager.tasks.length).toBe(3);
      expect(taskManager.tasks.map(t => t.title)).toEqual(['Task 1', 'Task 2', 'Task 3']);
    });
  });

  describe('Validation Tests (8 test cases)', () => {
    it('should throw error for empty title', () => {
      expect(() => {
        taskManager.createTask({
          title: '',
          priority: 'medium',
          status: 'to-do'
        });
      }).toThrow('Title is required');
    });

    it('should throw error for whitespace-only title', () => {
      expect(() => {
        taskManager.createTask({
          title: '   ',
          priority: 'medium',
          status: 'to-do'
        });
      }).toThrow('Title is required');
    });

    it('should throw error for missing title', () => {
      expect(() => {
        taskManager.createTask({
          priority: 'medium',
          status: 'to-do'
        });
      }).toThrow('Title is required');
    });

    it('should throw error for title exceeding 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      
      expect(() => {
        taskManager.createTask({
          title: longTitle,
          priority: 'medium',
          status: 'to-do'
        });
      }).toThrow('Title must be less than 100 characters');
    });

    it('should accept title with exactly 100 characters', () => {
      const maxTitle = 'a'.repeat(100);
      
      const task = taskManager.createTask({
        title: maxTitle,
        priority: 'medium',
        status: 'to-do'
      });

      expect(task.title).toBe(maxTitle);
    });

    it('should throw error for invalid priority', () => {
      expect(() => {
        taskManager.createTask({
          title: 'Test Task',
          priority: 'invalid',
          status: 'to-do'
        });
      }).toThrow('Invalid priority value');
    });

    it('should throw error for invalid status', () => {
      expect(() => {
        taskManager.createTask({
          title: 'Test Task',
          priority: 'medium',
          status: 'invalid'
        });
      }).toThrow('Invalid status value');
    });

    it('should return first validation error when multiple errors exist', () => {
      expect(() => {
        taskManager.createTask({
          title: '',
          priority: 'invalid',
          status: 'invalid'
        });
      }).toThrow('Title is required');
    });
  });

  describe('Persistence Tests (4 test cases)', () => {
    it('should load empty array when localStorage is empty', () => {
      // localStorage is already cleared in beforeEach
      const newTaskManager = new TaskManager();
      
      expect(newTaskManager.tasks).toEqual([]);
    });

    it('should load existing tasks from localStorage', () => {
      const existingTasks = [
        {
          id: 'test-id-1',
          title: 'Existing Task',
          description: 'From storage',
          priority: 'high',
          status: 'to-do',
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z'
        }
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(existingTasks));
      
      const newTaskManager = new TaskManager();
      
      expect(newTaskManager.tasks).toEqual(existingTasks);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.getItem.mockReturnValue('invalid json');
      
      const newTaskManager = new TaskManager();
      
      expect(newTaskManager.tasks).toEqual([]);
      expect(console.error).toHaveBeenCalledWith('Error loading tasks:', expect.any(Error));
    });

    it('should handle localStorage save errors gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      taskManager.createTask({
        title: 'Test Task',
        priority: 'medium',
        status: 'to-do'
      });
      
      expect(console.error).toHaveBeenCalledWith('Error saving tasks:', expect.any(Error));
    });
  });

  describe('Utility Functions Tests (3 test cases)', () => {
    it('should escape HTML to prevent XSS attacks', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      const escaped = taskManager.escapeHtml(maliciousInput);
      
      expect(escaped).toBe('&lt;script&gt;alert("xss")&lt;/script&gt;');
      expect(escaped).not.toContain('<script>');
    });

    it('should format dates as relative time strings', () => {
      const now = new Date();
      
      // Test "Just now"
      const justNow = now.toISOString();
      expect(taskManager.formatDate(justNow)).toBe('Just now');
      
      // Test minutes ago
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
      expect(taskManager.formatDate(fiveMinutesAgo)).toBe('5m ago');
      
      // Test hours ago
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      expect(taskManager.formatDate(twoHoursAgo)).toBe('2h ago');
      
      // Test days ago
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
      expect(taskManager.formatDate(threeDaysAgo)).toBe('3d ago');
    });

    it('should generate unique identifiers', () => {
      const id1 = taskManager.generateId();
      
      // Change mock values
      Date.now.mockReturnValue(1640995400000);
      Math.random.mockReturnValue(0.555555555);
      
      const id2 = taskManager.generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });
  });

  describe('UI Integration Tests', () => {
    it('should update stats after creating task', () => {
      const statsElement = document.getElementById('taskStats');
      
      taskManager.createTask({
        title: 'Stats Test',
        priority: 'medium',
        status: 'to-do'
      });
      
      taskManager.updateStats();
      
      expect(statsElement.textContent).toContain('1 task created');
    });

    it('should render empty state when no tasks exist', () => {
      taskManager.tasks = [];
      taskManager.renderTasks();
      
      const taskList = document.getElementById('taskList');
      expect(taskList.innerHTML).toContain('No tasks yet');
      expect(taskList.innerHTML).toContain('empty-state');
    });

    it('should render tasks when tasks exist', () => {
      taskManager.createTask({
        title: 'Render Test',
        description: 'Test Description',
        priority: 'high',
        status: 'to-do'
      });
      
      taskManager.renderTasks();
      
      const taskList = document.getElementById('taskList');
      expect(taskList.innerHTML).toContain('Render Test');
      expect(taskList.innerHTML).toContain('Test Description');
      expect(taskList.innerHTML).toContain('priority-high');
    });

    it('should handle missing DOM elements gracefully', () => {
      // Remove taskList element
      const taskList = document.getElementById('taskList');
      if (taskList) {
        taskList.remove();
      }
      
      expect(() => {
        taskManager.renderTasks();
      }).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle special characters in title', () => {
      const specialTitle = 'Task with émojis 🚀 and spëcial chars!';
      
      const task = taskManager.createTask({
        title: specialTitle,
        priority: 'medium',
        status: 'to-do'
      });
      
      expect(task.title).toBe(specialTitle);
    });

    it('should handle very long descriptions', () => {
      const longDescription = 'a'.repeat(1000);
      
      const task = taskManager.createTask({
        title: 'Long Description Task',
        description: longDescription,
        priority: 'medium',
        status: 'to-do'
      });
      
      expect(task.description).toBe(longDescription);
    });

    it('should validate task data correctly', () => {
      const validationErrors = taskManager.validateTask({
        title: '',
        priority: 'invalid',
        status: 'invalid'
      });
      
      expect(validationErrors).toContain('Title is required');
      expect(validationErrors).toContain('Invalid priority value');
      expect(validationErrors).toContain('Invalid status value');
    });

    it('should handle form submission with missing elements', () => {
      // Remove form elements
      document.getElementById('taskTitle').remove();
      
      expect(() => {
        taskManager.handleFormSubmit();
      }).not.toThrow();
    });
  });

  describe('Statistics and Rendering', () => {
    it('should calculate correct statistics for multiple tasks', () => {
      // Create tasks with different statuses
      taskManager.createTask({ title: 'Todo Task', priority: 'high', status: 'to-do' });
      taskManager.createTask({ title: 'Progress Task', priority: 'medium', status: 'in-progress' });
      taskManager.createTask({ title: 'Done Task', priority: 'low', status: 'done' });
      
      taskManager.updateStats();
      
      const statsElement = document.getElementById('taskStats');
      const statsText = statsElement.textContent;
      
      expect(statsText).toContain('3 tasks created');
      expect(statsText).toContain('1 done');
      expect(statsText).toContain('1 active');
      expect(statsText).toContain('1 todo');
    });

    it('should create proper HTML for task items', () => {
      const task = {
        id: 'test-123',
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        status: 'to-do',
        createdAt: new Date().toISOString()
      };
      
      const html = taskManager.createTaskHTML(task);
      
      expect(html).toContain('data-task-id="test-123"');
      expect(html).toContain('Test Task');
      expect(html).toContain('Test Description');
      expect(html).toContain('priority-high');
      expect(html).toContain('status-to-do');
    });

    it('should handle task HTML creation without description', () => {
      const task = {
        id: 'test-456',
        title: 'No Description Task',
        description: '',
        priority: 'medium',
        status: 'done',
        createdAt: new Date().toISOString()
      };
      
      const html = taskManager.createTaskHTML(task);
      
      expect(html).toContain('No Description Task');
      expect(html).not.toContain('task-description');
    });
  });
});
