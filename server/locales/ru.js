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
          success: 'Пользователь успешно обновлён',
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
          error: 'Не удалось создать новый статус',
          success: 'Новый статус успешно создан',
        },
        update: {
          error: 'Ошибка сохранения изменений',
          success: 'Статус успешно обновлён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Удаление статуса прошло успешно',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Ошибка сохранения изменений',
          success: 'Задача успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Удаление задачи прошло успешно',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Ошибка сохранения изменений',
          success: 'Метка успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Удаление метки прошло успешно',
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
          email: 'Почта',
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
        password: 'Пароль',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          submit: 'Сохранить',
          title: 'Редатирование',
        },
        delete: {
          submit: 'Удалить',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Имя',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          submit: 'Сохранить',
          title: 'Создать новый статус',
        },
        edit: {
          submit: 'Сохранить',
          title: 'Редатирование',
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
        name: 'Имя',
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
          submit: 'Сохранить',
          title: 'Создать новую задачу',
        },
        edit: {
          submit: 'Сохранить',
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
        name: 'Имя',
        createdAt: 'Дата создания',
        actions: 'Действия',
        new: {
          submit: 'Сохранить',
          title: 'Создать новую метку',
        },
        edit: {
          submit: 'Сохранить',
          title: 'Редатирование',
        },
        delete: {
          submit: 'Удалить',
        },
      },
    },
  },
};
