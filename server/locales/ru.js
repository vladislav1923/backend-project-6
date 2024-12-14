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
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
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
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
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
        notAssigned: 'Не назначена',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          submit: 'Сохранить',
          title: 'Редатирование',
        },
        delete: {
          error: 'Пользователь не найден',
          success: 'Пользователь удалён',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Имя',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          title: 'Создать новый статус',
        },
        edit: {
          submit: 'Сохранить',
          title: 'Редатирование',
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
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          title: 'Создать новую задачу',
        },
        edit: {
          submit: 'Сохранить',
          title: 'Редатирование',
        },
        delete: {
          error: 'Задача не найдена',
          success: 'Задача удалена',
        },
      },
    },
  },
};
