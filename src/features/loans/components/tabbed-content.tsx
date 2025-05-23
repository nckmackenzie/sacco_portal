import { format } from 'date-fns'
import clsx from 'clsx'
import { CheckCircleIcon, HourglassIcon, XCircleIcon } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import type { LoanDetailed } from '@/features/loans/utils/loans.type'
import type { getLoanStatus } from '@/lib/formatters'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, getInitials } from '@/lib/formatters'
import { DataTable } from '@/components/custom/datatable'
import { interestCalculator } from '@/lib/utils'
import { LoanStatus } from '@/features/dashboard/components/loan-status'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PaymentMethodBadges } from '@/components/custom/payment-method-badges'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface TabbedContentProps {
  loanDetails: LoanDetailed
  loanReference: string
  status: ReturnType<typeof getLoanStatus>
}

export function TabbedContent({
  loanReference,
  loanDetails,
  status,
}: TabbedContentProps) {
  const {
    purpose,
    loanAmount,
    balance,
    repaymentPeriod,
    completedAt,
    payments,
    nextDueDate,
    guarantors,
    approvalDate,
  } = loanDetails
  const pricipalAmount = loanAmount / repaymentPeriod
  const totalPayment = payments.reduce(
    (acc, payment) => acc + Number(payment.principalAmount),
    0,
  )

  const interest = interestCalculator(repaymentPeriod, loanAmount)
  const totalPaymentWithInterest = pricipalAmount + parseFloat(interest)

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList
        className={clsx('grid grid-cols-3 w-full max-w-2xl', {
          'grid-cols-2': status === 'pending' || status === 'rejected',
        })}
      >
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="guarantors">Guarantors</TabsTrigger>
        {status !== 'pending' && status !== 'rejected' && (
          <TabsTrigger value="payments">Payments</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="details" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Loan ID
                    </p>
                    <p>{loanReference}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Loan Type
                    </p>
                    <p className="capitalize">{purpose}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Principal Amount
                    </p>
                    <p>{formatCurrency(pricipalAmount)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Interest Rate
                    </p>
                    <p>{interest}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Term Length
                    </p>
                    <p>{repaymentPeriod} months</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Monthly Payment
                    </p>
                    <p>{formatCurrency(totalPaymentWithInterest)}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Approval Date
                    </p>
                    <p
                      className={clsx({
                        'text-danger-foreground': status === 'rejected',
                        'text-info-foreground': status === 'pending',
                      })}
                    >
                      {/* {format(approvalDate || applicationDate, 'MMMM d, yyyy')} */}
                      {status === 'pending'
                        ? 'Pending approval'
                        : status === 'rejected'
                          ? 'This loan was rejected'
                          : approvalDate
                            ? format(approvalDate, 'MMMM d, yyyy')
                            : 'Not Approved'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed Date
                    </p>
                    <p
                      className={clsx({
                        'text-success-foreground': status === 'completed',
                        'text-info-foreground': status === 'pending',
                      })}
                    >
                      {status === 'pending'
                        ? 'Pending approval'
                        : status === 'rejected'
                          ? 'This loan was rejected'
                          : status === 'written-off'
                            ? 'This loan was written off'
                            : completedAt
                              ? format(completedAt, 'MMMM d, yyyy')
                              : 'Not Completed'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Paid Amount
                    </p>
                    <p>{formatCurrency(totalPayment)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Remaining Balance
                    </p>
                    <p>{formatCurrency(balance)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Next Payment Date
                    </p>
                    <p
                      className={clsx({
                        'text-destructive': status === 'overdue',
                        'text-success-foreground': status === 'completed',
                        'text-info-foreground': status === 'pending',
                      })}
                    >
                      {status === 'pending'
                        ? 'Pending approval'
                        : status === 'rejected'
                          ? 'This loan was rejected'
                          : status === 'completed'
                            ? 'Loan fully paid!'
                            : nextDueDate
                              ? format(nextDueDate, 'MMMM d, yyyy')
                              : ''}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Loan Status
                    </p>
                    <LoanStatus status={status} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <Guarantors guarantors={guarantors} />

      <Payments payments={payments} />
    </Tabs>
  )
}

function Guarantors({
  guarantors,
}: {
  guarantors: LoanDetailed['guarantors']
}) {
  return (
    <TabsContent value="guarantors" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loan Guarantors</CardTitle>
          <CardDescription>
            People who have guaranteed this loan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {guarantors.length > 0 ? (
            <>
              <Table className="hidden md:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Guarantor</TableHead>
                    <TableHead>Amount Guaranteed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guarantors.map(({ guarantingAmount, member, status }) => (
                    <TableRow key={member.id}>
                      <TableCell className="flex items-center gap-4">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={member.photo || undefined}
                            alt={member.name}
                          />
                          <AvatarFallback>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.contact}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCurrency(guarantingAmount)}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        <Badge
                          variant={
                            status === 'approved'
                              ? 'success'
                              : status === 'rejected'
                                ? 'error'
                                : 'warning'
                          }
                        >
                          {status === 'approved' ? (
                            <CheckCircleIcon
                              aria-hidden
                              className="h-4 w-4 mr-1"
                            />
                          ) : status === 'rejected' ? (
                            <XCircleIcon aria-hidden className="h-4 w-4 mr-1" />
                          ) : (
                            <HourglassIcon
                              aria-hidden
                              className="h-4 w-4 mr-1"
                            />
                          )}
                          <span className="uppercase">{status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {status !== 'approved' && (
                          <Button size="sm" variant="secondary">
                            Change Guarantor
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="block md:hidden space-y-4">
                {guarantors.map(({ guarantingAmount, member, status }) => (
                  <Card
                    key={member.id}
                    className={clsx(
                      'overflow-hidden border-l-4 shadow-none hover:shadow-md transition-shadow duration-200',
                      {
                        'border-l-success': status === 'approved',
                        'border-l-destructive': status === 'rejected',
                        'border-l-warning':
                          status !== 'approved' && status !== 'rejected',
                      },
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-background">
                          <AvatarImage
                            src={member.photo || undefined}
                            alt={member.name}
                          />
                          <AvatarFallback className="text-sm font-medium">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {member.contact}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Amount Guaranteed
                          </p>
                          <p className="text-base font-semibold">
                            {formatCurrency(guarantingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Status
                          </p>
                          <Badge
                            variant={
                              status === 'approved'
                                ? 'success'
                                : status === 'rejected'
                                  ? 'destructive'
                                  : 'outline'
                            }
                            className="font-medium"
                          >
                            {status === 'approved' ? (
                              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                            ) : status === 'rejected' ? (
                              <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <HourglassIcon className="h-3.5 w-3.5 mr-1" />
                            )}
                            <span className="uppercase text-xs">{status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardContent>

                    {status !== 'approved' && (
                      <>
                        <Separator />
                        <CardFooter className="p-3 bg-muted/10">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full"
                            onClick={() => {}}
                          >
                            Change Guarantor
                          </Button>
                        </CardFooter>
                      </>
                    )}
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-6">
              No guarantors have been added for this loan yet.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <p className="text-sm text-muted-foreground">
            Total Guaranteed Amount: Ksh.
            {formatCurrency(
              guarantors.reduce(
                (acc, g) => acc + Number(g.guarantingAmount),
                0,
              ),
            )}
          </p>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}

function Payments({ payments }: { payments: LoanDetailed['payments'] }) {
  const { totalPrincipal, totalInterest } = payments.reduce(
    (acc, payment) => ({
      totalPrincipal: acc.totalPrincipal + Number(payment.principalAmount),
      totalInterest: acc.totalInterest + Number(payment.interestAmount),
    }),
    { totalPrincipal: 0, totalInterest: 0 },
  )
  const columns: Array<ColumnDef<LoanDetailed['payments'][number]>> = [
    {
      accessorKey: 'paymentDate',
      header: 'Payment Date',
      cell: ({ row }) => (
        <div className="row-font">
          {format(new Date(row.original.paymentDate), 'MMMM d, yyyy')}
        </div>
      ),
    },
    {
      accessorKey: 'principalAmount',
      header: 'Principal Amount',
      cell: ({ row }) => (
        <div className="row-font">
          {formatCurrency(row.original.principalAmount)}
        </div>
      ),
    },
    {
      accessorKey: 'interestAmount',
      header: 'Interest Amount',
      cell: ({ row }) => (
        <div className="row-font">
          {formatCurrency(row.original.interestAmount)}
        </div>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Payment Method',
      cell: ({ row }) => (
        <PaymentMethodBadges method={row.original.paymentMethod} />
      ),
    },
    {
      accessorKey: 'paymentReference',
      header: 'Payment Reference',
      cell: ({ row }) => (
        <div className="row-font uppercase">
          {row.original.paymentReference}
        </div>
      ),
    },
  ]
  return (
    <TabsContent value="payments" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Record of all payments made for this loan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable data={payments} columns={columns} />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div>
            <p className="text-sm font-medium">
              Total Paid: {formatCurrency(totalInterest + totalPrincipal)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Principal: {formatCurrency(totalPrincipal)} • Interest:{' '}
              {formatCurrency(totalInterest * 0.18)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  )
}

//  <div className="space-y-6">
//             {guarantors.length > 0 ? (
//               guarantors.map(guarantor => (
//                 <div
//                   key={guarantor.member.id}
//                   className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg border bg-card"
//                 >
//                   <div className="flex items-center gap-4">
//                     <Avatar>
//                         <AvatarImage src={guarantor.member.photo || undefined} alt={guarantor.member.name} />
//                         <AvatarFallback>{getInitials(guarantor.member.name)}</AvatarFallback>
//                     </Avatar>
//                   </div>
//                   <div className="flex flex-col md:flex-row gap-4 md:items-center mt-4 md:mt-0">
//                     <div className="text-sm">
//                       <p className="text-muted-foreground">Contact</p>
//                       <p>{guarantor.member.contact}</p>
//                     </div>
//                     <div className="flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2">
//                       <Banknote aria-hidden className="h-4 w-4" />
//                       <span className="font-medium">
//                         {formatCurrency(guarantor.guarantingAmount)}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-sm text-muted-foreground py-6">
//                 No guarantors have been added for this loan yet.
//               </p>
//             )}
//           </div>
