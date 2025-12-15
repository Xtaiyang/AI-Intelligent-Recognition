import { ButtonLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div>
      <h1 className="h1">Not found</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <ButtonLink href="/" variant="primary">
        Go home
      </ButtonLink>
    </div>
  );
}
