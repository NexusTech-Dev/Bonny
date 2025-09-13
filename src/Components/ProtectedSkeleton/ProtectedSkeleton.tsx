export default function ProtectedSkeleton() {
    return (
        <div className="flex h-screen bg-gray-100 animate-pulse">
            <aside className="w-64 bg-gray-300 m-4 rounded-xl flex-shrink-0">
                <div className="h-12 bg-gray-400 rounded mt-4 mx-2"></div>
                <div className="h-6 bg-gray-400 rounded mt-6 mx-2"></div>
                <div className="h-6 bg-gray-400 rounded mt-4 mx-2"></div>
                <div className="h-6 bg-gray-400 rounded mt-4 mx-2"></div>
                <div className="h-6 bg-gray-400 rounded mt-4 mx-2"></div>
            </aside>

            <main className="flex-1 p-6 space-y-6">
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                    <div className="h-32 bg-gray-300 rounded"></div>
                </div>

                <div className="overflow-x-auto">
                    <div className="min-w-full bg-gray-300 h-64 rounded"></div>
                </div>
            </main>
        </div>
    );
}
