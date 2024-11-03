import DownloadReport from '@/components/vendors/DownloadReport'
import React from 'react'

function page() {
  return (
    <div className='p-4'>
        <div className='mb-10'>
            <h1 className='text-3xl font-bold dark:text-indigo-500' >Export Data to CSV</h1>
            <span>Apply filters as per choice</span>
        </div>
        <DownloadReport />
    </div>
  )
}

export default page