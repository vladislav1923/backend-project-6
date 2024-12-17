// @ts-check

export default {
  translation: {
    appName: 'Менеджер Задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          error: 'Не удалось сохранить изменения',
          success: 'Пользователь успешно изменён',
          forbidden: 'Вы не можете редактировать других пользователей',
        },
        edit: {
          forbidden: 'Вы не можете редактировать других пользователей',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
          forbidden: 'Вы не можете удалять других пользователей',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Ошибка сохранения изменений',
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Ошибка сохранения изменений',
          success: 'Задача успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалена',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Ошибка сохранения изменений',
          success: 'Метка успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          email: 'Email',
          password: 'Пароль',
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        firstName: 'Имя',
        lastName: 'Фамилия',
        name: 'Полное имя',
        password: 'Пароль',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          submit: 'Изменить',
          title: 'Редактирование пользователя',
        },
        delete: {
          submit: 'Удалить',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          submit: 'Создать',
          title: 'Создать статус',
        },
        edit: {
          submit: 'Изменить',
          title: 'Изменение статуса',
        },
        delete: {
          submit: 'Удалить',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        status: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        labels: 'Метки',
        createdAt: 'Дата создания',
        notAssigned: 'Не назначена',
        noLabels: 'Отсутствуют',
        back: 'Назад к списку',
        actions: 'Действия',
        search: {
          myTasks: 'Только мои задачи',
          submit: 'Показать',
        },
        new: {
          submit: 'Создать',
          title: 'Создать задачу',
        },
        edit: {
          submit: 'Изменить',
          title: 'Редатирование задачи',
        },
        delete: {
          submit: 'Удалить',
        },
        one: {
          title: 'Задача №',
        },
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          submit: 'Создать',
          title: 'Создать метку',
        },
        edit: {
          submit: 'Изменить',
          title: 'Изменить метку',
        },
        delete: {
          submit: 'Удалить',
        },
      },
    },
  },
};
