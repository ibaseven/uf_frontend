import React from 'react'
import Profile from './_components/profile'
import { fetchJSON } from '@/lib/api'
import { USERSBYID_URL } from '@/lib/endpoint'

type Props = {
  params: Promise<{ id: string }>   // <<--- important
};

export default async function Page({ params }: Props) {

  const { id } = await params;      // <<--- on attend params

  const res = await fetchJSON(`${USERSBYID_URL}/${id}`);
  const userConnected = res.user;

  return (
    <div>
      <Profile user={userConnected} />
    </div>
  );
}
