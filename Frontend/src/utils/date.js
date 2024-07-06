export function formatDateForPost(createdAt) {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const diffInMs = now - createdDate;

  // Calculate the differences in various units
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d`;
  } else {
    // Format as date string for anything longer than a week
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return createdDate.toLocaleDateString(undefined, options);
  }
}
