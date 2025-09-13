export default function LoginSkeleton() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 animate-pulse">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-2">
                    <div className="w-8 h-8 bg-blue-300 rounded-full"></div>
                    <div className="h-6 w-40 bg-gray-300 rounded"></div>
                </div>

                <div className="space-y-4">
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                    <div className="h-10 bg-gray-300 rounded w-full"></div>
                </div>

                <div className="h-10 bg-blue-400 rounded w-full mt-4"></div>

                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mt-6"></div>
            </div>
        </div>
    );
}
