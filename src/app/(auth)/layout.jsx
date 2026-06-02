import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="text-xl font-semibold">
          React Starter
        </Link>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
