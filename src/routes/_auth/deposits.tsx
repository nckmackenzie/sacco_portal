/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DownloadCloudIcon, PlusIcon } from 'lucide-react'
import { Loader } from '@/components/custom/spinner'
import { Button } from '@/components/ui/button'
import Search from '@/components/custom/search'
import { transactionSearchSchema } from '@/routes/_auth/transactions'
import { useDocumentTitle } from '@/hooks/use-title'
import { DateRangePicker } from '@/components/custom/date-range-picker'
import { formatDate, formatDateToYMD } from '@/lib/formatters'
import { depositsQueryOptions } from '@/features/deposits/services/query-options'
import { DepositsTable } from '@/features/deposits/components/deposits-table'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/custom/credenza'
import { useExportCsv } from '@/hooks/use-csv'
import { requiredNumberSchemaEntry } from '@/lib/schema-entries'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_auth/deposits')({
  component: RouteComponent,
  validateSearch: transactionSearchSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: ({
    context,
    deps: {
      search: { from, q, to },
    },
  }) => context.queryClient.ensureQueryData(depositsQueryOptions(q, from, to)),
  pendingComponent: () => <Loader size="lg" />,
})

function RouteComponent() {
  useDocumentTitle('Deposits')
  const { q, from, to } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const {
    data: { data },
  } = useSuspenseQuery(depositsQueryOptions(q, from, to))
  const exportToExcel = useExportCsv('deposits')
  return (
    <div className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-y-4">
        <div>
          <h1 className="text-2xl font-bold">Deposits</h1>
          <p className="text-sm text-muted-foreground">
            View and track all your deposits.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2  sm:items-center">
          {/* <Button variant="default" onClick={() => {}}>
            <PlusIcon className="icon" />
            <span>New Deposit</span>
          </Button> */}
          <NewDeposit />
          <Button
            variant="secondary"
            onClick={() =>
              exportToExcel(
                data.map(
                  ({
                    depositDate,
                    amount,
                    paymentMethod,
                    paymentReference,
                    transactionCode,
                  }) => ({
                    'Deposit Date': formatDate(depositDate),
                    'Transaction Ref': transactionCode,
                    Amount: amount,
                    'Payment Method': paymentMethod,
                    'Payment Reference': paymentReference,
                  }),
                ),
              )
            }
          >
            <DownloadCloudIcon className="icon-muted" />
            <span>Export</span>
          </Button>
        </div>
      </header>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Search
          defaultValue={q}
          parentClassName="w-full md:w-1/2 lg:w-1/3"
          className="w-full"
          placeholder="Search transactions"
          onHandleSearch={(term: string) => {
            navigate({
              search: (prev) => ({
                ...prev,
                q: term.trim().length > 0 ? `${term.toString()}` : undefined,
              }),
            })
          }}
        />
        <DateRangePicker
          value={{
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
          }}
          buttonClassName="h-10 shadow-none"
          className="w-full md:w-1/2 lg:w-1/3"
          allowPastDates
          placeholder="Filter by date"
          onChange={(date) => {
            if (!!date?.from && !!date?.to) {
              navigate({
                search: (prev) => ({
                  ...prev,
                  from: date.from ? formatDateToYMD(date.from) : undefined,
                  to: date?.to ? formatDateToYMD(date.to) : undefined,
                }),
              })
            }
          }}
        />
      </div>
      <DepositsTable data={data} />
    </div>
  )
}

const depositFormSchema = z.object({
  amount: requiredNumberSchemaEntry('Deposit amount is required'),
})

function NewDeposit() {
  const form = useForm<z.infer<typeof depositFormSchema>>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: { amount: 0 },
  })
  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button variant="default">
          <PlusIcon className="icon" />
          <span>New Deposit</span>
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((data) => {
              console.log(data)
            })}
          >
            <CredenzaHeader>
              <CredenzaTitle>Make a deposit</CredenzaTitle>
              <CredenzaDescription className="text-xs text-muted-foreground">
                Enter amount and click on submit to make a deposit. Enter MPESA
                pin when prompted to complete the transaction.
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ''}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CredenzaBody>
            <CredenzaFooter className="flex flex-row items-center justify-end">
              <Button>Submit</Button>
              <CredenzaClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset()
                  }}
                >
                  Cancel
                </Button>
              </CredenzaClose>
            </CredenzaFooter>
          </form>
        </Form>
      </CredenzaContent>
    </Credenza>
  )
}
