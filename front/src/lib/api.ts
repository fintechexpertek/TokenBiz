const BASE_URL = 'http://localhost:8000';

function toUser(u: Record<string, unknown>) {
  return {
    id: u.id,
    email: u.email,
    role: u.role,
    verificationStatus: u.verification_status,
    firstName: u.first_name,
    lastName: u.last_name,
    phone: u.phone,
    citizenship: u.citizenship,
    representativePosition: u.representative_position,
    legalEntityName: u.legal_entity_name,
    countryOfIncorporation: u.country_of_incorporation,
    projectName: u.project_name,
    projectDescription: u.project_description,
    createdAt: u.created_at,
  };
}

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'Request failed');
  }
  return res.json();
}

export const api = {
  auth: {
    register: async (data: Record<string, unknown>) => {
      const res = await request<{ access_token: string; user: Record<string, unknown> }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { access_token: res.access_token, user: toUser(res.user) };
    },
    login: async (email: string, password: string) => {
      const res = await request<{ access_token: string; user: Record<string, unknown> }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return { access_token: res.access_token, user: toUser(res.user) };
    },
  },
  users: {
    me: () => request<unknown>('/users/me'),
    list: () => request<unknown[]>('/users/'),
    updateVerification: (userId: string, status: string) =>
      request<unknown>(`/users/${userId}/verification`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
  projects: {
    list: () => request<unknown[]>('/projects/'),
    get: (id: string) => request<unknown>(`/projects/${id}`),
    create: (data: Record<string, unknown>) =>
      request<unknown>('/projects/', { method: 'POST', body: JSON.stringify(data) }),
    issue: (id: string, amount: number) =>
      request<unknown>(`/projects/${id}/issue`, { method: 'POST', body: JSON.stringify({ amount }) }),
    burn: (id: string, amount: number) =>
      request<unknown>(`/projects/${id}/burn`, { method: 'POST', body: JSON.stringify({ amount }) }),
  },
  transactions: {
    my: () => request<unknown[]>('/transactions/my'),
    create: (data: Record<string, unknown>) =>
      request<unknown>('/transactions/', { method: 'POST', body: JSON.stringify(data) }),
  },
  buybacks: {
    list: () => request<unknown[]>('/buybacks/'),
    my: () => request<unknown[]>('/buybacks/my'),
    create: (data: Record<string, unknown>) =>
      request<unknown>('/buybacks/', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<unknown>(`/buybacks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  complaints: {
    list: () => request<unknown[]>('/complaints/'),
    create: (data: Record<string, unknown>) =>
      request<unknown>('/complaints/', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      request<unknown>(`/complaints/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    addNote: (targetUserId: string, note: string) =>
      request<unknown>('/complaints/admin-notes', {
        method: 'POST',
        body: JSON.stringify({ target_user_id: targetUserId, note }),
      }),
    getNotes: (userId: string) => request<unknown[]>(`/complaints/admin-notes/${userId}`),
  },
};
