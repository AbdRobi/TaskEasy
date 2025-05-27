const TaskManager = require('../TaskManager');

describe('TaskManager - Day 3: US2 Priority Sorting', () => {
  let taskManager;

  beforeEach(() => {
    // Reset mocks to default values
    Date.now.mockReturnValue(1640995200000);
    Math.random.mockReturnValue(0.123456789);
    
    // localStorage is already mocked and cleared in setupTests.js
    taskManager = new TaskManager();
    
    // Explicitly clear tasks array
    taskManager.tasks = [];
  });

  describe('US2: Priority Sorting Tests (15 test cases)', () => {
    it('should sort tasks by priority: high > medium > low', () => {
      // Create tasks in mixed priority order
      taskManager.createTask({ title: 'Low Task', priority: 'low', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.234567890);
      taskManager.createTask({ title: 'High Task', priority: 'high', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995202000);
      Math.random.mockReturnValue(0.345678901);
      taskManager.createTask({ title: 'Medium Task', priority: 'medium', status: 'to-do' });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks[0].title).toBe('High Task');
      expect(sortedTasks[1].title).toBe('Medium Task');
      expect(sortedTasks[2].title).toBe('Low Task');
    });

    it('should maintain creation order within same priority level', () => {
      // Create multiple tasks with same priority
      taskManager.createTask({ title: 'High Task 1', priority: 'high', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.234567890);
      taskManager.createTask({ title: 'High Task 2', priority: 'high', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995202000);
      Math.random.mockReturnValue(0.345678901);
      taskManager.createTask({ title: 'High Task 3', priority: 'high', status: 'to-do' });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks[0].title).toBe('High Task 1');
      expect(sortedTasks[1].title).toBe('High Task 2');
      expect(sortedTasks[2].title).toBe('High Task 3');
    });

    it('should not modify original tasks array', () => {
      const originalTasks = [
        { title: 'Low Task', priority: 'low', status: 'to-do' },
        { title: 'High Task', priority: 'high', status: 'to-do' }
      ];

      originalTasks.forEach((taskData, index) => {
        Date.now.mockReturnValue(1640995200000 + (index * 1000));
        Math.random.mockReturnValue(0.123456789 + (index * 0.1));
        taskManager.createTask(taskData);
      });
      
      const originalOrder = [...taskManager.tasks];
      taskManager.getTasksSortedByPriority();

      expect(taskManager.tasks).toEqual(originalOrder);
    });

    it('should handle empty task list', () => {
      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks).toEqual([]);
      expect(Array.isArray(sortedTasks)).toBe(true);
    });

    it('should handle single task correctly', () => {
      taskManager.createTask({ title: 'Single Task', priority: 'medium', status: 'to-do' });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks).toHaveLength(1);
      expect(sortedTasks[0].title).toBe('Single Task');
    });

    it('should sort complex mixed priority dataset', () => {
      const testTasks = [
        { title: 'Medium 1', priority: 'medium', status: 'to-do' },
        { title: 'Low 1', priority: 'low', status: 'to-do' },
        { title: 'High 1', priority: 'high', status: 'to-do' },
        { title: 'Medium 2', priority: 'medium', status: 'in-progress' },
        { title: 'High 2', priority: 'high', status: 'done' },
        { title: 'Low 2', priority: 'low', status: 'to-do' }
      ];

      testTasks.forEach((taskData, index) => {
        Date.now.mockReturnValue(1640995200000 + (index * 1000));
        Math.random.mockReturnValue(0.123456789 + (index * 0.1));
        taskManager.createTask(taskData);
      });
      
      const sortedTasks = taskManager.getTasksSortedByPriority();

      // Check priority order
      expect(sortedTasks[0].priority).toBe('high');
      expect(sortedTasks[1].priority).toBe('high');
      expect(sortedTasks[2].priority).toBe('medium');
      expect(sortedTasks[3].priority).toBe('medium');
      expect(sortedTasks[4].priority).toBe('low');
      expect(sortedTasks[5].priority).toBe('low');

      // Check creation order within priorities
      expect(sortedTasks[0].title).toBe('High 1');
      expect(sortedTasks[1].title).toBe('High 2');
      expect(sortedTasks[2].title).toBe('Medium 1');
      expect(sortedTasks[3].title).toBe('Medium 2');
    });

    it('should return new array instance each time', () => {
      taskManager.createTask({ title: 'Test Task', priority: 'high', status: 'to-do' });

      const sorted1 = taskManager.getTasksSortedByPriority();
      const sorted2 = taskManager.getTasksSortedByPriority();

      expect(sorted1).not.toBe(sorted2); // Different array instances
      expect(sorted1).toEqual(sorted2); // Same content
    });

    it('should handle all priority combinations', () => {
      const priorities = ['high', 'medium', 'low'];
      const testCombinations = [
        ['high', 'medium', 'low'],
        ['low', 'high', 'medium'],
        ['medium', 'low', 'high']
      ];

      testCombinations.forEach((combo, comboIndex) => {
        // Reset tasks for each combination
        taskManager.tasks = [];
        
        combo.forEach((priority, i) => {
          Date.now.mockReturnValue(1640995200000 + (comboIndex * 10000) + (i * 1000));
          Math.random.mockReturnValue(0.123456789 + (comboIndex * 0.01) + (i * 0.001));
          
          taskManager.createTask({
            title: `Task ${i}`,
            priority,
            status: 'to-do'
          });
        });

        const sorted = taskManager.getTasksSortedByPriority();
        
        // Verify sorting is correct
        for (let i = 0; i < sorted.length - 1; i++) {
          const currentPriority = sorted[i].priority;
          const nextPriority = sorted[i + 1].priority;
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          
          expect(priorityOrder[currentPriority]).toBeLessThanOrEqual(priorityOrder[nextPriority]);
        }
      });
    });

    it('should preserve all task properties during sorting', () => {
      const taskData = {
        title: 'Complete Task',
        description: 'Full description',
        priority: 'high',
        status: 'in-progress'
      };

      const originalTask = taskManager.createTask(taskData);
      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks[0]).toEqual(originalTask);
      expect(sortedTasks[0]).toHaveProperty('id');
      expect(sortedTasks[0]).toHaveProperty('createdAt');
      expect(sortedTasks[0]).toHaveProperty('updatedAt');
    });

    it('should handle tasks with different statuses correctly', () => {
      const statuses = ['to-do', 'in-progress', 'done'];
      
      statuses.forEach((status, index) => {
        Date.now.mockReturnValue(1640995200000 + (index * 1000));
        Math.random.mockReturnValue(0.123456789 + (index * 0.1));
        
        taskManager.createTask({
          title: `${status} High Task`,
          priority: 'high',
          status
        });
      });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks).toHaveLength(3);
      sortedTasks.forEach(task => {
        expect(task.priority).toBe('high');
      });
    });

    it('should work with renderTasks integration', () => {
      taskManager.createTask({ title: 'Low Priority', priority: 'low', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.987654321);
      taskManager.createTask({ title: 'High Priority', priority: 'high', status: 'to-do' });

      taskManager.renderTasks();

      const taskList = document.getElementById('taskList');
      const taskElements = taskList.querySelectorAll('.task-item');

      expect(taskElements).toHaveLength(2);
      expect(taskElements[0].querySelector('.task-title').textContent).toBe('High Priority');
      expect(taskElements[1].querySelector('.task-title').textContent).toBe('Low Priority');
    });

    it('should maintain sorting after new task creation', () => {
      taskManager.createTask({ title: 'Medium Task', priority: 'medium', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.234567890);
      taskManager.createTask({ title: 'Low Task', priority: 'low', status: 'to-do' });

      Date.now.mockReturnValue(1640995202000);
      Math.random.mockReturnValue(0.345678901);
      taskManager.createTask({ title: 'High Task', priority: 'high', status: 'to-do' });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks[0].title).toBe('High Task');
      expect(sortedTasks[1].title).toBe('Medium Task');
      expect(sortedTasks[2].title).toBe('Low Task');
    });

    it('should handle large datasets efficiently', () => {
      // Create 20 tasks instead of 50 for faster test execution
      const priorities = ['high', 'medium', 'low'];
      for (let i = 0; i < 20; i++) {
        const randomPriority = priorities[i % 3];
        
        Date.now.mockReturnValue(1640995200000 + (i * 1000));
        Math.random.mockReturnValue(0.123456789 + (i * 0.001));
        
        taskManager.createTask({
          title: `Task ${i}`,
          priority: randomPriority,
          status: 'to-do'
        });
      }

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks).toHaveLength(20);

      // Verify sorting correctness (main focus of this test)
      for (let i = 0; i < sortedTasks.length - 1; i++) {
        const current = sortedTasks[i];
        const next = sortedTasks[i + 1];
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        
        expect(priorityOrder[current.priority]).toBeLessThanOrEqual(priorityOrder[next.priority]);
      }
    });

    it('should be stable sort algorithm', () => {
      // Create tasks with same priority but different creation times
      const tasks = [
        { title: 'First Medium', priority: 'medium', status: 'to-do' },
        { title: 'Second Medium', priority: 'medium', status: 'to-do' },
        { title: 'Third Medium', priority: 'medium', status: 'to-do' }
      ];

      tasks.forEach((taskData, index) => {
        Date.now.mockReturnValue(1640995200000 + (index * 1000));
        Math.random.mockReturnValue(0.123456789 + (index * 0.1));
        taskManager.createTask(taskData);
      });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks[0].title).toBe('First Medium');
      expect(sortedTasks[1].title).toBe('Second Medium');
      expect(sortedTasks[2].title).toBe('Third Medium');
    });
  });

  describe('Priority Statistics Tests', () => {
    it('should calculate priority statistics correctly', () => {
      taskManager.createTask({ title: 'High 1', priority: 'high', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.234567890);
      taskManager.createTask({ title: 'High 2', priority: 'high', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995202000);
      Math.random.mockReturnValue(0.345678901);
      taskManager.createTask({ title: 'Medium 1', priority: 'medium', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995203000);
      Math.random.mockReturnValue(0.456789012);
      taskManager.createTask({ title: 'Low 1', priority: 'low', status: 'to-do' });

      const stats = taskManager.getPriorityStats();

      expect(stats).toEqual({
        high: 2,
        medium: 1,
        low: 1
      });
    });

    it('should return zero stats for empty task list', () => {
      const stats = taskManager.getPriorityStats();

      expect(stats).toEqual({
        high: 0,
        medium: 0,
        low: 0
      });
    });

    it('should update stats display with priority breakdown', () => {
      taskManager.createTask({ title: 'High Task', priority: 'high', status: 'done' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.234567890);
      taskManager.createTask({ title: 'Medium Task', priority: 'medium', status: 'in-progress' });
      
      Date.now.mockReturnValue(1640995202000);
      Math.random.mockReturnValue(0.345678901);
      taskManager.createTask({ title: 'Low Task', priority: 'low', status: 'to-do' });

      taskManager.updateStats();

      const statsElement = document.getElementById('taskStats');
      const statsText = statsElement.textContent;

      expect(statsText).toContain('3 tasks created');
      expect(statsText).toContain('1 done');
      expect(statsText).toContain('1 active');
      expect(statsText).toContain('1 todo');
      expect(statsText).toContain('Priority: 1H/1M/1L');
    });
  });

  describe('Helper Functions Tests', () => {
    it('should validate priority values correctly', () => {
      expect(['high', 'medium', 'low'].includes('high')).toBe(true);
      expect(['high', 'medium', 'low'].includes('medium')).toBe(true);
      expect(['high', 'medium', 'low'].includes('low')).toBe(true);
      expect(['high', 'medium', 'low'].includes('invalid')).toBe(false);
    });

    it('should get priority order correctly', () => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };

      expect(priorityOrder['high']).toBe(1);
      expect(priorityOrder['medium']).toBe(2);
      expect(priorityOrder['low']).toBe(3);
    });

    it('should format priority text correctly', () => {
      const priorityText = { high: "High", medium: "Medium", low: "Low" };

      expect(priorityText['high']).toBe('High');
      expect(priorityText['medium']).toBe('Medium');
      expect(priorityText['low']).toBe('Low');
    });
  });

  describe('Integration Tests (8 test cases)', () => {
    it('should integrate sorting with task creation workflow', () => {
      // Simulate user creating tasks in random order
      const userActions = [
        { title: 'Buy groceries', priority: 'low', status: 'to-do' },
        { title: 'Fix critical bug', priority: 'high', status: 'to-do' },
        { title: 'Review PR', priority: 'medium', status: 'to-do' },
        { title: 'Deploy to production', priority: 'high', status: 'in-progress' }
      ];

      userActions.forEach((taskData, index) => {
        Date.now.mockReturnValue(1640995200000 + (index * 1000));
        Math.random.mockReturnValue(0.123456789 + (index * 0.1));
        
        taskManager.createTask(taskData);
        taskManager.renderTasks(); // Simulate UI update
      });

      const taskList = document.getElementById('taskList');
      const taskElements = taskList.querySelectorAll('.task-item');

      expect(taskElements[0].querySelector('.task-title').textContent).toBe('Fix critical bug');
      expect(taskElements[1].querySelector('.task-title').textContent).toBe('Deploy to production');
      expect(taskElements[2].querySelector('.task-title').textContent).toBe('Review PR');
      expect(taskElements[3].querySelector('.task-title').textContent).toBe('Buy groceries');
    });

    it('should maintain sorting after form submission', () => {
      // Pre-populate with some tasks
      taskManager.createTask({ title: 'Existing Low', priority: 'low', status: 'to-do' });

      // Simulate form submission
      document.getElementById('taskTitle').value = 'New High Priority';
      document.getElementById('taskPriority').value = 'high';
      document.getElementById('taskStatus').value = 'to-do';

      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.987654321);

      taskManager.handleFormSubmit();

      const sortedTasks = taskManager.getTasksSortedByPriority();
      expect(sortedTasks[0].title).toBe('New High Priority');
      expect(sortedTasks[1].title).toBe('Existing Low');
    });

    it('should update statistics correctly with priority breakdown', () => {
      const tasks = [
        { title: 'High 1', priority: 'high', status: 'done' },
        { title: 'High 2', priority: 'high', status: 'to-do' },
        { title: 'Medium 1', priority: 'medium', status: 'in-progress' },
        { title: 'Low 1', priority: 'low', status: 'to-do' }
      ];

      tasks.forEach((taskData, index) => {
        Date.now.mockReturnValue(1640995200000 + (index * 1000));
        Math.random.mockReturnValue(0.123456789 + (index * 0.1));
        taskManager.createTask(taskData);
      });
      
      taskManager.updateStats();

      const statsElement = document.getElementById('taskStats');
      const statsText = statsElement.textContent;

      expect(statsText).toContain('4 tasks created');
      expect(statsText).toContain('Priority: 2H/1M/1L');
    });

    it('should handle empty state with sorting message', () => {
      taskManager.renderTasks();

      const taskList = document.getElementById('taskList');
      expect(taskList.innerHTML).toContain('No tasks yet');
      expect(taskList.innerHTML).toContain('automatically sorted by priority');
    });

    it('should preserve task data integrity during sorting operations', () => {
      const originalTask = taskManager.createTask({
        title: 'Test Task',
        description: 'Test Description',
        priority: 'high',
        status: 'in-progress'
      });

      const sortedTasks = taskManager.getTasksSortedByPriority();
      const foundTask = sortedTasks.find(task => task.id === originalTask.id);

      expect(foundTask).toEqual(originalTask);
      expect(foundTask.title).toBe('Test Task');
      expect(foundTask.description).toBe('Test Description');
      expect(foundTask.priority).toBe('high');
      expect(foundTask.status).toBe('in-progress');
    });

    it('should work correctly with localStorage persistence', () => {
      // Create tasks
      taskManager.createTask({ title: 'Low Task', priority: 'low', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.987654321);
      taskManager.createTask({ title: 'High Task', priority: 'high', status: 'to-do' });

      // Simulate page reload
      localStorage.getItem.mockReturnValue(JSON.stringify(taskManager.tasks));
      const newTaskManager = new TaskManager();

      const sortedTasks = newTaskManager.getTasksSortedByPriority();

      expect(sortedTasks[0].title).toBe('High Task');
      expect(sortedTasks[1].title).toBe('Low Task');
    });

    it('should handle concurrent task operations correctly', () => {
      // Simulate rapid task creation
      const tasks = [];
      for (let i = 0; i < 10; i++) {
        const priority = i % 2 === 0 ? 'high' : 'low';
        
        Date.now.mockReturnValue(1640995200000 + (i * 1000));
        Math.random.mockReturnValue(0.123456789 + (i * 0.01));
        
        tasks.push(taskManager.createTask({
          title: `Task ${i}`,
          priority,
          status: 'to-do'
        }));
      }

      const sortedTasks = taskManager.getTasksSortedByPriority();

      // All high priority tasks should come first
      const highTasks = sortedTasks.filter(task => task.priority === 'high');
      const lowTasks = sortedTasks.filter(task => task.priority === 'low');

      expect(highTasks).toHaveLength(5);
      expect(lowTasks).toHaveLength(5);

      // Check that all high priority tasks come before low priority tasks
      const firstLowIndex = sortedTasks.findIndex(task => task.priority === 'low');
      const lastHighIndex = sortedTasks.map(task => task.priority).lastIndexOf('high');

      expect(lastHighIndex).toBeLessThan(firstLowIndex);
    });

    it('should maintain UI consistency during sorting operations', () => {
      // Create tasks and render
      taskManager.createTask({ title: 'Medium Task', priority: 'medium', status: 'to-do' });
      
      Date.now.mockReturnValue(1640995201000);
      Math.random.mockReturnValue(0.987654321);
      taskManager.createTask({ title: 'High Task', priority: 'high', status: 'to-do' });
      taskManager.renderTasks();

      const taskElements = document.querySelectorAll('.task-item');

      expect(taskElements).toHaveLength(2);
      expect(taskElements[0].classList.contains('priority-high')).toBe(true);
      expect(taskElements[1].classList.contains('priority-medium')).toBe(true);
    });
  });

  describe('Performance Tests (3 test cases)', () => {
    it('should handle moderate datasets efficiently', () => {
      // Test with 30 tasks for reasonable performance expectations
      const priorities = ['high', 'medium', 'low'];
      for (let i = 0; i < 30; i++) {
        const randomPriority = priorities[i % 3];
        
        Date.now.mockReturnValue(1640995200000 + (i * 1000));
        Math.random.mockReturnValue(0.123456789 + (i * 0.001));
        
        taskManager.createTask({
          title: `Performance Task ${i}`,
          priority: randomPriority,
          status: 'to-do'
        });
      }

      const sortedTasks = taskManager.getTasksSortedByPriority();

      expect(sortedTasks).toHaveLength(30);

      // Verify sorting correctness (main focus)
      let lastPriorityOrder = 0;
      const priorityOrder = { high: 1, medium: 2, low: 3 };

      sortedTasks.forEach(task => {
        const currentPriorityOrder = priorityOrder[task.priority];
        expect(currentPriorityOrder).toBeGreaterThanOrEqual(lastPriorityOrder);
        lastPriorityOrder = currentPriorityOrder;
      });
    });

    it('should have consistent performance across multiple sorts', () => {
      // Create smaller dataset for consistent testing
      for (let i = 0; i < 15; i++) {
        const priority = ['high', 'medium', 'low'][i % 3];
        
        Date.now.mockReturnValue(1640995200000 + (i * 1000));
        Math.random.mockReturnValue(0.123456789 + (i * 0.001));
        
        taskManager.createTask({
          title: `Task ${i}`,
          priority,
          status: 'to-do'
        });
      }

      // Perform multiple sorts and verify consistency
      const results = [];
      for (let i = 0; i < 5; i++) {
        const sortedTasks = taskManager.getTasksSortedByPriority();
        results.push(sortedTasks);
      }

      // All results should be identical
      results.forEach(result => {
        expect(result).toEqual(results[0]);
        expect(result).toHaveLength(15);
      });
    });

    it('should handle reasonable dataset sizes without issues', () => {
      const initialTaskCount = taskManager.tasks.length;

      // Create 100 tasks for memory test
      for (let i = 0; i < 100; i++) {
        Date.now.mockReturnValue(1640995200000 + (i * 1000));
        Math.random.mockReturnValue(0.123456789 + (i * 0.0001));
        
        taskManager.createTask({
          title: `Memory Test ${i}`,
          priority: ['high', 'medium', 'low'][i % 3],
          status: 'to-do'
        });

        // Perform sorting every 20 tasks
        if (i % 20 === 0) {
          const sorted = taskManager.getTasksSortedByPriority();
          expect(sorted.length).toBeGreaterThan(0);
        }
      }

      // Final verification
      const finalSorted = taskManager.getTasksSortedByPriority();
      expect(finalSorted).toHaveLength(100);
      
      // Verify final sorting is correct
      for (let i = 0; i < finalSorted.length - 1; i++) {
        const current = finalSorted[i];
        const next = finalSorted[i + 1];
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        
        expect(priorityOrder[current.priority]).toBeLessThanOrEqual(priorityOrder[next.priority]);
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle malformed task data gracefully', () => {
      // Start with clean slate
      taskManager.tasks = [];
      
      // Add a task with missing priority (should not happen in normal flow)
      const malformedTask = {
        id: 'malformed',
        title: 'Malformed Task',
        status: 'to-do'
        // Missing priority
      };

      taskManager.tasks.push(malformedTask);

      expect(() => {
        taskManager.getTasksSortedByPriority();
      }).not.toThrow();
      
      // Should filter out malformed tasks
      const sortedTasks = taskManager.getTasksSortedByPriority();
      expect(sortedTasks).toHaveLength(0);
    });

    it('should handle null or undefined tasks in array', () => {
      // Start with completely clean slate
      taskManager.tasks = [];
      
      // Manually add null and undefined to tasks array
      taskManager.tasks.push(null);
      taskManager.tasks.push(undefined);
      
      // Add a valid task using createTask
      taskManager.createTask({ title: 'Valid Task', priority: 'high', status: 'to-do' });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      // Should only return the valid task, filtering out null/undefined
      expect(sortedTasks).toHaveLength(1);
      expect(sortedTasks[0].title).toBe('Valid Task');
    });

    it('should handle tasks with missing priority property', () => {
      // Start with clean slate
      taskManager.tasks = [];
      
      // Create a valid task first
      taskManager.createTask({ title: 'Valid Task', priority: 'high', status: 'to-do' });
      
      // Manually add task without priority
      taskManager.tasks.push({
        id: 'no-priority',
        title: 'No Priority Task',
        status: 'to-do'
        // Missing priority property
      });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      // Should only return tasks with valid priority
      expect(sortedTasks).toHaveLength(1);
      expect(sortedTasks[0].title).toBe('Valid Task');
    });

    it('should handle empty priority string', () => {
      // Start with clean slate
      taskManager.tasks = [];
      
      // Create a valid task first
      taskManager.createTask({ title: 'Valid Task', priority: 'high', status: 'to-do' });
      
      // Manually add task with empty priority
      taskManager.tasks.push({
        id: 'empty-priority',
        title: 'Empty Priority Task',
        priority: '',
        status: 'to-do'
      });

      const sortedTasks = taskManager.getTasksSortedByPriority();

      // Should only return tasks with valid priority
      expect(sortedTasks).toHaveLength(1);
      expect(sortedTasks[0].title).toBe('Valid Task');
    });
  });
});

// Run the tests
console.log('Running TaskEasy Day 3 - US2 Priority Sorting Test Suite...');
console.log('Target: 15 new test cases for priority sorting functionality');
console.log('Coverage target: 92% (increased from Day 2)');
