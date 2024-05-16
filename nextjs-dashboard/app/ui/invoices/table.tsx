import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import { customers, invoices } from '@/app/lib/placeholder-data';

type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  status: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

type InvoiceWithCustomer = {
  id: string;
  amount: number;
  date: string;
  status: string;
  name: string;
  email: string;
  image_url: string;
};

type InvoicesTableProps = {
  query: string;
  currentPage: number;
};

export default async function InvoicesTable({ query, currentPage }: InvoicesTableProps) {
  const ITEMS_PER_PAGE = 5;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  async function searchInvoices(query: string, ITEMS_PER_PAGE: number, offset: number): Promise<InvoiceWithCustomer[]> {
    const lowerQuery = query.toLowerCase();

    const filteredInvoices = invoices.filter((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id);
      if (!customer) return false;

      return (
        customer.name.toLowerCase().includes(lowerQuery) ||
        customer.email.toLowerCase().includes(lowerQuery) ||
        String(invoice.amount).toLowerCase().includes(lowerQuery) ||
        invoice.date.toLowerCase().includes(lowerQuery) ||
        invoice.status.toLowerCase().includes(lowerQuery)
      );
    });

    const sortedInvoices = filteredInvoices.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const paginatedInvoices = sortedInvoices.slice(offset, offset + ITEMS_PER_PAGE);

    const result: InvoiceWithCustomer[] = paginatedInvoices.map((invoice) => {
      const customer = customers.find((c) => c.id === invoice.customer_id);
      return {
        id: invoice.customer_id,
        amount: invoice.amount,
        date: invoice.date,
        status: invoice.status,
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        image_url: customer?.image_url ?? '',
      };
    });

    return result;
  }

  const filteredInvoices = await searchInvoices(query, ITEMS_PER_PAGE, offset);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {filteredInvoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredInvoices?.map((invoice, index) => (
                <tr
                  key={`${invoice.id}-${index}`}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={invoice.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <InvoiceStatus status={invoice.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
