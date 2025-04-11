export default function Loading() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-teal-600 dark:border-teal-400 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-blue-800 dark:border-blue-300 animate-spin"></div>
        </div>
      </div>
      <p className="mt-6 text-lg font-medium text-blue-900 dark:text-blue-200">Loading...</p>
      <p className="text-gray-600 dark:text-gray-300">Please wait while we prepare your content.</p>
    </div>
  );
}