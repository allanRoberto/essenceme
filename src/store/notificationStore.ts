import { create } from 'zustand';

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAtLabel: string;
  isRead: boolean;
};

type NotificationState = {
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
};

const mockNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Novo agendamento',
    message: 'Barbara Soares confirmou sessão para sexta às 14:00.',
    createdAtLabel: 'Agora',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Pagamento recebido',
    message: 'Amanda Pires finalizou o pagamento do serviço completo.',
    createdAtLabel: 'Hoje, 09:42',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Lembrete',
    message: 'Você tem 2 clientes com cadastro incompleto.',
    createdAtLabel: 'Hoje, 08:10',
    isRead: true,
  },
  {
    id: 'n4',
    title: 'Feedback da cliente',
    message: 'Marina enviou um comentário sobre a última consultoria.',
    createdAtLabel: 'Ontem',
    isRead: false,
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
    })),
}));
