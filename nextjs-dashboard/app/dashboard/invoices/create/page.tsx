import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';
import { customers } from '@/app/lib/placeholder-data';

export default async function Page() {

  async function fetchCustomerFields() {
    // Sort the customers array by name in ascending order
    const sortedCustomers = customers.sort((a, b) => a.name.localeCompare(b.name));
  
    // Return the sorted list with only the id and name fields
    const result = sortedCustomers.map(customer => ({
      id: customer.id,
      name: customer.name,
    }));
  
    return result;
  }

  const customer1 = await fetchCustomerFields();
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customer1} />
    </main>
  );
}
