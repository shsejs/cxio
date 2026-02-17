
import { User, Message } from '../types';

const API_URL = 'api.php';

export const apiService = {
  async register(data: any) {
    const res = await fetch(`${API_URL}?action=register`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(data: any) {
    const res = await fetch(`${API_URL}?action=login`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async sendMessage(to: string, content: string) {
    const res = await fetch(`${API_URL}?action=send_message`, {
      method: 'POST',
      body: JSON.stringify({ to, content })
    });
    return res.json();
  },

  async getMessages(username: string): Promise<Message[]> {
    const res = await fetch(`${API_URL}?action=get_messages&username=${username}`);
    const data = await res.json();
    return data.map((m: any) => ({
      ...m,
      timestamp: new Date(m.timestamp).getTime()
    }));
  },

  async deleteMessage(id: string) {
    const res = await fetch(`${API_URL}?action=delete_message`, {
      method: 'POST',
      body: JSON.stringify({ id })
    });
    return res.json();
  },

  async updateProfile(username: string, fullName: string, password?: string) {
    const res = await fetch(`${API_URL}?action=update_profile`, {
      method: 'POST',
      body: JSON.stringify({ username, fullName, password })
    });
    return res.json();
  }
};
