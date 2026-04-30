export function getYear(dateString) {
  if (!dateString) return 'N/A';
  const year = new Date(dateString).getFullYear();
  return Number.isNaN(year) ? 'N/A' : String(year);
}

export function formatRuntime(runtime) {
  if (!runtime) return 'N/A';
  const hours = Math.floor(runtime / 60);
  const mins = runtime % 60;
  if (!hours) return `${mins}min`;
  return `${hours}h ${mins}min`;
}

export function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]).join('').toUpperCase();
}
