import { redirect } from 'next/navigation';

/**
 * Root page - redirects to login
 * Users will authenticate and then be directed to /workspace
 */
export default function Home() {
  redirect('/login');
}
