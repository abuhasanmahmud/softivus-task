export default function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-red-600 mb-2">
        Task Not Found
      </h1>
      <p>The task you're looking for doesn't exist or has been removed.</p>
    </div>
  );
}
