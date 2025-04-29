import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function LoginButtons() {
  return (
    <div className="flex space-x-4">
      <SignInButton>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          Sign In
        </button>
      </SignInButton>
      <SignUpButton>
        <button className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition">
          Sign Up
        </button>
      </SignUpButton>
    </div>
  );
}