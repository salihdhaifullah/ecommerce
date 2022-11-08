import Link from "next/link";

export default function Custom404() {
    return (
        <section className="h-full w-full justify-center items-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-600">404</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Something&apos;s missing.</p>
                    <p className="mb-4 text-lg font-light text-gray-500 ">Sorry, we can&apos;t find that page. You&apos;ll find lots to explore on the home page. </p>
                    <Link href='/'>
                    <p className="inline-flex text-gray-100 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">
                        Back to Homepage
                    </p>
                    </Link>
                </div>
            </div>
        </section>
    );
}