interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration: number;
}

let toasts = $state<Toast[]>([]);

export function show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
  const id = crypto.randomUUID();
  toasts.push({ id, message, type, duration });
  
  setTimeout(() => {
    remove(id);
  }, duration);
}

function remove(id: string) {
  toasts = toasts.filter(t => t.id !== id);
}

export function removeToast(id: string) {
  remove(id);
}

export function success(message: string, duration?: number) {
  show(message, 'success', duration);
}

export function error(message: string, duration?: number) {
  show(message, 'error', duration);
}

export function info(message: string, duration?: number) {
  show(message, 'info', duration);
}

export function getToasts(): Toast[] {
  return toasts;
}

