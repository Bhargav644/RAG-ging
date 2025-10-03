export default function ProcessingIndicator() {
  return (
    <div className="text-center p-4">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
      <p className="mt-2 text-indigo-600">Processing your file...</p>
    </div>
  );
}
