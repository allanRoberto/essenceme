import { create } from 'zustand';

export type ClientService = {
  id: string;
  name: string;
  notes: string;
  serviceDate: string;
};

export type ClientRegistration = {
  id: string;
  style: string;
  palette: string;
  shirtSize: string;
  pantsSize: string;
  shoeSize: string;
  services: ClientService[];
  createdAt: string;
};

type ClientStoreState = {
  clients: ClientRegistration[];
  addClient: (data: Omit<ClientRegistration, 'id' | 'createdAt'>) => void;
};

export const useClientStore = create<ClientStoreState>((set) => ({
  clients: [],
  addClient: (data) => {
    const registration: ClientRegistration = {
      ...data,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      clients: [...state.clients, registration],
    }));
  },
}));
