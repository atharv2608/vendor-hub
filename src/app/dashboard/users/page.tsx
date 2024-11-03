"use client"
import React from 'react'
import { AddUser } from '@/components/users/AddUser'
function page() {
  return (
    <main className="dark:bg-gray-900 p-4 h-full">
      <div className="space-y-5">
        <div>
          <AddUser />
        </div>
        <div>
        </div>
      </div>
    </main>
  )
}

export default page