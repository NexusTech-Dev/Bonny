import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function ComingSoon() {
    return (
        <main className="bg-gradient-to-br from-amber-50 via-orange-100 to-orange-200 text-gray-800 min-h-screen flex flex-col justify-center items-center px-6 py-12">

            <div className="flex flex-col items-center gap-10 max-w-2xl text-center">
                <div className="w-54 h-54 md:w-64 md:h-64 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <DotLottieReact
                        src="https://lottie.host/df1bb404-e683-4871-9769-f993f6f7460b/upVDSIFwmj.lottie"
                        loop
                        autoplay
                    />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-orange-600 drop-shadow-md">
                    Um novo lar está chegando! 🐶
                </h1>

                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                    Estamos criando um sistema para apoiar a adoção de cães.
                    Em breve, você poderá acompanhar resgates, adoções e ajudar a transformar vidas.
                </p>

                <a
                    href="https://wa.me/5512991706194"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-orange-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-orange-400 transition-colors"
                >
                    Fale Conosco
                </a>
            </div>

            <footer className="mt-16 text-gray-500 text-sm opacity-70">
                &copy; {new Date().getFullYear()} Projeto Bonny - Todos os direitos reservados.
            </footer>
        </main>
    );
}
