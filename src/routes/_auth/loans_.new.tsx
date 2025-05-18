import { useState } from 'react'
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { loanTypesQueryOptions } from '@/features/loans/services/query-options'
import Information from '@/features/loans/components/loan-form'
import { loanFormSchema } from '@/features/loans/utils/loan-schema'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/custom/submit-button'

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
    context.queryClient.ensureQueryData(loanTypesQueryOptions()),
  errorComponent: ({ error, reset }) => (
    <ErrorComponent message={error.message} action={{ onClick: reset }} />
  ),
})

function RouteComponent() {
  useDocumentTitle('Apply for a loan')
  const [currentStep, setCurrentStep] = useState(0)
  const form = useForm<LoanApplicationFormValues>({
    defaultValues: {
      canSelfGuarantee: false,
    },
    resolver: zodResolver(loanFormSchema),
  })

  async function handleNext() {
    const currentStepFields = steps[currentStep].fields
    const output = await form.trigger(currentStepFields as Array<FieldName>, {
      shouldFocus: true,
    })

    if (!output) return

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }
  function handlePrevious() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className=" shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Loan Application
          </CardTitle>
          <CardDescription>
            Complete the form below to apply for a loan
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => {})}>
            <CardContent>
              <div className="mb-6">
                <Tabs value={steps[currentStep].id} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    {steps.map((step, index) => (
                      <TabsTrigger
                        key={step.id}
                        value={step.id}
                        className={`${index < currentStep ? 'text-success-foreground' : ''}`}
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
            </CardContent>
            <CardFooter className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeftIcon aria-hidden className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRightIcon aria-hidden className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <SubmitButton
                  buttonText="Submit Application"
                  isPending={false}
                />
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
