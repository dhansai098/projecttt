// This page handles editing existing notices
// It uses the same form component as the create page
import { useRouter } from 'next/router';
import NoticeForm from './new';

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = router.query;

  // The new.tsx component already handles both create and edit
  // by checking the id parameter from the router
  return <NoticeForm />;
}