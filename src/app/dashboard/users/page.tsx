"use client"
import React from 'react'
import { AddUser } from '@/components/users/AddUser'
import UserTable from '@/components/users/UserTable'
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
function Page() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  return (
    <main className="dark:bg-gray-900 p-4 h-full">
      <div className="space-y-5">
      {user?.canManageUsers && (
          <div>
            <AddUser />
          </div>
        )}
        <div>
          <UserTable />
        </div>
      </div>
    </main>
  )
}

export default Page