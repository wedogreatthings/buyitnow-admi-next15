import React from 'react';
import dynamic from 'next/dynamic';
import Loading from '@/app/loading';

const Contact = dynamic(() => import('@/components/contact/Contact'), {
  loading: () => <Loading />,
});

import { getContactData } from '@/backend/utils/server-only-methods';

export const metadata = {
  title: 'Dashboard - Messages',
};

const ContactPage = async () => {
  const messageData = await getContactData();

  return <Contact data={messageData} />;
};

export default ContactPage;