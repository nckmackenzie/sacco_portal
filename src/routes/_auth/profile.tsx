import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { Lock, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/hooks/use-title'
import { cn } from '@/lib/utils'
import { PersonalInformation } from '@/features/profile/components/personal-information'
import { Security } from '@/features/profile/components/security'

const profileSearchSchema = z.object({
  tab: z
    .enum(['personal-information', 'security'])
    .catch('personal-information'),
})

export type ProfileSearch = z.infer<typeof profileSearchSchema>

export const Route = createFileRoute('/_auth/profile')({
  component: RouteComponent,
  validateSearch: profileSearchSchema,
})

const TABS = [
  {
    name: 'Personal Information',
    value: 'personal-information',
    icon: User,
  },
  {
    name: 'Security',
    value: 'security',
    icon: Lock,
  },
]

function RouteComponent() {
  useDocumentTitle('Profile')
  const { tab } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  function handleTabChange(selectedTab: ProfileSearch['tab']) {
    navigate({ search: () => ({ tab: selectedTab }) })
  }
  return (
    <Card className="shadow-none p-0 h-full">
      <CardContent className="flex flex-col sm:flex-row p-0 h-full">
        <div className="w-56 flex flex-row gap-x-2 sm:flex-col sm:gap-y-2 sm:border-r py-6 px-4">
          {TABS.map((t) => (
            <Button
              key={t.value}
              variant="ghost"
              size="sm"
              className={cn(
                'text-xs justify-start items-center text-muted-foreground transition-colors hover:text-primary',
                { 'bg-secondary text-primary': t.value === tab },
              )}
              onClick={() => handleTabChange(t.value as ProfileSearch['tab'])}
            >
              <t.icon className="text-muted-foreground size-4" />
              <span>{t.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex-1 p-4 md:p-6">
          {tab === 'personal-information' ? (
            <PersonalInformation />
          ) : (
            <Security />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
