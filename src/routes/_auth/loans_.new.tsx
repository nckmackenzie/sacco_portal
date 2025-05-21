import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import type { LoanApplicationFormValues } from '@/features/loans/utils/loans.type'
import { useDocumentTitle } from '@/hooks/use-title'
import { Loader } from '@/components/custom/spinner'
import { ErrorComponent } from '@/components/custom/error'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  loanTypesQueryOptions,
  memberLoanStatusQueryOptions,
} from '@/features/loans/services/query-options'
import Information from '@/features/loans/components/loan-form'
import { loanFormSchema } from '@/features/loans/utils/loan-schema'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/custom/submit-button'
import { GuarantorForm } from '@/features/loans/components/guarantor-form'
import { Review } from '@/features/loans/components/review'
import axios from '@/lib/api/axios'

const steps = [
  {
    id: 'loan-details',
    label: 'Loan Details',
    fields: ['loanType', 'loanAmount', 'purpose', 'repaymentPeriod'],
  },
  { id: 'guarantors', label: 'Guarantors', fields: ['guarantors'] },
  { id: 'review', label: 'Review' },
]

type FieldName = keyof LoanApplicationFormValues

export const Route = createFileRoute('/_auth/loans_/new')({
  component: RouteComponent,
  pendingComponent: () => <Loader size="lg" />,
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(loanTypesQueryOptions()),
      context.queryClient.ensureQueryData(memberLoanStatusQueryOptions()),
    ]),

  errorComponent: ({ error, reset }) => (
    <ErrorComponent message={error.message} action={{ onClick: reset }} />
  ),
})

function RouteComponent() {
  useDocumentTitle('Apply for a loan')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loanTypes, memberLoanStatus] = Route.useLoaderData()
  const [currentStep, setCurrentStep] = useState(0)
  const form = useForm<LoanApplicationFormValues>({
    defaultValues: {
      canSelfGuarantee: false,
      guarantors: [],
    },
    resolver: zodResolver(loanFormSchema),
  })

  const { isPending, mutate } = useMutation({
    mutationFn: async (data: LoanApplicationFormValues) => {
      const formattedData = {
        loanTypeId: data.loanType,
        loanAmount: data.loanAmount,
        purpose: data.purpose,
        repaymentPeriod: data.repaymentPeriod,
        guarantors:
          data.guarantors?.map(({ amountGuaranteed, guarantorId }) => ({
            memberId: guarantorId,
            guarantingAmount: amountGuaranteed,
          })) || [],
      }
      await axios.post('/api/loans', formattedData)
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        if (error.response?.status === 422) {
          toast.error('Please ensure you have provided all required fields.')
        } else {
          toast.error(
            error.response?.data.error || error.response?.data.message,
          )
        }
      } else {
        toast.error('An unexpected error occurred.')
      }
    },
    onSuccess: () => {
      toast.success('Loan application submitted successfully.')
      form.reset()
      setCurrentStep(0)
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      navigate({ to: '/loans' })
    },
  })

  const [canSelfGuarantee, loanAmount, guarantors, loanType] = useWatch({
    control: form.control,
    name: ['canSelfGuarantee', 'loanAmount', 'guarantors', 'loanType'],
  })
  const amountRequiredForGuarantee =
    loanAmount -
    (memberLoanStatus.data.deposits - memberLoanStatus.data.totalLoanBalance)
  const totalGuaranteedAmount =
    guarantors?.reduce(
      (total, item) => total + Number(item.amountGuaranteed),
      0,
    ) || 0
  const isFullyGuaranteed = totalGuaranteedAmount >= amountRequiredForGuarantee

  async function handleNext() {
    const currentStepFields = steps[currentStep].fields
    const output = await form.trigger(currentStepFields as Array<FieldName>, {
      shouldFocus: true,
    })

    if (!output) return

    if (currentStep === 1 && !isFullyGuaranteed) {
      toast.error(`Your loan is not fully guaranteed.`)
      return
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  function handlePrevious() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className=" shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold ">Loan Application</CardTitle>
          <CardDescription>
            Complete the form below to apply for a loan
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutate(data))}>
            <CardContent>
              <div className="mb-6">
                <Tabs value={steps[currentStep].id} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {steps.map((step, index) => (
                      <TabsTrigger
                        key={step.id}
                        value={step.id}
                        className={`${index < currentStep ? 'text-green-900 dark:text-green-100' : ''}`}
                        disabled
                      >
                        {index < currentStep && <CheckCircleIcon />}
                        {step.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {currentStep === 0 && <Information form={form} />}
              {currentStep === 1 && (
                <GuarantorForm
                  form={form}
                  canSelfGuarantee={canSelfGuarantee}
                  amountRequiredForGuarantee={amountRequiredForGuarantee}
                  loanAmount={loanAmount}
                  isFullyGuaranteed={isFullyGuaranteed}
                  totalGuaranteedAmount={totalGuaranteedAmount}
                />
              )}
              {currentStep === 2 && (
                <Review
                  form={form}
                  loanType={loanTypes.data.find((l) => l.id === loanType)?.name}
                />
              )}
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isPending}
                type="button"
              >
                <ChevronLeftIcon aria-hidden className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={isPending} type="button">
                  Next
                  <ChevronRightIcon aria-hidden className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <SubmitButton
                  buttonText="Submit Application"
                  isPending={isPending}
                />
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
