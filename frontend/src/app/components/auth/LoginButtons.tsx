import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from '@/app/components/ui';

export default function LoginButtons() {
  return (
    <div className="flex gap-3">
      <SignInButton>
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton>
        <Button variant="primary" size="sm">
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  );
}