// @ts-check

export default {
  translation: {
    appName: 'Task Manager',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          error: 'Failed to save changes',
          success: 'User updated successfully',
          forbidden: 'You cannot update other users',
        },
        edit: {
          forbidden: 'You cannot edit other users',
        },
        delete: {
          error: 'Failed to delete user',
          success: 'User deleted successfully',
          forbidden: 'You cannot delete other users',
        },
      },
      statuses: {
        create: {
          error: 'Failed to create status',
          success: 'Status created successfully',
        },
        update: {
          error: 'Failed to save changes',
          success: 'Status updated successfully',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status deleted successfully',
        },
      },
      tasks: {
        create: {
          error: 'Failed to create task',
          success: 'Task created successfully',
        },
        update: {
          error: 'Failed to save changes',
          success: 'Task updated successfully',
        },
        delete: {
          error: 'Failed to delete task',
          success: 'Task deleted successfully',
        },
      },
      labels: {
        create: {
          error: 'Failed to create label',
          success: 'Label created successfully',
        },
        update: {
          error: 'Failed to save changes',
          success: 'Label updated successfully',
        },
        delete: {
          error: 'Failed to delete label',
          success: 'Label deleted successfully',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        tasks: 'Tasks',
        labels: 'Labels',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
      },
    },
    views: {
      session: {
        new: {
          email: 'Email',
          password: 'Password',
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        name: 'Full Name',
        password: 'Password',
        createdAt: 'Created at',
        actions: 'Actions',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          submit: 'Save',
          title: 'Edit',
        },
        delete: {
          submit: 'Delete',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        actions: 'Actions',
        new: {
          submit: 'Save',
          title: 'Create New Status',
        },
        edit: {
          submit: 'Save',
          title: 'Edit',
        },
        delete: {
          submit: 'Delete',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Name',
        description: 'Description',
        status: 'Status',
        creator: 'Creator',
        executor: 'Executor',
        labels: 'Labels',
        createdAt: 'Created at',
        notAssigned: 'Not assigned',
        noLabels: 'None',
        back: 'Back To The List',
        actions: 'Actions',
        search: {
          myTasks: 'Only my tasks',
          submit: 'Search',
        },
        new: {
          submit: 'Save',
          title: 'Create New Task',
        },
        edit: {
          submit: 'Save',
          title: 'Edit',
        },
        delete: {
          submit: 'Delete',
        },
        one: {
          title: 'Task №',
        },
      },
      labels: {
        id: 'ID',
        name: 'Name',
        createdAt: 'Created at',
        actions: 'Actions',
        new: {
          submit: 'Save',
          title: 'Create New Label',
        },
        edit: {
          submit: 'Save',
          title: 'Edit',
        },
        delete: {
          submit: 'Delete',
        },
      },
    },
  },
};
