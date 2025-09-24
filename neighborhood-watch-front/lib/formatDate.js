export const formatRelativeTime = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 6) return "";

  const [year, month, day, hour, minute, second, nano = 0] = dateArray;

  // ⚠️ În JavaScript, lunile sunt 0-indexate (ianuarie = 0)
  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    Math.floor(nano / 1_000_000)
  );
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 0) return "Acum";
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} zi${diffInDays > 1 ? "le" : ""}`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} săpt`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} lună${diffInMonths > 1 ? "i" : ""}`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} an${diffInYears > 1 ? "i" : ""}`;
};
