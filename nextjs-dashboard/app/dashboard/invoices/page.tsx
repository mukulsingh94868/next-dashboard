import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { customers, invoices } from '@/app/lib/placeholder-data';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  async function countFilteredInvoices(query: string): Promise<number> {
    // Convert query to lower case for case-insensitive search
    const lowerQuery = query.toLowerCase();
 
    // Filter invoices based on the query
    const filteredInvoices = invoices.filter((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id);
      if (!customer) return false;
 
      // Check if any field matches the query
      return (
        customer.name.toLowerCase().includes(lowerQuery) ||
        customer.email.toLowerCase().includes(lowerQuery) ||
        String(invoice.amount).toLowerCase().includes(lowerQuery) ||
        invoice.date.toLowerCase().includes(lowerQuery) ||
        invoice.status.toLowerCase().includes(lowerQuery)
      );
    });
 
    // Return the count of filtered invoices
    return filteredInvoices.length;
  }
 
  const totalPages = await countFilteredInvoices(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
